import { NextRequest, NextResponse } from "next/server";
import { authFromRequest } from "@/lib/mobile-auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(request: NextRequest) {
  const session = await authFromRequest(request);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  await prisma.notification.updateMany({
    where: {
      userId: session.user.id,
      isRead: false,
    },
    data: { isRead: true },
  });

  return NextResponse.json({ success: true });
}
