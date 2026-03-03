"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-helpers";
import { revalidatePath } from "next/cache";

export async function updateUser(
  id: string,
  data: {
    fullName?: string;
    email?: string;
    phone?: string | null;
    roles?: string[];
  }
) {
  await requireAdmin();

  await prisma.user.update({
    where: { id },
    data: {
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
      ...(data.roles !== undefined && { roles: data.roles }),
    },
  });

  revalidatePath("/admin/utilisateurs");
  revalidatePath(`/admin/utilisateurs/${id}`);
}

export async function suspendUser(id: string, reason: string) {
  await requireAdmin();

  await prisma.user.update({
    where: { id },
    data: {
      status: "suspended",
      suspendedAt: new Date(),
      suspendedReason: reason,
    },
  });

  revalidatePath("/admin/utilisateurs");
  revalidatePath(`/admin/utilisateurs/${id}`);
}

export async function banUser(id: string, reason: string) {
  await requireAdmin();

  await prisma.user.update({
    where: { id },
    data: {
      status: "banned",
      suspendedAt: new Date(),
      suspendedReason: reason,
    },
  });

  revalidatePath("/admin/utilisateurs");
  revalidatePath(`/admin/utilisateurs/${id}`);
}

export async function reactivateUser(id: string) {
  await requireAdmin();

  await prisma.user.update({
    where: { id },
    data: {
      status: "active",
      suspendedAt: null,
      suspendedReason: null,
    },
  });

  revalidatePath("/admin/utilisateurs");
  revalidatePath(`/admin/utilisateurs/${id}`);
}

export async function toggleVerifiedPapa(id: string) {
  await requireAdmin();

  const user = await prisma.user.findUniqueOrThrow({ where: { id } });

  await prisma.user.update({
    where: { id },
    data: { isVerifiedPapa: !user.isVerifiedPapa },
  });

  revalidatePath("/admin/utilisateurs");
  revalidatePath(`/admin/utilisateurs/${id}`);
}
