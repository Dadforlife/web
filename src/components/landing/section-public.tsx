"use client";

import { BlurFade } from "@/components/ui/blur-fade";
import { MagicCard } from "@/components/ui/magic-card";
import { User, Users, HeartHandshake, Shield } from "lucide-react";

const profils = [
  {
    name: "Papa solo",
    description: "Gérer le quotidien et la parentalité seul",
    icon: User,
  },
  {
    name: "Papa en couple",
    description: "Renforcer son rôle au sein du foyer",
    icon: Users,
  },
  {
    name: "Papa en séparation/divorce",
    description: "Traverser cette épreuve avec force",
    icon: HeartHandshake,
  },
  {
    name: "Père souhaitant progresser",
    description: "Renforcer stabilité et présence",
    icon: Shield,
  },
];

export function SectionPublic() {
  return (
    <section className="py-20 sm:py-28 bg-muted/30" aria-labelledby="public-heading">
      <div className="container mx-auto px-4 max-w-5xl">
        <BlurFade delay={0} inView>
          <div className="text-center mb-14">
            <span className="inline-block text-sm font-semibold text-warm uppercase tracking-wider mb-3">
              Pour toi
            </span>
            <h2
              id="public-heading"
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground tracking-tight"
            >
              À qui s&apos;adresse Papa pour la vie ?
            </h2>
          </div>
        </BlurFade>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-3xl mx-auto" role="list">
          {profils.map((profil, i) => (
            <BlurFade key={profil.name} delay={0.1 + i * 0.1} inView>
              <MagicCard
                className="rounded-2xl h-full"
                gradientColor="hsl(218, 55%, 28%)"
                gradientOpacity={0.06}
                gradientFrom="hsl(218, 55%, 38%)"
                gradientTo="hsl(34, 95%, 52%)"
              >
                <div className="p-6 flex items-start gap-4">
                  <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <profil.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground text-lg">{profil.name}</h3>
                    <p className="text-muted-foreground text-sm mt-1">{profil.description}</p>
                  </div>
                </div>
              </MagicCard>
            </BlurFade>
          ))}
        </div>
      </div>
    </section>
  );
}
