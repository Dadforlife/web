import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AdminActionType } from "@prisma/client";

export async function DELETE() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorise" }, { status: 401 });
  }

  const userId = session.user.id;
  const anonymizedEmail = `deleted+${userId}@example.local`;

  await prisma.$transaction(async (tx) => {
    await tx.user.update({
      where: { id: userId },
      data: {
        fullName: "Compte supprime (RGPD)",
        email: anonymizedEmail,
        phone: null,
        passwordHash: null,
        avatarUrl: null,
        suspendedReason: "Suppression RGPD",
        gdprDeletedAt: new Date(),
        status: "suspended",
      },
    });

    await tx.adminActionLog.create({
      data: {
        actionType: AdminActionType.gdpr_account_deleted,
        actorId: userId,
        targetUserId: userId,
        metadata: { source: "self_service" },
      },
    });
  });

  return NextResponse.json({ ok: true });
}

