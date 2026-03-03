"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import type { AccompagnementRequestStatus } from "@prisma/client";

export interface AdminNote {
  author: string;
  content: string;
  createdAt: string;
}

const VALID_STATUSES: AccompagnementRequestStatus[] = [
  "pending",
  "reviewing",
  "contacted",
  "active",
  "completed",
  "rejected",
];

export async function updateRequestStatus(
  id: string,
  status: AccompagnementRequestStatus,
) {
  await requireAdmin();

  if (!VALID_STATUSES.includes(status)) {
    throw new Error("Statut invalide.");
  }

  const request = await prisma.accompagnementRequest.findUnique({
    where: { id },
    select: { id: true },
  });

  if (!request) {
    throw new Error("Demande introuvable.");
  }

  await prisma.accompagnementRequest.update({
    where: { id },
    data: { status },
  });

  revalidatePath("/admin/demandes-accompagnement");
  revalidatePath(`/admin/demandes-accompagnement/${id}`);
}

export async function addAdminNote(id: string, content: string) {
  const admin = await requireAdmin();

  if (!content.trim()) {
    throw new Error("La note ne peut pas être vide.");
  }

  const request = await prisma.accompagnementRequest.findUnique({
    where: { id },
    select: { adminNotes: true },
  });

  if (!request) {
    throw new Error("Demande introuvable.");
  }

  // Parse existing notes (JSON array) or start fresh
  let existingNotes: AdminNote[] = [];
  if (request.adminNotes) {
    try {
      const parsed = JSON.parse(request.adminNotes);
      if (Array.isArray(parsed)) {
        existingNotes = parsed;
      } else {
        // Migrate old single-string note to array format
        existingNotes = [
          {
            author: "Admin",
            content: request.adminNotes,
            createdAt: new Date().toISOString(),
          },
        ];
      }
    } catch {
      // Old format: plain string — migrate it
      existingNotes = [
        {
          author: "Admin",
          content: request.adminNotes,
          createdAt: new Date().toISOString(),
        },
      ];
    }
  }

  const newNote: AdminNote = {
    author: admin.fullName || admin.email,
    content: content.trim(),
    createdAt: new Date().toISOString(),
  };

  const updatedNotes = [...existingNotes, newNote];

  await prisma.accompagnementRequest.update({
    where: { id },
    data: { adminNotes: JSON.stringify(updatedNotes) },
  });

  revalidatePath(`/admin/demandes-accompagnement/${id}`);

  return newNote;
}
