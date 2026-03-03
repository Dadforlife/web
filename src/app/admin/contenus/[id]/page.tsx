import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-helpers";
import { PageHeader } from "@/components/admin/page-header";
import { FileText } from "lucide-react";
import { EditContentForm } from "./edit-content-form";

export default async function EditContenuPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;

  const content = await prisma.content.findUnique({ where: { id } });
  if (!content) notFound();

  return (
    <div className="space-y-6 max-w-3xl">
      <PageHeader
        title="Modifier le contenu"
        description={content.title}
        icon={FileText}
        backHref="/admin/contenus"
      />
      <EditContentForm
        content={{
          id: content.id,
          title: content.title,
          type: content.type,
          body: content.body,
          isPublished: content.isPublished,
        }}
      />
    </div>
  );
}
