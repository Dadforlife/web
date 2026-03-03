import { requireAuth } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { getLatestDiagnostic } from "@/app/dashboard/diagnostic/actions";
import { PapaDashboardContent } from "./papa-dashboard-content";
import type { NextAppointment } from "./papa-dashboard-content";

export default async function DashboardPage() {
  const user = await requireAuth();
  const firstName = user.fullName?.trim().split(/\s+/)[0] || "toi";

  const [diagnostic, nextAppointmentRow] = await Promise.all([
    getLatestDiagnostic(),
    prisma.volunteerAppointment.findFirst({
      where: {
        fatherId: user.id,
        status: "a_venir",
        scheduledAt: { gte: new Date() },
      },
      orderBy: { scheduledAt: "asc" },
      select: {
        id: true,
        scheduledAt: true,
        type: true,
        duration: true,
        profile: {
          select: {
            user: { select: { fullName: true } },
          },
        },
      },
    }),
  ]);

  const nextAppointment: NextAppointment | null = nextAppointmentRow
    ? {
        id: nextAppointmentRow.id,
        scheduledAt: nextAppointmentRow.scheduledAt.toISOString(),
        type: nextAppointmentRow.type,
        duration: nextAppointmentRow.duration,
        volunteerName: nextAppointmentRow.profile?.user?.fullName ?? undefined,
      }
    : null;

  // Pas de modèle "tâche" pour l'instant : on masque la carte automatiquement
  const task = null;

  // Progression : 0/6 étapes (à brancher sur un suivi modules en base plus tard)
  const stepsValidated = 0;
  const currentModuleIndex = 0;

  return (
    <PapaDashboardContent
      firstName={firstName}
      diagnostic={diagnostic}
      nextAppointment={nextAppointment}
      task={task}
      stepsValidated={stepsValidated}
      currentModuleIndex={currentModuleIndex}
    />
  );
}
