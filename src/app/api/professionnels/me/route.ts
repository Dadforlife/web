import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getRequiredDocuments } from "@/lib/professional-validation";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorise" }, { status: 401 });
  }

  const [user, verification, documents, reviewsAgg] = await Promise.all([
    prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        email: true,
        fullName: true,
        professionalRole: true,
        professionalStatus: true,
        professionalLevel: true,
      },
    }),
    prisma.professionalVerification.findUnique({
      where: { userId: session.user.id },
    }),
    prisma.professionalDocument.findMany({
      where: { userId: session.user.id },
      select: {
        documentType: true,
        verified: true,
      },
    }),
    prisma.professionalReview.aggregate({
      where: { professionalId: session.user.id },
      _avg: { rating: true },
      _count: { _all: true },
    }),
  ]);

  if (!user) {
    return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 404 });
  }

  const required = getRequiredDocuments();
  const uploadedSet = new Set(documents.map((d) => d.documentType));
  const verifiedSet = new Set(
    documents.filter((d) => d.verified).map((d) => d.documentType),
  );

  return NextResponse.json({
    user,
    verification,
    progress: {
      requiredDocuments: required,
      uploadedDocuments: documents.length,
      uploadedRequiredDocuments: required.filter((t) => uploadedSet.has(t)).length,
      verifiedRequiredDocuments: required.filter((t) => verifiedSet.has(t)).length,
      interviewCompleted: verification?.interviewCompleted ?? false,
    },
    reviews: {
      count: reviewsAgg._count._all,
      avg: reviewsAgg._avg.rating ?? 0,
    },
  });
}

