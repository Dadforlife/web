"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-helpers";

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export async function createContent(formData: FormData) {
  const user = await requireAdmin();

  const title = formData.get("title") as string;
  const type = formData.get("type") as string;
  const body = formData.get("body") as string;
  const isPublished = formData.get("isPublished") === "on";

  if (!title || !type || !body) {
    throw new Error("Champs obligatoires manquants.");
  }

  const slug = generateSlug(title);

  await prisma.content.create({
    data: {
      title,
      type,
      slug,
      body,
      isPublished,
      authorId: user.id,
    },
  });

  revalidatePath("/admin/contenus");
  redirect("/admin/contenus");
}

export async function updateContent(id: string, formData: FormData) {
  await requireAdmin();

  const title = formData.get("title") as string;
  const type = formData.get("type") as string;
  const body = formData.get("body") as string;
  const isPublished = formData.get("isPublished") === "on";

  if (!title || !type || !body) {
    throw new Error("Champs obligatoires manquants.");
  }

  const slug = generateSlug(title);

  await prisma.content.update({
    where: { id },
    data: {
      title,
      type,
      slug,
      body,
      isPublished,
    },
  });

  revalidatePath("/admin/contenus");
  redirect("/admin/contenus");
}

export async function deleteContent(id: string) {
  await requireAdmin();

  await prisma.content.delete({ where: { id } });

  revalidatePath("/admin/contenus");
  redirect("/admin/contenus");
}

export async function togglePublish(id: string) {
  await requireAdmin();

  const content = await prisma.content.findUniqueOrThrow({ where: { id } });

  await prisma.content.update({
    where: { id },
    data: { isPublished: !content.isPublished },
  });

  revalidatePath("/admin/contenus");
}
