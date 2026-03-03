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
import { Mail, MessageCircle, UserCheck, UserX, Lock, Eye } from "lucide-react";
import { MessagerieFilters } from "./messagerie-filters";

type PageProps = {
  searchParams: Promise<{ status?: string; assigned?: string; page?: string }>;
};

function statusBadge(status: string) {
  if (status === "open") {
    return (
      <Badge className="bg-green-100 text-green-700 border-green-200">
        Ouverte
      </Badge>
    );
  }
  return (
    <Badge className="bg-red-100 text-red-700 border-red-200">
      <Lock className="h-3 w-3 mr-1" />
      Fermée
    </Badge>
  );
}

export default async function AdminMessageriePage({ searchParams }: PageProps) {
  const params = await searchParams;
  const statusFilter = params.status || "";
  const assignedFilter = params.assigned || "";
  const page = Math.max(1, parseInt(params.page || "1"));
  const perPage = 20;

  const where: Record<string, unknown> = {};
  if (statusFilter && statusFilter !== "all") {
    where.status = statusFilter;
  }
  if (assignedFilter === "assigned") {
    where.volunteerId = { not: null };
  } else if (assignedFilter === "unassigned") {
    where.volunteerId = null;
  }

  const [
    conversations,
    total,
    openCount,
    closedCount,
    assignedCount,
    unassignedCount,
  ] = await Promise.all([
    prisma.privateConversation.findMany({
      where,
      orderBy: { updatedAt: "desc" },
      skip: (page - 1) * perPage,
      take: perPage,
      include: {
        father: { select: { id: true, fullName: true } },
        volunteer: { select: { id: true, fullName: true } },
        _count: { select: { messages: true } },
      },
    }),
    prisma.privateConversation.count({ where }),
    prisma.privateConversation.count({ where: { status: "open" } }),
    prisma.privateConversation.count({ where: { status: "closed" } }),
    prisma.privateConversation.count({ where: { volunteerId: { not: null } } }),
    prisma.privateConversation.count({ where: { volunteerId: null } }),
  ]);

  const totalPages = Math.ceil(total / perPage);

  // Get unread counts per conversation
  const conversationsWithUnread = await Promise.all(
    conversations.map(async (conv) => {
      const unreadCount = await prisma.privateMessage.count({
        where: {
          conversationId: conv.id,
          isRead: false,
        },
      });
      return { ...conv, unreadCount };
    })
  );

  const formatDate = (date: Date) =>
    date.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  return (
    <div className="space-y-6 max-w-7xl">
      <PageHeader
        title="Messagerie privée"
        description={`${total} conversation(s) au total`}
        icon={Mail}
        backHref="/admin"
      />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatsCard
          title="Ouvertes"
          value={openCount}
          icon={MessageCircle}
          iconColor="text-green-600"
          borderColor="border-t-green-500"
        />
        <StatsCard
          title="Fermées"
          value={closedCount}
          icon={Lock}
          iconColor="text-red-600"
          borderColor="border-t-red-500"
        />
        <StatsCard
          title="Assignées"
          value={assignedCount}
          icon={UserCheck}
          iconColor="text-blue-600"
          borderColor="border-t-blue-500"
        />
        <StatsCard
          title="Non assignées"
          value={unassignedCount}
          icon={UserX}
          iconColor="text-orange-600"
          borderColor="border-t-orange-500"
        />
      </div>

      <MessagerieFilters />

      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle>Liste des conversations</CardTitle>
        </CardHeader>
        <CardContent>
          {conversationsWithUnread.length === 0 ? (
            <p className="text-muted-foreground py-6 text-center">
              Aucune conversation trouvée.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Sujet</TableHead>
                    <TableHead>Papa</TableHead>
                    <TableHead>Bénévole</TableHead>
                    <TableHead className="text-center">Messages</TableHead>
                    <TableHead className="text-center">Non lus</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {conversationsWithUnread.map((conv) => (
                    <TableRow
                      key={conv.id}
                      className={
                        conv.unreadCount > 0 ? "bg-primary/5" : ""
                      }
                    >
                      <TableCell className="font-medium max-w-[200px] truncate">
                        {conv.subject}
                      </TableCell>
                      <TableCell>{conv.father.fullName}</TableCell>
                      <TableCell>
                        {conv.volunteer ? (
                          conv.volunteer.fullName
                        ) : (
                          <span className="text-orange-600 text-sm">
                            Non assigné
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        {conv._count.messages}
                      </TableCell>
                      <TableCell className="text-center">
                        {conv.unreadCount > 0 ? (
                          <span className="inline-flex h-5 min-w-5 rounded-full bg-primary text-primary-foreground text-[11px] font-bold items-center justify-center px-1">
                            {conv.unreadCount}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">0</span>
                        )}
                      </TableCell>
                      <TableCell>{statusBadge(conv.status)}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatDate(conv.updatedAt)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/admin/messagerie/${conv.id}`}>
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
                      href={`/admin/messagerie?${new URLSearchParams({
                        ...(statusFilter && { status: statusFilter }),
                        ...(assignedFilter && { assigned: assignedFilter }),
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
                      href={`/admin/messagerie?${new URLSearchParams({
                        ...(statusFilter && { status: statusFilter }),
                        ...(assignedFilter && { assigned: assignedFilter }),
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
