"use client";

import { BlurFade } from "@/components/ui/blur-fade";
import { Marquee } from "@/components/ui/marquee";

const testimonials = [
  {
    name: "Thomas D.",
    role: "Papa solo",
    text: "Dad for Life m'a aidé à retrouver confiance en moi et à reconstruire ma relation avec mes enfants.",
  },
  {
    name: "Marc L.",
    role: "En séparation",
    text: "Le programme m'a donné les outils pour gérer la coparentalité avec sérénité. Je recommande à tous les pères.",
  },
  {
    name: "Julien P.",
    role: "Papa en couple",
    text: "Grâce à la communauté, j'ai compris que je n'étais pas seul. Les échanges avec d'autres pères sont précieux.",
  },
  {
    name: "Sébastien R.",
    role: "Papa solo",
    text: "Le module sur la stabilisation émotionnelle a changé ma façon de gérer les moments difficiles.",
  },
  {
    name: "Antoine M.",
    role: "En séparation",
    text: "Les professionnels du réseau m'ont accompagné dans mes démarches juridiques. Un vrai soutien.",
  },
  {
    name: "Nicolas B.",
    role: "Père engagé",
    text: "Un programme concret et bien structuré. En 6 semaines, j'ai retrouvé un cadre solide pour ma famille.",
  },
];

function TestimonialCard({ name, role, text }: { name: string; role: string; text: string }) {
  return (
    <div className="w-[320px] rounded-2xl border border-border/60 bg-card/80 backdrop-blur-sm p-6 shadow-sm">
      <p className="text-muted-foreground text-sm leading-relaxed mb-4">
        &laquo; {text} &raquo;
      </p>
      <div className="flex items-center gap-3">
        <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
          <span className="text-sm font-bold text-primary">
            {name.charAt(0)}
          </span>
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">{name}</p>
          <p className="text-xs text-muted-foreground">{role}</p>
        </div>
      </div>
    </div>
  );
}

export function SectionTestimonials() {
  return (
    <section className="py-20 sm:py-28 overflow-hidden relative">
      <div className="absolute inset-0 gradient-mesh" />

      <div className="relative">
        <BlurFade delay={0} inView>
          <div className="text-center mb-14 container mx-auto px-4">
            <span className="inline-block text-sm font-semibold text-warm uppercase tracking-wider mb-3">
              Témoignages
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground tracking-tight">
              Ils nous ont fait confiance
            </h2>
          </div>
        </BlurFade>

        <div className="relative">
          <Marquee pauseOnHover className="[--duration:35s] [--gap:1rem]">
            {testimonials.map((t, i) => (
              <TestimonialCard key={i} {...t} />
            ))}
          </Marquee>

          {/* Fade edges */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background to-transparent" />
        </div>
      </div>
    </section>
  );
}
