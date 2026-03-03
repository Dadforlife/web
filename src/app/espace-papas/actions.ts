"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { validateCreateDiscussion, validateCreateMessage } from "@/lib/forum/validation";
import { notifyNewReply } from "@/lib/notification-triggers";

export async function createDiscussion(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Vous devez être connecté pour créer une discussion." };
  }

  const raw = {
    title: formData.get("title"),
    categoryId: formData.get("categoryId"),
    content: formData.get("content"),
    isAnonymous: formData.get("isAnonymous") === "on",
  };
  const validated = validateCreateDiscussion(raw);
  if (!validated.success) {
    return { error: validated.error };
  }

  const { title, categoryId, content, isAnonymous } = validated.data;

  const category = await prisma.category.findUnique({
    where: { id: categoryId },
  });
  if (!category) {
    return { error: "Catégorie introuvable." };
  }

  const discussion = await prisma.discussion.create({
    data: {
      title,
      content,
      authorId: session.user.id,
      categoryId,
      isAnonymous,
      status: "active",
    },
  });

  revalidatePath("/espace-papas");
  redirect(`/espace-papas/${discussion.id}`);
}

export async function createMessage(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Vous devez être connecté pour répondre." };
  }

  const raw = {
    content: formData.get("content"),
    discussionId: formData.get("discussionId"),
  };
  const validated = validateCreateMessage(raw);
  if (!validated.success) {
    return { error: validated.error };
  }

  const { content, discussionId } = validated.data;

  const discussion = await prisma.discussion.findFirst({
    where: { id: discussionId, status: { in: ["active", "archived"] } },
  });
  if (!discussion) {
    return { error: "Discussion introuvable." };
  }

  await prisma.message.create({
    data: {
      content,
      authorId: session.user.id,
      discussionId,
    },
  });

  // Notify discussion author + participants (non-blocking)
  notifyNewReply(discussionId, session.user.id, content).catch(console.error);

  revalidatePath("/espace-papas");
  revalidatePath(`/espace-papas/${discussionId}`);
  redirect(`/espace-papas/${discussionId}`);
}
