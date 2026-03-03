"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { notifyConversationAssigned } from "@/lib/messagerie/notification-triggers";

export async function assignVolunteer(
  conversationId: string,
  volunteerId: string
) {
  const user = await requireAdmin();

  const volunteer = await prisma.user.findUnique({
    where: { id: volunteerId },
    select: { roles: true },
  });

  if (!volunteer || !volunteer.roles.includes("volunteer")) {
    throw new Error("L'utilisateur sélectionné n'est pas un bénévole");
  }

  await prisma.privateConversation.update({
    where: { id: conversationId },
    data: { volunteerId },
  });

  // Notify the assigned volunteer
  notifyConversationAssigned(conversationId, volunteerId).catch(console.error);

  revalidatePath(`/admin/messagerie/${conversationId}`);
  revalidatePath("/admin/messagerie");
}

export async function closeConversation(conversationId: string) {
  const user = await requireAdmin();

  await prisma.privateConversation.update({
    where: { id: conversationId },
    data: {
      status: "closed",
      closedAt: new Date(),
      closedById: user.id,
    },
  });

  revalidatePath(`/admin/messagerie/${conversationId}`);
  revalidatePath("/admin/messagerie");
}

export async function reopenConversation(conversationId: string) {
  await requireAdmin();

  await prisma.privateConversation.update({
    where: { id: conversationId },
    data: {
      status: "open",
      closedAt: null,
      closedById: null,
    },
  });

  revalidatePath(`/admin/messagerie/${conversationId}`);
  revalidatePath("/admin/messagerie");
}
