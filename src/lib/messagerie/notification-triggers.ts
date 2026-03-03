import React from "react";
import { notify } from "@/lib/notifications";
import { prisma } from "@/lib/prisma";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://dadforlife.org";

export async function notifyNewPrivateMessage(
  conversationId: string,
  senderId: string,
  messageContent: string
) {
  const conversation = await prisma.privateConversation.findUnique({
    where: { id: conversationId },
    select: {
      subject: true,
      fatherId: true,
      volunteerId: true,
    },
  });
  if (!conversation) return;

  const sender = await prisma.user.findUnique({
    where: { id: senderId },
    select: { fullName: true },
  });
  if (!sender) return;

  // Determine recipients: everyone in the conversation except the sender
  const recipientIds: string[] = [];
  if (conversation.fatherId !== senderId) {
    recipientIds.push(conversation.fatherId);
  }
  if (conversation.volunteerId && conversation.volunteerId !== senderId) {
    recipientIds.push(conversation.volunteerId);
  }

  const NouveauMessagePrive = (
    await import("@/emails/messagerie/nouveau-message-prive")
  ).default;

  const preview =
    messageContent.length > 150
      ? messageContent.substring(0, 150) + "..."
      : messageContent;

  for (const recipientId of recipientIds) {
    const recipient = await prisma.user.findUnique({
      where: { id: recipientId },
      select: { fullName: true, roles: true },
    });
    if (!recipient) continue;

    const link =
      recipient.roles.includes("admin")
        ? `/admin/messagerie/${conversationId}`
        : `/dashboard/messagerie/${conversationId}`;

    await notify({
      userId: recipientId,
      type: "messagerie.new_message",
      title: `Nouveau message de ${sender.fullName}`,
      body: `${sender.fullName} vous a envoyé un message : "${conversation.subject}"`,
      link,
      emailSubject: "Nouveau message privé — Papa pour la vie",
      emailTemplate: React.createElement(NouveauMessagePrive, {
        fullName: recipient.fullName,
        senderName: sender.fullName,
        conversationSubject: conversation.subject,
        messagePreview: preview,
        conversationUrl: `${baseUrl}${link}`,
      }),
    });
  }
}

export async function notifyConversationAssigned(
  conversationId: string,
  volunteerId: string
) {
  const conversation = await prisma.privateConversation.findUnique({
    where: { id: conversationId },
    select: { subject: true },
  });
  if (!conversation) return;

  await notify({
    userId: volunteerId,
    type: "messagerie.assigned",
    title: "Nouvelle conversation assignée",
    body: `Vous avez été assigné à la conversation "${conversation.subject}"`,
    link: `/dashboard/messagerie/${conversationId}`,
    emailSubject: "Nouvelle conversation assignée — Papa pour la vie",
  });
}
