import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorise" }, { status: 401 });
  }

  const { id } = await params;
  const document = await prisma.generatedDocument.findUnique({
    where: { id },
    include: { user: { select: { id: true, roles: true } } },
  });

  if (!document) {
    return NextResponse.json({ error: "Document introuvable" }, { status: 404 });
  }

  const isOwner = document.userId === session.user.id;
  const isAdmin = document.user.roles.includes("admin");
  if (!isOwner && !isAdmin) {
    return NextResponse.json({ error: "Acces refuse" }, { status: 403 });
  }

  return new NextResponse(document.content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Content-Disposition": `attachment; filename="${document.documentType}-${document.id}.txt"`,
    },
  });
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorise" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json().catch(() => ({}));
  const signatureProvider = (body.signatureProvider as string | undefined)?.trim();

  const document = await prisma.generatedDocument.findUnique({
    where: { id },
    select: { id: true, userId: true },
  });
  if (!document) {
    return NextResponse.json({ error: "Document introuvable" }, { status: 404 });
  }
  if (document.userId !== session.user.id) {
    return NextResponse.json({ error: "Acces refuse" }, { status: 403 });
  }

  const updated = await prisma.generatedDocument.update({
    where: { id },
    data: {
      isSigned: true,
      signedAt: new Date(),
      signatureProvider: signatureProvider ?? "internal",
    },
  });

  return NextResponse.json({ document: updated });
}

