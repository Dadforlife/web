import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-helpers";
import { PageHeader } from "@/components/admin/page-header";
import { UserDetailClient } from "./user-detail-client";
import { Users } from "lucide-react";

export default async function AdminUserDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;

  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      _count: {
        select: {
          discussions: true,
          messages: true,
          diagnostics: true,
        },
      },
    },
  });

  if (!user) notFound();

  const recentDiscussions = await prisma.discussion.findMany({
    where: { authorId: id },
    orderBy: { createdAt: "desc" },
    take: 10,
    select: {
      id: true,
      title: true,
      status: true,
      createdAt: true,
      category: { select: { name: true } },
      _count: { select: { messages: true } },
    },
  });

  const serializedUser = {
    id: user.id,
    email: user.email,
    fullName: user.fullName,
    phone: user.phone,
    roles: user.roles,
    status: user.status,
    isVerifiedPapa: user.isVerifiedPapa,
    avatarUrl: user.avatarUrl,
    lastActiveAt: user.lastActiveAt?.toISOString() ?? null,
    suspendedAt: user.suspendedAt?.toISOString() ?? null,
    suspendedReason: user.suspendedReason,
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
    _count: user._count,
  };

  const serializedDiscussions = recentDiscussions.map((d) => ({
    id: d.id,
    title: d.title,
    status: d.status,
    createdAt: d.createdAt.toISOString(),
    categoryName: d.category.name,
    messageCount: d._count.messages,
  }));

  return (
    <div className="space-y-6 max-w-4xl">
      <PageHeader
        title={user.fullName || user.email}
        description="Gestion du compte utilisateur"
        icon={Users}
        backHref="/admin/utilisateurs"
      />

      <UserDetailClient
        user={serializedUser}
        recentDiscussions={serializedDiscussions}
      />
    </div>
  );
}
