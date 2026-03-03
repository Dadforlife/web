"use server";

import { revalidatePath } from "next/cache";
import { requireVolunteer } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { notify } from "@/lib/notifications";

// ─── Availability CRUD ────────────────────────────────────────────────────────

export async function addAvailability(data: {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isRecurring: boolean;
  specificDate?: string;
  label?: string;
}) {
  const user = await requireVolunteer();

  const profile = await prisma.volunteerProfile.findUnique({
    where: { userId: user.id },
    select: { id: true },
  });

  if (!profile) throw new Error("Profil benevole introuvable.");

  await prisma.volunteerAvailability.create({
    data: {
      profileId: profile.id,
      dayOfWeek: data.dayOfWeek,
      startTime: data.startTime,
      endTime: data.endTime,
      isRecurring: data.isRecurring,
      specificDate: data.specificDate ? new Date(data.specificDate) : null,
      label: data.label || null,
    },
  });

  revalidatePath("/dashboard/benevole/disponibilites");
  revalidatePath("/dashboard/benevole");
}

export async function deleteAvailability(id: string) {
  const user = await requireVolunteer();

  const profile = await prisma.volunteerProfile.findUnique({
    where: { userId: user.id },
    select: { id: true },
  });

  if (!profile) throw new Error("Profil benevole introuvable.");

  // Ensure the availability belongs to this volunteer
  const availability = await prisma.volunteerAvailability.findFirst({
    where: { id, profileId: profile.id },
  });

  if (!availability) throw new Error("Creneau introuvable.");

  await prisma.volunteerAvailability.delete({ where: { id } });

  revalidatePath("/dashboard/benevole/disponibilites");
  revalidatePath("/dashboard/benevole");
}

// ─── Alert management ─────────────────────────────────────────────────────────

export async function resolveAlert(alertId: string) {
  const user = await requireVolunteer();

  const profile = await prisma.volunteerProfile.findUnique({
    where: { userId: user.id },
    select: { id: true },
  });

  if (!profile) throw new Error("Profil benevole introuvable.");

  const alert = await prisma.volunteerAlert.findFirst({
    where: { id: alertId, profileId: profile.id },
  });

  if (!alert) throw new Error("Alerte introuvable.");

  await prisma.volunteerAlert.update({
    where: { id: alertId },
    data: { isResolved: true, resolvedAt: new Date() },
  });

  revalidatePath("/dashboard/benevole/alertes");
  revalidatePath("/dashboard/benevole");
}

export async function createManualAlert(data: {
  fatherId: string;
  title: string;
  description?: string;
  priority: "low" | "medium" | "high" | "critical";
}) {
  const user = await requireVolunteer();

  const profile = await prisma.volunteerProfile.findUnique({
    where: { userId: user.id },
    select: { id: true },
  });

  if (!profile) throw new Error("Profil benevole introuvable.");

  // Verify the father is assigned to this volunteer
  const assignment = await prisma.papaAssignment.findFirst({
    where: { volunteerId: profile.id, fatherId: data.fatherId, status: "active" },
  });

  if (!assignment) throw new Error("Ce papa ne vous est pas assigne.");

  await prisma.volunteerAlert.create({
    data: {
      profileId: profile.id,
      fatherId: data.fatherId,
      type: "signalement_manuel",
      priority: data.priority,
      title: data.title,
      description: data.description || null,
    },
  });

  // Notify admins about the manual alert
  const admins = await prisma.user.findMany({
    where: { roles: { has: "admin" } },
    select: { id: true },
  });

  for (const admin of admins) {
    notify({
      userId: admin.id,
      type: "admin.volunteer_alert",
      title: `Signalement benevole : ${data.title}`,
      body: `${user.fullName} a signale une situation ${data.priority} pour un papa.`,
      link: "/admin/benevoles",
    }).catch(console.error);
  }

  revalidatePath("/dashboard/benevole/alertes");
  revalidatePath("/dashboard/benevole");
}

// ─── Appointment management ───────────────────────────────────────────────────

export async function createAppointment(data: {
  fatherId: string;
  type: "accompagnement_terrain" | "telephonique";
  scheduledAt: string;
  duration?: number;
  location?: string;
  notes?: string;
}) {
  const user = await requireVolunteer();

  const profile = await prisma.volunteerProfile.findUnique({
    where: { userId: user.id },
    select: { id: true },
  });

  if (!profile) throw new Error("Profil benevole introuvable.");

  // Verify the father is assigned to this volunteer
  const assignment = await prisma.papaAssignment.findFirst({
    where: { volunteerId: profile.id, fatherId: data.fatherId, status: "active" },
  });

  if (!assignment) throw new Error("Ce papa ne vous est pas assigne.");

  await prisma.volunteerAppointment.create({
    data: {
      profileId: profile.id,
      fatherId: data.fatherId,
      type: data.type,
      scheduledAt: new Date(data.scheduledAt),
      duration: data.duration ?? 60,
      location: data.location || null,
      notes: data.notes || null,
    },
  });

  revalidatePath("/dashboard/benevole/rendez-vous");
  revalidatePath("/dashboard/benevole");
}

export async function updateAppointmentStatus(
  id: string,
  status: "termine" | "annule",
) {
  const user = await requireVolunteer();

  const profile = await prisma.volunteerProfile.findUnique({
    where: { userId: user.id },
    select: { id: true },
  });

  if (!profile) throw new Error("Profil benevole introuvable.");

  const appointment = await prisma.volunteerAppointment.findFirst({
    where: { id, profileId: profile.id },
  });

  if (!appointment) throw new Error("Rendez-vous introuvable.");

  await prisma.volunteerAppointment.update({
    where: { id },
    data: { status },
  });

  revalidatePath("/dashboard/benevole/rendez-vous");
  revalidatePath("/dashboard/benevole");
}

export async function deleteAppointment(id: string) {
  const user = await requireVolunteer();

  const profile = await prisma.volunteerProfile.findUnique({
    where: { userId: user.id },
    select: { id: true },
  });

  if (!profile) throw new Error("Profil benevole introuvable.");

  const appointment = await prisma.volunteerAppointment.findFirst({
    where: { id, profileId: profile.id },
  });

  if (!appointment) throw new Error("Rendez-vous introuvable.");

  await prisma.volunteerAppointment.delete({ where: { id } });

  revalidatePath("/dashboard/benevole/rendez-vous");
  revalidatePath("/dashboard/benevole");
}

// ─── Appointment request management (accept/refuse) ────────────────────────

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://dadforlife.org";

export async function acceptAppointmentRequest(
  requestId: string,
  responseNote?: string,
) {
  const user = await requireVolunteer();

  const profile = await prisma.volunteerProfile.findUnique({
    where: { userId: user.id },
    select: { id: true },
  });

  if (!profile) throw new Error("Profil benevole introuvable.");

  const request = await prisma.appointmentRequest.findFirst({
    where: { id: requestId, status: "en_attente" },
    include: { user: { select: { id: true, fullName: true, email: true } } },
  });

  if (!request) throw new Error("Demande introuvable ou déjà traitée.");

  await prisma.appointmentRequest.update({
    where: { id: requestId },
    data: {
      status: "accepte",
      volunteerId: profile.id,
      responseNote: responseNote || null,
    },
  });

  // Notify the parent
  const DemandeAcceptee = (
    await import("@/emails/rendez-vous/demande-acceptee")
  ).default;

  const React = (await import("react")).default;

  notify({
    userId: request.userId,
    type: "community.appointment_accepted",
    title: "Demande de rendez-vous acceptée",
    body: `${user.fullName} a accepté votre demande de rendez-vous`,
    link: "/dashboard/demande-rdv",
    emailSubject: "Votre demande de rendez-vous a été acceptée — Papa pour la vie",
    emailTemplate: React.createElement(DemandeAcceptee, {
      parentName: request.user.fullName,
      volunteerName: user.fullName,
      type: request.type,
      responseNote: responseNote || undefined,
      dashboardUrl: `${baseUrl}/dashboard/demande-rdv`,
    }),
  }).catch(console.error);

  revalidatePath("/dashboard/benevole/demandes");
  revalidatePath("/dashboard/benevole");
}

export async function refuseAppointmentRequest(
  requestId: string,
  responseNote?: string,
) {
  const user = await requireVolunteer();

  const profile = await prisma.volunteerProfile.findUnique({
    where: { userId: user.id },
    select: { id: true },
  });

  if (!profile) throw new Error("Profil benevole introuvable.");

  const request = await prisma.appointmentRequest.findFirst({
    where: { id: requestId, status: "en_attente" },
    include: { user: { select: { id: true, fullName: true, email: true } } },
  });

  if (!request) throw new Error("Demande introuvable ou déjà traitée.");

  await prisma.appointmentRequest.update({
    where: { id: requestId },
    data: {
      status: "refuse",
      volunteerId: profile.id,
      responseNote: responseNote || null,
    },
  });

  // Notify the parent
  const DemandeRefusee = (
    await import("@/emails/rendez-vous/demande-refusee")
  ).default;

  const React = (await import("react")).default;

  notify({
    userId: request.userId,
    type: "community.appointment_refused",
    title: "Mise à jour de votre demande",
    body: "Votre demande de rendez-vous n'a pas pu être prise en charge",
    link: "/dashboard/demande-rdv",
    emailSubject: "Mise à jour de votre demande de rendez-vous — Papa pour la vie",
    emailTemplate: React.createElement(DemandeRefusee, {
      parentName: request.user.fullName,
      type: request.type,
      responseNote: responseNote || undefined,
      dashboardUrl: `${baseUrl}/dashboard/demande-rdv`,
    }),
  }).catch(console.error);

  revalidatePath("/dashboard/benevole/demandes");
  revalidatePath("/dashboard/benevole");
}

// ─── Profile management ───────────────────────────────────────────────────────

export async function updateVolunteerProfile(data: {
  bio?: string;
  city?: string;
  maxAssignments?: number;
  isActive?: boolean;
}) {
  const user = await requireVolunteer();

  await prisma.volunteerProfile.update({
    where: { userId: user.id },
    data: {
      bio: data.bio,
      city: data.city,
      maxAssignments: data.maxAssignments,
      isActive: data.isActive,
    },
  });

  revalidatePath("/dashboard/benevole");
}
