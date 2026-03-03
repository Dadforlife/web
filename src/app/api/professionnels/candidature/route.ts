import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ProfessionalRole, ProfessionalStatus } from "@prisma/client";

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorise" }, { status: 401 });
  }

  const body = await request.json();
  const role = body?.role as ProfessionalRole | undefined;
  const registrationNumber = (body?.officialRegistrationNumber as string | undefined)?.trim();

  if (!role || !Object.values(ProfessionalRole).includes(role)) {
    return NextResponse.json({ error: "Role professionnel invalide" }, { status: 400 });
  }

  await prisma.$transaction(async (tx) => {
    await tx.user.update({
      where: { id: session.user.id! },
      data: {
        professionalRole: role,
        professionalStatus: ProfessionalStatus.en_attente,
      },
    });

    await tx.professionalVerification.upsert({
      where: { userId: session.user.id! },
      create: {
        userId: session.user.id!,
        officialRegistrationNumber: registrationNumber ?? null,
      },
      update: {
        officialRegistrationNumber: registrationNumber ?? undefined,
      },
    });
  });

  return NextResponse.json({ ok: true });
}

