"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getNotificationPreferences() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const prefs = await prisma.notificationPreference.findUnique({
    where: { userId: session.user.id },
  });

  // Return defaults if no preferences saved yet
  if (!prefs) {
    return {
      emailAccount: true,
      emailForum: true,
      emailCommunity: true,
      emailProgramme: true,
      emailAdmin: true,
      emailEngagement: true,
      inappAccount: true,
      inappForum: true,
      inappCommunity: true,
      inappProgramme: true,
      inappAdmin: true,
      inappEngagement: true,
    };
  }

  return {
    emailAccount: prefs.emailAccount,
    emailForum: prefs.emailForum,
    emailCommunity: prefs.emailCommunity,
    emailProgramme: prefs.emailProgramme,
    emailAdmin: prefs.emailAdmin,
    emailEngagement: prefs.emailEngagement,
    inappAccount: prefs.inappAccount,
    inappForum: prefs.inappForum,
    inappCommunity: prefs.inappCommunity,
    inappProgramme: prefs.inappProgramme,
    inappAdmin: prefs.inappAdmin,
    inappEngagement: prefs.inappEngagement,
  };
}

export async function saveNotificationPreferences(formData: FormData): Promise<void> {
  const session = await auth();
  if (!session?.user?.id) {
    return;
  }

  const data = {
    emailAccount: formData.get("emailAccount") === "on",
    emailForum: formData.get("emailForum") === "on",
    emailCommunity: formData.get("emailCommunity") === "on",
    emailProgramme: formData.get("emailProgramme") === "on",
    emailAdmin: formData.get("emailAdmin") === "on",
    emailEngagement: formData.get("emailEngagement") === "on",
    inappAccount: formData.get("inappAccount") === "on",
    inappForum: formData.get("inappForum") === "on",
    inappCommunity: formData.get("inappCommunity") === "on",
    inappProgramme: formData.get("inappProgramme") === "on",
    inappAdmin: formData.get("inappAdmin") === "on",
    inappEngagement: formData.get("inappEngagement") === "on",
  };

  await prisma.notificationPreference.upsert({
    where: { userId: session.user.id },
    update: data,
    create: {
      userId: session.user.id,
      ...data,
    },
  });

  revalidatePath("/dashboard/parametres/notifications");
}
