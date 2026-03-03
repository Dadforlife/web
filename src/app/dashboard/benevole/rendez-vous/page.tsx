import { requireVolunteer } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/admin/page-header";
import { CalendarCheck } from "lucide-react";
import { AppointmentList } from "./appointment-list";

export default async function VolunteerAppointmentsPage() {
  const user = await requireVolunteer();

  const profile = await prisma.volunteerProfile.findUnique({
    where: { userId: user.id },
    select: {
      id: true,
      assignments: {
        where: { status: "active" },
        select: {
          fatherId: true,
          father: { select: { id: true, fullName: true } },
        },
      },
    },
  });

  if (!profile) {
    return <p className="text-muted-foreground">Profil introuvable.</p>;
  }

  const appointments = await prisma.volunteerAppointment.findMany({
    where: { profileId: profile.id },
    select: {
      id: true,
      type: true,
      scheduledAt: true,
      duration: true,
      status: true,
      location: true,
      notes: true,
      createdAt: true,
      father: {
        select: { id: true, fullName: true },
      },
    },
    orderBy: { scheduledAt: "desc" },
  });

  const serialized = appointments.map((a) => ({
    ...a,
    scheduledAt: a.scheduledAt.toISOString(),
    createdAt: a.createdAt.toISOString(),
  }));

  const assignedPapas = profile.assignments.map((a) => ({
    id: a.father.id,
    fullName: a.father.fullName,
  }));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Rendez-vous"
        description="Planifiez et suivez vos rendez-vous avec les papas"
        icon={CalendarCheck}
        backHref="/dashboard/benevole"
      />
      <AppointmentList appointments={serialized} assignedPapas={assignedPapas} />
    </div>
  );
}
