"use server";

import { sendEmail } from "@/lib/email";
import { prisma } from "@/lib/prisma";
import { createElement } from "react";

export type VolunteerApplicationState = {
  success: boolean;
  message: string;
  errors?: Partial<Record<VolunteerFieldName, string>>;
} | null;

type VolunteerFieldName =
  | "fullName"
  | "email"
  | "phone"
  | "city"
  | "availability"
  | "motivation"
  | "experience"
  | "consent";

type VolunteerPayload = {
  fullName: string;
  email: string;
  phone: string;
  city: string;
  availability: string;
  motivation: string;
  experience: string;
  consent: boolean;
  website: string;
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function getString(formData: FormData, key: string) {
  return (formData.get(key) as string | null)?.trim() ?? "";
}

function parsePayload(formData: FormData): VolunteerPayload {
  return {
    fullName: getString(formData, "fullName"),
    email: getString(formData, "email").toLowerCase(),
    phone: getString(formData, "phone"),
    city: getString(formData, "city"),
    availability: getString(formData, "availability"),
    motivation: getString(formData, "motivation"),
    experience: getString(formData, "experience"),
    consent: formData.get("consent") === "on",
    website: getString(formData, "website"),
  };
}

function validate(payload: VolunteerPayload) {
  const errors: Partial<Record<VolunteerFieldName, string>> = {};

  if (payload.website) {
    errors.fullName = "Soumission invalide.";
  }
  if (payload.fullName.length < 2) {
    errors.fullName = "Veuillez indiquer votre nom complet.";
  }
  if (!EMAIL_REGEX.test(payload.email)) {
    errors.email = "Veuillez saisir un email valide.";
  }
  if (payload.phone && payload.phone.length < 8) {
    errors.phone = "Le numéro de téléphone semble incomplet.";
  }
  if (payload.city.length < 2) {
    errors.city = "Veuillez préciser votre ville.";
  }
  if (!payload.availability) {
    errors.availability = "Sélectionnez votre disponibilité.";
  }
  if (payload.motivation.length < 80) {
    errors.motivation = "Décrivez votre motivation en au moins 80 caractères.";
  }
  if (!payload.consent) {
    errors.consent = "Vous devez accepter la charte de contact.";
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

function buildApplicationEmail(payload: VolunteerPayload) {
  const paragraph = (label: string, value: string) =>
    createElement(
      "p",
      null,
      createElement("strong", null, `${label} : `),
      value
    );

  return createElement(
    "div",
    { style: { fontFamily: "Arial, sans-serif", color: "#0f172a", lineHeight: 1.6 } },
    createElement("h1", { style: { marginBottom: "8px" } }, "Nouvelle candidature benevole"),
    createElement(
      "p",
      { style: { marginTop: 0, color: "#334155" } },
      "Une nouvelle candidature a ete soumise depuis la page devenir-benevole."
    ),
    createElement("hr", {
      style: { border: "none", borderTop: "1px solid #e2e8f0", margin: "20px 0" },
    }),
    paragraph("Nom", payload.fullName),
    paragraph("Email", payload.email),
    paragraph("Telephone", payload.phone || "Non renseigne"),
    paragraph("Ville", payload.city),
    paragraph("Disponibilite", payload.availability),
    paragraph(
      "Experience",
      payload.experience ? payload.experience : "Aucune experience specifique"
    ),
    createElement("p", null, createElement("strong", null, "Motivation :")),
    createElement("p", { style: { whiteSpace: "pre-wrap" } }, payload.motivation)
  );
}

export async function submitVolunteerApplication(
  _: VolunteerApplicationState,
  formData: FormData
): Promise<VolunteerApplicationState> {
  const payload = parsePayload(formData);
  const validation = validate(payload);

  if (!validation.valid) {
    return {
      success: false,
      message: "Certains champs doivent etre corriges.",
      errors: validation.errors,
    };
  }

  try {
    await prisma.volunteerApplication.create({
      data: {
        fullName: payload.fullName,
        email: payload.email,
        phone: payload.phone || null,
        city: payload.city,
        availability: payload.availability,
        motivation: payload.motivation,
        experience: payload.experience || null,
      },
    });
  } catch (err) {
    console.error("[VolunteerApplication] DB save error:", err);
    return {
      success: false,
      message:
        "Une erreur est survenue pendant l'enregistrement. Merci de reessayer dans quelques instants.",
    };
  }

  const recipient = process.env.VOLUNTEER_APPLICATION_EMAIL || "contact@dadforlife.org";
  sendEmail({
    to: recipient,
    subject: `Nouvelle candidature benevole - ${payload.fullName}`,
    react: buildApplicationEmail(payload),
  }).catch(console.error);

  return {
    success: true,
    message:
      "Merci, votre candidature a bien ete envoyee. Notre equipe reviendra vers vous sous 72h.",
  };
}
