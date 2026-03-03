import { requireAuth } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { DemandeRdvContent } from "./demande-rdv-content";

export default async function DemandeRdvPage() {
  const user = await requireAuth();

  const requests = await prisma.appointmentRequest.findMany({
    where: { userId: user.id },
    include: {
      volunteer: {
        include: { user: { select: { fullName: true } } },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  // Try to get user's city from latest request or accompagnement request
  let userCity: string | null = null;
  const latestWithCity = requests.find((r) => r.city);
  if (latestWithCity) {
    userCity = latestWithCity.city;
  } else {
    const accompagnement = await prisma.accompagnementRequest.findFirst({
      where: { userId: user.id },
      select: { fatherCity: true },
      orderBy: { createdAt: "desc" },
    });
    if (accompagnement) userCity = accompagnement.fatherCity;
  }

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
    volunteerName: r.volunteer?.user?.fullName ?? null,
    createdAt: r.createdAt.toISOString(),
  }));

  return (
    <DemandeRdvContent
      requests={serialized}
      userPhone={user.phone}
      userCity={userCity}
      userName={user.fullName}
    />
  );
}
