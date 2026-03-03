import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// UUID validation regex
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// ─── GET /api/messagerie/conversations/[id] ──────────────────────────────────
// Get conversation detail

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
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

  const conversation = await prisma.privateConversation.findUnique({
    where: { id },
    include: {
      father: { select: { id: true, fullName: true, email: true } },
      volunteer: { select: { id: true, fullName: true, email: true } },
      closedBy: { select: { id: true, fullName: true } },
    },
  });

  if (!conversation) {
    return NextResponse.json({ error: "Conversation introuvable" }, { status: 404 });
  }

  // Access control
  if (user.roles.includes("admin")) {
    // admin can access all conversations
  } else if (user.roles.includes("volunteer") && conversation.volunteerId === user.id) {
    // volunteer can access their assigned conversations
  } else if (conversation.fatherId === user.id) {
    // father can access their own conversations
  } else {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  }

  return NextResponse.json({ conversation });
}

// ─── PATCH /api/messagerie/conversations/[id] ────────────────────────────────
// Update conversation: assign volunteer, close/reopen (admin only)

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
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

  if (!user || !user.roles.includes("admin")) {
    return NextResponse.json({ error: "Accès réservé aux administrateurs" }, { status: 403 });
  }

  const conversation = await prisma.privateConversation.findUnique({
    where: { id },
  });

  if (!conversation) {
    return NextResponse.json({ error: "Conversation introuvable" }, { status: 404 });
  }

  const body = await request.json();
  const updateData: Record<string, unknown> = {};

  // Assign volunteer
  if (body.volunteerId !== undefined) {
    if (body.volunteerId === null) {
      updateData.volunteerId = null;
    } else {
      if (!UUID_REGEX.test(body.volunteerId)) {
        return NextResponse.json({ error: "ID bénévole invalide" }, { status: 400 });
      }
      const volunteer = await prisma.user.findUnique({
        where: { id: body.volunteerId },
        select: { roles: true },
      });
      if (!volunteer || !volunteer.roles.includes("volunteer")) {
        return NextResponse.json(
          { error: "L'utilisateur sélectionné n'est pas un bénévole" },
          { status: 400 }
        );
      }
      updateData.volunteerId = body.volunteerId;
    }
  }

  // Close / reopen
  if (body.status === "closed") {
    updateData.status = "closed";
    updateData.closedAt = new Date();
    updateData.closedById = user.id;
  } else if (body.status === "open") {
    updateData.status = "open";
    updateData.closedAt = null;
    updateData.closedById = null;
  }

  if (Object.keys(updateData).length === 0) {
    return NextResponse.json({ error: "Aucune modification fournie" }, { status: 400 });
  }

  const updated = await prisma.privateConversation.update({
    where: { id },
    data: updateData,
    include: {
      father: { select: { id: true, fullName: true } },
      volunteer: { select: { id: true, fullName: true } },
    },
  });

  // Notify volunteer if assigned
  if (body.volunteerId && body.volunteerId !== conversation.volunteerId) {
    import("@/lib/messagerie/notification-triggers").then(({ notifyConversationAssigned }) => {
      notifyConversationAssigned(id, body.volunteerId).catch(console.error);
    });
  }

  return NextResponse.json({ conversation: updated });
}
