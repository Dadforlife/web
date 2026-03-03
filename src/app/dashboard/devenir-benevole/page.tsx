import { redirect } from "next/navigation";
import { requireAuth } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { HandHeart, CheckCircle2, Clock, XCircle, Phone, CircleDot, Circle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { VolunteerFormDashboard } from "./volunteer-form-dashboard";

const statusConfig = {
  pending: {
    label: "En attente de réponse",
    description: "Votre candidature est en cours d'examen. Notre équipe reviendra vers vous sous 72h.",
    icon: Clock,
    color: "bg-warm/10 text-warm",
    badgeClass: "bg-warm/20 text-warm hover:bg-warm/20 border-0",
  },
  contacted: {
    label: "Contacté",
    description: "Notre équipe vous a contacté. Vérifiez vos emails et votre téléphone.",
    icon: Phone,
    color: "bg-primary/10 text-primary",
    badgeClass: "bg-primary/20 text-primary hover:bg-primary/20 border-0",
  },
  accepted: {
    label: "Acceptée",
    description: "Félicitations ! Votre candidature a été acceptée. Bienvenue dans l'équipe !",
    icon: CheckCircle2,
    color: "bg-chart-4/10 text-chart-4",
    badgeClass: "bg-chart-4/20 text-chart-4 hover:bg-chart-4/20 border-0",
  },
  rejected: {
    label: "Non retenue",
    description: "Votre candidature n'a pas été retenue cette fois. Vous pouvez soumettre une nouvelle candidature.",
    icon: XCircle,
    color: "bg-destructive/10 text-destructive",
    badgeClass: "bg-destructive/20 text-destructive hover:bg-destructive/20 border-0",
  },
} as const;

const APPLICATION_STEPS = [
  {
    key: "submitted",
    title: "Candidature envoyee",
    description: "Votre demande est bien recue.",
  },
  {
    key: "pending",
    title: "Analyse de votre profil",
    description: "Notre equipe etudie votre candidature.",
  },
  {
    key: "contacted",
    title: "Prise de contact",
    description: "Un membre de l'equipe vous contacte.",
  },
  {
    key: "accepted",
    title: "Validation finale",
    description: "Decision finale sur votre candidature.",
  },
] as const;

function getCurrentStepIndex(status: string) {
  switch (status) {
    case "pending":
      return 1;
    case "contacted":
      return 2;
    case "accepted":
      return 3;
    case "rejected":
      return 3;
    default:
      return 1;
  }
}

export default async function DevenirBenevoleDashboardPage() {
  const user = await requireAuth();

  if (user.roles.includes("volunteer")) {
    redirect("/dashboard");
  }

  const existingApplication = await prisma.volunteerApplication.findFirst({
    where: {
      OR: [
        { userId: user.id },
        { email: user.email },
      ],
    },
    orderBy: { createdAt: "desc" },
  });

  const hasActiveApplication = existingApplication && existingApplication.status !== "rejected";

  return (
    <div className="space-y-8 max-w-3xl">
      {/* En-tête */}
      <div className="space-y-4 animate-fade-in-up">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
            <HandHeart className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">
              Devenir bénévole
            </h1>
            <p className="text-muted-foreground mt-1">
              Rejoignez l&apos;équipe Papa pour la vie et aidez d&apos;autres papas
            </p>
          </div>
        </div>
      </div>

      {hasActiveApplication ? (
        // Application existante : afficher le statut
        <ApplicationStatus application={existingApplication} />
      ) : (
        // Pas de candidature active : afficher le formulaire
        <VolunteerFormDashboard
          user={{
            fullName: user.fullName,
            email: user.email,
            phone: user.phone ?? "",
          }}
        />
      )}
    </div>
  );
}

function ApplicationStatus({ application }: { application: { status: string; createdAt: Date } }) {
  const status = application.status as keyof typeof statusConfig;
  const config = statusConfig[status] ?? statusConfig.pending;
  const Icon = config.icon;
  const currentStepIndex = getCurrentStepIndex(application.status);
  const isRejected = application.status === "rejected";

  return (
    <Card
      className="rounded-2xl animate-fade-in-up"
      style={{ animationDelay: "0.1s", animationFillMode: "both" }}
    >
      <CardContent className="py-10 space-y-8">
        <div className="text-center space-y-4">
        <div className={`h-16 w-16 rounded-full ${config.color} flex items-center justify-center mx-auto`}>
          <Icon className="h-8 w-8" />
        </div>
        <div className="space-y-2">
          <Badge className={config.badgeClass}>{config.label}</Badge>
          <h2 className="text-xl font-bold text-foreground">Candidature soumise</h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            {config.description}
          </p>
        </div>
        <p className="text-xs text-muted-foreground pt-2">
          Candidature envoyée le{" "}
          {new Intl.DateTimeFormat("fr-FR", {
            day: "numeric",
            month: "long",
            year: "numeric",
          }).format(application.createdAt)}
        </p>
        </div>

        <div className="max-w-xl mx-auto space-y-3">
          <p className="text-sm font-semibold text-foreground">
            Etape actuelle :{" "}
            <span className="text-primary">
              {isRejected ? "Decision finale - non retenue" : APPLICATION_STEPS[currentStepIndex].title}
            </span>
          </p>
          <div className="rounded-xl border bg-muted/20 p-4">
            <ol className="space-y-3">
              {APPLICATION_STEPS.map((step, index) => {
                const isDone = !isRejected && index < currentStepIndex;
                const isCurrent = index === currentStepIndex;
                const isFinalRejected = isRejected && index === APPLICATION_STEPS.length - 1;

                return (
                  <li key={step.key} className="flex items-start gap-3">
                    <div className="mt-0.5 shrink-0">
                      {isDone ? (
                        <CheckCircle2 className="h-4 w-4 text-chart-4" />
                      ) : isCurrent || isFinalRejected ? (
                        <CircleDot className={`h-4 w-4 ${isFinalRejected ? "text-destructive" : "text-primary"}`} />
                      ) : (
                        <Circle className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                    <div className="space-y-0.5">
                      <p
                        className={`text-sm font-medium ${
                          isFinalRejected
                            ? "text-destructive"
                            : isCurrent
                              ? "text-primary"
                              : isDone
                                ? "text-foreground"
                                : "text-muted-foreground"
                        }`}
                      >
                        {step.title}
                      </p>
                      <p className="text-xs text-muted-foreground">{step.description}</p>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
