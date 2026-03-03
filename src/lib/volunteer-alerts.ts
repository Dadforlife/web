import { prisma } from "@/lib/prisma";
import { notify } from "@/lib/notifications";

/**
 * Check a diagnostic result and create alerts for assigned volunteers.
 * Called after a diagnostic is submitted.
 */
export async function checkDiagnosticAlerts(diagnostic: {
  scoreGlobal: number;
  classification: string;
  userId: string;
}) {
  let priority: "high" | "critical" | null = null;

  if (
    diagnostic.classification === "critique" ||
    Number(diagnostic.scoreGlobal) >= 8
  ) {
    priority = "critical";
  } else if (
    diagnostic.classification === "élevé" ||
    diagnostic.classification === "eleve" ||
    Number(diagnostic.scoreGlobal) >= 6
  ) {
    priority = "high";
  }

  if (!priority) return;

  // Find all active assignments for this father
  const assignments = await prisma.papaAssignment.findMany({
    where: { fatherId: diagnostic.userId, status: "active" },
    select: {
      volunteer: {
        select: {
          id: true,
          userId: true,
        },
      },
    },
  });

  if (assignments.length === 0) return;

  const father = await prisma.user.findUnique({
    where: { id: diagnostic.userId },
    select: { fullName: true },
  });

  const title =
    priority === "critical"
      ? `Diagnostic critique - ${father?.fullName || "Papa"}`
      : `Diagnostic eleve - ${father?.fullName || "Papa"}`;

  const description = `Score global : ${diagnostic.scoreGlobal}/10 — Classification : ${diagnostic.classification}. Une attention particuliere est recommandee.`;

  for (const assignment of assignments) {
    await prisma.volunteerAlert.create({
      data: {
        profileId: assignment.volunteer.id,
        fatherId: diagnostic.userId,
        type: "diagnostic_critique",
        priority,
        title,
        description,
      },
    });

    notify({
      userId: assignment.volunteer.userId,
      type: "admin.diagnostic_alert",
      title,
      body: description,
      link: "/dashboard/benevole/alertes",
    }).catch(console.error);
  }
}
