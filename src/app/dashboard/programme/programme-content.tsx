"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Play, FileText, Video } from "lucide-react";

export interface ProgrammeModuleDisplay {
  number: number;
  title: string;
  description: string;
  duration: string;
  hasVideo: boolean;
  hasText: boolean;
  checklist: string[];
  status: "not_started" | "in_progress" | "completed";
}

function getStatusConfig(status: string) {
  switch (status) {
    case "completed":
      return {
        badge: <Badge className="bg-chart-4/20 text-chart-4 hover:bg-chart-4/20 border-0">Terminé</Badge>,
        dotClass: "bg-chart-4 border-chart-4",
        cardClass: "border-chart-4/30 bg-chart-4/5",
      };
    case "in_progress":
      return {
        badge: <Badge className="bg-warm/20 text-warm hover:bg-warm/20 border-0">En cours</Badge>,
        dotClass: "bg-warm border-warm ring-4 ring-warm/20",
        cardClass: "border-warm/30 bg-warm/5 shadow-md",
      };
    default:
      return {
        badge: <Badge variant="secondary">Verrouillé</Badge>,
        dotClass: "bg-muted border-muted-foreground/30",
        cardClass: "opacity-60",
      };
  }
}

export function ProgrammeContent({ modules }: { modules: ProgrammeModuleDisplay[] }) {
  const completedCount = modules.filter((m) => m.status === "completed").length;
  const progress = modules.length ? Math.round((completedCount / modules.length) * 100) : 0;

  return (
    <div className="space-y-8 max-w-4xl">
      {/* En-tête */}
      <div className="space-y-5 animate-fade-in-up">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">
          Programme &quot;Père Stable, Enfant Stable&quot;
        </h1>
        <p className="text-muted-foreground">
          Un parcours de 6 semaines structuré pour vous accompagner vers une
          coparentalité sereine et stable.
        </p>

        {/* Barre de progression */}
        <div className="flex items-center gap-4 max-w-md">
          <div className="flex-1 h-3 rounded-full bg-muted overflow-hidden">
            <div
              className="h-3 rounded-full bg-primary animate-progress transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-sm font-semibold text-muted-foreground tabular-nums">
            {progress}%
          </span>
        </div>
      </div>

      {/* Timeline verticale */}
      <div className="relative space-y-6 pl-6 sm:pl-8">
        <div className="absolute left-[0.5rem] sm:left-[0.9375rem] top-4 bottom-4 w-0.5 bg-border" />

        {modules.map((mod, index) => {
          const config = getStatusConfig(mod.status);
          return (
            <div
              key={mod.number}
              className="relative animate-fade-in-up"
              style={{ animationDelay: `${index * 0.06}s`, animationFillMode: "both" }}
            >
              <div
                className={`absolute -left-6 sm:-left-8 top-6 sm:top-8 h-4 w-4 rounded-full border-2 z-10 ${config.dotClass}`}
              />

              <Card className={`rounded-2xl ${config.cardClass}`}>
                <CardHeader>
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div className="space-y-1 min-w-0 flex-1">
                      <CardTitle className="text-lg sm:text-xl">
                        Module {mod.number} : {mod.title}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {mod.description}
                      </p>
                      <div className="flex flex-wrap items-center gap-2 sm:gap-4 pt-2">
                        <Badge variant="outline" className="text-xs">
                          <Clock className="h-3 w-3 mr-1" />
                          {mod.duration}
                        </Badge>
                        {mod.hasVideo && (
                          <span className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Video className="h-3 w-3" />
                            Vidéo
                          </span>
                        )}
                        {mod.hasText && (
                          <span className="flex items-center gap-1 text-xs text-muted-foreground">
                            <FileText className="h-3 w-3" />
                            Texte
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="shrink-0">{config.badge}</div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <p className="text-sm font-medium text-foreground">
                      Checklist :
                    </p>
                    {mod.checklist.map((item, i) => (
                      <label
                        key={i}
                        className="flex items-center gap-3 text-sm text-muted-foreground"
                      >
                        <input
                          type="checkbox"
                          disabled={mod.status === "not_started"}
                          defaultChecked={mod.status === "completed"}
                          className="rounded border-muted-foreground/30 text-primary focus:ring-primary"
                        />
                        {item}
                      </label>
                    ))}
                    {mod.status === "in_progress" && (
                      <Button className="mt-4" size="sm">
                        <Play className="mr-2 h-4 w-4" />
                        Continuer le module
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          );
        })}
      </div>
    </div>
  );
}
