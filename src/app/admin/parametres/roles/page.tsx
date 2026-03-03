import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-helpers";
import { PageHeader } from "@/components/admin/page-header";
import { ShieldCheck } from "lucide-react";
import { RolesClient } from "./roles-client";

export default async function AdminRolesPage() {
  await requireAdmin();

  const privilegedUsers = await prisma.user.findMany({
    where: {
      OR: [
        { roles: { has: "admin" } },
        { roles: { has: "moderator" } },
      ],
    },
    orderBy: { fullName: "asc" },
    select: {
      id: true,
      fullName: true,
      email: true,
      roles: true,
    },
  });

  return (
    <div className="space-y-6 max-w-4xl">
      <PageHeader
        title="Gestion des rôles"
        description="Administrateurs et modérateurs de la plateforme"
        icon={ShieldCheck}
        backHref="/admin/parametres"
      />

      <RolesClient privilegedUsers={privilegedUsers} />
    </div>
  );
}
