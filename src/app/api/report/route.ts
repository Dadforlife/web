import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { validateReport } from "@/lib/forum/validation";
import { notifyPostReported } from "@/lib/notification-triggers";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "Non autorisé. Connectez-vous pour signaler." },
      { status: 401 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Corps de requête invalide." },
      { status: 400 }
    );
  }

  const validated = validateReport(body);
  if (!validated.success) {
    return NextResponse.json({ error: validated.error }, { status: 400 });
  }

  const { reason, discussionId, messageId } = validated.data;

  if (discussionId) {
    const exists = await prisma.discussion.findFirst({
      where: { id: discussionId },
    });
    if (!exists) {
      return NextResponse.json(
        { error: "Discussion introuvable." },
        { status: 404 }
      );
    }
  }
  if (messageId) {
    const exists = await prisma.message.findFirst({
      where: { id: messageId },
    });
    if (!exists) {
      return NextResponse.json(
        { error: "Message introuvable." },
        { status: 404 }
      );
    }
  }

  await prisma.report.create({
    data: {
      reason,
      reporterId: session.user.id,
      discussionId: discussionId ?? null,
      messageId: messageId ?? null,
    },
  });

  // Notify the discussion author that their post was reported (non-blocking)
  if (discussionId) {
    notifyPostReported(discussionId, reason).catch(console.error);
  }

  return NextResponse.json({
    success: true,
    message: "Signalement enregistré. L'équipe de modération en prendra connaissance.",
  });
}
