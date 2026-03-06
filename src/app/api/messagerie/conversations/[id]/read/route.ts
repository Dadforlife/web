import { NextRequest, NextResponse } from "next/server";
import { authFromRequest } from "@/lib/mobile-auth";
import { prisma } from "@/lib/prisma";

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// ─── POST /api/messagerie/conversations/[id]/read ────────────────────────────
// Mark all messages from other participants as read

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await authFromRequest(request);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const { id } = await params;
  if (!UUID_REGEX.test(id)) {
    return NextResponse.json({ error: "ID invalide" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, roles: true },
  });

  if (!user) {
    return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 404 });
  }

  // Verify access
  const conversation = await prisma.privateConversation.findUnique({
    where: { id },
    select: { fatherId: true, volunteerId: true },
  });

  if (!conversation) {
    return NextResponse.json({ error: "Conversation introuvable" }, { status: 404 });
  }

  const isParticipant =
    user.roles.includes("admin") ||
    conversation.fatherId === user.id ||
    conversation.volunteerId === user.id;

  if (!isParticipant) {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  }

  // Mark all messages from others as read
  await prisma.privateMessage.updateMany({
    where: {
      conversationId: id,
      senderId: { not: user.id },
      isRead: false,
    },
    data: { isRead: true },
  });

  return NextResponse.json({ success: true });
}
