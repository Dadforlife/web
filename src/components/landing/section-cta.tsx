"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { BlurFade } from "@/components/ui/blur-fade";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { Particles } from "@/components/ui/particles";
import { Button } from "@/components/ui/button";

export function SectionCTA() {
  return (
    <section
      id="accompagnement"
      className="relative py-20 sm:py-28 md:py-36 bg-primary text-primary-foreground overflow-hidden scroll-mt-20"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-chart-2/90" />
      <Particles
        className="absolute inset-0"
        quantity={40}
        staticity={20}
        ease={60}
        color="#ffffff"
        size={0.4}
      />
      <div className="absolute top-0 left-0 w-[500px] h-[500px] rounded-full bg-white/5 blur-[100px] -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-warm/10 blur-[80px] translate-x-1/3 translate-y-1/3" />

      <div className="relative container mx-auto px-4 max-w-5xl">
        <div className="rounded-3xl border border-white/20 bg-white/8 backdrop-blur-md p-8 sm:p-12 md:p-14 shadow-2xl">
          <div className="text-center">
            <BlurFade delay={0} inView>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-tight">
                Votre histoire de p&egrave;re ne s&apos;arr&ecirc;te pas ici.
              </h2>
            </BlurFade>

            <BlurFade delay={0.15} inView>
              <p className="text-primary-foreground/90 max-w-2xl mx-auto text-lg leading-relaxed mt-6">
                Commencez aujourd&apos;hui un parcours exigeant et bienveillant pour
                retrouver stabilit&eacute;, confiance et pr&eacute;sence aupr&egrave;s de vos enfants.
              </p>
            </BlurFade>

            <BlurFade delay={0.22} inView>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-primary-foreground/85">
                <span className="inline-flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-warm" />
                  Adh&eacute;sion gratuite
                </span>
                <span className="inline-flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-warm" />
                  &Eacute;valuation confidentielle
                </span>
                <span className="inline-flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-warm" />
                  Accompagnement personnalis&eacute;
                </span>
              </div>
            </BlurFade>

            <BlurFade delay={0.35} inView>
              <div className="flex justify-center gap-3 mt-10 flex-wrap">
                <Link href="/diagnostic">
                  <ShimmerButton
                    shimmerColor="#ffffff"
                    shimmerSize="0.05em"
                    shimmerDuration="3s"
                    borderRadius="12px"
                    background="hsl(34, 95%, 52%)"
                    className="h-13 px-10 text-base font-semibold shadow-xl"
                  >
                    Demander un accompagnement
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </ShimmerButton>
                </Link>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="h-13 rounded-xl border-white/35 bg-transparent px-7 text-primary-foreground hover:bg-white/10 hover:text-primary-foreground"
                >
                  <Link href="/auth/register">Rejoindre la communaut&eacute;</Link>
                </Button>
              </div>
            </BlurFade>

            <BlurFade delay={0.45} inView>
              <div className="mt-14">
                <p className="text-2xl md:text-3xl font-bold text-primary-foreground/95 tracking-tight">
                  Un p&egrave;re stable aujourd&apos;hui, c&apos;est un enfant plus &eacute;quilibr&eacute; demain.
                </p>
              </div>
            </BlurFade>
          </div>
        </div>
      </div>
    </section>
  );
}
