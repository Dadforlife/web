import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-helpers";
import { PageHeader } from "@/components/admin/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { History, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

const PER_PAGE = 20;

const TYPE_CONFIG: Record<string, { label: string; className: string }> = {
  global: {
    label: "Globale",
    className:
      "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-300",
  },
  group: {
    label: "Groupe",
    className:
      "border-purple-200 bg-purple-50 text-purple-700 dark:border-purple-800 dark:bg-purple-950 dark:text-purple-300",
  },
  individual: {
    label: "Individuelle",
    className:
      "border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-950 dark:text-green-300",
  },
};

function TypeBadge({ type }: { type: string }) {
  const config = TYPE_CONFIG[type] ?? {
    label: type,
    className: "",
  };
  return <Badge className={config.className}>{config.label}</Badge>;
}

export default async function AdminNotificationsHistoriquePage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  await requireAdmin();
  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page ?? "1", 10) || 1);

  const [logs, totalCount] = await Promise.all([
    prisma.adminNotificationLog.findMany({
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PER_PAGE,
      take: PER_PAGE,
      include: {
        sentBy: { select: { fullName: true, email: true } },
      },
    }),
    prisma.adminNotificationLog.count(),
  ]);

  const totalPages = Math.max(1, Math.ceil(totalCount / PER_PAGE));

  function buildPageUrl(targetPage: number) {
    const p = new URLSearchParams();
    if (targetPage > 1) p.set("page", String(targetPage));
    const qs = p.toString();
    return `/admin/notifications/historique${qs ? `?${qs}` : ""}`;
  }

  return (
    <div className="space-y-6 max-w-6xl">
      <PageHeader
        title="Historique des notifications"
        description={`${totalCount} notification(s) envoyée(s)`}
        icon={History}
        backHref="/admin/notifications"
      />

      <Card className="rounded-2xl">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Sujet</TableHead>
                <TableHead className="text-center">Destinataires</TableHead>
                <TableHead>Envoyé par</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center py-8 text-muted-foreground"
                  >
                    Aucune notification envoyée.
                  </TableCell>
                </TableRow>
              ) : (
                logs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="text-muted-foreground whitespace-nowrap">
                      {log.createdAt.toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                      <span className="ml-1 text-xs">
                        {log.createdAt.toLocaleTimeString("fr-FR", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </TableCell>
                    <TableCell>
                      <TypeBadge type={log.type} />
                    </TableCell>
                    <TableCell className="max-w-[300px] truncate font-medium">
                      {log.subject}
                    </TableCell>
                    <TableCell className="text-center tabular-nums">
                      {log.recipientCount}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {log.sentBy.fullName || log.sentBy.email}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Page {page} sur {totalPages}
          </p>
          <div className="flex items-center gap-2">
            {page > 1 ? (
              <Button variant="outline" size="sm" asChild>
                <Link href={buildPageUrl(page - 1)}>
                  <ChevronLeft className="h-4 w-4" />
                  Précédent
                </Link>
              </Button>
            ) : (
              <Button variant="outline" size="sm" disabled>
                <ChevronLeft className="h-4 w-4" />
                Précédent
              </Button>
            )}
            {page < totalPages ? (
              <Button variant="outline" size="sm" asChild>
                <Link href={buildPageUrl(page + 1)}>
                  Suivant
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </Button>
            ) : (
              <Button variant="outline" size="sm" disabled>
                Suivant
                <ChevronRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
