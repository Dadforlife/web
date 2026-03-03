"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { sanitizeForStorage } from "@/lib/forum/sanitize";
import { MESSAGERIE_LIMITS } from "@/lib/messagerie/validation";
import { notify } from "@/lib/notifications";
import type { VolunteerRole } from "@prisma/client";

export async function updateApplicationStatus(
  id: string,
  status: "pending" | "contacted" | "accepted" | "rejected",
  adminNotes?: string,
  volunteerRole?: VolunteerRole,
) {
  const admin = await requireAdmin();

  const application = await prisma.volunteerApplication.findUnique({
    where: { id },
    select: { userId: true, email: true, fullName: true, city: true },
  });

  if (!application) {
    throw new Error("Candidature introuvable.");
  }

  await prisma.volunteerApplication.update({
    where: { id },
    data: {
      status,
      adminNotes: adminNotes ?? undefined,
      reviewedById: admin.id,
      reviewedAt: new Date(),
    },
  });

  // Promote user: add "volunteer" to roles array and create profile on acceptance
  if (status === "accepted" && application.userId) {
    const selectedRole = volunteerRole ?? "accompagnateur_terrain";

    await prisma.$transaction(async (tx) => {
      const currentUser = await tx.user.findUniqueOrThrow({
        where: { id: application.userId! },
        select: { roles: true },
      });
      const newRoles = currentUser.roles.includes("volunteer")
        ? currentUser.roles
        : [...currentUser.roles, "volunteer"];
      await tx.user.update({
        where: { id: application.userId! },
        data: { roles: newRoles },
      });
      await tx.volunteerProfile.upsert({
        where: { userId: application.userId! },
        create: {
          userId: application.userId!,
          volunteerRole: selectedRole,
          city: application.city,
        },
        update: {
          volunteerRole: selectedRole,
          isActive: true,
        },
      });
    });

    notify({
      userId: application.userId,
      type: "admin.volunteer_accepted",
      title: "Candidature acceptee !",
      body: `Felicitations ${application.fullName}, votre candidature benevole a ete acceptee. Accedez a votre dashboard benevole pour commencer.`,
      link: "/dashboard/benevole",
    }).catch(console.error);
  }

  revalidatePath("/admin/benevoles");
  revalidatePath(`/admin/benevoles/${id}`);
  revalidatePath("/dashboard", "layout");
  revalidatePath("/dashboard/benevole");
  revalidatePath("/dashboard/devenir-benevole");
}

export async function deleteApplication(id: string) {
  await requireAdmin();

  await prisma.volunteerApplication.delete({ where: { id } });

  revalidatePath("/admin/benevoles");
}

export async function addAdminNote(id: string, notes: string) {
  await requireAdmin();

  await prisma.volunteerApplication.update({
    where: { id },
    data: { adminNotes: notes },
  });

  revalidatePath(`/admin/benevoles/${id}`);
}

export async function sendPrivateMessageFromApplication(
  applicationId: string,
  subjectInput: string,
  contentInput: string,
) {
  const admin = await requireAdmin();

  const subject = sanitizeForStorage(subjectInput, MESSAGERIE_LIMITS.subjectMaxLength);
  const content = sanitizeForStorage(contentInput, MESSAGERIE_LIMITS.messageMaxLength);

  if (subject.length < 3) {
    throw new Error("Le sujet doit faire au moins 3 caracteres.");
  }
  if (content.length < 3) {
    throw new Error("Le message doit faire au moins 3 caracteres.");
  }

  const application = await prisma.volunteerApplication.findUnique({
    where: { id: applicationId },
    select: {
      id: true,
      fullName: true,
      email: true,
      userId: true,
    },
  });

  if (!application) {
    throw new Error("Candidature introuvable.");
  }

  let fatherId = application.userId ?? null;

  if (!fatherId) {
    const member = await prisma.user.findFirst({
      where: { email: application.email, roles: { has: "member" } },
      select: { id: true },
    });
    fatherId = member?.id ?? null;
  }

  if (!fatherId) {
    throw new Error("Aucun compte papa lie a cette candidature.");
  }

  const openConversation = await prisma.privateConversation.findFirst({
    where: {
      fatherId,
      status: "open",
    },
    orderBy: { updatedAt: "desc" },
    select: { id: true },
  });

  const conversationId = await prisma.$transaction(async (tx) => {
    if (openConversation) {
      await tx.privateMessage.create({
        data: {
          conversationId: openConversation.id,
          senderId: admin.id,
          senderRole: "admin",
          content,
        },
      });
      await tx.privateConversation.update({
        where: { id: openConversation.id },
        data: { updatedAt: new Date() },
      });
      return openConversation.id;
    }

    const conversation = await tx.privateConversation.create({
      data: {
        fatherId,
        subject,
      },
      select: { id: true },
    });

    await tx.privateMessage.create({
      data: {
        conversationId: conversation.id,
        senderId: admin.id,
        senderRole: "admin",
        content,
      },
    });

    return conversation.id;
  });

  import("@/lib/messagerie/notification-triggers").then(({ notifyNewPrivateMessage }) => {
    notifyNewPrivateMessage(conversationId, admin.id, content).catch(console.error);
  });

  revalidatePath("/admin/messagerie");
  revalidatePath(`/admin/messagerie/${conversationId}`);
  revalidatePath(`/admin/benevoles/${applicationId}`);
  revalidatePath("/dashboard/messagerie");

  return { conversationId };
}
