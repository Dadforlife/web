import { redirect } from "next/navigation";
import { requireAuth } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { AccompagnementRequestForm } from "./request-form";

export default async function NouvelleDemandePage() {
  const user = await requireAuth();

  if (user.primaryRole !== "maman_demande") {
    redirect("/dashboard");
  }

  const existing = await prisma.accompagnementRequest.findFirst({
    where: { userId: user.id },
  });

  if (existing) {
    redirect("/dashboard/maman");
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
          Nouvelle demande d&apos;accompagnement
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Renseignez les informations sur le p&egrave;re de votre enfant pour que notre
          &eacute;quipe puisse lui proposer un accompagnement adapt&eacute;.
        </p>
      </div>
      <AccompagnementRequestForm
        motherPhone={user.phone ?? ""}
      />
    </div>
  );
}
