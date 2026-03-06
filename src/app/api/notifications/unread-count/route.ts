import { NextRequest, NextResponse } from "next/server";
import { authFromRequest } from "@/lib/mobile-auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const session = await authFromRequest(request);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const count = await prisma.notification.count({
    where: {
      userId: session.user.id,
      isRead: false,
    },
  });

  return NextResponse.json({ count });
}
