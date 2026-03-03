import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PageHeader } from "@/components/admin/page-header";
import { StatsCard } from "@/components/admin/stats-card";
import { HandHeart, Clock, CheckCircle2, XCircle, Phone, Eye } from "lucide-react";
import { ApplicationsFilters } from "./applications-filters";

type PageProps = {
  searchParams: Promise<{ status?: string; q?: string; page?: string }>;
};

const STATUS_CONFIG: Record<string, { label: string; variant: "default" | "secondary" | "outline" | "destructive" }> = {
  pending: { label: "En attente", variant: "secondary" },
  contacted: { label: "Contacté", variant: "default" },
  accepted: { label: "Accepté", variant: "default" },
  rejected: { label: "Refusé", variant: "destructive" },
};

function statusBadge(status: string) {
  const config = STATUS_CONFIG[status] ?? { label: status, variant: "outline" as const };
  const colorClass =
    status === "pending"
      ? "bg-orange-100 text-orange-700 border-orange-200"
      : status === "contacted"
        ? "bg-blue-100 text-blue-700 border-blue-200"
        : status === "accepted"
          ? "bg-green-100 text-green-700 border-green-200"
          : status === "rejected"
            ? "bg-red-100 text-red-700 border-red-200"
            : "";
  return (
    <Badge variant={config.variant} className={colorClass}>
      {config.label}
    </Badge>
  );
}

export default async function AdminBenevolesPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const statusFilter = params.status || "";
  const q = params.q?.trim() || "";
  const page = Math.max(1, parseInt(params.page || "1"));
  const perPage = 20;

  const where: Record<string, unknown> = {};
  if (statusFilter && statusFilter !== "all") {
    where.status = statusFilter;
  }
  if (q) {
    where.OR = [
      { fullName: { contains: q, mode: "insensitive" } },
      { email: { contains: q, mode: "insensitive" } },
      { city: { contains: q, mode: "insensitive" } },
    ];
  }

  const [applications, total, pendingCount, contactedCount, acceptedCount, rejectedCount] =
    await Promise.all([
      prisma.volunteerApplication.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * perPage,
        take: perPage,
      }),
      prisma.volunteerApplication.count({ where }),
      prisma.volunteerApplication.count({ where: { status: "pending" } }),
      prisma.volunteerApplication.count({ where: { status: "contacted" } }),
      prisma.volunteerApplication.count({ where: { status: "accepted" } }),
      prisma.volunteerApplication.count({ where: { status: "rejected" } }),
    ]);

  const totalPages = Math.ceil(total / perPage);

  const formatDate = (date: Date) =>
    date.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  return (
    <div className="space-y-6 max-w-7xl">
      <PageHeader
        title="Candidatures bénévoles"
        description={`${total} candidature(s) au total`}
        icon={HandHeart}
        backHref="/admin"
      />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatsCard
          title="En attente"
          value={pendingCount}
          icon={Clock}
          iconColor="text-orange-600"
          borderColor="border-t-orange-500"
        />
        <StatsCard
          title="Contactés"
          value={contactedCount}
          icon={Phone}
          iconColor="text-blue-600"
          borderColor="border-t-blue-500"
        />
        <StatsCard
          title="Acceptés"
          value={acceptedCount}
          icon={CheckCircle2}
          iconColor="text-green-600"
          borderColor="border-t-green-500"
        />
        <StatsCard
          title="Refusés"
          value={rejectedCount}
          icon={XCircle}
          iconColor="text-red-600"
          borderColor="border-t-red-500"
        />
      </div>

      <ApplicationsFilters />

      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle>Liste des candidatures</CardTitle>
        </CardHeader>
        <CardContent>
          {applications.length === 0 ? (
            <p className="text-muted-foreground py-6 text-center">
              Aucune candidature trouvée.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Ville</TableHead>
                    <TableHead>Disponibilité</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {applications.map((app) => (
                    <TableRow
                      key={app.id}
                      className={app.status === "pending" ? "bg-orange-50/50" : ""}
                    >
                      <TableCell className="font-medium">{app.fullName}</TableCell>
                      <TableCell>{app.email}</TableCell>
                      <TableCell>{app.city}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {app.availability}
                      </TableCell>
                      <TableCell>{statusBadge(app.status)}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatDate(app.createdAt)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/admin/benevoles/${app.id}`}>
                            <Eye className="h-4 w-4 mr-1" />
                            Voir
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-muted-foreground">
                Page {page} sur {totalPages}
              </p>
              <div className="flex gap-2">
                {page > 1 && (
                  <Button variant="outline" size="sm" asChild>
                    <Link
                      href={`/admin/benevoles?${new URLSearchParams({
                        ...(statusFilter && { status: statusFilter }),
                        ...(q && { q }),
                        page: String(page - 1),
                      })}`}
                    >
                      Précédent
                    </Link>
                  </Button>
                )}
                {page < totalPages && (
                  <Button variant="outline" size="sm" asChild>
                    <Link
                      href={`/admin/benevoles?${new URLSearchParams({
                        ...(statusFilter && { status: statusFilter }),
                        ...(q && { q }),
                        page: String(page + 1),
                      })}`}
                    >
                      Suivant
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
