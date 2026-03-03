import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { evaluateProfessionalLevel } from "@/lib/professional-validation";

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorise" }, { status: 401 });
  }

  const body = await request.json();
  const professionalId = body?.professionalId as string | undefined;
  const rating = Number(body?.rating);
  const comment = (body?.comment as string | undefined)?.trim();

  if (!professionalId || !Number.isFinite(rating) || rating < 1 || rating > 5) {
    return NextResponse.json({ error: "Payload invalide" }, { status: 400 });
  }
  if (professionalId === session.user.id) {
    return NextResponse.json({ error: "Auto-avis interdit" }, { status: 400 });
  }

  const review = await prisma.professionalReview.create({
    data: {
      professionalId,
      memberId: session.user.id,
      rating,
      comment: comment || null,
    },
  });

  await evaluateProfessionalLevel(professionalId);
  return NextResponse.json({ review }, { status: 201 });
}

