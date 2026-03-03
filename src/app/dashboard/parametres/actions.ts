"use server";

import { revalidatePath } from "next/cache";
import { requireAuth } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";

export async function addEnfant(
  _prevState: { error?: string; success?: boolean } | undefined,
  formData: FormData,
) {
  const user = await requireAuth();

  const prenom = (formData.get("prenom") as string)?.trim();
  const sexe = (formData.get("sexe") as string)?.trim();

  if (!prenom) {
    return { error: "Le prénom est obligatoire." };
  }
  if (!sexe || (sexe !== "garcon" && sexe !== "fille")) {
    return { error: "Le sexe est obligatoire." };
  }

  const count = await prisma.enfant.count({ where: { userId: user.id } });
  if (count >= 20) {
    return { error: "Vous ne pouvez pas ajouter plus de 20 enfants." };
  }

  try {
    await prisma.enfant.create({
      data: {
        userId: user.id,
        prenom,
        sexe: sexe as "garcon" | "fille",
      },
    });
  } catch (err) {
    console.error("Enfant creation error:", err);
    return { error: "Erreur lors de l'ajout. Veuillez réessayer." };
  }

  revalidatePath("/dashboard");
  return { success: true };
}

export async function removeEnfant(enfantId: string) {
  const user = await requireAuth();

  await prisma.enfant.deleteMany({
    where: { id: enfantId, userId: user.id },
  });

  revalidatePath("/dashboard");
}
