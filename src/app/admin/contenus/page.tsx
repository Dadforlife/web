import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-helpers";
import { PageHeader } from "@/components/admin/page-header";
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
  FileText,
  Plus,
  CheckCircle,
  XCircle,
  ChevronLeft,
  ChevronRight,
  Pencil,
} from "lucide-react";
import Link from "next/link";
import { ContenusFilters } from "./contenus-filters";
import { TogglePublishButton } from "./toggle-publish-button";

const PER_PAGE = 20;

const TYPE_LABELS: Record<string, string> = {
  article: "Article",
  resource: "Ressource",
  page: "Page",
  programme: "Programme",
};

function TypeBadge({ type }: { type: string }) {
  const label = TYPE_LABELS[type] ?? type;
  switch (type) {
    case "article":
      return (
        <Badge className="border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-300">
          {label}
        </Badge>
      );
    case "resource":
      return (
        <Badge className="border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-950 dark:text-green-300">
          {label}
        </Badge>
      );
    case "page":
      return (
        <Badge className="border-purple-200 bg-purple-50 text-purple-700 dark:border-purple-800 dark:bg-purple-950 dark:text-purple-300">
          {label}
        </Badge>
      );
    case "programme":
      return (
        <Badge className="border-orange-200 bg-orange-50 text-orange-700 dark:border-orange-800 dark:bg-orange-950 dark:text-orange-300">
          {label}
        </Badge>
      );
    default:
      return <Badge variant="outline">{label}</Badge>;
  }
}

export default async function AdminContenusPage({
  searchParams,
}: {
  searchParams: Promise<{
    type?: string;
    published?: string;
    page?: string;
  }>;
}) {
  await requireAdmin();
  const params = await searchParams;

  const typeFilter = params.type ?? "";
  const publishedFilter = params.published ?? "";
  const page = Math.max(1, parseInt(params.page ?? "1", 10) || 1);

  const where: Record<string, unknown> = {};

  if (typeFilter) {
    where.type = typeFilter;
  }
  if (publishedFilter === "true") {
    where.isPublished = true;
  } else if (publishedFilter === "false") {
    where.isPublished = false;
  }

  const [contents, totalCount] = await Promise.all([
    prisma.content.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PER_PAGE,
      take: PER_PAGE,
      include: {
        author: { select: { fullName: true } },
      },
    }),
    prisma.content.count({ where }),
  ]);

  const totalPages = Math.max(1, Math.ceil(totalCount / PER_PAGE));

  function buildPageUrl(targetPage: number) {
    const p = new URLSearchParams();
    if (typeFilter) p.set("type", typeFilter);
    if (publishedFilter) p.set("published", publishedFilter);
    if (targetPage > 1) p.set("page", String(targetPage));
    const qs = p.toString();
    return `/admin/contenus${qs ? `?${qs}` : ""}`;
  }

  return (
    <div className="space-y-6 max-w-6xl">
      <PageHeader
        title="Contenus"
        description={`${totalCount} contenu(s)`}
        icon={FileText}
        backHref="/admin"
      >
        <Button asChild>
          <Link href="/admin/contenus/nouveau">
            <Plus className="h-4 w-4" />
            Nouveau contenu
          </Link>
        </Button>
      </PageHeader>

      <ContenusFilters />

      <Card className="rounded-2xl">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Titre</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Publié</TableHead>
                <TableHead>Auteur</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contents.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center py-8 text-muted-foreground"
                  >
                    Aucun contenu trouvé.
                  </TableCell>
                </TableRow>
              ) : (
                contents.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell className="font-medium max-w-[300px] truncate">
                      {c.title}
                    </TableCell>
                    <TableCell>
                      <TypeBadge type={c.type} />
                    </TableCell>
                    <TableCell>
                      {c.isPublished ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <XCircle className="h-4 w-4 text-muted-foreground" />
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {c.author.fullName || "—"}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {c.createdAt.toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/admin/contenus/${c.id}`}>
                            <Pencil className="h-4 w-4" />
                          </Link>
                        </Button>
                        <TogglePublishButton
                          id={c.id}
                          isPublished={c.isPublished}
                        />
                      </div>
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
