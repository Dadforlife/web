"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";

export async function deleteDiscussion(id: string) {
  await requireAdmin();

  await prisma.discussion.delete({
    where: { id },
  });

  revalidatePath("/admin/discussions");
}

export async function deleteMessage(id: string) {
  await requireAdmin();

  const message = await prisma.message.findUnique({
    where: { id },
    select: { discussionId: true },
  });

  await prisma.message.delete({
    where: { id },
  });

  revalidatePath("/admin/discussions");
  if (message) {
    revalidatePath(`/admin/discussions/${message.discussionId}`);
  }
}

export async function updateDiscussionStatus(
  id: string,
  status: "active" | "flagged" | "archived",
) {
  await requireAdmin();

  await prisma.discussion.update({
    where: { id },
    data: { status },
  });

  revalidatePath("/admin/discussions");
  revalidatePath(`/admin/discussions/${id}`);
}

export async function blockUserFromDiscussion(
  userId: string,
  reason: string,
) {
  await requireAdmin();

  await prisma.user.update({
    where: { id: userId },
    data: {
      status: "suspended",
      suspendedAt: new Date(),
      suspendedReason: reason,
    },
  });

  revalidatePath("/admin/discussions");
  revalidatePath("/admin/utilisateurs");
}
