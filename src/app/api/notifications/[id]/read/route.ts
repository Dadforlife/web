import { NextRequest, NextResponse } from "next/server";
import { authFromRequest } from "@/lib/mobile-auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await authFromRequest(request);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const { id } = await params;

  const notification = await prisma.notification.findFirst({
    where: { id, userId: session.user.id },
  });

  if (!notification) {
    return NextResponse.json(
      { error: "Notification introuvable" },
      { status: 404 }
    );
  }

  await prisma.notification.update({
    where: { id },
    data: { isRead: true },
  });

  return NextResponse.json({ success: true });
}
