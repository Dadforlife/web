import { requireAuth, hasRole } from "@/lib/auth-helpers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { ProfessionalApplicationForm } from "./professional-application-form";
import {
  CheckCircle2,
  Clock,
  FileSearch,
  Shield,
  Users,
  Scale,
  Heart,
} from "lucide-react";

const ROLE_LABELS: Record<string, string> = {
  avocat: "Avocat",
  mediateur: "Médiateur",
  coach: "Coach",
  psychologue: "Psychologue",
};

export default async function DevenirProfessionnelPage() {
  const user = await requireAuth();

  if (hasRole(user, "partner")) {
    redirect("/dashboard/professionnel");
  }

  if (hasRole(user, "volunteer")) {
    redirect("/dashboard");
  }

  const existing = await prisma.professionalVerification.findUnique({
    where: { userId: user.id },
  });

  const currentStatus = user.professionalStatus;
  const hasActiveApplication =
    currentStatus === "en_attente" ||
    currentStatus === "en_verification" ||
    currentStatus === "valide";

  if (hasActiveApplication && existing) {
    const steps = [
      {
        label: "Candidature soumise",
        description: "Votre dossier a été reçu",
        icon: CheckCircle2,
        done: true,
      },
      {
        label: "Vérification",
        description: "Examen de vos documents et qualifications",
        icon: FileSearch,
        done: currentStatus === "en_verification" || currentStatus === "valide",
        active: currentStatus === "en_attente",
      },
      {
        label: "Validation",
        description: "Entretien et activation de votre profil",
        icon: Shield,
        done: currentStatus === "valide",
        active: currentStatus === "en_verification",
      },
    ];

    return (
      <div className="max-w-2xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Candidature professionnel</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Suivez l&apos;avancement de votre dossier en temps réel.
          </p>
        </div>

        <Card className="rounded-2xl overflow-hidden">
          <div className="bg-primary/5 border-b border-primary/10 p-5">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Scale className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-foreground">
                  {user.professionalRole
                    ? ROLE_LABELS[user.professionalRole] || user.professionalRole
                    : "Spécialité non renseignée"}
                </p>
                {existing.officialRegistrationNumber && (
                  <p className="text-xs text-muted-foreground">
                    N° {existing.officialRegistrationNumber}
                  </p>
                )}
              </div>
            </div>
          </div>
          <CardContent className="p-5 space-y-5">
            {/* Étapes de progression */}
            <div className="space-y-4">
              {steps.map((step, i) => {
                const StepIcon = step.icon;
                return (
                  <div key={step.label} className="flex items-start gap-4">
                    <div className="flex flex-col items-center">
                      <div
                        className={`h-9 w-9 rounded-full flex items-center justify-center shrink-0 ${
                          step.done
                            ? "bg-primary text-primary-foreground"
                            : step.active
                              ? "bg-primary/15 text-primary ring-2 ring-primary/30"
                              : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {step.done ? (
                          <CheckCircle2 className="h-4 w-4" />
                        ) : step.active ? (
                          <Clock className="h-4 w-4 animate-pulse" />
                        ) : (
                          <StepIcon className="h-4 w-4" />
                        )}
                      </div>
                      {i < steps.length - 1 && (
                        <div
                          className={`w-0.5 h-8 mt-1 rounded-full ${
                            step.done ? "bg-primary" : "bg-muted"
                          }`}
                        />
                      )}
                    </div>
                    <div className="pt-1">
                      <p
                        className={`text-sm font-semibold ${
                          step.done
                            ? "text-primary"
                            : step.active
                              ? "text-foreground"
                              : "text-muted-foreground"
                        }`}
                      >
                        {step.label}
                        {step.active && (
                          <span className="ml-2 text-xs font-normal text-muted-foreground">
                            — En cours
                          </span>
                        )}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {step.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="rounded-xl bg-muted/50 p-4 text-sm text-muted-foreground">
              <p>
                💡 Vous recevrez une notification à chaque étape du processus.
                L&apos;équipe examine les candidatures sous 48h en moyenne.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Devenir professionnel partenaire</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Rejoignez notre réseau et accompagnez les pères dans leur parcours
          familial.
        </p>
      </div>

      {/* Avantages */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Card className="rounded-xl border-primary/10 bg-primary/5">
          <CardContent className="flex items-center gap-3 py-3">
            <Users className="h-5 w-5 text-primary shrink-0" />
            <div>
              <p className="text-sm font-semibold text-foreground">
                Visibilité
              </p>
              <p className="text-xs text-muted-foreground">
                Référencé dans notre annuaire
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-xl border-primary/10 bg-primary/5">
          <CardContent className="flex items-center gap-3 py-3">
            <Heart className="h-5 w-5 text-primary shrink-0" />
            <div>
              <p className="text-sm font-semibold text-foreground">Impact</p>
              <p className="text-xs text-muted-foreground">
                Aidez des pères en difficulté
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-xl border-primary/10 bg-primary/5">
          <CardContent className="flex items-center gap-3 py-3">
            <Shield className="h-5 w-5 text-primary shrink-0" />
            <div>
              <p className="text-sm font-semibold text-foreground">
                Confiance
              </p>
              <p className="text-xs text-muted-foreground">
                Profil vérifié et badge Expert
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <ProfessionalApplicationForm />
    </div>
  );
}
