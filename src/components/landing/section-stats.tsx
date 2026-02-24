"use client";

import { NumberTicker } from "@/components/ui/number-ticker";
import { BlurFade } from "@/components/ui/blur-fade";

const stats = [
  { value: 200, suffix: "+", label: "Pères accompagnés" },
  { value: 6, suffix: " sem.", label: "Programme gratuit" },
  { value: 100, suffix: "%", label: "Gratuit" },
  { value: 95, suffix: "%", label: "De satisfaction" },
];

export function SectionStats() {
  return (
    <section className="py-16 sm:py-20 border-y border-border/50 bg-card/50 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
          {stats.map((stat, i) => (
            <BlurFade key={stat.label} delay={i * 0.1} inView>
              <div className="text-center">
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
