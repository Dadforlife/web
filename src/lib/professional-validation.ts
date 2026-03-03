import { prisma } from "@/lib/prisma";
import type {
  ProfessionalDocumentType,
  ProfessionalLevel,
} from "@prisma/client";

const REQUIRED_DOCUMENTS: ProfessionalDocumentType[] = [
  "charte_signee",
  "assurance",
  "diplome",
  "piece_identite",
];

export function getRequiredDocuments() {
  return REQUIRED_DOCUMENTS;
}

export async function hasAllRequiredDocuments(userId: string) {
  const docs = await prisma.professionalDocument.findMany({
    where: { userId },
    select: { documentType: true },
  });
  const uploaded = new Set(docs.map((d) => d.documentType));
  return REQUIRED_DOCUMENTS.every((docType) => uploaded.has(docType));
}

export async function startVerificationIfReady(userId: string) {
  const hasAllDocs = await hasAllRequiredDocuments(userId);
  if (!hasAllDocs) return false;

  await prisma.user.update({
    where: { id: userId },
    data: { professionalStatus: "en_verification" },
  });
  return true;
}

export async function evaluateProfessionalLevel(userId: string) {
  const [user, verification, reviewAgg, positiveReviews] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        professionalStatus: true,
        professionalLevel: true,
      },
    }),
    prisma.professionalVerification.findUnique({
      where: { userId },
      select: {
        interviewCompleted: true,
        registrationVerified: true,
      },
    }),
    prisma.professionalReview.aggregate({
      where: { professionalId: userId },
      _avg: { rating: true },
      _count: { _all: true },
    }),
    prisma.professionalReview.count({
      where: {
        professionalId: userId,
        rating: { gte: 4 },
      },
    }),
  ]);

  if (!user) return null;

  let nextLevel: ProfessionalLevel = "reference";

  const canBeValidated =
    user.professionalStatus === "valide" &&
    verification?.interviewCompleted &&
    verification?.registrationVerified;

  if (canBeValidated) {
    nextLevel = "valide";
  }

  const avgRating = reviewAgg._avg.rating ?? 0;
  const reviewCount = reviewAgg._count._all ?? 0;
  const canBeExpert =
    canBeValidated && positiveReviews >= 5 && reviewCount >= 5 && avgRating > 4;

  if (canBeExpert) {
    nextLevel = "expert";
  }

  await prisma.user.update({
    where: { id: userId },
    data: { professionalLevel: nextLevel },
  });

  return {
    level: nextLevel,
    avgRating,
    reviewCount,
    positiveReviews,
  };
}

