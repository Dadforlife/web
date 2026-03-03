"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-helpers";
import { revalidatePath } from "next/cache";

export async function exportPaymentsCSV() {
  await requireAdmin();

  const payments = await prisma.payment.findMany({
    orderBy: { createdAt: "desc" },
    include: { user: { select: { fullName: true, email: true } } },
  });

  const header =
    "Date,Utilisateur,Email,Montant,Devise,Type,Statut,Fournisseur,ID Paiement";

  const rows = payments.map((p) => {
    const date = p.createdAt.toLocaleDateString("fr-FR");
    const name = (p.user.fullName || "—").replace(/,/g, " ");
    const email = p.user.email;
    const amount = (p.amount / 100).toFixed(2);
    return [
      date,
      name,
      email,
      amount,
      p.currency,
      p.type,
      p.status,
      p.provider,
      p.providerPaymentId ?? "",
    ].join(",");
  });

  const csv = [header, ...rows].join("\n");
  const filename = `paiements-${new Date().toISOString().slice(0, 10)}.csv`;

  return { csv, filename };
}

export async function refundPayment(id: string) {
  await requireAdmin();

  await prisma.payment.update({
    where: { id },
    data: { status: "refunded" },
  });

  revalidatePath("/admin/paiements");
}
