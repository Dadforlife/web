"use client";

import { BlurFade } from "@/components/ui/blur-fade";
import { MagicCard } from "@/components/ui/magic-card";
import { Heart, Shield, MessageCircle, Wallet, Users } from "lucide-react";

const missionItems = [
  {
    icon: Heart,
    title: "Stabilisation émotionnelle",
    description: "Vous aider à retrouver un équilibre intérieur pour prendre des décisions éclairées.",
  },
  {
    icon: Shield,
    title: "Cadre parental",
    description: "Comprendre vos droits et devoirs pour structurer votre rôle de père.",
  },
  {
    icon: MessageCircle,
    title: "Communication apaisée",
    description: "Développer une communication constructive avec l\u2019autre parent, sans escalade.",
  },
  {
    icon: Wallet,
    title: "Organisation financière",
    description: "Reprendre le contrôle de votre budget et anticiper les charges liées à la parentalité.",
  },
  {
    icon: Users,
    title: "Maintien du lien parent-enfant",
    description: "Préserver et renforcer votre présence auprès de vos enfants, au quotidien.",
  },
];

export function SectionMission() {
  return (
    <section id="mission" className="py-20 sm:py-28 relative overflow-hidden scroll-mt-20">
      <div className="absolute inset-0 gradient-mesh" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/[0.03] blur-[120px]" />

      <div className="relative container mx-auto px-4 max-w-5xl">
        <BlurFade delay={0} inView>
          <div className="text-center mb-14">
            <span className="inline-block text-sm font-semibold text-warm uppercase tracking-wider mb-3">
              Notre mission
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground tracking-tight">
              Ce que Papa pour la vie vous apporte
            </h2>
            <p className="text-muted-foreground text-lg mt-4 max-w-2xl mx-auto">
              Un accompagnement global, structur&eacute; autour de cinq axes essentiels
              pour tout p&egrave;re en qu&ecirc;te de stabilit&eacute;.
            </p>
          </div>
        </BlurFade>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-4xl mx-auto mb-14">
          {missionItems.map((item, i) => (
            <BlurFade key={i} delay={0.1 + i * 0.08} inView>
              <MagicCard
                className="rounded-2xl h-full"
                gradientColor="hsl(218, 55%, 28%)"
                gradientOpacity={0.06}
                gradientFrom="hsl(218, 55%, 38%)"
                gradientTo="hsl(34, 95%, 52%)"
              >
                <div className="p-6">
                  <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <item.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-bold text-foreground text-lg mb-2">{item.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </MagicCard>
            </BlurFade>
          ))}
        </div>

        <BlurFade delay={0.7} inView>
          <div className="text-center">
            <p className="text-2xl md:text-3xl font-bold text-foreground">
              Un p&egrave;re stable aujourd&apos;hui,{" "}
              <span className="gradient-text">un enfant plus &eacute;quilibr&eacute; demain.</span>
            </p>
          </div>
        </BlurFade>
      </div>
    </section>
  );
}
