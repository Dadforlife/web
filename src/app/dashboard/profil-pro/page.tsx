import { requireAuth } from "@/lib/auth-helpers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProfessionalLevelBadge } from "@/components/professional-level-badge";
import { ProfessionalStatusBadge } from "@/components/professional-status-badge";
import { getRequiredDocuments } from "@/lib/professional-validation";

const ROLE_LABELS: Record<string, string> = {
  benevole: "Bénévole",
  avocat: "Avocat",
  mediateur: "Médiateur",
  coach: "Coach",
  psychologue: "Psychologue",
};

export default async function DashboardProfilProPage() {
  const user = await requireAuth();

  // Redirect non-professionals to the application page
  if (!user.professionalRole && !user.professionalStatus) {
    redirect("/dashboard/devenir-professionnel");
  }

  const [profile, documents, verification, reviews] = await Promise.all([
    prisma.user.findUnique({
      where: { id: user.id },
      select: {
        professionalRole: true,
        professionalStatus: true,
        professionalLevel: true,
      },
    }),
    prisma.professionalDocument.findMany({
      where: { userId: user.id },
      select: { documentType: true, verified: true },
    }),
    prisma.professionalVerification.findUnique({
      where: { userId: user.id },
      select: {
        interviewCompleted: true,
        interviewScore: true,
      },
    }),
    prisma.professionalReview.aggregate({
      where: { professionalId: user.id },
      _avg: { rating: true },
      _count: { _all: true },
    }),
  ]);

  const required = getRequiredDocuments();
  const uploaded = new Set(documents.map((d) => d.documentType));
  const verified = new Set(documents.filter((d) => d.verified).map((d) => d.documentType));
  const progressValue = Math.round(
    ((required.filter((doc) => uploaded.has(doc)).length +
      required.filter((doc) => verified.has(doc)).length +
      (verification?.interviewCompleted ? 1 : 0)) /
      (required.length * 2 + 1)) *
      100,
  );

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold">Profil professionnel</h1>
        <p className="text-muted-foreground text-sm">
          Suivi de votre dossier, niveau et validation.
        </p>
      </div>

      <Card>
        <CardContent className="pt-6 grid sm:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Role</p>
            <p className="font-medium">
              {profile?.professionalRole ? ROLE_LABELS[profile.professionalRole] : "Non renseigne"}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Statut</p>
            <ProfessionalStatusBadge status={profile?.professionalStatus ?? null} />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Badge</p>
            <ProfessionalLevelBadge level={profile?.professionalLevel ?? null} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Progression de validation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="h-3 rounded-full bg-muted">
            <div
              className="h-3 rounded-full bg-primary transition-all"
              style={{ width: `${progressValue}%` }}
            />
          </div>
          <p className="text-sm text-muted-foreground">{progressValue}% complete</p>
          <p className="text-sm">
            Documents obligatoires: {required.filter((doc) => uploaded.has(doc)).length}/{required.length}
          </p>
          <p className="text-sm">
            Documents verifies: {required.filter((doc) => verified.has(doc)).length}/{required.length}
          </p>
          <p className="text-sm">
            Entretien: {verification?.interviewCompleted ? "Realise" : "En attente"}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Qualite de service</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm">
            Avis recus: {reviews._count._all} - Note moyenne: {(reviews._avg.rating ?? 0).toFixed(1)}/5
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Le niveau Expert est attribue automatiquement a partir de 5 avis positifs et une moyenne &gt; 4/5.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

