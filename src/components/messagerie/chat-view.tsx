"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { MessageBubble } from "./message-bubble";
import { Send, Lock, Loader2, Paperclip, X } from "lucide-react";
import { toast } from "sonner";

interface Message {
  id: string;
  content: string;
  senderId: string;
  senderRole: string;
  isRead: boolean;
  createdAt: string;
  attachmentName?: string | null;
  attachmentMime?: string | null;
  attachmentSize?: number | null;
  sender: {
    id: string;
    fullName: string;
    roles: string[];
  };
}

interface ChatViewProps {
  conversationId: string;
  currentUserId: string;
  initialMessages: Message[];
  conversationStatus: string;
  conversationSubject: string;
  hasMoreInitial: boolean;
  nextCursorInitial: string | null;
}

export function ChatView({
  conversationId,
  currentUserId,
  initialMessages,
  conversationStatus,
  conversationSubject,
  hasMoreInitial,
  nextCursorInitial,
}: ChatViewProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(hasMoreInitial);
  const [nextCursor, setNextCursor] = useState(nextCursorInitial);
  const [status, setStatus] = useState(conversationStatus);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const hasScrolledInitially = useRef(false);

  const formatSize = (size: number) => {
    if (size < 1024) return `${size} o`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  };

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  // Scroll to bottom on initial load
  useEffect(() => {
    if (!hasScrolledInitially.current && messages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: "instant" });
      hasScrolledInitially.current = true;
    }
  }, [messages.length]);

  // Mark messages as read
  useEffect(() => {
    fetch(`/api/messagerie/conversations/${conversationId}/read`, {
      method: "POST",
    }).catch(() => {});
  }, [conversationId]);

  // Poll for new messages every 10 seconds
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch(
          `/api/messagerie/conversations/${conversationId}/messages?limit=30`
        );
        if (!res.ok) return;
        const data = await res.json();

        setMessages((prev) => {
          const existingIds = new Set(prev.map((m) => m.id));
          const newMessages = (data.messages as Message[]).filter(
            (m) => !existingIds.has(m.id)
          );
          if (newMessages.length > 0) {
            // Mark as read
            fetch(`/api/messagerie/conversations/${conversationId}/read`, {
              method: "POST",
            }).catch(() => {});
            return [...prev, ...newMessages];
          }
          return prev;
        });

        // Check conversation status
        const convRes = await fetch(
          `/api/messagerie/conversations/${conversationId}`
        );
        if (convRes.ok) {
          const convData = await convRes.json();
          setStatus(convData.conversation.status);
        }
      } catch {
        // Silently ignore polling errors
      }
    }, 10_000);

    return () => clearInterval(interval);
  }, [conversationId]);

  // Auto-scroll when new messages arrive
  useEffect(() => {
    if (hasScrolledInitially.current) {
      scrollToBottom();
    }
  }, [messages.length, scrollToBottom]);

  const loadOlderMessages = async () => {
    if (!hasMore || !nextCursor || loadingMore) return;
    setLoadingMore(true);

    try {
      const res = await fetch(
        `/api/messagerie/conversations/${conversationId}/messages?limit=30&cursor=${nextCursor}`
      );
      if (!res.ok) return;
      const data = await res.json();

      setMessages((prev) => [...(data.messages as Message[]), ...prev]);
      setHasMore(data.hasMore);
      setNextCursor(data.nextCursor);
    } catch {
      toast.error("Erreur lors du chargement des messages");
    } finally {
      setLoadingMore(false);
    }
  };

  const handleSend = async () => {
    if ((!newMessage.trim() && !selectedFile) || sending || status === "closed") return;

    setSending(true);
    try {
      const endpoint = `/api/messagerie/conversations/${conversationId}/messages`;
      const res = selectedFile
        ? await fetch(endpoint, {
            method: "POST",
            body: (() => {
              const formData = new FormData();
              formData.append("content", newMessage.trim());
              formData.append("file", selectedFile);
              return formData;
            })(),
          })
        : await fetch(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ content: newMessage.trim() }),
          });

      if (!res.ok) {
        const data = await res.json();
        toast.error(data.error || "Erreur lors de l'envoi");
        return;
      }

      const data = await res.json();
      setMessages((prev) => [...prev, data.message]);
      setNewMessage("");
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch {
      toast.error("Erreur lors de l'envoi du message");
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)] max-h-[800px]">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b">
        <div>
          <h2 className="text-lg font-semibold">{conversationSubject}</h2>
        </div>
        {status === "closed" && (
          <Badge className="bg-red-100 text-red-700 border-red-200">
            <Lock className="h-3 w-3 mr-1" />
            Fermée
          </Badge>
        )}
      </div>

      {/* Messages */}
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto py-4 space-y-4"
      >
        {hasMore && (
          <div className="text-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={loadOlderMessages}
              disabled={loadingMore}
            >
              {loadingMore ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              Charger les messages précédents
            </Button>
          </div>
        )}

        {messages.length === 0 && (
          <div className="text-center text-muted-foreground py-12">
            <p>Aucun message pour le moment.</p>
            <p className="text-sm mt-1">Commencez la conversation !</p>
          </div>
        )}

        {messages.map((msg) => (
          <MessageBubble
            key={msg.id}
            messageId={msg.id}
            conversationId={conversationId}
            content={msg.content}
            senderName={msg.sender.fullName}
            senderRole={msg.senderRole}
            createdAt={msg.createdAt}
            isOwn={msg.senderId === currentUserId}
            isRead={msg.isRead}
            attachmentName={msg.attachmentName}
            attachmentMime={msg.attachmentMime}
            attachmentSize={msg.attachmentSize}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      {status === "closed" ? (
        <div className="pt-4 border-t">
          <div className="flex items-center justify-center gap-2 text-muted-foreground bg-muted/50 rounded-xl py-3">
            <Lock className="h-4 w-4" />
            <span className="text-sm">Cette conversation est fermée</span>
          </div>
        </div>
      ) : (
        <div className="pt-4 border-t">
          {selectedFile && (
            <div className="mb-2 flex items-center justify-between rounded-lg border bg-muted/30 px-3 py-2 text-sm">
              <div className="flex items-center gap-2 min-w-0">
                <Paperclip className="h-4 w-4 shrink-0 text-muted-foreground" />
                <span className="truncate">{selectedFile.name}</span>
                <span className="text-xs text-muted-foreground shrink-0">
                  ({formatSize(selectedFile.size)})
                </span>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-7 w-7 shrink-0"
                onClick={() => {
                  setSelectedFile(null);
                  if (fileInputRef.current) fileInputRef.current.value = "";
                }}
                disabled={sending}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
          <div className="flex gap-2">
            <Textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Écrivez votre message..."
              className="min-h-[44px] max-h-[120px] resize-none rounded-xl"
              rows={1}
            />
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0] ?? null;
                setSelectedFile(file);
              }}
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="h-[44px] w-[44px] shrink-0 rounded-xl"
              onClick={() => fileInputRef.current?.click()}
              disabled={sending}
            >
              <Paperclip className="h-4 w-4" />
            </Button>
            <Button
              onClick={handleSend}
              disabled={(!newMessage.trim() && !selectedFile) || sending}
              size="icon"
              className="h-[44px] w-[44px] shrink-0 rounded-xl"
            >
              {sending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-1.5 px-1">
            Entree pour envoyer, Maj+Entree pour retour ligne, 10 MB max par fichier.
          </p>
        </div>
      )}
    </div>
  );
}
