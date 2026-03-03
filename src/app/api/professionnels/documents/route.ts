import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { type ProfessionalDocumentType } from "@prisma/client";
import { startVerificationIfReady } from "@/lib/professional-validation";

const ALLOWED_DOCUMENT_TYPES: ProfessionalDocumentType[] = [
  "charte_signee",
  "convention_signee",
  "assurance",
  "diplome",
  "piece_identite",
];

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorise" }, { status: 401 });
  }

  const documents = await prisma.professionalDocument.findMany({
    where: { userId: session.user.id },
    orderBy: { uploadedAt: "desc" },
  });

  return NextResponse.json({ documents });
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorise" }, { status: 401 });
  }

  const body = await request.json();
  const documentType = body?.documentType as ProfessionalDocumentType | undefined;
  const fileUrl = (body?.fileUrl as string | undefined)?.trim();

  if (!documentType || !ALLOWED_DOCUMENT_TYPES.includes(documentType)) {
    return NextResponse.json({ error: "Type de document invalide" }, { status: 400 });
  }
  if (!fileUrl) {
    return NextResponse.json({ error: "fileUrl est requis" }, { status: 400 });
  }

  const document = await prisma.professionalDocument.create({
    data: {
      userId: session.user.id,
      documentType,
      fileUrl,
    },
  });

  await startVerificationIfReady(session.user.id);
  return NextResponse.json({ document }, { status: 201 });
}

