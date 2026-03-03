import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChatView } from "@/components/messagerie/chat-view";
import { ArrowLeft, Mail, Lock, UserRound } from "lucide-react";
import Link from "next/link";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function ConversationPage({ params }: PageProps) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/auth/login");
  }

  const { id } = await params;

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, roles: true },
  });

  if (!user) {
    redirect("/auth/login");
  }

  const conversation = await prisma.privateConversation.findUnique({
    where: { id },
    include: {
      father: { select: { id: true, fullName: true } },
      volunteer: { select: { id: true, fullName: true } },
    },
  });

  if (!conversation) {
    notFound();
  }

  const isMember = !user.roles.includes("volunteer") && !user.roles.includes("admin");

  if (isMember && conversation.fatherId !== user.id) {
    redirect("/dashboard/messagerie");
  }
  if (user.roles.includes("volunteer") && conversation.volunteerId !== user.id) {
    redirect("/dashboard/messagerie");
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
  const nextCursor = hasMore ? displayMessages[displayMessages.length - 1]?.id : null;

  // Mark messages as read
  await prisma.privateMessage.updateMany({
    where: {
      conversationId: id,
      senderId: { not: user.id },
      isRead: false,
    },
    data: { isRead: true },
  });

  // Serialize for client
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

  const counterpartName = isMember
    ? conversation.volunteer?.fullName || "Equipe Papa pour la vie"
    : conversation.father.fullName;
  const counterpartLabel = isMember ? "Interlocuteur" : "Papa";

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      <Card className="rounded-2xl border bg-card/80 backdrop-blur supports-[backdrop-filter]:bg-card/70">
        <CardHeader className="space-y-4">
          <div>
            <Button variant="ghost" size="sm" asChild className="-ml-2">
              <Link href="/dashboard/messagerie">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Retour
              </Link>
            </Button>
          </div>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="space-y-1.5">
              <CardTitle className="text-xl sm:text-2xl flex items-center gap-2">
                <Mail className="h-5 w-5 text-primary" />
                {conversation.subject}
              </CardTitle>
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <UserRound className="h-4 w-4" />
                {counterpartLabel} : {counterpartName}
              </p>
            </div>
            {conversation.status === "open" ? (
              <Badge className="bg-green-100 text-green-700 border-green-200">
                Conversation ouverte
              </Badge>
            ) : (
              <Badge className="bg-red-100 text-red-700 border-red-200">
                <Lock className="h-3 w-3 mr-1" />
                Conversation fermee
              </Badge>
            )}
          </div>
        </CardHeader>
      </Card>

      <Card className="rounded-2xl border shadow-sm">
        <CardContent className="p-4 sm:p-6">
          <ChatView
            conversationId={id}
            currentUserId={user.id}
            initialMessages={serializedMessages}
            conversationStatus={conversation.status}
            conversationSubject={conversation.subject}
            hasMoreInitial={hasMore}
            nextCursorInitial={nextCursor}
          />
        </CardContent>
      </Card>
    </div>
  );
}
