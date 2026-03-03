import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/admin/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, MessageCircle, FileText } from "lucide-react";
import Link from "next/link";
import { ReportsFilters } from "./reports-filters";

const STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  pending: {
    label: "En attente",
    className: "bg-orange-100 text-orange-800 border-orange-200",
  },
  warning: {
    label: "Avertissement",
    className: "bg-yellow-100 text-yellow-800 border-yellow-200",
  },
  suspended: {
    label: "Suspendu",
    className: "bg-red-100 text-red-800 border-red-200",
  },
  dismissed: {
    label: "Rejeté",
    className: "bg-gray-100 text-gray-600 border-gray-200",
  },
};

interface PageProps {
  searchParams: Promise<{ status?: string }>;
}

export default async function AdminSignalementsPage({ searchParams }: PageProps) {
  const { status } = await searchParams;

  const validStatuses = ["pending", "warning", "suspended", "dismissed"];
  const filterStatus = status && validStatuses.includes(status) ? status : undefined;

  let reports: {
    id: string;
    reason: string;
    status: string;
    discussionId: string | null;
    messageId: string | null;
    createdAt: Date;
    reporter: { email: string };
  }[] = [];

  try {
    reports = await prisma.report.findMany({
      where: filterStatus ? { status: filterStatus } : undefined,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        reason: true,
        status: true,
        discussionId: true,
        messageId: true,
        createdAt: true,
        reporter: { select: { email: true } },
      },
    });
  } catch {
    // DB not ready
  }

  const pendingCount = reports.filter((r) => r.status === "pending").length;

  return (
    <div className="space-y-6 max-w-6xl">
      <PageHeader
        title="Signalements"
        description={`${reports.length} signalement(s)${pendingCount > 0 ? ` · ${pendingCount} en attente` : ""}`}
        icon={AlertTriangle}
        backHref="/admin"
      >
        <ReportsFilters currentStatus={filterStatus} />
      </PageHeader>

      <Card className="rounded-2xl">
        <CardContent className="p-0">
          {reports.length === 0 ? (
            <p className="text-muted-foreground py-12 text-center">
              Aucun signalement{filterStatus ? " pour ce filtre" : ""}.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                      Type
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                      Raison
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                      Signalé par
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                      Statut
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                      Date
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {reports.map((report) => {
                    const config = STATUS_CONFIG[report.status] ?? STATUS_CONFIG.pending;
                    const isPending = report.status === "pending";

                    return (
                      <tr
                        key={report.id}
                        className={`border-b border-border/60 hover:bg-muted/30 ${isPending ? "bg-orange-50/40 dark:bg-orange-950/10" : ""}`}
                      >
                        <td className="py-3 px-4">
                          {report.discussionId ? (
                            <FileText className="h-4 w-4 text-muted-foreground" aria-label="Discussion" />
                          ) : (
                            <MessageCircle className="h-4 w-4 text-muted-foreground" aria-label="Message" />
                          )}
                        </td>
                        <td className="py-3 px-4 max-w-[200px] truncate">
                          {report.reason}
                        </td>
                        <td className="py-3 px-4 text-muted-foreground">
                          {report.reporter.email}
                        </td>
                        <td className="py-3 px-4">
                          <Badge className={config.className}>
                            {config.label}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-muted-foreground whitespace-nowrap">
                          {report.createdAt.toLocaleDateString("fr-FR", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </td>
                        <td className="py-3 px-4">
                          <Link
                            href={`/admin/signalements/${report.id}`}
                            className="text-primary hover:underline text-sm font-medium"
                          >
                            Voir
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
