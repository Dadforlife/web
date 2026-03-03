"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  Calendar,
  Target,
  MessageCircle,
  Users,
  CalendarDays,
  ArrowRight,
  HandHeart,
  Sun,
  Cloud,
  CloudRain,
  AlertTriangle,
} from "lucide-react";
import Link from "next/link";
import { DEFAULT_MODULES } from "@/app/dashboard/programme/default-modules";
import type { LatestDiagnostic } from "@/app/dashboard/diagnostic/actions";

const TOTAL_STEPS = 6;
const MODULE_LINKS: Record<number, string> = {
  1: "/formation/module-1",
  2: "/dashboard/programme",
  3: "/dashboard/programme",
  4: "/dashboard/programme",
  5: "/dashboard/programme",
  6: "/dashboard/programme",
};

type MeteoConfig = {
  label: string;
  icon: typeof Sun;
  bgClass: string;
  iconClass: string;
  borderClass: string;
};

const METEO_BY_CLASSIFICATION: Record<string, MeteoConfig> = {
  "Situation maîtrisée": {
    label: "Situation maîtrisée",
    icon: Sun,
    bgClass: "bg-emerald-50 dark:bg-emerald-950/30",
    iconClass: "text-emerald-600 dark:text-emerald-400",
    borderClass: "border-emerald-200 dark:border-emerald-800",
  },
  "Sous tension": {
    label: "Sous tension",
    icon: Cloud,
    bgClass: "bg-amber-50 dark:bg-amber-950/30",
    iconClass: "text-amber-600 dark:text-amber-400",
    borderClass: "border-amber-200 dark:border-amber-800",
  },
  "Conflit élevé": {
    label: "Conflit élevé",
    icon: CloudRain,
    bgClass: "bg-orange-50 dark:bg-orange-950/30",
    iconClass: "text-orange-600 dark:text-orange-400",
    borderClass: "border-orange-200 dark:border-orange-800",
  },
  "Risque critique": {
    label: "Risque critique",
    icon: AlertTriangle,
    bgClass: "bg-red-50 dark:bg-red-950/30",
    iconClass: "text-red-600 dark:text-red-400",
    borderClass: "border-red-200 dark:border-red-800",
  },
};

function getMeteoConfig(classification: string): MeteoConfig {
  return (
    METEO_BY_CLASSIFICATION[classification] ?? {
      label: classification,
      icon: Cloud,
      bgClass: "bg-muted/50",
      iconClass: "text-muted-foreground",
      borderClass: "border-border",
    }
  );
}

export type NextAppointment = {
  id: string;
  scheduledAt: string;
  type: string;
  duration: number;
  volunteerName?: string;
};

export type DashboardTask = {
  id: string;
  title: string;
  deadline: string;
  href: string;
};

type PapaDashboardContentProps = {
  firstName: string;
  diagnostic: LatestDiagnostic | null;
  nextAppointment: NextAppointment | null;
  task: DashboardTask | null;
  /** Nombre d'étapes validées (0–6) pour la progression */
  stepsValidated: number;
  /** Index du module en cours (1–6), 0 = aucun */
  currentModuleIndex: number;
};

export function PapaDashboardContent({
  firstName,
  diagnostic,
  nextAppointment,
  task,
  stepsValidated,
  currentModuleIndex,
}: PapaDashboardContentProps) {
  const currentModule = DEFAULT_MODULES[currentModuleIndex] ?? DEFAULT_MODULES[0];
  const nextActionModule = currentModuleIndex === 0 ? DEFAULT_MODULES[0] : DEFAULT_MODULES[currentModuleIndex];
  const nextActionLabel =
    currentModuleIndex === 0 ? "Commencer le module 1" : `Continuer le module ${nextActionModule.number}`;
  const nextActionHref = MODULE_LINKS[nextActionModule.number] ?? "/dashboard/programme";

  const meteo = diagnostic ? getMeteoConfig(diagnostic.classification) : null;
  const MeteoIcon = meteo?.icon ?? Cloud;

  return (
    <div className="space-y-10 max-w-4xl">
      {/* ————————————————— SECTION 1 : HERO — TON CAP ————————————————— */}
      <section className="space-y-6 animate-fade-in-up">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">
            Bonjour, {firstName} 👋
          </h1>
          <p className="text-muted-foreground mt-1">Voici ton cap cette semaine</p>
        </div>

        {/* Carte score + interprétation */}
        {diagnostic ? (
          <Card
            className={`rounded-2xl border overflow-hidden ${meteo ? meteo.borderClass : ""} ${meteo ? meteo.bgClass : ""}`}
          >
            <CardContent className="p-5">
              <div className="flex flex-wrap items-center gap-4">
                <div
                  className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border ${meteo?.borderClass ?? "border-border"} ${meteo?.bgClass ?? "bg-muted/50"}`}
                >
                  <MeteoIcon className={`h-8 w-8 ${meteo?.iconClass ?? "text-muted-foreground"}`} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-muted-foreground">Score global</p>
                  <p className="text-2xl font-bold text-foreground">{Number(diagnostic.score_global)}</p>
                  <p className={`text-sm font-semibold mt-0.5 ${meteo?.iconClass ?? "text-foreground"}`}>
                    {meteo?.label ?? diagnostic.classification}
                  </p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
                {diagnostic.plan_title}. {diagnostic.plan_content.slice(0, 120)}
                {diagnostic.plan_content.length > 120 ? "…" : ""}
              </p>
            </CardContent>
          </Card>
        ) : (
          <Card className="rounded-2xl border border-dashed bg-muted/30">
            <CardContent className="p-6 text-center">
              <p className="text-sm text-muted-foreground">
                Fais ton évaluation pour obtenir ton cap et un plan d&apos;action personnalisé.
              </p>
              <Button asChild variant="outline" size="sm" className="mt-3">
                <Link href="/dashboard/diagnostic">Faire l&apos;évaluation</Link>
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Bloc dominant : Prochaine action recommandée — CTA principal unique */}
        <div className="rounded-2xl border-2 border-primary/20 bg-primary/5 p-6 space-y-4">
          <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <Target className="h-4 w-4 text-primary" />
            Prochaine action recommandée
          </p>
          <div>
            <h2 className="text-xl font-bold text-foreground">{nextActionLabel}</h2>
            <p className="text-sm text-muted-foreground mt-1">
              {nextActionModule.duration} · {nextActionModule.description.slice(0, 80)}
              {nextActionModule.description.length > 80 ? "…" : ""}
            </p>
          </div>
          <Button asChild size="lg" className="w-full sm:w-auto min-w-[220px] rounded-xl text-base font-semibold h-12 shadow-lg">
            <Link href={nextActionHref}>
              Commencer maintenant
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* ————————————————— SECTION 2 : CE QUE TU FAIS MAINTENANT ————————————————— */}
      <section className="space-y-4 animate-fade-in-up" style={{ animationDelay: "0.05s", animationFillMode: "both" }}>
        <h2 className="text-lg font-semibold text-foreground">Ce que tu fais maintenant</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* 1) Module en cours */}
          <Card className="rounded-2xl border-t-4 border-t-primary">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-primary" />
                Module en cours
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="font-semibold text-foreground">
                Module {currentModule.number} : {currentModule.title}
              </p>
              <p className="text-xs text-muted-foreground">{currentModule.duration} · {currentModule.description.slice(0, 50)}…</p>
              <Button asChild variant="secondary" size="sm" className="rounded-xl w-full sm:w-auto">
                <Link href={MODULE_LINKS[currentModule.number] ?? "/dashboard/programme"}>
                  <span className="inline-flex items-center gap-1.5">
                    Continuer
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* 2) Prochaine visio */}
          <Card className="rounded-2xl border-t-4 border-t-chart-4">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Calendar className="h-4 w-4 text-chart-4" />
                Prochaine visio
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {nextAppointment ? (
                <>
                  <p className="font-semibold text-foreground">
                    {new Date(nextAppointment.scheduledAt).toLocaleDateString("fr-FR", {
                      weekday: "short",
                      day: "numeric",
                      month: "short",
                    })}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(nextAppointment.scheduledAt).toLocaleTimeString("fr-FR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                    {" · "}
                    {nextAppointment.type === "accompagnement_terrain" ? "Accompagnement" : "Téléphonique"}
                  </p>
                  <Button asChild variant="secondary" size="sm" className="rounded-xl w-full sm:w-auto">
                    <Link href="/dashboard/programme">Voir les détails</Link>
                  </Button>
                </>
              ) : (
                <>
                  <p className="text-sm text-muted-foreground">Aucune visio planifiée</p>
                  <Button asChild variant="secondary" size="sm" className="rounded-xl w-full sm:w-auto">
                    <Link href="/dashboard/programme">Voir le programme</Link>
                  </Button>
                </>
              )}
            </CardContent>
          </Card>

          {/* 3) Tâche importante — affichée seulement si une tâche existe */}
          {task && (
            <Card className="rounded-2xl border-t-4 border-t-warm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Tâche importante
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="font-semibold text-foreground">{task.title}</p>
                <p className="text-xs text-muted-foreground">
                  Avant le {new Date(task.deadline).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" })}
                </p>
                <Button asChild variant="secondary" size="sm" className="rounded-xl w-full sm:w-auto">
                  <Link href={task.href}>Traiter</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      {/* ————————————————— SECTION 3 : TA PROGRESSION ————————————————— */}
      <section className="animate-fade-in-up" style={{ animationDelay: "0.1s", animationFillMode: "both" }}>
        <Card className="rounded-2xl overflow-hidden">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-foreground">
              Tu construis ta stabilité pas à pas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex-1 h-3 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-500"
                  style={{ width: `${Math.round((stepsValidated / TOTAL_STEPS) * 100)}%` }}
                />
              </div>
              <span className="text-sm font-semibold text-muted-foreground tabular-nums shrink-0">
                {stepsValidated} / {TOTAL_STEPS} étapes validées
              </span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Chaque étape validée renforce ta stabilité et celle de ton enfant.
            </p>
          </CardContent>
        </Card>
      </section>

      {/* ————————————————— SECTION 4 : COMMUNAUTÉ & SOUTIEN ————————————————— */}
      <section className="animate-fade-in-up" style={{ animationDelay: "0.15s", animationFillMode: "both" }}>
        <h2 className="text-lg font-semibold text-foreground mb-4">Tu n&apos;es pas seul</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Button asChild variant="outline" className="h-auto py-4 px-4 rounded-xl justify-start gap-3" size="lg">
            <Link href="/espace-papas">
              <Users className="h-5 w-5 shrink-0 text-primary" />
              Accéder à l&apos;Espace Papas
            </Link>
          </Button>
          <Button asChild variant="outline" className="h-auto py-4 px-4 rounded-xl justify-start gap-3" size="lg">
            <Link href="/dashboard/messagerie">
              <MessageCircle className="h-5 w-5 shrink-0 text-primary" />
              Envoyer un message
            </Link>
          </Button>
          <Button asChild variant="outline" className="h-auto py-4 px-4 rounded-xl justify-start gap-3" size="lg">
            <Link href="/dashboard/programme">
              <CalendarDays className="h-5 w-5 shrink-0 text-primary" />
              Voir les prochains groupes
            </Link>
          </Button>
        </div>
      </section>

      {/* ————————————————— SECTION 5 : ÉVOLUTION (en bas) ————————————————— */}
      <section
        className="pt-6 border-t border-border animate-fade-in-up"
        style={{ animationDelay: "0.2s", animationFillMode: "both" }}
      >
        <div className="rounded-xl bg-muted/50 border border-border/80 p-5 flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex-1">
            <p className="text-sm text-muted-foreground leading-relaxed">
              Quand tu te sentiras prêt, tu pourras aider d&apos;autres papas.
            </p>
          </div>
          <Button asChild variant="secondary" size="sm" className="rounded-xl shrink-0">
            <Link href="/dashboard/devenir-benevole">
              En savoir plus sur le bénévolat
              <HandHeart className="ml-1.5 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
