import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ProfessionalStatus } from "@prisma/client";
import { evaluateProfessionalLevel } from "@/lib/professional-validation";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorise" }, { status: 401 });
  }

  const admin = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, roles: true },
  });
  if (!admin || !admin.roles.includes("admin")) {
    return NextResponse.json({ error: "Acces admin requis" }, { status: 403 });
  }

  const { id } = await params;
  const body = await request.json();
  const status = body?.status as ProfessionalStatus | undefined;
  const adminNotes = (body?.adminNotes as string | undefined)?.trim();

  if (!status || !Object.values(ProfessionalStatus).includes(status)) {
    return NextResponse.json({ error: "Statut invalide" }, { status: 400 });
  }

  await prisma.$transaction(async (tx) => {
    await tx.user.update({
      where: { id },
      data: { professionalStatus: status },
    });
    await tx.professionalVerification.upsert({
      where: { userId: id },
      create: {
        userId: id,
        adminNotes: adminNotes ?? null,
        validatedByAdminId: status === "valide" ? admin.id : null,
        validatedAt: status === "valide" ? new Date() : null,
      },
      update: {
        adminNotes: adminNotes ?? undefined,
        validatedByAdminId: status === "valide" ? admin.id : null,
        validatedAt: status === "valide" ? new Date() : null,
      },
    });
  });

  await evaluateProfessionalLevel(id);
  return NextResponse.json({ ok: true });
}

