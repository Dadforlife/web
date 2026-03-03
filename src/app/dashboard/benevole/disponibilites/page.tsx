import { requireVolunteer } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/admin/page-header";
import { Calendar } from "lucide-react";
import { AvailabilityGrid } from "./availability-grid";

export default async function VolunteerAvailabilityPage() {
  const user = await requireVolunteer();

  const profile = await prisma.volunteerProfile.findUnique({
    where: { userId: user.id },
    select: { id: true },
  });

  if (!profile) {
    return <p className="text-muted-foreground">Profil introuvable.</p>;
  }

  const availabilities = await prisma.volunteerAvailability.findMany({
    where: { profileId: profile.id },
    select: {
      id: true,
      dayOfWeek: true,
      startTime: true,
      endTime: true,
      isRecurring: true,
      specificDate: true,
      label: true,
    },
    orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }],
  });

  const serialized = availabilities.map((a) => ({
    ...a,
    specificDate: a.specificDate?.toISOString() ?? null,
  }));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Mes disponibilites"
        description="Gerez vos creneaux de disponibilite pour l'accompagnement"
        icon={Calendar}
        backHref="/dashboard/benevole"
      />
      <AvailabilityGrid availabilities={serialized} />
    </div>
  );
}
