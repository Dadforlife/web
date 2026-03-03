"use client";

import { BlurFade } from "@/components/ui/blur-fade";
import { MagicCard } from "@/components/ui/magic-card";
import {
  HeartCrack,
  Baby,
  Receipt,
  Unlink,
  UserX,
} from "lucide-react";

const constatItems = [
  {
    text: "Une séparation ou un divorce qui bouleverse vos repères",
    icon: HeartCrack,
  },
  {
    text: "La difficulté d\u2019organiser votre quotidien de père solo",
    icon: Baby,
  },
  {
    text: "Une pression financière ou administrative pesante",
    icon: Receipt,
  },
  {
    text: "Des obstacles pour maintenir un lien fort avec vos enfants",
    icon: Unlink,
  },
  {
    text: "Un sentiment d\u2019isolement face à votre situation",
    icon: UserX,
  },
];

export function SectionConstat() {
  return (
    <section id="constat" className="py-20 sm:py-28 bg-muted/30 scroll-mt-20" aria-labelledby="constat-heading">
      <div className="container mx-auto px-4 max-w-5xl">
        <BlurFade delay={0} inView>
          <div className="text-center mb-14">
            <span className="inline-block text-sm font-semibold text-warm uppercase tracking-wider mb-3">
              Le constat
            </span>
            <h2
              id="constat-heading"
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground tracking-tight"
            >
              Vous traversez peut-&ecirc;tre
            </h2>
            <p className="text-muted-foreground text-lg mt-4 max-w-2xl mx-auto">
              Ces situations sont fr&eacute;quentes et l&eacute;gitimes. Vous n&apos;&ecirc;tes pas seul.
            </p>
          </div>
        </BlurFade>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {constatItems.map((item, i) => (
            <BlurFade key={i} delay={0.1 + i * 0.08} inView>
              <MagicCard
                className="rounded-2xl h-full"
                gradientColor="hsl(218, 55%, 28%)"
                gradientOpacity={0.08}
                gradientFrom="hsl(218, 55%, 38%)"
                gradientTo="hsl(34, 95%, 52%)"
              >
                <div className="p-6 flex items-start gap-4">
                  <div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <item.icon className="h-5 w-5 text-primary" />
                  </div>
                  <p className="text-foreground font-medium leading-relaxed">
                    {item.text}
                  </p>
                </div>
              </MagicCard>
            </BlurFade>
          ))}
        </div>

        <BlurFade delay={0.6} inView>
          <div className="mt-14 text-center space-y-3">
            <p className="text-foreground text-xl font-semibold">
              Quelle que soit votre situation familiale, Papa pour la vie est l&agrave; pour vous accompagner.
            </p>
            <p className="text-muted-foreground text-lg">
              Avec m&eacute;thode, respect et discr&eacute;tion.
            </p>
          </div>
        </BlurFade>
      </div>
    </section>
  );
}
