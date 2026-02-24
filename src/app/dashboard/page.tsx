"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  Calendar,
  CheckCircle,
  Clock,
  ArrowRight,
  Users,
  TrendingUp,
  Quote,
} from "lucide-react";
import Link from "next/link";
import { useDashboardUser } from "@/components/dashboard-provider";
import { DiagnosticResultCard } from "@/components/diagnostic-result-card";

const modules = [
  { number: 1, title: "Comprendre la séparation", status: "not_started" },
  { number: 2, title: "Gérer ses émotions", status: "not_started" },
  { number: 3, title: "Droits et devoirs parentaux", status: "not_started" },
  { number: 4, title: "Communication avec l'autre parent", status: "not_started" },
  { number: 5, title: "Construire la coparentalité", status: "not_started" },
  { number: 6, title: "Mon nouveau cadre de vie", status: "not_started" },
];

const nextEvents = [
  {
    title: "Groupe de parole - Gestion du stress",
    date: "Mardi 25 mars, 20h00",
  },
  {
    title: "Visio - Questions juridiques",
    date: "Jeudi 27 mars, 19h00",
  },
];

function getStatusBadge(status: string) {
  switch (status) {
    case "completed":
      return <Badge className="bg-chart-4/20 text-chart-4 hover:bg-chart-4/20 border-0">Terminé</Badge>;
    case "in_progress":
      return <Badge className="bg-warm/20 text-warm hover:bg-warm/20 border-0">En cours</Badge>;
    default:
      return <Badge variant="secondary">À venir</Badge>;
  }
}

function getStatusIcon(status: string) {
  switch (status) {
    case "completed":
      return <CheckCircle className="h-5 w-5 text-chart-4" />;
    case "in_progress":
      return <Clock className="h-5 w-5 text-warm" />;
    default:
      return <div className="h-5 w-5 rounded-full border-2 border-muted-foreground/30" />;
  }
}

export default function DashboardPage() {
  const user = useDashboardUser();
  const firstName = user.fullName?.split(" ")[0] || "Utilisateur";

  const completedCount = modules.filter((m) => m.status === "completed").length;
  const progress = Math.round((completedCount / modules.length) * 100);
  const currentModule = modules.find((m) => m.status === "in_progress");

  return (
    <div className="space-y-8 max-w-6xl">
      {/* En-tête + citation */}
      <div className="space-y-5 animate-fade-in-up">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">
            Bonjour, {firstName}
          </h1>
          <p className="text-muted-foreground mt-1">
            Votre parcours &quot;Père Stable, Enfant Stable&quot;
          </p>
        </div>

        {/* Météo de situation + plan d'action (dernier diagnostic) */}
        <DiagnosticResultCard context="dashboard" showLink />

        {/* Citation motivante */}
        <div className="rounded-2xl bg-primary/5 border border-primary/10 p-5 flex items-start gap-4">
          <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            <Quote className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium italic text-foreground leading-relaxed">
              &quot;Le meilleur cadeau qu&apos;un père puisse faire à ses enfants, c&apos;est sa propre stabilité.&quot;
            </p>
            <p className="text-xs text-muted-foreground mt-2 font-medium">Conseil du jour</p>
          </div>
        </div>
      </div>

      {/* Cartes résumé */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <Card className="rounded-2xl border-t-4 border-t-primary animate-fade-in-up hover:shadow-lg transition-shadow" style={{ animationDelay: "0.1s", animationFillMode: "both" }}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Progression
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{progress}%</div>
            <div className="mt-2 h-2.5 rounded-full bg-muted">
              <div
                className="h-2.5 rounded-full bg-primary animate-progress transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {completedCount}/{modules.length} modules complétés
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-t-4 border-t-warm animate-fade-in-up hover:shadow-lg transition-shadow" style={{ animationDelay: "0.2s", animationFillMode: "both" }}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Module en cours
            </CardTitle>
            <BookOpen className="h-4 w-4 text-warm" />
          </CardHeader>
          <CardContent>
            {currentModule ? (
              <>
                <div className="text-2xl font-bold">Module {currentModule.number}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {currentModule.title}
                </p>
              </>
            ) : (
              <>
                <div className="text-2xl font-bold">Module 1</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Prêt à commencer
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-t-4 border-t-chart-4 animate-fade-in-up hover:shadow-lg transition-shadow" style={{ animationDelay: "0.3s", animationFillMode: "both" }}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Prochaine visio
            </CardTitle>
            <Calendar className="h-4 w-4 text-chart-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Mar. 25</div>
            <p className="text-xs text-muted-foreground mt-1">
              Groupe de parole - 20h00
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Modules */}
        <Card className="rounded-2xl animate-fade-in-up hover:shadow-lg transition-shadow" style={{ animationDelay: "0.2s", animationFillMode: "both" }}>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 shrink-0" />
                Mon programme
              </CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/dashboard/programme">
                  Voir tout <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-1">
            {modules.map((mod) => (
              <div
                key={mod.number}
                className="flex flex-wrap items-center gap-2 sm:gap-3 p-3 rounded-lg hover:bg-muted/80 border-l-2 border-l-transparent hover:border-l-primary transition-all cursor-pointer"
              >
                {getStatusIcon(mod.status)}
                <div className="flex-1">
                  <p className="text-sm font-medium">
                    Module {mod.number} : {mod.title}
                  </p>
                </div>
                {getStatusBadge(mod.status)}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Événements */}
        <Card className="rounded-2xl animate-fade-in-up hover:shadow-lg transition-shadow" style={{ animationDelay: "0.3s", animationFillMode: "both" }}>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 shrink-0" />
                Prochains événements
              </CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/dashboard/calendrier">
                  Voir tout <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {nextEvents.map((event) => (
              <div
                key={event.title}
                className="flex items-start gap-3 p-4 rounded-lg border hover:shadow-sm transition-shadow"
              >
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">{event.title}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {event.date}
                  </p>
                </div>
              </div>
            ))}
            <Button variant="outline" className="w-full" asChild>
              <Link href="/dashboard/calendrier">Voir le calendrier complet</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
