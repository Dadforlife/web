import { redirect } from "next/navigation";
import { requireAuth } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { MamanDashboardContent } from "./dashboard-content";

export default async function MamanDashboardPage() {
  const user = await requireAuth();

  if (user.primaryRole !== "maman_demande") {
    redirect("/dashboard");
  }

  const request = await prisma.accompagnementRequest.findFirst({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  if (!request) {
    redirect("/dashboard/maman/nouvelle-demande");
  }

  return (
    <MamanDashboardContent
      fullName={user.fullName}
      request={{
        id: request.id,
        fatherFirstName: request.fatherFirstName,
        fatherCity: request.fatherCity,
        status: request.status,
        createdAt: request.createdAt.toISOString(),
      }}
    />
  );
}
