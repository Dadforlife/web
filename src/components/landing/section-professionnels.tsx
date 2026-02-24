"use client";

import { BlurFade } from "@/components/ui/blur-fade";
import { Scale, Users, Coins, Brain, Heart } from "lucide-react";
import { MagicCard } from "@/components/ui/magic-card";

const professionnels = [
  {
    name: "Avocats en droit de la famille",
    description: "Conseil juridique spécialisé en séparation, divorce et garde d\u2019enfants.",
    icon: Scale,
  },
  {
    name: "Médiateurs familiaux",
    description: "Facilitation du dialogue entre les parents pour des accords durables.",
    icon: Users,
  },
  {
    name: "Experts financiers",
    description: "Accompagnement budgétaire et anticipation des charges parentales.",
    icon: Coins,
  },
  {
    name: "Coachs parentaux",
    description: "Soutien individuel pour renforcer votre posture de père.",
    icon: Brain,
  },
  {
    name: "Psychologues",
    description: "Écoute et accompagnement émotionnel dans les moments difficiles.",
    icon: Heart,
  },
];

export function SectionProfessionnels() {
  return (
    <section id="professionnels" className="py-20 sm:py-28 bg-muted/30 scroll-mt-20">
      <div className="container mx-auto px-4 max-w-5xl">
        <BlurFade delay={0} inView>
          <div className="text-center mb-14">
            <span className="inline-block text-sm font-semibold text-warm uppercase tracking-wider mb-3">
              R&eacute;seau de partenaires
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground tracking-tight">
              Un annuaire de professionnels qualifi&eacute;s
            </h2>
            <p className="text-muted-foreground text-lg mt-4 max-w-2xl mx-auto">
              Dad for Life s&apos;appuie sur un r&eacute;seau de partenaires
              s&eacute;lectionn&eacute;s pour vous orienter vers les bons interlocuteurs.
            </p>
          </div>
        </BlurFade>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-4xl mx-auto mb-10">
          {professionnels.map((item, i) => (
            <BlurFade key={i} delay={0.1 + i * 0.08} inView>
              <MagicCard
                className="rounded-2xl h-full"
                gradientColor="hsl(218, 55%, 28%)"
                gradientOpacity={0.06}
                gradientFrom="hsl(218, 55%, 38%)"
                gradientTo="hsl(34, 95%, 52%)"
              >
                <div className="p-6">
                  <div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <item.icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-1">{item.name}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                </div>
              </MagicCard>
            </BlurFade>
          ))}
        </div>

        <BlurFade delay={0.5} inView>
          <p className="text-muted-foreground text-center text-sm font-medium">
            L&apos;acc&egrave;s &agrave; l&apos;annuaire est r&eacute;serv&eacute; aux
            membres ayant r&eacute;alis&eacute; leur diagnostic.
          </p>
        </BlurFade>
      </div>
    </section>
  );
}
