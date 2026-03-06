import { NextRequest, NextResponse } from "next/server";
import { authFromRequest } from "@/lib/mobile-auth";
import { prisma } from "@/lib/prisma";

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; messageId: string }> }
) {
  const session = await authFromRequest(request);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorise" }, { status: 401 });
  }

  const { id: conversationId, messageId } = await params;
  if (!UUID_REGEX.test(conversationId) || !UUID_REGEX.test(messageId)) {
    return NextResponse.json({ error: "ID invalide" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, roles: true },
  });
  if (!user) {
    return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 404 });
  }

  const conversation = await prisma.privateConversation.findUnique({
    where: { id: conversationId },
    select: { fatherId: true, volunteerId: true },
  });
  if (!conversation) {
    return NextResponse.json({ error: "Conversation introuvable" }, { status: 404 });
  }

  const hasAccess =
    user.roles.includes("admin") ||
    (user.roles.includes("volunteer") && conversation.volunteerId === user.id) ||
    conversation.fatherId === user.id;
  if (!hasAccess) {
    return NextResponse.json({ error: "Acces refuse" }, { status: 403 });
  }

  const message = await prisma.privateMessage.findFirst({
    where: { id: messageId, conversationId },
    select: {
      attachmentName: true,
      attachmentMime: true,
      attachmentData: true,
    },
  });

  if (!message?.attachmentData || !message.attachmentName) {
    return NextResponse.json({ error: "Piece jointe introuvable" }, { status: 404 });
  }

  return new NextResponse(new Uint8Array(message.attachmentData), {
    status: 200,
    headers: {
      "Content-Type": message.attachmentMime || "application/octet-stream",
      "Content-Disposition": `attachment; filename="${encodeURIComponent(message.attachmentName)}"`,
      "Cache-Control": "private, no-store",
    },
  });
}
