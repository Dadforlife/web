import { requireAdmin } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/admin/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function AdminProfessionalHistoryPage() {
  await requireAdmin();

  const logs = await prisma.adminActionLog.findMany({
    where: {
      actionType: {
        in: [
          "professional_status_changed",
          "professional_document_verified",
          "professional_interview_scored",
          "generated_document_created",
        ],
      },
    },
    orderBy: { createdAt: "desc" },
    take: 200,
    include: {
      actor: {
        select: { fullName: true, email: true },
      },
      targetUser: {
        select: { fullName: true, email: true },
      },
    },
  });

  return (
    <div className="space-y-6 max-w-5xl">
      <PageHeader
        title="Historique validations"
        description="Journal des actions admin sur les professionnels"
        backHref="/admin/professionnels"
      />

      <Card>
        <CardHeader>
          <CardTitle>Dernieres actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {logs.length === 0 ? (
            <p className="text-sm text-muted-foreground">Aucun log.</p>
          ) : (
            logs.map((log) => (
              <div key={log.id} className="rounded-lg border p-3">
                <p className="font-medium">{log.actionType}</p>
                <p className="text-sm text-muted-foreground">
                  Admin: {log.actor.fullName || log.actor.email} - Cible:{" "}
                  {log.targetUser?.fullName || log.targetUser?.email || "n/a"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {log.createdAt.toLocaleString("fr-FR")}
                </p>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}

