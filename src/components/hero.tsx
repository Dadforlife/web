"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, PlayCircle, ShieldCheck, Sparkles, Users } from "lucide-react";
import { BlurFade } from "@/components/ui/blur-fade";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { Particles } from "@/components/ui/particles";
import { Button } from "@/components/ui/button";

const heroImage = "/hero-image.svg";

export function Hero() {
  return (
    <section className="relative min-h-[92vh] flex items-center overflow-hidden bg-gradient-to-b from-background via-background to-muted/40">
      <Particles
        className="absolute inset-0"
        quantity={75}
        staticity={30}
        ease={80}
        color="#1e3a5f"
        size={0.5}
      />

      <div className="absolute top-0 right-0 w-[min(80vw,700px)] h-[min(80vw,700px)] rounded-full bg-primary/[0.04] blur-[100px] -translate-y-1/3 translate-x-1/4" />
      <div className="absolute bottom-0 left-0 w-[min(70vw,500px)] h-[min(70vw,500px)] rounded-full bg-warm/[0.06] blur-[80px] translate-y-1/3 -translate-x-1/4" />

      <div className="absolute inset-0 gradient-mesh opacity-60" />

      <div className="relative container mx-auto px-4 py-16 sm:py-24 md:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center max-w-6xl mx-auto">
          <div className="text-center lg:text-left space-y-8">
            <BlurFade delay={0} inView>
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-card/70 backdrop-blur-sm px-4 py-1.5 text-sm font-medium text-primary shadow-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-warm opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-warm" />
                </span>
                Association d&apos;accompagnement des p&egrave;res
              </div>
            </BlurFade>

            <BlurFade delay={0.1} inView>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-foreground leading-[1.04]">
                Un p&egrave;re n&apos;a pas besoin d&apos;&ecirc;tre parfait.
                <span className="gradient-text block mt-2">
                  Il a juste besoin d&apos;&ecirc;tre pr&eacute;sent.
                </span>
              </h1>
            </BlurFade>

            <BlurFade delay={0.2} inView>
              <p className="text-lg text-muted-foreground leading-relaxed max-w-xl mx-auto lg:mx-0">
                Papa pour la vie vous accompagne dans les moments les plus sensibles de la vie familiale
                pour avancer avec un cadre concret, des experts qualifi&eacute;s et une communaut&eacute;
                de p&egrave;res qui comprennent ce que vous traversez.
              </p>
            </BlurFade>

            <BlurFade delay={0.3} inView>
              <div className="flex justify-center lg:justify-start gap-3 flex-wrap">
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
                <Button
                  variant="outline"
                  size="lg"
                  asChild
                  className="h-13 rounded-xl border-primary/25 bg-card/80 px-7 backdrop-blur-sm hover:bg-card"
                >
                  <Link href="/#programme">
                    D&eacute;couvrir le programme
                    <PlayCircle className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </BlurFade>

            <BlurFade delay={0.4} inView>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 max-w-xl mx-auto lg:mx-0">
                <div className="glass rounded-xl border border-border/60 p-3 text-left">
                  <p className="text-2xl font-bold text-foreground">100%</p>
                  <p className="text-xs text-muted-foreground">Gratuit</p>
                </div>
                <div className="glass rounded-xl border border-border/60 p-3 text-left">
                  <p className="text-2xl font-bold text-foreground">6 sem.</p>
                  <p className="text-xs text-muted-foreground">Programme d&apos;accompagnement</p>
                </div>
                <div className="glass rounded-xl border border-border/60 p-3 text-left">
                  <p className="text-2xl font-bold text-foreground">100%</p>
                  <p className="text-xs text-muted-foreground">Confidentiel</p>
                </div>
              </div>
            </BlurFade>

            <BlurFade delay={0.5} inView>
              <div className="flex items-center justify-center lg:justify-start gap-5 pt-2 text-sm text-muted-foreground flex-wrap">
                <div className="inline-flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-chart-4" />
                  <span>Confidentiel</span>
                </div>
                <div className="inline-flex items-center gap-2">
                  <Users className="h-4 w-4 text-chart-2" />
                  <span>Accompagnement humain</span>
                </div>
                <div className="inline-flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-warm" />
                  <span>Sans engagement</span>
                </div>
              </div>
            </BlurFade>
          </div>

          <BlurFade delay={0.3} inView direction="right">
            <div className="relative flex justify-center lg:justify-end">
              <div className="relative w-full max-w-md aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl ring-1 ring-border/50">
                <Image
                  src={heroImage}
                  alt="Un père accompagné par Papa pour la vie"
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
                    <p className="text-sm font-semibold text-foreground">Ici, on ne juge pas.</p>
                    <p className="text-xs text-muted-foreground">On &eacute;coute. On comprend.</p>
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
