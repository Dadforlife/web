"use client";

import { NumberTicker } from "@/components/ui/number-ticker";
import { BlurFade } from "@/components/ui/blur-fade";

const stats = [
  { value: 6, suffix: " sem.", label: "Programme d'accompagnement" },
  { value: 5, suffix: " axes", label: "D'accompagnement" },
  { value: 100, suffix: "%", label: "Gratuit" },
  { value: 100, suffix: "%", label: "Confidentiel" },
];

export function SectionStats() {
  return (
    <section className="py-16 sm:py-20 border-y border-border/50 bg-card/60 backdrop-blur-sm relative overflow-hidden">
      <div className="absolute inset-0 gradient-mesh opacity-40" />
      <div className="container mx-auto px-4">
        <div className="relative grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {stats.map((stat, i) => (
            <BlurFade key={stat.label} delay={i * 0.1} inView>
              <div className="text-center rounded-2xl border border-border/50 bg-background/70 p-5 shadow-sm">
                <div className="text-3xl sm:text-4xl font-extrabold text-foreground">
                  <NumberTicker value={stat.value} delay={0.3 + i * 0.1} className="text-foreground" />
                  <span className="text-primary">{stat.suffix}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-2 font-medium">
                  {stat.label}
                </p>
              </div>
            </BlurFade>
          ))}
        </div>
      </div>
    </section>
  );
}
