"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireAuth } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";

export async function submitAccompagnementRequest(
  _prevState: { error?: string } | undefined,
  formData: FormData,
) {
  const user = await requireAuth();

  if (user.primaryRole !== "maman_demande") {
    return { error: "Action r\u00e9serv\u00e9e aux mamans." };
  }

  const existing = await prisma.accompagnementRequest.findFirst({
    where: { userId: user.id },
  });
  if (existing) {
    redirect("/dashboard/maman");
  }

  const fatherFirstName = (formData.get("fatherFirstName") as string)?.trim();
  const fatherCity = (formData.get("fatherCity") as string)?.trim();
  const fatherPhone = (formData.get("fatherPhone") as string)?.trim();
  const fatherEmail = (formData.get("fatherEmail") as string)?.trim() || null;
  const situationDescription = (formData.get("situationDescription") as string)?.trim();
  const motherPhone = (formData.get("motherPhone") as string)?.trim();
  const consent = formData.get("consent");

  const childrenCount = parseInt(formData.get("childrenCount") as string, 10) || 0;
  const enfantsData: { prenom: string; sexe: string }[] = [];
  for (let i = 0; i < childrenCount; i++) {
    const prenom = (formData.get(`childPrenom_${i}`) as string)?.trim();
    const sexe = (formData.get(`childSexe_${i}`) as string)?.trim();
    if (!prenom) {
      return { error: `Le prénom de l'enfant ${i + 1} est obligatoire.` };
    }
    if (!sexe || (sexe !== "garcon" && sexe !== "fille")) {
      return { error: `Le sexe de l'enfant ${i + 1} est obligatoire.` };
    }
    enfantsData.push({ prenom, sexe });
  }

  if (!fatherFirstName) {
    return { error: "Le prénom du père est obligatoire." };
  }
  if (!fatherCity) {
    return { error: "La ville du père est obligatoire." };
  }
  if (!fatherPhone) {
    return { error: "Le téléphone du père est obligatoire." };
  }
  if (enfantsData.length === 0) {
    return { error: "Veuillez ajouter au moins un enfant." };
  }
  if (!situationDescription || situationDescription.length < 100) {
    return { error: "La description de la situation doit contenir au moins 100 caractères." };
  }
  if (!motherPhone) {
    return { error: "Votre numéro de téléphone est obligatoire." };
  }
  if (consent !== "on") {
    return { error: "Vous devez accepter les conditions pour soumettre la demande." };
  }

  try {
    await prisma.$transaction(async (tx) => {
      await tx.accompagnementRequest.create({
        data: {
          userId: user.id,
          fatherFirstName,
          fatherCity,
          fatherPhone,
          fatherEmail,
          situationDescription,
          motherPhone,
          enfantsData,
        },
      });

      for (const enfant of enfantsData) {
        await tx.enfant.create({
          data: {
            userId: user.id,
            prenom: enfant.prenom,
            sexe: enfant.sexe as "garcon" | "fille",
          },
        });
      }
    });
  } catch (err) {
    console.error("AccompagnementRequest creation error:", err);
    return { error: "Erreur lors de la création de la demande. Veuillez réessayer." };
  }

  revalidatePath("/dashboard/maman");
  redirect("/dashboard/maman");
}
