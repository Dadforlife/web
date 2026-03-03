"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  MessageCircle,
  Send,
  ChevronRight,
  Search,
} from "lucide-react";
import { Input } from "@/components/ui/input";

interface Conversation {
  id: string;
  subject: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  father: { id: string; fullName: string };
  volunteer: { id: string; fullName: string } | null;
  unreadCount: number;
  lastMessage: {
    content: string;
    createdAt: string;
    senderRole: string;
  } | null;
}

interface ConversationListProps {
  initialConversations: Conversation[];
  currentUserRole: string;
  basePath: string;
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function timeAgo(dateStr: string) {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60_000);
  const diffHours = Math.floor(diffMs / 3_600_000);
  const diffDays = Math.floor(diffMs / 86_400_000);

  if (diffMin < 1) return "À l\u2019instant";
  if (diffMin < 60) return `il y a ${diffMin} min`;
  if (diffHours < 24) return `il y a ${diffHours}h`;
  if (diffDays === 1) return "Hier";
  if (diffDays < 7) return `il y a ${diffDays}j`;
  return date.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
  });
}

function getRoleBadge(role: string) {
  if (role === "admin") return "Admin";
  if (role === "volunteer") return "Bénévole";
  return null;
}

export function ConversationList({
  initialConversations,
  currentUserRole,
  basePath,
}: ConversationListProps) {
  const [conversations, setConversations] =
    useState<Conversation[]>(initialConversations);
  const [search, setSearch] = useState("");

  // Poll for updates every 15 seconds
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch("/api/messagerie/conversations?limit=50");
        if (!res.ok) return;
        const data = await res.json();
        setConversations(data.conversations);
      } catch {
        // Silently ignore polling errors
      }
    }, 15_000);

    return () => clearInterval(interval);
  }, []);

  const filtered = search.trim()
    ? conversations.filter(
        (c) =>
          c.subject.toLowerCase().includes(search.toLowerCase()) ||
          c.father.fullName.toLowerCase().includes(search.toLowerCase()) ||
          c.volunteer?.fullName
            .toLowerCase()
            .includes(search.toLowerCase())
      )
    : conversations;

  if (conversations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
        <div className="relative mb-6">
          <div className="h-20 w-20 rounded-2xl bg-primary/10 flex items-center justify-center">
            <MessageCircle className="h-10 w-10 text-primary" />
          </div>
          <div className="absolute -bottom-1 -right-1 h-8 w-8 rounded-lg bg-muted flex items-center justify-center border-2 border-card">
            <Send className="h-3.5 w-3.5 text-muted-foreground" />
          </div>
        </div>
        <h3 className="text-lg font-semibold text-foreground">
          Aucune conversation
        </h3>
        <p className="text-sm text-muted-foreground mt-1.5 max-w-sm leading-relaxed">
          {currentUserRole === "member"
            ? "Vous n\u2019avez pas encore de conversation. Envoyez un premier message pour échanger avec un bénévole ou un administrateur."
            : "Aucune conversation ne vous est assignée pour le moment."}
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Barre de recherche — affichée seulement si plus de 3 conversations */}
      {conversations.length > 3 && (
        <div className="px-4 py-3 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher une conversation..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-9 bg-muted/40 border-0 focus-visible:ring-1"
            />
          </div>
        </div>
      )}

      {/* Liste filtrée */}
      {filtered.length === 0 ? (
        <div className="text-center py-10 px-4">
          <p className="text-sm text-muted-foreground">
            Aucune conversation ne correspond à votre recherche.
          </p>
        </div>
      ) : (
        <div className="divide-y">
          {filtered.map((conv) => {
            const otherPerson =
              currentUserRole === "member"
                ? conv.volunteer?.fullName || "En attente d\u2019assignation"
                : conv.father.fullName;

            const otherInitials =
              currentUserRole === "member"
                ? conv.volunteer
                  ? getInitials(conv.volunteer.fullName)
                  : "?"
                : getInitials(conv.father.fullName);

            const isUnread = conv.unreadCount > 0;
            const isClosed = conv.status === "closed";
            const senderLabel = conv.lastMessage
              ? getRoleBadge(conv.lastMessage.senderRole)
              : null;

            return (
              <Link
                key={conv.id}
                href={`${basePath}/${conv.id}`}
                className={cn(
                  "group flex items-center gap-3.5 px-5 py-4 transition-colors hover:bg-muted/50",
                  isUnread && "bg-primary/[0.03]"
                )}
              >
                {/* Avatar */}
                <Avatar
                  className={cn(
                    "h-11 w-11 shrink-0 ring-2 ring-offset-2 ring-offset-card transition-shadow",
                    isUnread
                      ? "ring-primary/30"
                      : "ring-transparent"
                  )}
                >
                  <AvatarFallback
                    className={cn(
                      "text-xs font-bold",
                      isUnread
                        ? "bg-primary/15 text-primary"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    {otherInitials}
                  </AvatarFallback>
                </Avatar>

                {/* Contenu */}
                <div className="flex-1 min-w-0">
                  {/* Ligne 1 : sujet + heure */}
                  <div className="flex items-center justify-between gap-2">
                    <h3
                      className={cn(
                        "text-sm truncate",
                        isUnread
                          ? "font-bold text-foreground"
                          : "font-medium text-foreground/90"
                      )}
                    >
                      {conv.subject}
                    </h3>
                    <span
                      className={cn(
                        "text-[11px] shrink-0",
                        isUnread
                          ? "text-primary font-semibold"
                          : "text-muted-foreground"
                      )}
                    >
                      {conv.lastMessage
                        ? timeAgo(conv.lastMessage.createdAt)
                        : timeAgo(conv.createdAt)}
                    </span>
                  </div>

                  {/* Ligne 2 : interlocuteur */}
                  <p className="text-xs text-muted-foreground mt-0.5 truncate">
                    {currentUserRole === "member" ? (
                      <>
                        Avec{" "}
                        <span className="font-medium text-foreground/70">
                          {otherPerson}
                        </span>
                      </>
                    ) : (
                      <span className="font-medium text-foreground/70">
                        {otherPerson}
                      </span>
                    )}
                  </p>

                  {/* Ligne 3 : aperçu du dernier message + badges */}
                  <div className="flex items-center justify-between gap-2 mt-1">
                    <p
                      className={cn(
                        "text-xs truncate leading-relaxed",
                        isUnread
                          ? "text-foreground/70 font-medium"
                          : "text-muted-foreground"
                      )}
                    >
                      {senderLabel && (
                        <span className="text-muted-foreground">
                          {senderLabel} :{" "}
                        </span>
                      )}
                      {conv.lastMessage
                        ? conv.lastMessage.content
                        : "Pas encore de message"}
                    </p>
                    <div className="flex items-center gap-1.5 shrink-0">
                      {isClosed && (
                        <Badge
                          variant="secondary"
                          className="text-[10px] px-1.5 py-0 font-medium"
                        >
                          Fermée
                        </Badge>
                      )}
                      {isUnread && (
                        <span className="h-5 min-w-5 rounded-full bg-primary text-primary-foreground text-[11px] font-bold flex items-center justify-center px-1.5">
                          {conv.unreadCount > 99
                            ? "99+"
                            : conv.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Chevron */}
                <ChevronRight className="h-4 w-4 text-muted-foreground/40 shrink-0 group-hover:text-muted-foreground transition-colors" />
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
