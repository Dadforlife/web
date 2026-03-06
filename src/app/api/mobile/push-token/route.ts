import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authFromRequest } from "@/lib/mobile-auth";

export async function POST(request: NextRequest) {
  const session = await authFromRequest(request);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const { token, platform } = await request.json();

  if (!token || !platform) {
    return NextResponse.json(
      { error: "Token et plateforme requis." },
      { status: 400 }
    );
  }

  if (platform !== "ios" && platform !== "android") {
    return NextResponse.json(
      { error: "Plateforme invalide." },
      { status: 400 }
    );
  }

  // Upsert: if token already exists for another user, reassign it
  await prisma.pushToken.upsert({
    where: { token },
    update: {
      userId: session.user.id,
      platform,
    },
    create: {
      userId: session.user.id,
      token,
      platform,
    },
  });

  return NextResponse.json({ success: true });
}

export async function DELETE(request: NextRequest) {
  const session = await authFromRequest(request);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const { token } = await request.json();

  if (!token) {
    return NextResponse.json({ error: "Token requis." }, { status: 400 });
  }

  await prisma.pushToken.deleteMany({
    where: {
      token,
      userId: session.user.id,
    },
  });

  return NextResponse.json({ success: true });
}
