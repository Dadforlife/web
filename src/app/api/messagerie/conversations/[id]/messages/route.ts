import { NextRequest, NextResponse } from "next/server";
import { authFromRequest } from "@/lib/mobile-auth";
import { prisma } from "@/lib/prisma";
import { validateCreateMessage } from "@/lib/messagerie/validation";
import { sanitizeForStorage } from "@/lib/forum/sanitize";
import { MESSAGERIE_LIMITS } from "@/lib/messagerie/validation";

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// Simple in-memory rate limiter: max 10 messages per minute per user
const rateLimitMap = new Map<string, number[]>();
const RATE_LIMIT_WINDOW = 60_000; // 1 minute
const RATE_LIMIT_MAX = 10;
const MAX_ATTACHMENT_BYTES = 10 * 1024 * 1024; // 10 MB

function resolveSenderRole(roles: string[]): string {
  if (roles.includes("admin")) return "admin";
  if (roles.includes("volunteer")) return "volunteer";
  return "member";
}

function checkRateLimit(userId: string): boolean {
  const now = Date.now();
  const timestamps = rateLimitMap.get(userId) || [];
  const recent = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW);
  rateLimitMap.set(userId, recent);
  return recent.length < RATE_LIMIT_MAX;
}

function recordMessage(userId: string) {
  const timestamps = rateLimitMap.get(userId) || [];
  timestamps.push(Date.now());
  rateLimitMap.set(userId, timestamps);
}

async function verifyAccess(
  conversationId: string,
  userId: string,
  userRoles: string[]
) {
  const conversation = await prisma.privateConversation.findUnique({
    where: { id: conversationId },
    select: { fatherId: true, volunteerId: true, status: true },
  });

  if (!conversation) return { allowed: false, conversation: null, error: "Conversation introuvable" };

  if (userRoles.includes("admin")) return { allowed: true, conversation, error: null };
  if (userRoles.includes("volunteer") && conversation.volunteerId === userId)
    return { allowed: true, conversation, error: null };
  if (conversation.fatherId === userId)
    return { allowed: true, conversation, error: null };

  return { allowed: false, conversation: null, error: "Accès refusé" };
}

// ─── GET /api/messagerie/conversations/[id]/messages ─────────────────────────
// Get messages with cursor-based pagination

export async function GET(
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

  const access = await verifyAccess(id, user.id, user.roles);
  if (!access.allowed) {
    return NextResponse.json({ error: access.error }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const limit = Math.min(parseInt(searchParams.get("limit") || "30"), 50);
  const cursor = searchParams.get("cursor") || "";

  const whereClause: Record<string, unknown> = { conversationId: id };

  if (cursor && UUID_REGEX.test(cursor)) {
    const cursorMessage = await prisma.privateMessage.findUnique({
      where: { id: cursor },
      select: { createdAt: true },
    });
    if (cursorMessage) {
      whereClause.createdAt = { lt: cursorMessage.createdAt };
    }
  }

  const messages = await prisma.privateMessage.findMany({
    where: whereClause,
    orderBy: { createdAt: "desc" },
    take: limit + 1,
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

  const hasMore = messages.length > limit;
  const result = hasMore ? messages.slice(0, limit) : messages;
  const nextCursor = hasMore ? result[result.length - 1]?.id : null;

  return NextResponse.json({
    messages: result.reverse(), // Return in chronological order
    hasMore,
    nextCursor,
  });
}

// ─── POST /api/messagerie/conversations/[id]/messages ────────────────────────
// Send a message

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

  const access = await verifyAccess(id, user.id, user.roles);
  if (!access.allowed) {
    return NextResponse.json({ error: access.error }, { status: 403 });
  }

  if (access.conversation!.status === "closed") {
    return NextResponse.json(
      { error: "Cette conversation est fermée" },
      { status: 403 }
    );
  }

  // Rate limiting
  if (!checkRateLimit(user.id)) {
    return NextResponse.json(
      { error: "Trop de messages envoyés. Veuillez patienter." },
      { status: 429 }
    );
  }

  const contentType = request.headers.get("content-type") || "";
  let messageContent = "";
  let attachment:
    | {
        name: string;
        mime: string;
        size: number;
        data: Buffer;
      }
    | undefined;

  if (contentType.includes("multipart/form-data")) {
    const formData = await request.formData();
    const rawContent = (formData.get("content") as string | null) ?? "";
    messageContent = sanitizeForStorage(rawContent, MESSAGERIE_LIMITS.messageMaxLength);

    const maybeFile = formData.get("file");
    if (maybeFile instanceof File && maybeFile.size > 0) {
      if (maybeFile.size > MAX_ATTACHMENT_BYTES) {
        return NextResponse.json(
          { error: "Le fichier depasse la taille maximale de 10 MB." },
          { status: 400 }
        );
      }
      const bytes = await maybeFile.arrayBuffer();
      attachment = {
        name: sanitizeForStorage(maybeFile.name || "fichier", 255),
        mime: maybeFile.type || "application/octet-stream",
        size: maybeFile.size,
        data: Buffer.from(bytes),
      };
    }

    if (!attachment && messageContent.length < 3) {
      return NextResponse.json(
        { error: "Le message doit faire au moins 3 caracteres." },
        { status: 400 }
      );
    }
  } else {
    const body = await request.json();
    const validation = validateCreateMessage(body);
    if (!validation.success) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }
    messageContent = validation.data.content;
  }

  recordMessage(user.id);

  const message = await prisma.privateMessage.create({
    data: {
      conversationId: id,
      senderId: user.id,
      senderRole: resolveSenderRole(user.roles),
      content: messageContent || "",
      attachmentName: attachment?.name,
      attachmentMime: attachment?.mime,
      attachmentSize: attachment?.size,
      attachmentData: attachment?.data
        ? new Uint8Array(attachment.data)
        : undefined,
    },
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

  // Update conversation timestamp
  await prisma.privateConversation.update({
    where: { id },
    data: { updatedAt: new Date() },
  });

  // Trigger notification asynchronously
  import("@/lib/messagerie/notification-triggers").then(({ notifyNewPrivateMessage }) => {
    notifyNewPrivateMessage(id, user.id, messageContent || "[piece jointe]").catch(console.error);
  });

  return NextResponse.json({ message }, { status: 201 });
}
