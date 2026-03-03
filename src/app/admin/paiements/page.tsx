import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-helpers";
import { PageHeader } from "@/components/admin/page-header";
import { StatsCard } from "@/components/admin/stats-card";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  CreditCard,
  Euro,
  CheckCircle,
  XCircle,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { PaymentsFilters } from "./payments-filters";
import { ExportCSVButton, RefundButton } from "./payments-actions-client";

const PER_PAGE = 20;

const STATUS_LABELS: Record<string, string> = {
  success: "Réussi",
  failed: "Échoué",
  refunded: "Remboursé",
};

const TYPE_LABELS: Record<string, string> = {
  subscription: "Abonnement",
  donation: "Don",
};

function StatusBadge({ status }: { status: string }) {
  const label = STATUS_LABELS[status] ?? status;
  switch (status) {
    case "success":
      return (
        <Badge className="border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-950 dark:text-green-300">
          {label}
        </Badge>
      );
    case "failed":
      return (
        <Badge className="border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300">
          {label}
        </Badge>
      );
    case "refunded":
      return (
        <Badge className="border-orange-200 bg-orange-50 text-orange-700 dark:border-orange-800 dark:bg-orange-950 dark:text-orange-300">
          {label}
        </Badge>
      );
    default:
      return <Badge variant="outline">{label}</Badge>;
  }
}

function TypeBadge({ type }: { type: string }) {
  const label = TYPE_LABELS[type] ?? type;
  switch (type) {
    case "subscription":
      return (
        <Badge className="border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-300">
          {label}
        </Badge>
      );
    case "donation":
      return (
        <Badge className="border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-950 dark:text-green-300">
          {label}
        </Badge>
      );
    default:
      return <Badge variant="outline">{label}</Badge>;
  }
}

function formatAmount(amountCents: number, currency: string) {
  const value = (amountCents / 100).toFixed(2);
  if (currency === "EUR") return `${value} €`;
  return `${value} ${currency}`;
}

export default async function AdminPaiementsPage({
  searchParams,
}: {
  searchParams: Promise<{
    status?: string;
    type?: string;
    page?: string;
  }>;
}) {
  await requireAdmin();
  const params = await searchParams;

  const statusFilter = params.status ?? "";
  const typeFilter = params.type ?? "";
  const page = Math.max(1, parseInt(params.page ?? "1", 10) || 1);

  const where: Record<string, unknown> = {};
  if (statusFilter) where.status = statusFilter;
  if (typeFilter) where.type = typeFilter;

  const [payments, totalCount, stats] = await Promise.all([
    prisma.payment.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PER_PAGE,
      take: PER_PAGE,
      include: { user: { select: { fullName: true, email: true } } },
    }),
    prisma.payment.count({ where }),
    prisma.payment.groupBy({
      by: ["status"],
      _sum: { amount: true },
      _count: true,
    }),
  ]);

  const totalPages = Math.max(1, Math.ceil(totalCount / PER_PAGE));

  const successStats = stats.find((s) => s.status === "success");
  const failedStats = stats.find((s) => s.status === "failed");
  const refundedStats = stats.find((s) => s.status === "refunded");

  const totalRevenue = (successStats?._sum.amount ?? 0) / 100;
  const successCount = successStats?._count ?? 0;
  const failedCount = failedStats?._count ?? 0;
  const refundedCount = refundedStats?._count ?? 0;

  function buildPageUrl(targetPage: number) {
    const p = new URLSearchParams();
    if (statusFilter) p.set("status", statusFilter);
    if (typeFilter) p.set("type", typeFilter);
    if (targetPage > 1) p.set("page", String(targetPage));
    const qs = p.toString();
    return `/admin/paiements${qs ? `?${qs}` : ""}`;
  }

  return (
    <div className="space-y-6 max-w-6xl">
      <PageHeader
        title="Paiements"
        description={`${totalCount} paiement(s) au total`}
        icon={CreditCard}
        backHref="/admin"
      >
        <ExportCSVButton />
      </PageHeader>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Revenu total"
          value={`${totalRevenue.toFixed(2)} €`}
          icon={Euro}
          iconColor="text-green-600"
          borderColor="border-t-green-500"
        />
        <StatsCard
          title="Paiements réussis"
          value={successCount}
          icon={CheckCircle}
          iconColor="text-green-600"
          borderColor="border-t-green-500"
        />
        <StatsCard
          title="Paiements échoués"
          value={failedCount}
          icon={XCircle}
          iconColor="text-red-500"
          borderColor="border-t-red-500"
        />
        <StatsCard
          title="Remboursements"
          value={refundedCount}
          icon={RotateCcw}
          iconColor="text-orange-500"
          borderColor="border-t-orange-500"
        />
      </div>

      <PaymentsFilters />

      <Card className="rounded-2xl">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Utilisateur</TableHead>
                <TableHead className="text-right">Montant</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center py-8 text-muted-foreground"
                  >
                    Aucun paiement trouvé.
                  </TableCell>
                </TableRow>
              ) : (
                payments.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="text-muted-foreground">
                      {p.createdAt.toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">
                        {p.user.fullName || "—"}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {p.user.email}
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {formatAmount(p.amount, p.currency)}
                    </TableCell>
                    <TableCell>
                      <TypeBadge type={p.type} />
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={p.status} />
                    </TableCell>
                    <TableCell className="text-right">
                      {p.status === "success" && (
                        <RefundButton paymentId={p.id} />
                      )}
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
