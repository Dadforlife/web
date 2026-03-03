import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { ConversationList } from "@/components/messagerie/conversation-list";
import { NewConversationDialog } from "@/components/messagerie/new-conversation-dialog";
import {
  MessageCircle,
  ShieldCheck,
  Clock,
  Lock,
} from "lucide-react";

export default async function MessageriePage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/auth/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, roles: true },
  });

  if (!user) {
    redirect("/auth/login");
  }

  const isMember = !user.roles.includes("volunteer") && !user.roles.includes("admin");
  const isVolunteer = user.roles.includes("volunteer");

  const where: Record<string, unknown> = {};
  if (isMember) {
    where.fatherId = user.id;
  } else if (isVolunteer) {
    where.volunteerId = user.id;
  }

  const conversations = await prisma.privateConversation.findMany({
    where,
    orderBy: { updatedAt: "desc" },
    take: 50,
    include: {
      father: { select: { id: true, fullName: true } },
      volunteer: { select: { id: true, fullName: true } },
      messages: {
        orderBy: { createdAt: "desc" },
        take: 1,
        select: {
          content: true,
          createdAt: true,
          senderId: true,
          senderRole: true,
        },
      },
    },
  });

  // Compute unread counts
  const conversationsWithUnread = await Promise.all(
    conversations.map(async (conv) => {
      const unreadCount = await prisma.privateMessage.count({
        where: {
          conversationId: conv.id,
          senderId: { not: user.id },
          isRead: false,
        },
      });

      const lastMessage = conv.messages[0] || null;

      return {
        id: conv.id,
        subject: conv.subject,
        status: conv.status,
        createdAt: conv.createdAt.toISOString(),
        updatedAt: conv.updatedAt.toISOString(),
        father: conv.father,
        volunteer: conv.volunteer,
        unreadCount,
        lastMessage: lastMessage
          ? {
              content:
                lastMessage.content.length > 100
                  ? lastMessage.content.substring(0, 100) + "..."
                  : lastMessage.content,
              createdAt: lastMessage.createdAt.toISOString(),
              senderRole: lastMessage.senderRole,
            }
          : null,
      };
    })
  );

  const totalUnread = conversationsWithUnread.reduce(
    (sum, c) => sum + c.unreadCount,
    0
  );
  const openCount = conversationsWithUnread.filter(
    (c) => c.status === "open"
  ).length;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
            Messagerie
          </h1>
          <p className="text-muted-foreground">
            {isMember
              ? "Échangez en privé avec votre bénévole ou un administrateur."
              : "Gérez vos conversations avec les papas qui vous sont assignés."}
          </p>
        </div>
        {isMember && <NewConversationDialog />}
      </div>

      {/* Stats rapides */}
      {conversationsWithUnread.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div className="rounded-xl border bg-card p-4">
            <p className="text-2xl font-bold text-foreground">
              {conversationsWithUnread.length}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Conversation{conversationsWithUnread.length > 1 ? "s" : ""}
            </p>
          </div>
          <div className="rounded-xl border bg-card p-4">
            <p className="text-2xl font-bold text-foreground">
              {openCount}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              En cours
            </p>
          </div>
          <div className="rounded-xl border bg-card p-4 col-span-2 sm:col-span-1">
            <p
              className={`text-2xl font-bold ${totalUnread > 0 ? "text-primary" : "text-foreground"}`}
            >
              {totalUnread}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Non lu{totalUnread > 1 ? "s" : ""}
            </p>
          </div>
        </div>
      )}

      {/* Liste de conversations */}
      <div className="rounded-2xl border bg-card overflow-hidden shadow-sm">
        {conversationsWithUnread.length > 0 && (
          <div className="px-5 py-3.5 border-b bg-muted/30">
            <p className="text-sm font-medium text-muted-foreground">
              {conversationsWithUnread.length} conversation
              {conversationsWithUnread.length > 1 ? "s" : ""}
              {totalUnread > 0 && (
                <span className="text-primary font-semibold">
                  {" "}
                  &middot; {totalUnread} message
                  {totalUnread > 1 ? "s" : ""} non lu
                  {totalUnread > 1 ? "s" : ""}
                </span>
              )}
            </p>
          </div>
        )}
        <ConversationList
          initialConversations={conversationsWithUnread}
          currentUserRole={isMember ? "member" : "volunteer"}
          basePath="/dashboard/messagerie"
        />
      </div>

      {/* Infos — visible uniquement pour les membres */}
      {isMember && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          {[
            {
              icon: ShieldCheck,
              title: "Confidentiel",
              description:
                "Vos échanges sont privés et protégés. Seul votre bénévole assigné et les administrateurs y ont accès.",
            },
            {
              icon: Clock,
              title: "Réponse rapide",
              description:
                "Un bénévole ou un administrateur vous répondra dans les meilleurs délais.",
            },
            {
              icon: Lock,
              title: "Sécurisé",
              description:
                "Vos messages et pièces jointes sont stockés de manière sécurisée.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="flex gap-3 rounded-xl border bg-card p-4"
            >
              <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <item.icon className="h-4.5 w-4.5 text-primary" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-foreground">
                  {item.title}
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
