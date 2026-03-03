"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-helpers";
import { notify, notifyAll } from "@/lib/notifications";

export type NotificationActionState = {
  success: boolean;
  message: string;
} | null;

export async function sendGlobalNotification(
  _prev: NotificationActionState,
  formData: FormData
): Promise<NotificationActionState> {
  const admin = await requireAdmin();

  const subject = formData.get("subject") as string;
  const body = formData.get("body") as string;

  if (!subject?.trim() || !body?.trim()) {
    return { success: false, message: "Le sujet et le message sont requis." };
  }

  const totalUsers = await prisma.user.count();

  await notifyAll({
    type: "admin.broadcast",
    title: subject.trim(),
    body: body.trim(),
  });

  await prisma.adminNotificationLog.create({
    data: {
      type: "global",
      subject: subject.trim(),
      body: body.trim(),
      sentById: admin.id,
      recipientCount: totalUsers,
    },
  });

  revalidatePath("/admin/notifications");
  return {
    success: true,
    message: `Notification envoyée à ${totalUsers} utilisateur(s).`,
  };
}

export async function sendGroupNotification(
  _prev: NotificationActionState,
  formData: FormData
): Promise<NotificationActionState> {
  const admin = await requireAdmin();

  const subject = formData.get("subject") as string;
  const body = formData.get("body") as string;
  const role = formData.get("role") as string;

  if (!subject?.trim() || !body?.trim() || !role) {
    return {
      success: false,
      message: "Le sujet, le message et le rôle sont requis.",
    };
  }

  const users = await prisma.user.findMany({
    where: { roles: { has: role } },
    select: { id: true },
  });

  const promises = users.map((user) =>
    notify({
      userId: user.id,
      type: "admin.broadcast",
      title: subject.trim(),
      body: body.trim(),
    })
  );
  await Promise.allSettled(promises);

  await prisma.adminNotificationLog.create({
    data: {
      type: "group",
      subject: subject.trim(),
      body: body.trim(),
      sentById: admin.id,
      recipientCount: users.length,
    },
  });

  revalidatePath("/admin/notifications");
  return {
    success: true,
    message: `Notification envoyée à ${users.length} utilisateur(s) avec le rôle « ${role} ».`,
  };
}

export async function sendIndividualNotification(
  _prev: NotificationActionState,
  formData: FormData
): Promise<NotificationActionState> {
  const admin = await requireAdmin();

  const subject = formData.get("subject") as string;
  const body = formData.get("body") as string;
  const email = formData.get("email") as string;

  if (!subject?.trim() || !body?.trim() || !email?.trim()) {
    return {
      success: false,
      message: "Le sujet, le message et l'email sont requis.",
    };
  }

  const user = await prisma.user.findUnique({
    where: { email: email.trim() },
    select: { id: true, fullName: true },
  });

  if (!user) {
    return {
      success: false,
      message: "Aucun utilisateur trouvé avec cet email.",
    };
  }

  await notify({
    userId: user.id,
    type: "admin.broadcast",
    title: subject.trim(),
    body: body.trim(),
  });

  await prisma.adminNotificationLog.create({
    data: {
      type: "individual",
      subject: subject.trim(),
      body: body.trim(),
      sentById: admin.id,
      recipientCount: 1,
    },
  });

  revalidatePath("/admin/notifications");
  return {
    success: true,
    message: `Notification envoyée à ${user.fullName || email.trim()}.`,
  };
}
