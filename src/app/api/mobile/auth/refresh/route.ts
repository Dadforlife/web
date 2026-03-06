import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyMobileToken, signMobileToken } from "@/lib/mobile-auth";

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Token manquant." }, { status: 401 });
  }

  const token = authHeader.slice(7);
  const payload = await verifyMobileToken(token);
  if (!payload) {
    return NextResponse.json({ error: "Token invalide ou expiré." }, { status: 401 });
  }

  // Fetch fresh user data in case roles changed
  const user = await prisma.user.findUnique({
    where: { id: payload.sub },
    select: {
      id: true,
      email: true,
      fullName: true,
      primaryRole: true,
      roles: true,
      status: true,
    },
  });

  if (!user) {
    return NextResponse.json({ error: "Utilisateur introuvable." }, { status: 404 });
  }

  if (user.status === "suspended" || user.status === "banned") {
    return NextResponse.json({ error: "Votre compte a été suspendu." }, { status: 403 });
  }

  // Update last active
  await prisma.user.update({
    where: { id: user.id },
    data: { lastActiveAt: new Date() },
  });

  const newToken = await signMobileToken({
    sub: user.id,
    email: user.email,
    fullName: user.fullName,
    primaryRole: user.primaryRole,
    roles: user.roles,
  });

  return NextResponse.json({
    token: newToken,
    user: {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      primaryRole: user.primaryRole,
      roles: user.roles,
    },
  });
}
