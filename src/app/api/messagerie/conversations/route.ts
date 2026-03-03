import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { validateCreateConversation } from "@/lib/messagerie/validation";

// ─── GET /api/messagerie/conversations ───────────────────────────────────────
// List conversations filtered by user role

export async function GET(request: NextRequest) {
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

  const { searchParams } = new URL(request.url);
  const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
  const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 50);
  const status = searchParams.get("status") || "";
  const skip = (page - 1) * limit;

  // Build where clause based on roles
  const where: Record<string, unknown> = {};

  if (user.roles.includes("admin")) {
    // admin sees all — no filter
  } else if (user.roles.includes("volunteer")) {
    where.volunteerId = user.id;
  } else {
    where.fatherId = user.id;
  }

  if (status && (status === "open" || status === "closed")) {
    where.status = status;
  }

  const [conversations, total] = await Promise.all([
    prisma.privateConversation.findMany({
      where,
      orderBy: { updatedAt: "desc" },
      skip,
      take: limit,
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
    }),
    prisma.privateConversation.count({ where }),
  ]);

  // Compute unread counts for each conversation
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
        createdAt: conv.createdAt,
        updatedAt: conv.updatedAt,
        father: conv.father,
        volunteer: conv.volunteer,
        unreadCount,
        lastMessage: lastMessage
          ? {
              content:
                lastMessage.content.length > 100
                  ? lastMessage.content.substring(0, 100) + "..."
                  : lastMessage.content,
              createdAt: lastMessage.createdAt,
              senderRole: lastMessage.senderRole,
            }
          : null,
      };
    })
  );

  return NextResponse.json({
    conversations: conversationsWithUnread,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  });
}

// ─── POST /api/messagerie/conversations ──────────────────────────────────────
// Create a new conversation (fathers only)

export async function POST(request: NextRequest) {
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

  // Only members (fathers) can create conversations
  if (!user.roles.includes("member") || user.roles.includes("admin") || user.roles.includes("volunteer")) {
    return NextResponse.json(
      { error: "Seuls les papas peuvent démarrer une conversation" },
      { status: 403 }
    );
  }

  const body = await request.json();
  const validation = validateCreateConversation(body);

  if (!validation.success) {
    return NextResponse.json({ error: validation.error }, { status: 400 });
  }

  const { subject, content } = validation.data;

  // Create conversation + first message in a transaction
  const conversation = await prisma.$transaction(async (tx) => {
    const conv = await tx.privateConversation.create({
      data: {
        fatherId: user.id,
        subject,
      },
    });

    await tx.privateMessage.create({
      data: {
        conversationId: conv.id,
        senderId: user.id,
        senderRole: "member",
        content,
      },
    });

    return conv;
  });

  return NextResponse.json({ conversation }, { status: 201 });
}
