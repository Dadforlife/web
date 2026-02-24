"use client";

import { Heart, Shield, Handshake, Wallet, Target, FileCheck } from "lucide-react";
import { BlurFade } from "@/components/ui/blur-fade";
import { MagicCard } from "@/components/ui/magic-card";
import { BorderBeam } from "@/components/ui/border-beam";

const programmeModules = [
  {
    title: "Stabilisation émotionnelle",
    subtitle: "Retrouver un socle intérieur solide pour avancer avec lucidité.",
    icon: Heart,
    step: "Étape 1",
  },
  {
    title: "Compréhension du cadre parental",
    subtitle: "Connaître vos droits, vos devoirs et le fonctionnement du cadre juridique.",
    icon: Shield,
    step: "Étape 2",
  },
  {
    title: "Communication stratégique",
    subtitle: "Apprendre à échanger avec l\u2019autre parent de manière constructive.",
    icon: Handshake,
    step: "Étape 3",
  },
  {
    title: "Organisation financière",
    subtitle: "Reprendre le contrôle de votre budget et anticiper les charges.",
    icon: Wallet,
    step: "Étape 4",
  },
  {
    title: "Leadership paternel",
    subtitle: "Devenir un père stable, présent et structurant pour vos enfants.",
    icon: Target,
    step: "Étape 5",
  },
  {
    title: "Plan d\u2019action 6 mois",
    subtitle: "Définir des objectifs clairs et un plan concret pour les mois à venir.",
    icon: FileCheck,
    step: "Étape 6",
  },
];

export function SectionProgramme() {
  return (
    <section id="programme" className="py-20 sm:py-28 bg-muted/30 scroll-mt-20">
      <div className="container mx-auto px-4">
        <BlurFade delay={0} inView>
          <div className="text-center mb-16">
            <span className="inline-block text-sm font-semibold text-warm uppercase tracking-wider mb-3">
              L&apos;accompagnement
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground tracking-tight">
              Un parcours en 6 &eacute;tapes
            </h2>
            <p className="text-muted-foreground text-lg mt-4 max-w-2xl mx-auto">
              Chaque &eacute;tape est con&ccedil;ue pour vous faire progresser
              vers la stabilit&eacute; et la s&eacute;r&eacute;nit&eacute;
              dans votre r&ocirc;le de p&egrave;re.
            </p>
          </div>
        </BlurFade>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
          {programmeModules.map((mod, i) => (
            <BlurFade key={i} delay={0.1 + i * 0.08} inView>
              <div className="relative rounded-2xl overflow-hidden h-full">
                <MagicCard
                  className="rounded-2xl h-full"
                  gradientColor="hsl(34, 95%, 52%)"
                  gradientOpacity={0.06}
                  gradientFrom="hsl(34, 95%, 52%)"
                  gradientTo="hsl(218, 55%, 38%)"
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                        <mod.icon className="h-6 w-6 text-primary" />
                      </div>
                      <span className="text-xs font-bold text-warm bg-warm/10 px-3 py-1 rounded-full">
                        {mod.step}
                      </span>
                    </div>
                    <h3 className="font-bold text-lg text-foreground">{mod.title}</h3>
                    <p className="text-muted-foreground text-sm mt-2 leading-relaxed">{mod.subtitle}</p>
                  </div>
                </MagicCard>
                {i === 0 && <BorderBeam size={200} duration={8} />}
              </div>
            </BlurFade>
          ))}
        </div>

        <BlurFade delay={0.6} inView>
          <p className="text-muted-foreground text-center text-sm font-medium mt-10">
            Ce parcours ne constitue pas un conseil juridique. Il vise &agrave; vous
            apporter des rep&egrave;res et un cadre d&apos;accompagnement global.
          </p>
        </BlurFade>
      </div>
    </section>
  );
}
