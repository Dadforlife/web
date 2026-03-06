import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { signMobileToken } from "@/lib/mobile-auth";
import { notifyWelcome } from "@/lib/notification-triggers";

const VALID_PRIMARY_ROLES = [
  "papa_aide",
  "maman_demande",
  "papa_benevole",
] as const;

export async function POST(request: NextRequest) {
  try {
    const { fullName, email, phone, password, primaryRole } =
      await request.json();

    if (!fullName || !email || !password) {
      return NextResponse.json(
        { error: "Veuillez remplir tous les champs obligatoires." },
        { status: 400 }
      );
    }

    if (
      !primaryRole ||
      !VALID_PRIMARY_ROLES.includes(
        primaryRole as (typeof VALID_PRIMARY_ROLES)[number]
      )
    ) {
      return NextResponse.json(
        { error: "Veuillez choisir un profil valide." },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Le mot de passe doit contenir au moins 6 caractères." },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    const existing = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });
    if (existing) {
      return NextResponse.json(
        { error: "Cet email est déjà utilisé." },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const newUser = await prisma.user.create({
      data: {
        email: normalizedEmail,
        fullName,
        phone: phone || null,
        passwordHash,
        emailVerified: new Date(),
        primaryRole,
        roles: ["member"],
      },
    });

    notifyWelcome(newUser.id, fullName).catch(console.error);

    const token = await signMobileToken({
      sub: newUser.id,
      email: newUser.email,
      fullName: newUser.fullName,
      primaryRole: newUser.primaryRole,
      roles: newUser.roles,
    });

    return NextResponse.json(
      {
        token,
        user: {
          id: newUser.id,
          email: newUser.email,
          fullName: newUser.fullName,
          primaryRole: newUser.primaryRole,
          roles: newUser.roles,
        },
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { error: "Erreur lors de la création du compte." },
      { status: 500 }
    );
  }
}
