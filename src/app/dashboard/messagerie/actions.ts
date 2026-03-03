"use server";

import { revalidatePath } from "next/cache";
import { requireAuth } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";

export async function closeConversation(conversationId: string) {
  const user = await requireAuth();

  if (!user.roles.includes("admin") && !user.roles.includes("volunteer")) {
    throw new Error("Non autorisé");
  }

  if (user.roles.includes("volunteer") && !user.roles.includes("admin")) {
    const conversation = await prisma.privateConversation.findUnique({
      where: { id: conversationId },
      select: { volunteerId: true },
    });
    if (!conversation || conversation.volunteerId !== user.id) {
      throw new Error("Accès refusé");
    }
  }

  await prisma.privateConversation.update({
    where: { id: conversationId },
    data: {
      status: "closed",
      closedAt: new Date(),
      closedById: user.id,
    },
  });

  revalidatePath(`/dashboard/messagerie/${conversationId}`);
  revalidatePath("/dashboard/messagerie");
}
