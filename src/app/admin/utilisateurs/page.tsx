import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-helpers";
import { PageHeader } from "@/components/admin/page-header";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Users,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  UserCircle,
} from "lucide-react";
import Link from "next/link";
import { UsersFilters } from "./users-filters";

const PER_PAGE = 20;

const ROLE_LABELS: Record<string, string> = {
  admin: "Admin",
  partner: "Partenaire",
  moderator: "Modérateur",
  member: "Membre",
  volunteer: "Bénévole",
};

const STATUS_LABELS: Record<string, string> = {
  active: "Actif",
  suspended: "Suspendu",
  banned: "Banni",
};

const PRIMARY_ROLE_CONFIG: Record<
  string,
  { label: string; emoji: string; className: string }
> = {
  papa_aide: {
    label: "Papa",
    emoji: "👨",
    className:
      "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-300",
  },
  papa_benevole: {
    label: "Papa",
    emoji: "👨",
    className:
      "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-300",
  },
  maman_demande: {
    label: "Maman",
    emoji: "👩",
    className:
      "border-pink-200 bg-pink-50 text-pink-700 dark:border-pink-800 dark:bg-pink-950 dark:text-pink-300",
  },
  professionnel: {
    label: "Professionnel",
    emoji: "💼",
    className:
      "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-300",
  },
};

function RoleBadge({ role }: { role: string }) {
  const label = ROLE_LABELS[role] ?? role;
  switch (role) {
    case "admin":
      return <Badge>{label}</Badge>;
    case "partner":
      return <Badge variant="secondary">{label}</Badge>;
    case "moderator":
      return (
        <Badge className="border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-300">
          {label}
        </Badge>
      );
    default:
      return <Badge variant="outline">{label}</Badge>;
  }
}

function StatusBadge({ status }: { status: string }) {
  const label = STATUS_LABELS[status] ?? status;
  switch (status) {
    case "active":
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-green-600">
          <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
          {label}
        </span>
      );
    case "suspended":
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-orange-600">
          <span className="h-1.5 w-1.5 rounded-full bg-orange-500" />
          {label}
        </span>
      );
    case "banned":
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-red-600">
          <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
          {label}
        </span>
      );
    default:
      return (
        <span className="text-xs text-muted-foreground">{label}</span>
      );
  }
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default async function AdminUtilisateursPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    role?: string;
    status?: string;
    page?: string;
  }>;
}) {
  await requireAdmin();
  const params = await searchParams;

  const q = params.q?.trim() ?? "";
  const roleFilter = params.role ?? "";
  const statusFilter = params.status ?? "";
  const page = Math.max(1, parseInt(params.page ?? "1", 10) || 1);

  const where: Record<string, unknown> = {};

  if (q) {
    where.OR = [
      { fullName: { contains: q, mode: "insensitive" } },
      { email: { contains: q, mode: "insensitive" } },
    ];
  }
  if (roleFilter) {
    where.roles = { has: roleFilter };
  }
  if (statusFilter) {
    where.status = statusFilter;
  }

  const [users, totalCount] = await Promise.all([
    prisma.user.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PER_PAGE,
      take: PER_PAGE,
      select: {
        id: true,
        email: true,
        fullName: true,
        roles: true,
        primaryRole: true,
        status: true,
        isVerifiedPapa: true,
        createdAt: true,
      },
    }),
    prisma.user.count({ where }),
  ]);

  const totalPages = Math.max(1, Math.ceil(totalCount / PER_PAGE));

  function buildPageUrl(targetPage: number) {
    const p = new URLSearchParams();
    if (q) p.set("q", q);
    if (roleFilter) p.set("role", roleFilter);
    if (statusFilter) p.set("status", statusFilter);
    if (targetPage > 1) p.set("page", String(targetPage));
    const qs = p.toString();
    return `/admin/utilisateurs${qs ? `?${qs}` : ""}`;
  }

  return (
    <div className="space-y-6 max-w-6xl">
      <PageHeader
        title="Utilisateurs"
        description={`${totalCount} compte(s) inscrit(s)`}
        icon={Users}
        backHref="/admin"
      />

      <UsersFilters />

      {/* Table */}
      <div className="rounded-2xl border bg-card overflow-hidden shadow-sm">
        {/* Header */}
        <div className="hidden sm:grid grid-cols-[1fr_120px_120px_80px_70px_100px] gap-3 px-5 py-3 border-b bg-muted/40 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
          <span>Utilisateur</span>
          <span>Profil</span>
          <span>Rôles</span>
          <span>Statut</span>
          <span className="text-center">Vérifié</span>
          <span className="text-right">Inscription</span>
        </div>

        {/* Body */}
        {users.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="h-14 w-14 rounded-2xl bg-muted flex items-center justify-center mb-4">
              <UserCircle className="h-7 w-7 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium text-foreground">
              Aucun utilisateur trouvé
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Essayez de modifier vos filtres de recherche.
            </p>
          </div>
        ) : (
          <div className="divide-y">
            {users.map((u) => {
              const config =
                PRIMARY_ROLE_CONFIG[u.primaryRole] ??
                PRIMARY_ROLE_CONFIG.papa_aide;

              return (
                <Link
                  key={u.id}
                  href={`/admin/utilisateurs/${u.id}`}
                  className="sm:grid sm:grid-cols-[1fr_120px_120px_80px_70px_100px] gap-3 flex flex-col px-5 py-3.5 items-start sm:items-center hover:bg-muted/30 transition-colors group"
                >
                  {/* Utilisateur : avatar + nom + email */}
                  <div className="flex items-center gap-3 min-w-0">
                    <Avatar className="h-9 w-9 shrink-0">
                      <AvatarFallback
                        className={`text-xs font-bold ${
                          u.primaryRole === "maman_demande"
                            ? "bg-pink-100 text-pink-700"
                            : "bg-primary/10 text-primary"
                        }`}
                      >
                        {u.fullName
                          ? getInitials(u.fullName)
                          : "?"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                        {u.fullName || "\u2014"}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {u.email}
                      </p>
                    </div>
                  </div>

                  {/* Profil : Papa / Maman / Professionnel */}
                  <div className="mt-2 sm:mt-0">
                    <Badge
                      variant="outline"
                      className={`text-[11px] font-medium ${config.className}`}
                    >
                      <span className="mr-1">{config.emoji}</span>
                      {config.label}
                    </Badge>
                  </div>

                  {/* Rôles */}
                  <div className="flex flex-wrap gap-1 mt-1 sm:mt-0">
                    {u.roles.map((role) => (
                      <RoleBadge key={role} role={role} />
                    ))}
                  </div>

                  {/* Statut */}
                  <div className="mt-1 sm:mt-0">
                    <StatusBadge status={u.status} />
                  </div>

                  {/* Vérifié */}
                  <div className="hidden sm:flex justify-center">
                    {u.isVerifiedPapa && (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    )}
                  </div>

                  {/* Inscription */}
                  <div className="hidden sm:block text-right">
                    <span className="text-xs text-muted-foreground">
                      {u.createdAt.toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {/* Pagination */}
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
