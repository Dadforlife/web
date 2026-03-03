"use server";

import { requireAuth } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email";
import { createElement } from "react";

export type VolunteerFormState = {
  success: boolean;
  message: string;
  errors?: Partial<Record<"city" | "availability" | "motivation" | "experience", string>>;
} | null;

function getString(formData: FormData, key: string) {
  return (formData.get(key) as string | null)?.trim() ?? "";
}

function validate(data: {
  city: string;
  availability: string;
  motivation: string;
}) {
  const errors: Partial<Record<"city" | "availability" | "motivation", string>> = {};

  if (data.city.length < 2) {
    errors.city = "Veuillez préciser votre ville.";
  }
  if (!data.availability) {
    errors.availability = "Sélectionnez votre disponibilité.";
  }
  if (data.motivation.length < 80) {
    errors.motivation = "Décrivez votre motivation en au moins 80 caractères.";
  }

  return { valid: Object.keys(errors).length === 0, errors };
}

function buildNotificationEmail(user: { fullName: string; email: string }, city: string, availability: string, motivation: string, experience: string | null) {
  const paragraph = (label: string, value: string) =>
    createElement("p", null, createElement("strong", null, `${label} : `), value);

  return createElement(
    "div",
    { style: { fontFamily: "Arial, sans-serif", color: "#0f172a", lineHeight: 1.6 } },
    createElement("h1", { style: { marginBottom: "8px" } }, "Nouvelle candidature bénévole (membre connecté)"),
    createElement(
      "p",
      { style: { marginTop: 0, color: "#334155" } },
      "Un membre connecté a soumis sa candidature depuis son tableau de bord."
    ),
    createElement("hr", {
      style: { border: "none", borderTop: "1px solid #e2e8f0", margin: "20px 0" },
    }),
    paragraph("Nom", user.fullName),
    paragraph("Email", user.email),
    paragraph("Ville", city),
    paragraph("Disponibilité", availability),
    paragraph("Expérience", experience || "Aucune expérience spécifique"),
    createElement("p", null, createElement("strong", null, "Motivation :")),
    createElement("p", { style: { whiteSpace: "pre-wrap" } }, motivation)
  );
}

export async function submitAuthenticatedVolunteerApplication(
  _: VolunteerFormState,
  formData: FormData
): Promise<VolunteerFormState> {
  const user = await requireAuth();

  // Check if user already has volunteer role
  if (user.roles.includes("volunteer")) {
    return {
      success: false,
      message: "Vous êtes déjà bénévole.",
    };
  }

  // Check for existing application
  const existing = await prisma.volunteerApplication.findFirst({
    where: {
      OR: [
        { userId: user.id },
        { email: user.email },
      ],
    },
    orderBy: { createdAt: "desc" },
  });

  if (existing && existing.status !== "rejected") {
    return {
      success: false,
      message: "Vous avez déjà soumis une candidature.",
    };
  }

  const city = getString(formData, "city");
  const availability = getString(formData, "availability");
  const motivation = getString(formData, "motivation");
  const experience = getString(formData, "experience");

  const validation = validate({ city, availability, motivation });
  if (!validation.valid) {
    return {
      success: false,
      message: "Certains champs doivent être corrigés.",
      errors: validation.errors,
    };
  }

  try {
    await prisma.volunteerApplication.create({
      data: {
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        city,
        availability,
        motivation,
        experience: experience || null,
        userId: user.id,
      },
    });
  } catch (err) {
    console.error("[VolunteerApplication] DB save error:", err);
    return {
      success: false,
      message: "Une erreur est survenue. Merci de réessayer dans quelques instants.",
    };
  }

  const recipient = process.env.VOLUNTEER_APPLICATION_EMAIL || "contact@dadforlife.org";
  sendEmail({
    to: recipient,
    subject: `Nouvelle candidature bénévole - ${user.fullName}`,
    react: buildNotificationEmail(
      { fullName: user.fullName, email: user.email },
      city,
      availability,
      motivation,
      experience || null
    ),
  }).catch(console.error);

  return {
    success: true,
    message: "Merci, votre candidature a bien été envoyée. Notre équipe reviendra vers vous sous 72h.",
  };
}
