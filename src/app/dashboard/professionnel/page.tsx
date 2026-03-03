import { requireAuth } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Briefcase,
  FileText,
  CheckCircle,
  Clock,
  AlertTriangle,
  ArrowRight,
  Mail,
  Star,
  ShieldCheck,
} from "lucide-react";

const STATUS_CONFIG: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline"; icon: typeof CheckCircle }> = {
  en_attente: { label: "En attente", variant: "secondary", icon: Clock },
  en_verification: { label: "En v\u00e9rification", variant: "outline", icon: FileText },
  valide: { label: "Valid\u00e9", variant: "default", icon: CheckCircle },
  refuse: { label: "Refus\u00e9", variant: "destructive", icon: AlertTriangle },
  suspendu: { label: "Suspendu", variant: "destructive", icon: AlertTriangle },
};

const ROLE_LABELS: Record<string, string> = {
  avocat: "Avocat",
  mediateur: "M\u00e9diateur",
  coach: "Coach",
  psychologue: "Psychologue",
  benevole: "B\u00e9n\u00e9vole",
};

export default async function ProfessionnelDashboardPage() {
  const user = await requireAuth();

  const [profile, documents, verification, reviews] = await Promise.all([
    prisma.user.findUnique({
      where: { id: user.id },
      select: {
        professionalRole: true,
        professionalStatus: true,
        professionalLevel: true,
        fullName: true,
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

  const status = profile?.professionalStatus ?? "en_attente";
  const statusInfo = STATUS_CONFIG[status] || STATUS_CONFIG.en_attente;
  const StatusIcon = statusInfo.icon;
  const isValidated = status === "valide";
  const hasRole = !!profile?.professionalRole;
  const firstName = profile?.fullName?.split(" ")[0] || "Professionnel";
  const uploadedCount = documents.length;
  const verifiedCount = documents.filter((d) => d.verified).length;

  return (
    <div className="space-y-8 max-w-5xl">
      <div className="space-y-2 animate-fade-in-up">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">
          Bonjour, {firstName}
        </h1>
        <p className="text-muted-foreground">
          Votre espace professionnel partenaire
        </p>
      </div>

      <Card className="rounded-2xl border-t-4 border-t-primary animate-fade-in-up" style={{ animationDelay: "0.05s", animationFillMode: "both" }}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-primary shrink-0" />
            Statut de votre dossier
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-3 gap-6">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium mb-1">Sp&eacute;cialit&eacute;</p>
              <p className="font-semibold">
                {hasRole ? ROLE_LABELS[profile!.professionalRole!] || profile!.professionalRole : "Non renseign\u00e9e"}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium mb-1">Statut</p>
              <Badge variant={statusInfo.variant} className="gap-1">
                <StatusIcon className="h-3.5 w-3.5" />
                {statusInfo.label}
              </Badge>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium mb-1">Niveau</p>
              <p className="font-semibold capitalize">
                {profile?.professionalLevel ?? "R\u00e9f\u00e9rence"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {!hasRole && (
        <div className="rounded-2xl bg-warm/10 border border-warm/20 p-5 flex items-start gap-4 animate-fade-in-up">
          <AlertTriangle className="h-5 w-5 text-warm shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold">Candidature &agrave; compl&eacute;ter</p>
            <p className="text-xs text-muted-foreground mt-1">
              Vous n&apos;avez pas encore soumis votre candidature professionnelle.
              Rendez-vous sur la page de candidature pour choisir votre sp&eacute;cialit&eacute; et d&eacute;marrer le processus de validation.
            </p>
            <Button size="sm" className="mt-3 rounded-xl" asChild>
              <Link href="/dashboard/devenir-professionnel">
                Compléter ma candidature
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <Card className="rounded-2xl hover:shadow-lg transition-shadow animate-fade-in-up" style={{ animationDelay: "0.1s", animationFillMode: "both" }}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Documents
            </CardTitle>
            <FileText className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{uploadedCount}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {verifiedCount} v&eacute;rifi&eacute;(s)
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl hover:shadow-lg transition-shadow animate-fade-in-up" style={{ animationDelay: "0.15s", animationFillMode: "both" }}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Entretien
            </CardTitle>
            <Briefcase className="h-4 w-4 text-warm" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {verification?.interviewCompleted ? "R\u00e9alis\u00e9" : "En attente"}
            </div>
            {verification?.interviewScore && (
              <p className="text-xs text-muted-foreground mt-1">
                Score : {verification.interviewScore}/10
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="rounded-2xl hover:shadow-lg transition-shadow animate-fade-in-up" style={{ animationDelay: "0.2s", animationFillMode: "both" }}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Avis re&ccedil;us
            </CardTitle>
            <Star className="h-4 w-4 text-chart-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reviews._count._all}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Moyenne : {(reviews._avg.rating ?? 0).toFixed(1)}/5
            </p>
          </CardContent>
        </Card>
      </div>

      {isValidated && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Card className="rounded-2xl hover:shadow-lg transition-shadow animate-fade-in-up" style={{ animationDelay: "0.25s", animationFillMode: "both" }}>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Mail className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-sm">Messagerie</p>
                  <p className="text-xs text-muted-foreground">&Eacute;changes avec les membres</p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="rounded-xl w-full" asChild>
                <Link href="/dashboard/messagerie">
                  Ouvrir <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="rounded-2xl hover:shadow-lg transition-shadow animate-fade-in-up" style={{ animationDelay: "0.3s", animationFillMode: "both" }}>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-10 w-10 rounded-xl bg-chart-4/10 flex items-center justify-center">
                  <FileText className="h-5 w-5 text-chart-4" />
                </div>
                <div>
                  <p className="font-semibold text-sm">Mon profil pro</p>
                  <p className="text-xs text-muted-foreground">Documents et validation</p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="rounded-xl w-full" asChild>
                <Link href="/dashboard/profil-pro">
                  G&eacute;rer <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
