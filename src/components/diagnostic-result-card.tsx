"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Sun,
  Cloud,
  CloudRain,
  AlertTriangle,
  ClipboardList,
  Calendar,
  ArrowRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  getLatestDiagnostic,
  type LatestDiagnostic,
} from "@/app/dashboard/diagnostic/actions";

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
    iconClass: "text-amber-500",
    borderClass: "border-emerald-200 dark:border-emerald-800",
  },
  "Sous tension": {
    label: "Sous tension",
    icon: Cloud,
    bgClass: "bg-amber-50 dark:bg-amber-950/30",
    iconClass: "text-amber-600",
    borderClass: "border-amber-200 dark:border-amber-800",
  },
  "Conflit élevé": {
    label: "Conflit élevé",
    icon: CloudRain,
    bgClass: "bg-orange-50 dark:bg-orange-950/30",
    iconClass: "text-orange-600",
    borderClass: "border-orange-200 dark:border-orange-800",
  },
  "Risque critique": {
    label: "Risque critique",
    icon: AlertTriangle,
    bgClass: "bg-red-50 dark:bg-red-950/30",
    iconClass: "text-red-600",
    borderClass: "border-red-200 dark:border-red-800",
  },
};

function getMeteoConfig(classification: string): MeteoConfig {
  return (
    METEO_BY_CLASSIFICATION[classification] ?? {
      label: classification,
      icon: Cloud,
      bgClass: "bg-muted",
      iconClass: "text-muted-foreground",
      borderClass: "border-border",
    }
  );
}

function formatDiagnosticDate(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return "";
  }
}

interface DiagnosticResultCardProps {
  /** Afficher le lien "Refaire le diagnostic" (page diagnostic) ou "Voir le diagnostic" (dashboard) */
  showLink?: boolean;
  /** Contexte : "dashboard" | "diagnostic" pour adapter le lien et le titre */
  context?: "dashboard" | "diagnostic";
  /** Données passées en prop (évite un fetch si déjà dispo) */
  initialData?: LatestDiagnostic | null;
}

export function DiagnosticResultCard({
  showLink = true,
  context = "dashboard",
  initialData,
}: DiagnosticResultCardProps) {
  const [diagnostic, setDiagnostic] = useState<LatestDiagnostic | null>(
    initialData ?? null
  );
  const [loading, setLoading] = useState(!initialData);

  useEffect(() => {
    if (initialData !== undefined) {
      setDiagnostic(initialData);
      setLoading(false);
      return;
    }
    let cancelled = false;
    getLatestDiagnostic().then((data) => {
      if (!cancelled) {
        setDiagnostic(data);
        setLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [initialData]);

  if (loading) {
    return (
      <Card className="rounded-2xl">
        <CardContent className="py-8">
          <p className="text-center text-sm text-muted-foreground">
            Chargement de ton diagnostic…
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!diagnostic) {
    return (
      <Card className="rounded-2xl border-dashed">
        <CardContent className="py-8 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
            <ClipboardList className="h-6 w-6 text-muted-foreground" />
          </div>
          <p className="mt-3 text-sm font-medium text-foreground">
            Aucun diagnostic enregistré
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Réponds au questionnaire pour obtenir ta météo de situation et un plan d&apos;action personnalisé.
          </p>
          {showLink && (
            <Button asChild className="mt-4" size="sm">
              <Link href="/dashboard/diagnostic">
                Faire le diagnostic <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  const meteo = getMeteoConfig(diagnostic.classification);
  const MeteoIcon = meteo.icon;

  return (
    <Card
      className={`rounded-2xl border ${meteo.borderClass} overflow-hidden`}
    >
      <CardHeader className={`pb-2 ${meteo.bgClass}`}>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${meteo.bgClass} border ${meteo.borderClass}`}
            >
              <MeteoIcon className={`h-7 w-7 ${meteo.iconClass}`} />
            </div>
            <div>
              <CardTitle className="text-base">Météo de situation</CardTitle>
              <p className={`text-sm font-semibold ${meteo.iconClass}`}>
                {meteo.label}
              </p>
              <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                <Calendar className="h-3.5 w-3.5" />
                Diagnostic du {formatDiagnosticDate(diagnostic.created_at)}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Score global</p>
            <p className="text-lg font-bold text-foreground">
              {Number(diagnostic.score_global)}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 pt-4">
        <div>
          <h4 className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <ClipboardList className="h-4 w-4 text-primary" />
            Plan d&apos;action
          </h4>
          <p className="mt-1 text-sm font-medium text-foreground">
            {diagnostic.plan_title}
          </p>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {diagnostic.plan_content}
          </p>
        </div>

        {showLink && (
          <div className="pt-2">
            <Button variant="outline" size="sm" asChild>
              <Link href="/dashboard/diagnostic">
                {context === "diagnostic"
                  ? "Refaire le diagnostic"
                  : "Voir le diagnostic"}
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
