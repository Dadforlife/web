import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-helpers";
import { PageHeader } from "@/components/admin/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Briefcase, Eye, Plus } from "lucide-react";
import { ProfessionalLevelBadge } from "@/components/professional-level-badge";
import { ProfessionalStatusBadge } from "@/components/professional-status-badge";

const ROLE_LABELS: Record<string, string> = {
  benevole: "Benevole",
  avocat: "Avocat",
  mediateur: "Mediateur",
  coach: "Coach",
  psychologue: "Psychologue",
};

export default async function AdminProfessionnelsPage({
  searchParams,
}: {
  searchParams: Promise<{ role?: string; status?: string; q?: string }>;
}) {
  await requireAdmin();
  const params = await searchParams;

  const where: Record<string, unknown> = {
    professionalRole: { not: null },
  };

  if (params.role) {
    where.professionalRole = params.role;
  }
  if (params.status) {
    where.professionalStatus = params.status;
  }
  if (params.q) {
    where.OR = [
      { fullName: { contains: params.q, mode: "insensitive" } },
      { email: { contains: params.q, mode: "insensitive" } },
    ];
  }

  const users = await prisma.user.findMany({
    where,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      fullName: true,
      email: true,
      professionalRole: true,
      professionalStatus: true,
      professionalLevel: true,
      createdAt: true,
    },
    take: 200,
  });

  return (
    <div className="space-y-6 max-w-7xl">
      <PageHeader
        title="Validation des professionnels"
        description="Benevoles, avocats, mediateurs, coachs et psychologues"
        icon={Briefcase}
        backHref="/admin"
      >
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link href="/admin/professionnels/historique">Historique</Link>
          </Button>
          <Button asChild>
            <Link href="/admin/professionnels/nouveau">
              <Plus className="h-4 w-4 mr-1" />
              Ajouter
            </Link>
          </Button>
        </div>
      </PageHeader>

      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle>Candidatures professionnelles</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Niveau</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground py-6">
                    Aucune candidature professionnelle.
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.fullName || "—"}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      {user.professionalRole ? ROLE_LABELS[user.professionalRole] : "—"}
                    </TableCell>
                    <TableCell>
                      <ProfessionalStatusBadge status={user.professionalStatus} />
                    </TableCell>
                    <TableCell>
                      <ProfessionalLevelBadge level={user.professionalLevel} />
                    </TableCell>
                    <TableCell>
                      {user.createdAt.toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/admin/professionnels/${user.id}`}>
                          <Eye className="h-4 w-4 mr-1" />
                          Ouvrir
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

