"use client";

import { BlurFade } from "@/components/ui/blur-fade";
import { UserPlus, ClipboardCheck, Route } from "lucide-react";

const steps = [
  {
    icon: UserPlus,
    title: "Adhésion gratuite",
    description:
      "Votre inscription est entièrement gratuite et sans engagement. Vous accédez immédiatement à l\u2019espace membre.",
    accent: "primary",
  },
  {
    icon: ClipboardCheck,
    title: "Évaluation obligatoire",
    description:
      "Un entretien initial permet d\u2019évaluer votre situation personnelle et de définir vos besoins prioritaires.",
    accent: "warm",
  },
  {
    icon: Route,
    title: "Orientation personnalisée",
    description:
      "Sur la base de l'évaluation, vous êtes orienté vers les ressources et les professionnels adaptés à votre situation.",
    accent: "chart-2",
  },
];

const accentClasses: Record<string, { border: string; bg: string; icon: string }> = {
  primary: {
    border: "border-l-4 border-l-primary",
    bg: "bg-primary/10",
    icon: "text-primary",
  },
  warm: {
    border: "border-l-4 border-l-warm",
    bg: "bg-warm/10",
    icon: "text-warm",
  },
  "chart-2": {
    border: "border-l-4 border-l-chart-2",
    bg: "bg-chart-2/10",
    icon: "text-chart-2",
  },
};

export function SectionFonctionnement() {
  return (
    <section id="fonctionnement" className="py-20 sm:py-28 relative overflow-hidden scroll-mt-20">
      <div className="absolute inset-0 gradient-mesh" />
      <div className="absolute left-1/2 top-20 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-primary/[0.04] blur-[110px]" />

      <div className="relative container mx-auto px-4 max-w-5xl">
        <BlurFade delay={0} inView>
          <div className="text-center mb-14">
            <span className="inline-block text-sm font-semibold text-warm uppercase tracking-wider mb-3">
              Comment &ccedil;a fonctionne
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground tracking-tight">
              Une m&eacute;thode claire en 3 &eacute;tapes
            </h2>
            <p className="text-muted-foreground text-lg mt-4 max-w-2xl mx-auto">
              Chaque &eacute;tape est pens&eacute;e pour vous faire avancer rapidement,
              avec un accompagnement humain, discret et orient&eacute; r&eacute;sultats.
            </p>
          </div>
        </BlurFade>

        <div className="relative space-y-5 max-w-3xl mx-auto">
          <div className="absolute left-[33px] top-10 bottom-10 w-px bg-gradient-to-b from-primary/30 via-warm/20 to-chart-2/30" />
          {steps.map((step, i) => {
            const classes = accentClasses[step.accent];
            return (
              <BlurFade key={i} delay={0.15 + i * 0.12} inView>
                <div
                  className={`relative flex items-start gap-5 rounded-2xl border border-border/60 bg-card/85 backdrop-blur-sm p-6 shadow-sm ${classes.border} hover:shadow-md transition-all hover:-translate-y-0.5`}
                >
                  <div className="flex flex-col items-center gap-2 shrink-0">
                    <span className="text-xs font-bold text-muted-foreground">0{i + 1}</span>
                    <div
                      className={`h-12 w-12 rounded-xl ${classes.bg} ring-1 ring-border/50 flex items-center justify-center`}
                    >
                      <step.icon className={`h-6 w-6 ${classes.icon}`} />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground text-lg mb-1">{step.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              </BlurFade>
            );
          })}
        </div>

        <BlurFade delay={0.5} inView>
          <div className="mt-10 flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <span className="inline-block h-2 w-2 rounded-full bg-chart-4" />
            <span>Adh&eacute;sion gratuite</span>
            <span className="text-border">•</span>
            <span>&Eacute;valuation confidentielle</span>
            <span className="text-border">•</span>
            <span>Orientation personnalis&eacute;e</span>
          </div>
        </BlurFade>
      </div>
    </section>
  );
}
