"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { signIn, signOut } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";
import { notifyWelcome } from "@/lib/notification-triggers";

export async function login(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const redirectTo = (formData.get("redirectTo") as string)?.trim() || "";

  if (!email || !password) {
    return { error: "Veuillez remplir tous les champs." };
  }

  const safeRedirect =
    redirectTo && redirectTo.startsWith("/") && !redirectTo.startsWith("//")
      ? redirectTo
      : "/dashboard";

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: safeRedirect,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Email ou mot de passe incorrect." };
    }
    // NEXT_REDIRECT errors must be re-thrown for redirect to work
    throw error;
  }
}

const VALID_PRIMARY_ROLES = ["papa_aide", "maman_demande", "papa_benevole", "professionnel"] as const;
type PrimaryRoleValue = (typeof VALID_PRIMARY_ROLES)[number];

function getRedirectForRole(primaryRole: PrimaryRoleValue): string {
  switch (primaryRole) {
    case "maman_demande":
      return "/dashboard/maman";
    case "professionnel":
      return "/dashboard/professionnel";
    default:
      return "/dashboard";
  }
}

export async function register(formData: FormData) {
  const fullName = formData.get("fullname") as string;
  const email = formData.get("email") as string;
  const phone = (formData.get("phone") as string) || null;
  const password = formData.get("password") as string;
  const primaryRoleRaw = formData.get("primaryRole") as string;

  if (!fullName || !email || !password) {
    return { error: "Veuillez remplir tous les champs obligatoires." };
  }

  if (!primaryRoleRaw || !VALID_PRIMARY_ROLES.includes(primaryRoleRaw as PrimaryRoleValue)) {
    return { error: "Veuillez choisir un profil valide." };
  }

  const primaryRole = primaryRoleRaw as PrimaryRoleValue;

  if (password.length < 6) {
    return { error: "Le mot de passe doit contenir au moins 6 caractères." };
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { error: "Cet email est déjà utilisé." };
  }

  const passwordHash = await bcrypt.hash(password, 12);

  let newUser;
  try {
    newUser = await prisma.user.create({
      data: {
        email,
        fullName,
        phone,
        passwordHash,
        emailVerified: new Date(),
        primaryRole,
        roles: ["member"],
      },
    });
  } catch (err) {
    console.error("Registration DB error:", err);
    return { error: "Erreur lors de la création du compte. Veuillez réessayer." };
  }

  notifyWelcome(newUser.id, fullName).catch(console.error);

  const redirectTo = getRedirectForRole(primaryRole);

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Compte créé, mais erreur de connexion. Essayez de vous connecter." };
    }
    throw error;
  }
}

export async function logout() {
  await signOut({ redirect: false });
  revalidatePath("/", "layout");
  redirect("/?deconnexion=1");
}
