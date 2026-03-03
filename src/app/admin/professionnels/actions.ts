"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import {
  AdminActionType,
  GeneratedDocumentType,
  ProfessionalLevel,
  ProfessionalStatus,
} from "@prisma/client";
import { evaluateProfessionalLevel } from "@/lib/professional-validation";
import { notify } from "@/lib/notifications";

export async function setProfessionalStatus(
  userId: string,
  status: ProfessionalStatus,
  adminNotes?: string,
) {
  const admin = await requireAdmin();

  await prisma.$transaction(async (tx) => {
    await tx.user.update({
      where: { id: userId },
      data: { professionalStatus: status },
    });

    await tx.professionalVerification.upsert({
      where: { userId },
      create: {
        userId,
        adminNotes: adminNotes ?? null,
        validatedByAdminId: status === "valide" ? admin.id : null,
        validatedAt: status === "valide" ? new Date() : null,
      },
      update: {
        adminNotes: adminNotes ?? undefined,
        validatedByAdminId: status === "valide" ? admin.id : null,
        validatedAt: status === "valide" ? new Date() : null,
      },
    });

    await tx.adminActionLog.create({
      data: {
        actionType: AdminActionType.professional_status_changed,
        actorId: admin.id,
        targetUserId: userId,
        metadata: { status, adminNotes },
      },
    });
  });

  if (status === ProfessionalStatus.valide) {
    const targetUser = await prisma.user.findUniqueOrThrow({
      where: { id: userId },
      select: { roles: true },
    });
    const newRoles = targetUser.roles.includes("partner")
      ? targetUser.roles
      : [...targetUser.roles, "partner"];
    await prisma.user.update({
      where: { id: userId },
      data: {
        roles: newRoles,
        professionalLevel: ProfessionalLevel.reference,
      },
    });
    await evaluateProfessionalLevel(userId);
  }

  await notify({
    userId,
    type: "admin.professional_status_changed",
    title: "Mise a jour de votre statut professionnel",
    body: `Votre statut est maintenant: ${status}.`,
    link: "/dashboard/profil-pro",
  });

  revalidatePath("/admin/professionnels");
  revalidatePath(`/admin/professionnels/${userId}`);
}

export async function saveInterview(
  userId: string,
  interviewScore: number,
  adminNotes?: string,
) {
  const admin = await requireAdmin();

  await prisma.$transaction(async (tx) => {
    await tx.professionalVerification.upsert({
      where: { userId },
      create: {
        userId,
        interviewCompleted: true,
        interviewScore,
        adminNotes: adminNotes ?? null,
      },
      update: {
        interviewCompleted: true,
        interviewScore,
        adminNotes: adminNotes ?? undefined,
      },
    });

    await tx.adminActionLog.create({
      data: {
        actionType: AdminActionType.professional_interview_scored,
        actorId: admin.id,
        targetUserId: userId,
        metadata: { interviewScore, adminNotes },
      },
    });
  });

  await evaluateProfessionalLevel(userId);
  revalidatePath(`/admin/professionnels/${userId}`);
}

export async function verifyProfessionalDocument(documentId: string) {
  const admin = await requireAdmin();

  const document = await prisma.professionalDocument.update({
    where: { id: documentId },
    data: {
      verified: true,
      verifiedAt: new Date(),
      verifiedById: admin.id,
    },
    select: { id: true, userId: true },
  });

  await prisma.adminActionLog.create({
    data: {
      actionType: AdminActionType.professional_document_verified,
      actorId: admin.id,
      targetUserId: document.userId,
      metadata: { documentId: document.id },
    },
  });

  revalidatePath(`/admin/professionnels/${document.userId}`);
}

export async function generateProfessionalDocument(
  userId: string,
  documentType: GeneratedDocumentType,
) {
  const admin = await requireAdmin();
  const user = await prisma.user.findUniqueOrThrow({
    where: { id: userId },
    select: { fullName: true, email: true, professionalRole: true },
  });

  const title =
    documentType === GeneratedDocumentType.charte_ethique
      ? "Charte Ethique Papa pour la vie"
      : "Convention de partenariat Papa pour la vie";

  const content = [
    title,
    "",
    `Nom: ${user.fullName || "N/A"}`,
    `Email: ${user.email}`,
    `Role: ${user.professionalRole ?? "N/A"}`,
    `Date de generation: ${new Date().toISOString()}`,
    "",
    "Ce document est genere automatiquement et doit etre signe electroniquement.",
  ].join("\n");

  const created = await prisma.generatedDocument.create({
    data: {
      userId,
      documentType,
      content,
      fileUrl: "",
    },
    select: { id: true },
  });

  await prisma.generatedDocument.update({
    where: { id: created.id },
    data: { fileUrl: `/api/professionnels/documents/generated/${created.id}` },
  });

  await prisma.adminActionLog.create({
    data: {
      actionType: AdminActionType.generated_document_created,
      actorId: admin.id,
      targetUserId: userId,
      metadata: { documentType, generatedDocumentId: created.id },
    },
  });

  revalidatePath(`/admin/professionnels/${userId}`);
}

