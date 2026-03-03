"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";

export async function resolveReport(
  id: string,
  resolution: string,
  status: "warning" | "suspended" | "dismissed",
) {
  const admin = await requireAdmin();

  await prisma.report.update({
    where: { id },
    data: {
      status,
      resolution,
      resolvedAt: new Date(),
      resolvedById: admin.id,
    },
  });

  revalidatePath("/admin/signalements");
  revalidatePath(`/admin/signalements/${id}`);
}

export async function dismissReport(id: string) {
  await resolveReport(id, "Signalement rejeté par un administrateur.", "dismissed");
}

export async function warnUser(reportId: string, _userId: string) {
  await resolveReport(
    reportId,
    "Un avertissement a été envoyé à l'auteur du contenu.",
    "warning",
  );
}

export async function suspendFromReport(
  reportId: string,
  userId: string,
  reason: string,
) {
  const admin = await requireAdmin();

  await prisma.$transaction(async (tx) => {
    await tx.report.update({
      where: { id: reportId },
      data: {
        status: "suspended",
        resolution: reason,
        resolvedAt: new Date(),
        resolvedById: admin.id,
      },
    });
    await tx.user.update({
      where: { id: userId },
      data: {
        status: "suspended",
        suspendedAt: new Date(),
        suspendedReason: reason,
      },
    });
  });

  revalidatePath("/admin/signalements");
  revalidatePath(`/admin/signalements/${reportId}`);
}

export async function deleteReportedContent(reportId: string) {
  const admin = await requireAdmin();

  const report = await prisma.report.findUnique({
    where: { id: reportId },
    select: { discussionId: true, messageId: true },
  });

  if (!report) throw new Error("Signalement introuvable.");

  await prisma.$transaction(async (tx) => {
    await tx.report.update({
      where: { id: reportId },
      data: {
        status: "suspended",
        resolution: "Le contenu signalé a été supprimé.",
        resolvedAt: new Date(),
        resolvedById: admin.id,
      },
    });

    if (report.discussionId) {
      await tx.discussion.delete({ where: { id: report.discussionId } });
    } else if (report.messageId) {
      await tx.message.delete({ where: { id: report.messageId } });
    }
  });

  revalidatePath("/admin/signalements");
  revalidatePath(`/admin/signalements/${reportId}`);
}
