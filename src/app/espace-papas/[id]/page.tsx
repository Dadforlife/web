import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ReportButton } from "@/components/forum/report-button";
import { ReactionButtons } from "@/components/forum/reaction-buttons";
import { MessageForm } from "./message-form";
import { sanitizeForDisplay } from "@/lib/forum/sanitize";
import { ArrowLeft, MessageCircle, Calendar, User } from "lucide-react";

type PageProps = {
  params: Promise<{ id: string }>;
};

function AuthorAvatar({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  return (
    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
      {initials}
    </div>
  );
}

function formatFullDate(date: Date): string {
  return date.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatShortDate(date: Date): string {
  return date.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function DiscussionPage({ params }: PageProps) {
  const { id } = await params;

  const discussion = await prisma.discussion.findFirst({
    where: { id, status: { in: ["active", "archived"] } },
    include: {
      category: true,
      author: { select: { fullName: true } },
      messages: {
        orderBy: { createdAt: "asc" },
        include: {
          author: { select: { fullName: true } },
        },
      },
    },
  });

  if (!discussion) notFound();

  const authorLabel = discussion.isAnonymous
    ? "Papa anonyme"
    : (discussion.author?.fullName || "Papa").trim() || "Papa";

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8 sm:py-10">
      <nav className="mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link
            href="/espace-papas"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour à l&apos;Espace Papas
          </Link>
        </Button>
      </nav>

      {/* Discussion principale */}
      <article className="rounded-xl border border-border/80 bg-card shadow-sm overflow-hidden">
        <header className="p-5 sm:p-6">
          <div className="flex items-center gap-2 mb-3">
            <Badge
              variant="secondary"
              className="text-xs font-medium bg-primary/10 text-primary hover:bg-primary/15"
            >
              {discussion.category.name}
            </Badge>
          </div>

          <h1 className="text-xl sm:text-2xl font-bold text-foreground leading-tight mb-4">
            {discussion.title}
          </h1>

          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <AuthorAvatar name={authorLabel} />
              <div>
                <p className="text-sm font-medium text-foreground">
                  {authorLabel}
                </p>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <time dateTime={discussion.createdAt.toISOString()}>
                    {formatFullDate(discussion.createdAt)}
                  </time>
                </p>
              </div>
            </div>
            <ReportButton discussionId={discussion.id} size="xs" />
          </div>
        </header>

        <div className="border-t border-border/40" />

        <div
          className="p-5 sm:p-6 text-foreground prose prose-sm max-w-none prose-p:leading-relaxed"
          dangerouslySetInnerHTML={{
            __html: sanitizeForDisplay(discussion.content),
          }}
        />

        <div className="px-5 sm:px-6 pb-5 sm:pb-6">
          <div className="border-t border-border/40 pt-4">
            <ReactionButtons discussionId={discussion.id} size="sm" />
          </div>
        </div>
      </article>

      {/* Réponses */}
      <section className="mt-10" aria-label="Réponses">
        <div className="flex items-center gap-2 mb-6">
          <div className="flex items-center gap-2 text-lg font-semibold text-foreground">
            <MessageCircle className="h-5 w-5 text-primary" />
            {discussion.messages.length} réponse
            {discussion.messages.length !== 1 ? "s" : ""}
          </div>
          <div className="flex-1 border-t border-border/50" />
        </div>

        {discussion.messages.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border/60 bg-muted/20 p-8 text-center">
            <User className="h-8 w-8 mx-auto text-muted-foreground/40 mb-3" />
            <p className="text-sm text-muted-foreground">
              Aucune réponse pour le moment. Soyez le premier à apporter votre
              soutien.
            </p>
          </div>
        ) : (
          <ul className="space-y-4">
            {discussion.messages.map((msg) => {
              const msgAuthor =
                (msg.author?.fullName || "Papa").trim() || "Papa";
              return (
                <li
                  key={msg.id}
                  className="rounded-xl border border-border/60 bg-card p-4 sm:p-5"
                >
                  <div className="flex items-start gap-3">
                    <AuthorAvatar name={msgAuthor} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <div>
                          <span className="text-sm font-medium text-foreground">
                            {msgAuthor}
                          </span>
                          <span className="text-xs text-muted-foreground ml-2">
                            <time dateTime={msg.createdAt.toISOString()}>
                              {formatShortDate(msg.createdAt)}
                            </time>
                          </span>
                        </div>
                        <ReportButton messageId={msg.id} size="xs" />
                      </div>
                      <div
                        className="text-foreground prose prose-sm max-w-none"
                        dangerouslySetInnerHTML={{
                          __html: sanitizeForDisplay(msg.content),
                        }}
                      />
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}

        {/* Formulaire de réponse */}
        <div className="mt-8 rounded-xl border border-primary/20 bg-primary/5 p-5 sm:p-6">
          <h3 className="text-base font-semibold text-foreground mb-1">
            Apporter votre soutien
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Chaque mot compte. Partagez votre expérience ou encouragez ce papa.
          </p>
          <MessageForm discussionId={discussion.id} />
        </div>
      </section>
    </div>
  );
}
