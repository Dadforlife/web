import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// ─── GET /api/messagerie/unread-count ────────────────────────────────────────
// Get total unread message count across all accessible conversations

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, roles: true },
  });

  if (!user) {
    return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 404 });
  }

  // Build conversation filter based on roles
  let conversationFilter: Record<string, unknown> = {};

  if (user.roles.includes("admin")) {
    // admin sees all — no filter
  } else if (user.roles.includes("volunteer")) {
    conversationFilter = { volunteerId: user.id };
  } else {
    conversationFilter = { fatherId: user.id };
  }

  const count = await prisma.privateMessage.count({
    where: {
      conversation: conversationFilter,
      senderId: { not: user.id },
      isRead: false,
    },
  });

  return NextResponse.json({ count });
}
