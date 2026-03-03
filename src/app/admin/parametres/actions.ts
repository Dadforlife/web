"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-helpers";

const SETTING_KEYS = [
  "site_logo_url",
  "site_primary_color",
  "site_accent_color",
  "homepage_title",
  "homepage_subtitle",
  "support_email",
  "smtp_host",
  "smtp_port",
  "smtp_user",
  "smtp_password",
] as const;

export async function updateSettings(
  _prev: { success: boolean; message: string },
  formData: FormData,
): Promise<{ success: boolean; message: string }> {
  await requireAdmin();

  try {
    const upserts = SETTING_KEYS.filter((key) => formData.has(key)).map(
      (key) => {
        const value = (formData.get(key) as string) ?? "";
        return prisma.siteSetting.upsert({
          where: { key },
          update: { value },
          create: { key, value },
        });
      },
    );

    await prisma.$transaction(upserts);

    revalidatePath("/admin/parametres");
    return { success: true, message: "Paramètres enregistrés avec succès." };
  } catch {
    return {
      success: false,
      message: "Erreur lors de l'enregistrement des paramètres.",
    };
  }
}

export async function getSettings(): Promise<Record<string, string>> {
  await requireAdmin();

  const rows = await prisma.siteSetting.findMany();
  const map: Record<string, string> = {};
  for (const row of rows) {
    map[row.key] = row.value;
  }
  return map;
}

export async function promoteToAdmin(userId: string) {
  await requireAdmin();
  const user = await prisma.user.findUniqueOrThrow({ where: { id: userId } });
  const roles = user.roles.includes("admin") ? user.roles : [...user.roles, "admin"];
  await prisma.user.update({
    where: { id: userId },
    data: { roles },
  });
  revalidatePath("/admin/parametres/roles");
}

export async function promoteToModerator(userId: string) {
  await requireAdmin();
  const user = await prisma.user.findUniqueOrThrow({ where: { id: userId } });
  const roles = user.roles.includes("moderator") ? user.roles : [...user.roles, "moderator"];
  await prisma.user.update({
    where: { id: userId },
    data: { roles },
  });
  revalidatePath("/admin/parametres/roles");
}

export async function demoteToMember(userId: string) {
  await requireAdmin();
  const user = await prisma.user.findUniqueOrThrow({ where: { id: userId } });
  const roles = user.roles.filter((r) => r !== "admin" && r !== "moderator");
  if (roles.length === 0) roles.push("member");
  await prisma.user.update({
    where: { id: userId },
    data: { roles },
  });
  revalidatePath("/admin/parametres/roles");
}

export async function searchUserByEmail(email: string) {
  await requireAdmin();
  if (!email.trim()) return null;

  return prisma.user.findFirst({
    where: { email: { equals: email.trim(), mode: "insensitive" } },
    select: { id: true, fullName: true, email: true, roles: true },
  });
}
