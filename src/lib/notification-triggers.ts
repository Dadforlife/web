import React from "react";
import { notify, notifyAll } from "@/lib/notifications";
import { prisma } from "@/lib/prisma";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://dadforlife.org";

// ─── 1. Account notifications ────────────────────────────────────────────────

export async function notifyWelcome(userId: string, fullName: string) {
  const Bienvenue =
    (await import("@/emails/account/bienvenue")).default;

  await notify({
    userId,
    type: "account.welcome",
    title: "Bienvenue sur Papa pour la vie !",
    body: "Votre compte a été créé avec succès. Découvrez votre espace personnel.",
    link: "/dashboard",
    emailSubject: "Bienvenue sur Papa pour la vie !",
    emailTemplate: React.createElement(Bienvenue, {
      fullName,
      dashboardUrl: `${baseUrl}/dashboard`,
    }),
  });
}

export async function notifyPasswordReset(
  userId: string,
  fullName: string,
  resetUrl: string
) {
  const MotDePasseOublie =
    (await import("@/emails/account/mot-de-passe-oublie")).default;

  await notify({
    userId,
    type: "account.password_reset",
    title: "Réinitialisation de mot de passe",
    body: "Vous avez demandé à réinitialiser votre mot de passe.",
    link: resetUrl,
    emailSubject: "Réinitialisation de votre mot de passe — Papa pour la vie",
    emailTemplate: React.createElement(MotDePasseOublie, {
      fullName,
      resetUrl,
    }),
  });
}

export async function notifyPasswordResetSuccess(
  userId: string,
  fullName: string
) {
  const ReinitialisationReussie =
    (await import("@/emails/account/reinitialisation-reussie")).default;

  await notify({
    userId,
    type: "account.password_reset_success",
    title: "Mot de passe modifié",
    body: "Votre mot de passe a été réinitialisé avec succès.",
    emailSubject: "Mot de passe modifié — Papa pour la vie",
    emailTemplate: React.createElement(ReinitialisationReussie, { fullName }),
  });
}

export async function notifyAccountSuspended(
  userId: string,
  fullName: string,
  reason: string
) {
  const CompteSuspendu =
    (await import("@/emails/account/compte-suspendu")).default;

  await notify({
    userId,
    type: "account.suspended",
    title: "Compte suspendu",
    body: `Votre compte a été suspendu : ${reason}`,
    emailSubject: "Votre compte Papa pour la vie a été suspendu",
    emailTemplate: React.createElement(CompteSuspendu, {
      fullName,
      reason,
      contactEmail: "contact@dadforlife.org",
    }),
  });
}

export async function notifyAccountDeleted(
  userId: string,
  fullName: string,
  email: string
) {
  const CompteSupprime =
    (await import("@/emails/account/compte-supprime")).default;

  // Only send email — no in-app since account is being deleted
  const { sendEmail } = await import("@/lib/email");
  await sendEmail({
    to: email,
    subject: "Votre compte Papa pour la vie a été supprimé",
    react: React.createElement(CompteSupprime, { fullName }),
  });
}

// ─── 2. Forum notifications ──────────────────────────────────────────────────

export async function notifyNewReply(
  discussionId: string,
  replierId: string,
  replyContent: string
) {
  const discussion = await prisma.discussion.findUnique({
    where: { id: discussionId },
    include: { author: { select: { id: true, fullName: true } } },
  });

  if (!discussion) return;

  const replier = await prisma.user.findUnique({
    where: { id: replierId },
    select: { fullName: true },
  });

  if (!replier) return;

  // Don't notify if author is replying to their own discussion
  if (discussion.authorId === replierId) return;

  const NouvelleReponse =
    (await import("@/emails/forum/nouvelle-reponse")).default;

  const preview =
    replyContent.length > 150
      ? replyContent.substring(0, 150) + "..."
      : replyContent;
  const discussionUrl = `${baseUrl}/espace-papas/${discussionId}`;

  await notify({
    userId: discussion.authorId,
    type: "forum.new_reply",
    title: `Nouvelle réponse de ${replier.fullName}`,
    body: `${replier.fullName} a répondu dans "${discussion.title}"`,
    link: `/espace-papas/${discussionId}`,
    emailSubject: `Nouvelle réponse dans "${discussion.title}" — Papa pour la vie`,
    emailTemplate: React.createElement(NouvelleReponse, {
      fullName: discussion.author.fullName,
      discussionTitle: discussion.title,
      authorName: replier.fullName,
      replyPreview: preview,
      discussionUrl,
    }),
  });

  // Also notify other participants (unique authors of messages in this discussion)
  const participants = await prisma.message.findMany({
    where: {
      discussionId,
      authorId: {
        notIn: [replierId, discussion.authorId],
      },
    },
    select: { authorId: true },
    distinct: ["authorId"],
  });

  const NouveauMessage =
    (await import("@/emails/forum/nouveau-message")).default;

  for (const participant of participants) {
    const participantUser = await prisma.user.findUnique({
      where: { id: participant.authorId },
      select: { fullName: true },
    });

    if (!participantUser) continue;

    await notify({
      userId: participant.authorId,
      type: "forum.new_message",
      title: `Nouveau message dans "${discussion.title}"`,
      body: `${replier.fullName} a posté un message dans une discussion que vous suivez`,
      link: `/espace-papas/${discussionId}`,
      emailSubject: `Nouveau message dans "${discussion.title}" — Papa pour la vie`,
      emailTemplate: React.createElement(NouveauMessage, {
        fullName: participantUser.fullName,
        discussionTitle: discussion.title,
        authorName: replier.fullName,
        messagePreview: preview,
        discussionUrl,
      }),
    });
  }
}

export async function notifyPostReported(
  discussionId: string,
  reason: string
) {
  const discussion = await prisma.discussion.findUnique({
    where: { id: discussionId },
    include: { author: { select: { id: true, fullName: true } } },
  });

  if (!discussion) return;

  const PostSignale =
    (await import("@/emails/forum/post-signale")).default;

  await notify({
    userId: discussion.authorId,
    type: "forum.post_reported",
    title: "Publication signalée",
    body: `Votre publication "${discussion.title}" a été signalée`,
    link: `/espace-papas/${discussionId}`,
    emailSubject: "Votre publication a été signalée — Papa pour la vie",
    emailTemplate: React.createElement(PostSignale, {
      fullName: discussion.author.fullName,
      discussionTitle: discussion.title,
      reason,
    }),
  });
}

export async function notifyPostModerated(
  userId: string,
  fullName: string,
  discussionTitle: string,
  action: string,
  reason: string
) {
  const PostModere =
    (await import("@/emails/forum/post-modere")).default;

  await notify({
    userId,
    type: "forum.post_moderated",
    title: "Publication modérée",
    body: `Votre publication "${discussionTitle}" a été ${action}`,
    emailSubject: "Votre publication a été modérée — Papa pour la vie",
    emailTemplate: React.createElement(PostModere, {
      fullName,
      discussionTitle,
      action,
      reason,
      contactEmail: "contact@dadforlife.org",
    }),
  });
}

// ─── 3. Community notifications ───────────────────────────────────────────────

export async function notifyNewMember(newMemberName: string) {
  const NouveauMembre =
    (await import("@/emails/community/nouveau-membre")).default;

  await notifyAll({
    type: "community.new_member",
    title: "Nouveau membre",
    body: `${newMemberName} a rejoint la communauté Papa pour la vie`,
    link: "/espace-papas",
    emailSubject: `${newMemberName} a rejoint Papa pour la vie`,
    emailTemplateFactory: (user) =>
      React.createElement(NouveauMembre, {
        fullName: user.fullName,
        newMemberName,
      }),
  });
}

// ─── 4. Admin notifications (bulk) ───────────────────────────────────────────

export async function notifyCGUUpdate(effectiveDate: string, cguUrl: string) {
  const MiseAJourCGU =
    (await import("@/emails/admin/mise-a-jour-cgu")).default;

  await notifyAll({
    type: "admin.cgu_update",
    title: "Mise à jour des CGU",
    body: `Les Conditions Générales d'Utilisation ont été mises à jour (effet le ${effectiveDate})`,
    link: cguUrl,
    emailSubject: "Mise à jour des CGU — Papa pour la vie",
    emailTemplateFactory: (user) =>
      React.createElement(MiseAJourCGU, {
        fullName: user.fullName,
        effectiveDate,
        cguUrl: `${baseUrl}${cguUrl}`,
      }),
  });
}

export async function notifyMaintenance(
  maintenanceDate: string,
  maintenanceDuration: string
) {
  const MaintenanceProgrammee =
    (await import("@/emails/admin/maintenance-programmee")).default;

  await notifyAll({
    type: "admin.maintenance",
    title: "Maintenance programmée",
    body: `Maintenance prévue le ${maintenanceDate} (durée : ${maintenanceDuration})`,
    emailSubject: "Maintenance programmée — Papa pour la vie",
    emailTemplateFactory: (user) =>
      React.createElement(MaintenanceProgrammee, {
        fullName: user.fullName,
        maintenanceDate,
        maintenanceDuration,
      }),
  });
}
