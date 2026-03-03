import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email";
import React from "react";

// ─── Category mapping ─────────────────────────────────────────────────────────

type NotificationCategory =
  | "account"
  | "forum"
  | "community"
  | "programme"
  | "admin"
  | "engagement"
  | "messagerie";

function getCategoryFromType(type: string): NotificationCategory {
  const prefix = type.split(".")[0];
  const map: Record<string, NotificationCategory> = {
    account: "account",
    forum: "forum",
    community: "community",
    programme: "programme",
    admin: "admin",
    engagement: "engagement",
    messagerie: "messagerie",
  };
  return map[prefix] || "account";
}

function getEmailPrefKey(
  category: NotificationCategory
): string {
  const map: Record<NotificationCategory, string> = {
    account: "emailAccount",
    forum: "emailForum",
    community: "emailCommunity",
    programme: "emailProgramme",
    admin: "emailAdmin",
    engagement: "emailEngagement",
    messagerie: "emailMessagerie",
  };
  return map[category];
}

function getInappPrefKey(
  category: NotificationCategory
): string {
  const map: Record<NotificationCategory, string> = {
    account: "inappAccount",
    forum: "inappForum",
    community: "inappCommunity",
    programme: "inappProgramme",
    admin: "inappAdmin",
    engagement: "inappEngagement",
    messagerie: "inappMessagerie",
  };
  return map[category];
}

// ─── Main notification function ───────────────────────────────────────────────

interface NotifyOptions {
  userId: string;
  type: string;
  title: string;
  body: string;
  link?: string;
  emailSubject?: string;
  emailTemplate?: React.ReactElement;
}

export async function notify({
  userId,
  type,
  title,
  body,
  link,
  emailSubject,
  emailTemplate,
}: NotifyOptions) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        email: true,
        notificationPreferences: true,
      },
    });

    if (!user) return;

    const category = getCategoryFromType(type);
    const prefs = user.notificationPreferences;

    // Default to true if no preferences set
    const emailEnabled = prefs
      ? (prefs[getEmailPrefKey(category) as keyof typeof prefs] as boolean)
      : true;
    const inappEnabled = prefs
      ? (prefs[getInappPrefKey(category) as keyof typeof prefs] as boolean)
      : true;

    // Create in-app notification
    if (inappEnabled) {
      await prisma.notification.create({
        data: {
          userId,
          type,
          title,
          body,
          link,
        },
      });
    }

    // Send email
    if (emailEnabled && emailTemplate && emailSubject) {
      await sendEmail({
        to: user.email,
        subject: emailSubject,
        react: emailTemplate,
      });
    }
  } catch (error) {
    console.error(`[Notification] Error sending ${type} to ${userId}:`, error);
  }
}

// ─── Bulk notify (for admin notifications sent to all users) ──────────────────

export async function notifyAll({
  type,
  title,
  body,
  link,
  emailSubject,
  emailTemplateFactory,
}: {
  type: string;
  title: string;
  body: string;
  link?: string;
  emailSubject?: string;
  emailTemplateFactory?: (user: {
    fullName: string;
    email: string;
  }) => React.ReactElement;
}) {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      fullName: true,
    },
  });

  const promises = users.map((user) =>
    notify({
      userId: user.id,
      type,
      title,
      body,
      link,
      emailSubject,
      emailTemplate: emailTemplateFactory
        ? emailTemplateFactory({ fullName: user.fullName, email: user.email })
        : undefined,
    })
  );

  await Promise.allSettled(promises);
}
