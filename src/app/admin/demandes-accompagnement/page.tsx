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
import {
  Baby,
  Clock,
  Search as SearchIcon,
  Phone,
  HeartHandshake,
  CheckCircle2,
  XCircle,
  Eye,
} from "lucide-react";
import { RequestsFilters } from "./requests-filters";

type PageProps = {
  searchParams: Promise<{ status?: string; q?: string; page?: string }>;
};

const STATUS_CONFIG: Record<
  string,
  { label: string; colorClass: string }
> = {
  pending: {
    label: "En attente",
    colorClass: "bg-orange-100 text-orange-700 border-orange-200",
  },
  reviewing: {
    label: "En cours d’analyse",
    colorClass: "bg-purple-100 text-purple-700 border-purple-200",
  },
  contacted: {
    label: "Père contacté",
    colorClass: "bg-blue-100 text-blue-700 border-blue-200",
  },
  active: {
    label: "Accompagnement actif",
    colorClass: "bg-green-100 text-green-700 border-green-200",
  },
  completed: {
    label: "Terminé",
    colorClass: "bg-gray-100 text-gray-700 border-gray-200",
  },
  rejected: {
    label: "Refusée",
    colorClass: "bg-red-100 text-red-700 border-red-200",
  },
};

function statusBadge(status: string) {
  const config = STATUS_CONFIG[status] ?? {
    label: status,
    colorClass: "",
  };
  return (
    <Badge variant="outline" className={config.colorClass}>
      {config.label}
    </Badge>
  );
}

export default async function AdminDemandesAccompagnementPage({
  searchParams,
}: PageProps) {
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
      { user: { fullName: { contains: q, mode: "insensitive" } } },
      { fatherFirstName: { contains: q, mode: "insensitive" } },
      { fatherCity: { contains: q, mode: "insensitive" } },
    ];
  }

  const [
    requests,
    total,
    pendingCount,
    reviewingCount,
    contactedCount,
    activeCount,
    completedCount,
    rejectedCount,
  ] = await Promise.all([
    prisma.accompagnementRequest.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * perPage,
      take: perPage,
      include: {
        user: { select: { fullName: true, email: true } },
      },
    }),
    prisma.accompagnementRequest.count({ where }),
    prisma.accompagnementRequest.count({ where: { status: "pending" } }),
    prisma.accompagnementRequest.count({ where: { status: "reviewing" } }),
    prisma.accompagnementRequest.count({ where: { status: "contacted" } }),
    prisma.accompagnementRequest.count({ where: { status: "active" } }),
    prisma.accompagnementRequest.count({ where: { status: "completed" } }),
    prisma.accompagnementRequest.count({ where: { status: "rejected" } }),
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
        title="Demandes d&#39;accompagnement"
        description={`${total} demande(s) au total`}
        icon={Baby}
        backHref="/admin"
      />

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatsCard
          title="En attente"
          value={pendingCount}
          icon={Clock}
          iconColor="text-orange-600"
          borderColor="border-t-orange-500"
        />
        <StatsCard
          title="En analyse"
          value={reviewingCount}
          icon={SearchIcon}
          iconColor="text-purple-600"
          borderColor="border-t-purple-500"
        />
        <StatsCard
          title="Contactés"
          value={contactedCount}
          icon={Phone}
          iconColor="text-blue-600"
          borderColor="border-t-blue-500"
        />
        <StatsCard
          title="Actifs"
          value={activeCount}
          icon={HeartHandshake}
          iconColor="text-green-600"
          borderColor="border-t-green-500"
        />
        <StatsCard
          title="Terminés"
          value={completedCount}
          icon={CheckCircle2}
          iconColor="text-gray-600"
          borderColor="border-t-gray-500"
        />
        <StatsCard
          title="Refusés"
          value={rejectedCount}
          icon={XCircle}
          iconColor="text-red-600"
          borderColor="border-t-red-500"
        />
      </div>

      <RequestsFilters />

      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle>Liste des demandes</CardTitle>
        </CardHeader>
        <CardContent>
          {requests.length === 0 ? (
            <p className="text-muted-foreground py-6 text-center">
              Aucune demande trouvée.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Maman</TableHead>
                    <TableHead>Père</TableHead>
                    <TableHead>Ville</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {requests.map((req) => (
                    <TableRow
                      key={req.id}
                      className={
                        req.status === "pending" ? "bg-orange-50/50" : ""
                      }
                    >
                      <TableCell>
                        <div>
                          <p className="font-medium">{req.user.fullName}</p>
                          <p className="text-xs text-muted-foreground">
                            {req.user.email}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>{req.fatherFirstName}</TableCell>
                      <TableCell>{req.fatherCity}</TableCell>
                      <TableCell>{statusBadge(req.status)}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatDate(req.createdAt)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" asChild>
                          <Link
                            href={`/admin/demandes-accompagnement/${req.id}`}
                          >
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
                      href={`/admin/demandes-accompagnement?${new URLSearchParams(
                        {
                          ...(statusFilter && { status: statusFilter }),
                          ...(q && { q }),
                          page: String(page - 1),
                        }
                      )}`}
                    >
                      Précédent
                    </Link>
                  </Button>
                )}
                {page < totalPages && (
                  <Button variant="outline" size="sm" asChild>
                    <Link
                      href={`/admin/demandes-accompagnement?${new URLSearchParams(
                        {
                          ...(statusFilter && { status: statusFilter }),
                          ...(q && { q }),
                          page: String(page + 1),
                        }
                      )}`}
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
