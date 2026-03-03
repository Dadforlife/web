"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import type { ProfessionalRole, ProfessionalStatus } from "@prisma/client";

export type CreateProfessionalState = {
  error?: string;
} | null;

const VALID_ROLES: ProfessionalRole[] = [
  "avocat",
  "mediateur",
  "coach",
  "psychologue",
];

const VALID_STATUSES: ProfessionalStatus[] = ["en_attente", "valide"];

export async function createProfessional(
  _prevState: CreateProfessionalState,
  formData: FormData,
): Promise<CreateProfessionalState> {
  await requireAdmin();

  const fullName = (formData.get("fullName") as string)?.trim();
  const email = (formData.get("email") as string)?.trim().toLowerCase();
  const phone = (formData.get("phone") as string)?.trim() || null;
  const password = formData.get("password") as string;
  const professionalRole = formData.get("professionalRole") as string;
  const registrationNumber =
    (formData.get("registrationNumber") as string)?.trim() || null;
  const professionalStatus =
    (formData.get("professionalStatus") as string) || "valide";

  // Validation
  if (!fullName || fullName.length < 2) {
    return { error: "Le nom complet est obligatoire (min. 2 caractères)." };
  }

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: "Veuillez saisir une adresse email valide." };
  }

  if (!password || password.length < 8) {
    return {
      error: "Le mot de passe est obligatoire (min. 8 caractères).",
    };
  }

  if (!VALID_ROLES.includes(professionalRole as ProfessionalRole)) {
    return { error: "Veuillez choisir une spécialité valide." };
  }

  if (!VALID_STATUSES.includes(professionalStatus as ProfessionalStatus)) {
    return { error: "Statut initial invalide." };
  }

  // Check for existing email
  const existingUser = await prisma.user.findUnique({
    where: { email },
    select: { id: true },
  });

  if (existingUser) {
    return { error: "Un compte avec cet email existe déjà." };
  }

  const passwordHash = await bcrypt.hash(password, 12);

  await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        fullName,
        email,
        passwordHash,
        phone,
        primaryRole: "professionnel",
        roles: ["member", "partner"],
        professionalRole: professionalRole as ProfessionalRole,
        professionalStatus: professionalStatus as ProfessionalStatus,
        professionalLevel: "reference",
      },
    });

    await tx.professionalVerification.create({
      data: {
        userId: user.id,
        officialRegistrationNumber: registrationNumber,
      },
    });
  });

  revalidatePath("/admin/professionnels");
  redirect("/admin/professionnels");
}
