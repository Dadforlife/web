"use server";

import { revalidatePath } from "next/cache";
import { requireAuth, hasRole } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { ProfessionalRole, ProfessionalStatus } from "@prisma/client";

const VALID_ROLES: ProfessionalRole[] = ["avocat", "mediateur", "coach", "psychologue"];

export async function submitProfessionalApplication(
  _prevState: { error?: string; success?: boolean } | undefined,
  formData: FormData,
) {
  const user = await requireAuth();

  if (hasRole(user, "partner")) {
    return { error: "Vous \u00eates d\u00e9j\u00e0 un professionnel partenaire valid\u00e9." };
  }

  if (hasRole(user, "volunteer")) {
    return { error: "Vous ne pouvez pas \u00eatre \u00e0 la fois b\u00e9n\u00e9vole et professionnel." };
  }

  const roleRaw = formData.get("professionalRole") as string;
  const registrationNumber = (formData.get("registrationNumber") as string)?.trim() || null;

  if (!roleRaw || !VALID_ROLES.includes(roleRaw as ProfessionalRole)) {
    return { error: "Veuillez choisir une sp\u00e9cialit\u00e9 valide." };
  }

  const role = roleRaw as ProfessionalRole;

  if (user.professionalStatus === "en_verification" || user.professionalStatus === "valide") {
    return { error: "Une candidature est d\u00e9j\u00e0 en cours ou valid\u00e9e." };
  }

  await prisma.$transaction(async (tx) => {
    await tx.user.update({
      where: { id: user.id },
      data: {
        professionalRole: role,
        professionalStatus: ProfessionalStatus.en_attente,
      },
    });

    await tx.professionalVerification.upsert({
      where: { userId: user.id },
      create: {
        userId: user.id,
        officialRegistrationNumber: registrationNumber,
      },
      update: {
        officialRegistrationNumber: registrationNumber ?? undefined,
      },
    });
  });

  revalidatePath("/dashboard/devenir-professionnel");
  revalidatePath("/dashboard/professionnel");
  revalidatePath("/dashboard/profil-pro");

  return { success: true };
}
