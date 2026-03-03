import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/admin/page-header";
import { MessageSquare } from "lucide-react";
import { DiscussionDetailClient } from "./discussion-detail-client";

function formatDate(date: Date) {
  return date.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function AdminDiscussionDetailPage(props: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await props.params;

  const discussion = await prisma.discussion.findUnique({
    where: { id },
    include: {
      author: { select: { id: true, fullName: true, email: true, status: true } },
      category: { select: { name: true } },
      messages: {
        orderBy: { createdAt: "asc" },
        include: {
          author: { select: { id: true, fullName: true, email: true } },
        },
      },
      _count: { select: { reports: true } },
    },
  });

  if (!discussion) {
    notFound();
  }

  const serialized = {
    id: discussion.id,
    title: discussion.title,
    content: discussion.content,
    status: discussion.status,
    isAnonymous: discussion.isAnonymous,
    createdAt: formatDate(discussion.createdAt),
    updatedAt: formatDate(discussion.updatedAt),
    reportsCount: discussion._count.reports,
    author: discussion.author,
    category: discussion.category.name,
    messages: discussion.messages.map((m) => ({
      id: m.id,
      content: m.content,
      isFlagged: m.isFlagged,
      createdAt: formatDate(m.createdAt),
      author: m.author,
    })),
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <PageHeader
        title={discussion.title}
        description={`Par ${discussion.author.fullName || discussion.author.email} · ${serialized.category}`}
        icon={MessageSquare}
        backHref="/admin/discussions"
      />

      <DiscussionDetailClient discussion={serialized} />
    </div>
  );
}
