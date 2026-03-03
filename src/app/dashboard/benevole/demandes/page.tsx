import { requireVolunteer } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { DemandesBenevoleContent } from "./demandes-content";

export default async function DemandesPage() {
  await requireVolunteer();

  const requests = await prisma.appointmentRequest.findMany({
    where: {
      status: { in: ["en_attente", "accepte", "refuse"] },
    },
    include: {
      user: { select: { fullName: true, email: true, phone: true, primaryRole: true } },
      volunteer: {
        include: { user: { select: { fullName: true } } },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const serialized = requests.map((r) => ({
    id: r.id,
    type: r.type,
    reason: r.reason,
    message: r.message,
    city: r.city,
    location: r.location,
    phone: r.phone,
    preferredDate: r.preferredDate?.toISOString() ?? null,
    status: r.status,
    responseNote: r.responseNote,
    parentName: r.user.fullName,
    parentEmail: r.user.email,
    parentPhone: r.user.phone ?? r.phone,
    parentRole: r.user.primaryRole,
    volunteerName: r.volunteer?.user?.fullName ?? null,
    createdAt: r.createdAt.toISOString(),
  }));

  return <DemandesBenevoleContent requests={serialized} />;
}
