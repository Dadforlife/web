"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { MessageCircle } from "lucide-react";
import { ReactionButtons } from "@/components/forum/reaction-buttons";
import { cn } from "@/lib/utils";

export type DiscussionCardData = {
  id: string;
  title: string;
  createdAt: string;
  isAnonymous: boolean;
  category: { id: string; name: string };
  author: { fullName: string | null } | null;
  _count: { messages: number };
  isNew?: boolean;
};

export function DiscussionCard({
  discussion,
  className,
}: {
  discussion: DiscussionCardData;
  className?: string;
}) {
  const authorLabel = discussion.isAnonymous
    ? "Papa anonyme"
    : (discussion.author?.fullName || "Papa").trim() || "Papa";
  const createdDate = new Date(discussion.createdAt);

  return (
    <article
      className={cn(
        "group rounded-xl border border-border/80 bg-card p-4 sm:p-5 shadow-sm transition-all hover:shadow-md hover:border-primary/20",
        className
      )}
    >
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <Link
            href={`/espace-papas/${discussion.id}`}
            className="flex-1 min-w-0"
          >
            <h2 className="font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
              {discussion.title}
            </h2>
          </Link>
          {discussion.isNew && (
            <Badge variant="secondary" className="shrink-0 text-xs">
              Nouveau
            </Badge>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <Badge variant="outline" className="font-normal">
            {discussion.category.name}
          </Badge>
          <span className="hidden sm:inline">·</span>
          <span>{authorLabel}</span>
          <span className="hidden sm:inline">·</span>
          <span className="flex items-center gap-1">
            <MessageCircle className="h-3.5 w-3.5" />
            {discussion._count.messages} réponse{discussion._count.messages !== 1 ? "s" : ""}
          </span>
          <span className="hidden sm:inline">·</span>
          <time dateTime={discussion.createdAt}>
            {formatRelativeDate(createdDate)}
          </time>
        </div>
        <div className="flex flex-wrap gap-2 pt-1">
          <ReactionButtons discussionId={discussion.id} size="xs" />
        </div>
      </div>
    </article>
  );
}

function formatRelativeDate(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60_000);
  const diffHours = Math.floor(diffMs / 3600_000);
  const diffDays = Math.floor(diffMs / 86400_000);

  if (diffMins < 60) return `Il y a ${diffMins} min`;
  if (diffHours < 24) return `Il y a ${diffHours} h`;
  if (diffDays < 7) return `Il y a ${diffDays} j`;
  return date.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
  });
}
