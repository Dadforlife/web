import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { signMobileToken } from "@/lib/mobile-auth";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Veuillez remplir tous les champs." },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
      select: {
        id: true,
        email: true,
        fullName: true,
        passwordHash: true,
        primaryRole: true,
        roles: true,
        status: true,
      },
    });

    if (!user || !user.passwordHash) {
      return NextResponse.json(
        { error: "Email ou mot de passe incorrect." },
        { status: 401 }
      );
    }

    if (user.status === "suspended" || user.status === "banned") {
      return NextResponse.json(
        { error: "Votre compte a été suspendu." },
        { status: 403 }
      );
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return NextResponse.json(
        { error: "Email ou mot de passe incorrect." },
        { status: 401 }
      );
    }

    // Update last active
    await prisma.user.update({
      where: { id: user.id },
      data: { lastActiveAt: new Date() },
    });

    const token = await signMobileToken({
      sub: user.id,
      email: user.email,
      fullName: user.fullName,
      primaryRole: user.primaryRole,
      roles: user.roles,
    });

    return NextResponse.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        primaryRole: user.primaryRole,
        roles: user.roles,
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Erreur serveur." },
      { status: 500 }
    );
  }
}
