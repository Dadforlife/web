"use client";

import Link from "next/link";
import { Users, Video, Calendar, Heart } from "lucide-react";
import { BlurFade } from "@/components/ui/blur-fade";
import { MagicCard } from "@/components/ui/magic-card";
import { Button } from "@/components/ui/button";

const communauteItems = [
  {
    text: "Accès à la communauté complète : échanges sécurisés, groupe privé",
    icon: Users,
    description: "Un espace bienveillant entre pères",
  },
  {
    text: "Visio mensuelle",
    icon: Video,
    description: "Échanges en direct avec des experts",
  },
  {
    text: "Rencontres trimestrielles",
    icon: Calendar,
    description: "Pour se retrouver et partager",
  },
  {
    text: "Fais un don pour soutenir d'autres pères",
    icon: Heart,
    description: "Chaque contribution aide un père dans son combat",
  },
];

export function SectionCommunaute() {
  return (
    <section className="py-20 sm:py-28 bg-muted/30">
      <div className="container mx-auto px-4 max-w-5xl">
        <BlurFade delay={0} inView>
          <div className="text-center mb-14">
            <span className="inline-block text-sm font-semibold text-warm uppercase tracking-wider mb-3">
              Communauté
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground tracking-tight">
              Communauté & soutien
            </h2>
            <p className="text-muted-foreground text-lg mt-4 max-w-2xl mx-auto">
              Rejoins un réseau de pères engagés qui se soutiennent mutuellement
            </p>
          </div>
        </BlurFade>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-3xl mx-auto mb-12">
          {communauteItems.map((item, i) => (
            <BlurFade key={i} delay={0.1 + i * 0.1} inView>
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
                  <p className="font-semibold text-foreground mb-1">{item.text}</p>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
              </MagicCard>
            </BlurFade>
          ))}
        </div>

        <BlurFade delay={0.5} inView>
          <div className="flex justify-center">
            <Button
              size="lg"
              variant="outline"
              className="border-2 rounded-xl font-semibold text-base px-8 h-12 hover:bg-primary/5 hover:border-primary/30 transition-all"
              asChild
            >
              <Link href="/auth/register">
                Rejoindre la communaut&eacute; gratuitement
              </Link>
            </Button>
          </div>
        </BlurFade>
      </div>
    </section>
  );
}
