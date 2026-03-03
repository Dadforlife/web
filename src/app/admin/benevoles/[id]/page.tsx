import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/admin/page-header";
import { HandHeart } from "lucide-react";
import { ApplicationDetailClient } from "./application-detail-client";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminApplicationDetailPage({ params }: PageProps) {
  const { id } = await params;

  const application = await prisma.volunteerApplication.findUnique({
    where: { id },
    include: {
      reviewedBy: { select: { fullName: true, email: true } },
    },
  });

  if (!application) notFound();

  const serialized = {
    id: application.id,
    fullName: application.fullName,
    email: application.email,
    phone: application.phone,
    city: application.city,
    availability: application.availability,
    motivation: application.motivation,
    experience: application.experience,
    status: application.status,
    adminNotes: application.adminNotes,
    reviewedBy: application.reviewedBy
      ? { fullName: application.reviewedBy.fullName, email: application.reviewedBy.email }
      : null,
    reviewedAt: application.reviewedAt?.toISOString() ?? null,
    createdAt: application.createdAt.toISOString(),
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <PageHeader
        title={`Candidature de ${application.fullName}`}
        description={`Soumise le ${application.createdAt.toLocaleDateString("fr-FR", {
          day: "numeric",
          month: "long",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })}`}
        icon={HandHeart}
        backHref="/admin/benevoles"
      />
      <ApplicationDetailClient application={serialized} />
    </div>
  );
}
