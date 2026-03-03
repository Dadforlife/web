"use server";

import { revalidatePath } from "next/cache";
import { requireAuth } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { notify } from "@/lib/notifications";
import React from "react";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://dadforlife.org";

// ─── Reason labels ──────────────────────────────────────────────────────────

export const REASON_LABELS: Record<string, string> = {
  tribunal_jaf: "Tribunal (audience JAF)",
  commissariat: "Commissariat (plainte, main courante)",
  passage_bras: "Passage de bras (échange de garde)",
  gare: "Gare",
  demenagement: "Déménagement",
  point_rencontre: "Point rencontre",
  expertise_psy_sociale: "Expertise psy / sociale",
  autre: "Autre",
};

// ─── Create appointment request (parent side) ──────────────────────────────

export async function createAppointmentRequest(data: {
  type: "accompagnement_terrain" | "telephonique";
  reason?: string;
  message?: string;
  city?: string;
  location?: string;
  phone?: string;
  preferredDate?: string;
}) {
  const user = await requireAuth();

  const request = await prisma.appointmentRequest.create({
    data: {
      userId: user.id,
      type: data.type,
      reason: data.reason || null,
      message: data.message || null,
      city: data.city || null,
      location: data.location || null,
      phone: data.phone || null,
      preferredDate: data.preferredDate ? new Date(data.preferredDate) : null,
    },
  });

  // Notify all active volunteers
  const volunteers = await prisma.volunteerProfile.findMany({
    where: { isActive: true },
    include: { user: { select: { id: true, fullName: true, email: true } } },
  });

  const NouvelleDemande = (
    await import("@/emails/rendez-vous/nouvelle-demande")
  ).default;

  const typeLabel =
    data.type === "accompagnement_terrain"
      ? "Accompagnement terrain"
      : "Rendez-vous téléphonique";

  const reasonLabel = data.reason ? REASON_LABELS[data.reason] || data.reason : undefined;

  const messageWithReason = [
    reasonLabel ? `Motif : ${reasonLabel}` : null,
    data.location ? `Lieu : ${data.location}` : null,
    data.message || null,
  ]
    .filter(Boolean)
    .join("\n");

  const preferredDateStr = data.preferredDate
    ? new Date(data.preferredDate).toLocaleDateString("fr-FR", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : undefined;

  for (const volunteer of volunteers) {
    notify({
      userId: volunteer.user.id,
      type: "community.appointment_request",
      title: "Nouvelle demande de rendez-vous",
      body: `${user.fullName} demande un ${typeLabel.toLowerCase()}${reasonLabel ? ` — ${reasonLabel}` : ""}`,
      link: "/dashboard/benevole/demandes",
      emailSubject: `Nouvelle demande de rendez-vous — Papa pour la vie`,
      emailTemplate: React.createElement(NouvelleDemande, {
        volunteerName: volunteer.user.fullName,
        parentName: user.fullName,
        type: data.type,
        message: messageWithReason || undefined,
        city: data.city || undefined,
        preferredDate: preferredDateStr,
        dashboardUrl: `${baseUrl}/dashboard/benevole/demandes`,
      }),
    }).catch(console.error);
  }

  revalidatePath("/dashboard/demande-rdv");
  return { id: request.id };
}

// ─── Cancel appointment request (parent side) ──────────────────────────────

export async function cancelAppointmentRequest(requestId: string) {
  const user = await requireAuth();

  const request = await prisma.appointmentRequest.findFirst({
    where: { id: requestId, userId: user.id, status: "en_attente" },
  });

  if (!request) throw new Error("Demande introuvable.");

  await prisma.appointmentRequest.update({
    where: { id: requestId },
    data: { status: "annule" },
  });

  revalidatePath("/dashboard/demande-rdv");
}
