import { requireVolunteer } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/admin/page-header";
import { AlertTriangle } from "lucide-react";
import { AlertList } from "./alert-list";

export default async function VolunteerAlertsPage() {
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

  const alerts = await prisma.volunteerAlert.findMany({
    where: { profileId: profile.id },
    select: {
      id: true,
      type: true,
      priority: true,
      title: true,
      description: true,
      isResolved: true,
      resolvedAt: true,
      createdAt: true,
      father: {
        select: { id: true, fullName: true },
      },
    },
    orderBy: [
      { isResolved: "asc" },
      { createdAt: "desc" },
    ],
  });

  const serialized = alerts.map((a) => ({
    ...a,
    createdAt: a.createdAt.toISOString(),
    resolvedAt: a.resolvedAt?.toISOString() ?? null,
  }));

  const assignedPapas = profile.assignments.map((a) => ({
    id: a.father.id,
    fullName: a.father.fullName,
  }));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Alertes"
        description="Suivez les situations qui necessitent votre attention"
        icon={AlertTriangle}
        backHref="/dashboard/benevole"
      />
      <AlertList alerts={serialized} assignedPapas={assignedPapas} />
    </div>
  );
}
