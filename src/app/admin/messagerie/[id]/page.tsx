import { requireAdmin } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/admin/page-header";
import { ChatView } from "@/components/messagerie/chat-view";
import { ConversationActions } from "./conversation-actions-client";
import { Mail, User, UserCheck, Calendar, Lock } from "lucide-react";
import Link from "next/link";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminConversationPage({ params }: PageProps) {
  const admin = await requireAdmin();
  const { id } = await params;

  const conversation = await prisma.privateConversation.findUnique({
    where: { id },
    include: {
      father: { select: { id: true, fullName: true, email: true } },
      volunteer: { select: { id: true, fullName: true, email: true } },
      closedBy: { select: { id: true, fullName: true } },
    },
  });

  if (!conversation) {
    notFound();
  }

  // Fetch initial messages
  const messages = await prisma.privateMessage.findMany({
    where: { conversationId: id },
    orderBy: { createdAt: "desc" },
    take: 31,
    select: {
      id: true,
      content: true,
      senderId: true,
      senderRole: true,
      isRead: true,
      createdAt: true,
      attachmentName: true,
      attachmentMime: true,
      attachmentSize: true,
      sender: { select: { id: true, fullName: true, roles: true } },
    },
  });

  const hasMore = messages.length > 30;
  const displayMessages = hasMore ? messages.slice(0, 30) : messages;
  const nextCursor = hasMore
    ? displayMessages[displayMessages.length - 1]?.id
    : null;

  // Fetch available volunteers for assignment
  const volunteers = await prisma.user.findMany({
    where: { roles: { has: "volunteer" }, status: "active" },
    select: { id: true, fullName: true },
    orderBy: { fullName: "asc" },
  });

  const serializedMessages = displayMessages.reverse().map((m) => ({
    id: m.id,
    content: m.content,
    senderId: m.senderId,
    senderRole: m.senderRole,
    isRead: m.isRead,
    createdAt: m.createdAt.toISOString(),
    attachmentName: m.attachmentName,
    attachmentMime: m.attachmentMime,
    attachmentSize: m.attachmentSize,
    sender: m.sender,
  }));

  const formatDate = (date: Date) =>
    date.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <div className="space-y-6 max-w-7xl">
      <PageHeader
        title={conversation.subject}
        icon={Mail}
        backHref="/admin/messagerie"
      >
        {conversation.status === "open" ? (
          <Badge className="bg-green-100 text-green-700 border-green-200">
            Ouverte
          </Badge>
        ) : (
          <Badge className="bg-red-100 text-red-700 border-red-200">
            <Lock className="h-3 w-3 mr-1" />
            Fermée
          </Badge>
        )}
      </PageHeader>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main: Chat view */}
        <div className="lg:col-span-2">
          <Card className="rounded-2xl">
            <CardContent className="p-4 sm:p-6">
              <ChatView
                conversationId={id}
                currentUserId={admin.id}
                initialMessages={serializedMessages}
                conversationStatus={conversation.status}
                conversationSubject={conversation.subject}
                hasMoreInitial={hasMore}
                nextCursorInitial={nextCursor}
              />
            </CardContent>
          </Card>
        </div>

        {/* Sidebar: Info + Actions */}
        <div className="space-y-4">
          {/* Conversation info */}
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle className="text-base">Informations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <User className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
                <div>
                  <p className="font-medium">Papa</p>
                  <p className="text-muted-foreground">
                    {conversation.father.fullName}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {conversation.father.email}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <UserCheck className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
                <div>
                  <p className="font-medium">Bénévole assigné</p>
                  {conversation.volunteer ? (
                    <>
                      <p className="text-muted-foreground">
                        {conversation.volunteer.fullName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {conversation.volunteer.email}
                      </p>
                    </>
                  ) : (
                    <p className="text-orange-600">Non assigné</p>
                  )}
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Calendar className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
                <div>
                  <p className="font-medium">Créée le</p>
                  <p className="text-muted-foreground">
                    {formatDate(conversation.createdAt)}
                  </p>
                </div>
              </div>
              {conversation.closedAt && conversation.closedBy && (
                <div className="flex items-start gap-2">
                  <Lock className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
                  <div>
                    <p className="font-medium">Fermée le</p>
                    <p className="text-muted-foreground">
                      {formatDate(conversation.closedAt)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      par {conversation.closedBy.fullName}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Actions */}
          <ConversationActions
            conversationId={id}
            currentVolunteerId={conversation.volunteerId}
            conversationStatus={conversation.status}
            volunteers={volunteers}
          />

          {/* Quick links */}
          <Card className="rounded-2xl">
            <CardContent className="p-4">
              <Button variant="outline" size="sm" className="w-full" asChild>
                <Link href={`/admin/utilisateurs/${conversation.father.id}`}>
                  Voir le profil du papa
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
