import { prisma } from "@/lib/prisma";
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
import { MessageSquare } from "lucide-react";
import Link from "next/link";
import { DiscussionsFilters } from "./discussions-filters";

const STATUS_BADGE: Record<string, { label: string; className: string }> = {
  active: { label: "Active", className: "bg-green-100 text-green-800 border-0" },
  flagged: { label: "Signalée", className: "bg-orange-100 text-orange-800 border-0" },
  archived: { label: "Archivée", className: "bg-gray-100 text-gray-600 border-0" },
};

function formatDate(date: Date) {
  return date.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default async function AdminDiscussionsPage(props: {
  searchParams: Promise<{ status?: string; q?: string }>;
}) {
  const searchParams = await props.searchParams;
  const statusFilter = searchParams.status;
  const searchQuery = searchParams.q;

  let discussions: {
    id: string;
    title: string;
    status: string;
    createdAt: Date;
    author: { fullName: string; email: string };
    category: { name: string };
    _count: { messages: number };
  }[] = [];

  try {
    discussions = await prisma.discussion.findMany({
      where: {
        ...(statusFilter && statusFilter !== "all" ? { status: statusFilter } : {}),
        ...(searchQuery
          ? { title: { contains: searchQuery, mode: "insensitive" as const } }
          : {}),
      },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        status: true,
        createdAt: true,
        author: { select: { fullName: true, email: true } },
        category: { select: { name: true } },
        _count: { select: { messages: true } },
      },
    });
  } catch {
    // DB not ready
  }

  return (
    <div className="space-y-6 max-w-6xl">
      <PageHeader
        title="Discussions"
        description={`${discussions.length} discussion(s)`}
        icon={MessageSquare}
        backHref="/admin"
      />

      <DiscussionsFilters
        currentStatus={statusFilter ?? "all"}
        currentSearch={searchQuery ?? ""}
      />

      <Card className="rounded-2xl">
        <CardContent className="pt-6">
          {discussions.length === 0 ? (
            <p className="text-muted-foreground py-6 text-center">
              Aucune discussion trouvée.
            </p>
          ) : (
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Titre</TableHead>
                    <TableHead>Auteur</TableHead>
                    <TableHead>Catégorie</TableHead>
                    <TableHead className="text-center">Messages</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Créée le</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {discussions.map((d) => {
                    const badge = STATUS_BADGE[d.status] ?? STATUS_BADGE.active;
                    return (
                      <TableRow key={d.id} className="hover:bg-muted/30">
                        <TableCell className="font-medium max-w-[250px] truncate">
                          <Link
                            href={`/admin/discussions/${d.id}`}
                            className="hover:underline"
                          >
                            {d.title}
                          </Link>
                        </TableCell>
                        <TableCell>
                          {d.author.fullName || d.author.email}
                        </TableCell>
                        <TableCell>{d.category.name}</TableCell>
                        <TableCell className="text-center">
                          {d._count.messages}
                        </TableCell>
                        <TableCell>
                          <Badge className={badge.className}>
                            {badge.label}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {formatDate(d.createdAt)}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
