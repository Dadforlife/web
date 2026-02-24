"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { BlurFade } from "@/components/ui/blur-fade";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { Particles } from "@/components/ui/particles";

const heroImage = "/hero-image.svg";

export function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-gradient-to-b from-background via-background to-muted/30">
      <Particles
        className="absolute inset-0"
        quantity={60}
        staticity={30}
        ease={80}
        color="#1e3a5f"
        size={0.5}
      />

      <div className="absolute top-0 right-0 w-[min(80vw,700px)] h-[min(80vw,700px)] rounded-full bg-primary/[0.04] blur-[100px] -translate-y-1/3 translate-x-1/4" />
      <div className="absolute bottom-0 left-0 w-[min(70vw,500px)] h-[min(70vw,500px)] rounded-full bg-warm/[0.06] blur-[80px] translate-y-1/3 -translate-x-1/4" />

      <div className="relative container mx-auto px-4 py-16 sm:py-24 md:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center max-w-6xl mx-auto">
          {/* Colonne texte */}
          <div className="text-center lg:text-left space-y-8">
            <BlurFade delay={0} inView>
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-warm opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-warm" />
                </span>
                Association d&apos;accompagnement des p&egrave;res
              </div>
            </BlurFade>

            <BlurFade delay={0.1} inView>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-foreground leading-[1.08]">
                Rester un p&egrave;re.{" "}
                <span className="gradient-text block mt-2">
                  &Agrave; chaque &eacute;tape de votre vie familiale.
                </span>
              </h1>
            </BlurFade>

            <BlurFade delay={0.2} inView>
              <p className="text-lg text-muted-foreground leading-relaxed max-w-xl mx-auto lg:mx-0">
                Dad for Life propose un accompagnement structur&eacute; et personnalis&eacute;
                pour vous aider &agrave; traverser les &eacute;tapes de votre vie de p&egrave;re
                avec stabilit&eacute;, clart&eacute; et s&eacute;r&eacute;nit&eacute;.
                Que vous soyez p&egrave;re solo, en couple ou en instance de
                s&eacute;paration.
              </p>
            </BlurFade>

            <BlurFade delay={0.3} inView>
              <div className="flex justify-center lg:justify-start">
                <Link href="/diagnostic">
                  <ShimmerButton
                    shimmerColor="#ffffff"
                    shimmerSize="0.05em"
                    shimmerDuration="3s"
                    borderRadius="12px"
                    background="hsl(34, 95%, 52%)"
                    className="h-13 px-10 text-base font-semibold shadow-lg"
                  >
                    Demander un accompagnement
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </ShimmerButton>
                </Link>
              </div>
            </BlurFade>

            <BlurFade delay={0.4} inView>
              <div className="flex items-center justify-center lg:justify-start gap-6 sm:gap-8 pt-4 text-sm text-muted-foreground flex-wrap">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-chart-4" />
                  <span>Adh&eacute;sion gratuite</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-chart-4" />
                  <span>Confidentiel</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-chart-4" />
                  <span>Sans engagement</span>
                </div>
              </div>
            </BlurFade>
          </div>

          {/* Colonne image */}
          <BlurFade delay={0.3} inView direction="right">
            <div className="relative flex justify-center lg:justify-end">
              <div className="relative w-full max-w-md aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl ring-1 ring-border/50">
                <Image
                  src={heroImage}
                  alt="Un père accompagné par Dad for Life"
                  fill
                  sizes="(max-width: 1024px) 100vw, 480px"
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
              </div>
              <div className="absolute -bottom-4 -left-4 sm:left-auto sm:-right-6 glass rounded-2xl p-4 shadow-lg border border-border/50">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">Accompagnement</p>
                    <p className="text-xs text-muted-foreground">structur&eacute; et personnalis&eacute;</p>
                  </div>
                </div>
              </div>
            </div>
          </BlurFade>
        </div>
      </div>
    </section>
  );
}
