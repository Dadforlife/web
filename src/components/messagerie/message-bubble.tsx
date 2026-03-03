"use client";

import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Paperclip, Download } from "lucide-react";

interface MessageBubbleProps {
  messageId: string;
  conversationId: string;
  content: string;
  senderName: string;
  senderRole: string;
  createdAt: string;
  isOwn: boolean;
  isRead?: boolean;
  attachmentName?: string | null;
  attachmentMime?: string | null;
  attachmentSize?: number | null;
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function formatTime(dateStr: string) {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / 86_400_000);

  const time = date.toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  if (diffDays === 0) return time;
  if (diffDays === 1) return `Hier, ${time}`;
  if (diffDays < 7) {
    return `${date.toLocaleDateString("fr-FR", { weekday: "short" })}, ${time}`;
  }
  return `${date.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
  })}, ${time}`;
}

function getRoleBadge(role: string) {
  if (role === "admin") {
    return (
      <Badge className="bg-red-100 text-red-700 border-red-200 text-[10px] px-1.5 py-0">
        Admin
      </Badge>
    );
  }
  if (role === "volunteer") {
    return (
      <Badge className="bg-blue-100 text-blue-700 border-blue-200 text-[10px] px-1.5 py-0">
        Bénévole
      </Badge>
    );
  }
  return null;
}

export function MessageBubble({
  messageId,
  conversationId,
  content,
  senderName,
  senderRole,
  createdAt,
  isOwn,
  attachmentName,
  attachmentMime,
  attachmentSize,
}: MessageBubbleProps) {
  const attachmentUrl = `/api/messagerie/conversations/${conversationId}/messages/${messageId}/attachment`;

  const formatSize = (size?: number | null) => {
    if (!size || size <= 0) return "";
    if (size < 1024) return `${size} o`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div
      className={cn(
        "flex gap-2.5 max-w-[85%]",
        isOwn ? "ml-auto flex-row-reverse" : "mr-auto"
      )}
    >
      <Avatar className="h-8 w-8 shrink-0 mt-1">
        <AvatarFallback
          className={cn(
            "text-xs font-bold",
            isOwn
              ? "bg-primary/10 text-primary"
              : "bg-muted text-muted-foreground"
          )}
        >
          {getInitials(senderName)}
        </AvatarFallback>
      </Avatar>
      <div className={cn("flex flex-col", isOwn ? "items-end" : "items-start")}>
        <div className="flex items-center gap-1.5 mb-1">
          <span className="text-xs font-medium text-muted-foreground">
            {senderName}
          </span>
          {getRoleBadge(senderRole)}
        </div>
        <div
          className={cn(
            "rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap break-words",
            isOwn
              ? "bg-primary text-primary-foreground rounded-tr-sm"
              : "bg-muted rounded-tl-sm"
          )}
        >
          {content ? <p>{content}</p> : null}
          {attachmentName && (
            <div
              className={cn(
                "mt-2 rounded-lg border px-2.5 py-2",
                isOwn
                  ? "border-primary-foreground/30 bg-primary-foreground/10"
                  : "border-border bg-background/80"
              )}
            >
              <div className="flex items-center gap-2">
                <Paperclip className="h-4 w-4 shrink-0" />
                <div className="min-w-0">
                  <p className="truncate font-medium">{attachmentName}</p>
                  <p className="text-[11px] opacity-80">
                    {[attachmentMime || "fichier", formatSize(attachmentSize)]
                      .filter(Boolean)
                      .join(" - ")}
                  </p>
                </div>
                <Button
                  type="button"
                  variant={isOwn ? "secondary" : "outline"}
                  size="sm"
                  asChild
                  className="ml-auto h-7 px-2"
                >
                  <a href={attachmentUrl} target="_blank" rel="noreferrer">
                    <Download className="h-3.5 w-3.5 mr-1" />
                    Telecharger
                  </a>
                </Button>
              </div>
            </div>
          )}
        </div>
        <span className="text-[11px] text-muted-foreground mt-1 px-1">
          {formatTime(createdAt)}
        </span>
      </div>
    </div>
  );
}
