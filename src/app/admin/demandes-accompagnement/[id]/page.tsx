import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-helpers";
import { PageHeader } from "@/components/admin/page-header";
import { Baby } from "lucide-react";
import { RequestDetailClient } from "./request-detail-client";
import type { AdminNote } from "../actions";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminRequestDetailPage({ params }: PageProps) {
  const { id } = await params;
  const admin = await requireAdmin();

  const request = await prisma.accompagnementRequest.findUnique({
    where: { id },
    include: {
      user: { select: { fullName: true, email: true } },
    },
  });

  if (!request) notFound();

  // Parse adminNotes JSON array
  let notes: AdminNote[] = [];
  if (request.adminNotes) {
    try {
      const parsed = JSON.parse(request.adminNotes);
      if (Array.isArray(parsed)) {
        notes = parsed;
      } else {
        // Old plain-string format: wrap as single note
        notes = [
          {
            author: "Admin",
            content: request.adminNotes,
            createdAt: request.updatedAt.toISOString(),
          },
        ];
      }
    } catch {
      notes = [
        {
          author: "Admin",
          content: request.adminNotes,
          createdAt: request.updatedAt.toISOString(),
        },
      ];
    }
  }

  const serialized = {
    id: request.id,
    status: request.status,
    notes,
    fatherFirstName: request.fatherFirstName,
    fatherCity: request.fatherCity,
    fatherPhone: request.fatherPhone,
    fatherEmail: request.fatherEmail,
    motherPhone: request.motherPhone,
    situationDescription: request.situationDescription,
    enfantsData: request.enfantsData as
      | { prenom: string; sexe: string }[]
      | null,
    user: {
      fullName: request.user.fullName,
      email: request.user.email,
    },
    createdAt: request.createdAt.toISOString(),
    updatedAt: request.updatedAt.toISOString(),
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <PageHeader
        title={`Demande de ${request.user.fullName}`}
        description={`Soumise le ${request.createdAt.toLocaleDateString("fr-FR", {
          day: "numeric",
          month: "long",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })}`}
        icon={Baby}
        backHref="/admin/demandes-accompagnement"
      />
      <RequestDetailClient
        request={serialized}
        adminName={admin.fullName || admin.email}
      />
    </div>
  );
}
