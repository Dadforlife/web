"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { BlurFade } from "@/components/ui/blur-fade";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { Particles } from "@/components/ui/particles";

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

      <div className="relative container mx-auto px-4 text-center max-w-3xl">
        <BlurFade delay={0} inView>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-tight">
            Vous ne contr&ocirc;lez pas toujours votre situation familiale.
          </h2>
        </BlurFade>

        <BlurFade delay={0.15} inView>
          <p className="text-primary-foreground/90 max-w-xl mx-auto text-lg leading-relaxed mt-6">
            Mais vous pouvez d&eacute;cider de la mani&egrave;re dont vous traversez cette p&eacute;riode.
          </p>
        </BlurFade>

        <BlurFade delay={0.25} inView>
          <p className="text-primary-foreground/80 max-w-xl mx-auto text-base leading-relaxed mt-3">
            Faites le premier pas. L&apos;adh&eacute;sion est gratuite,
            le diagnostic confidentiel, l&apos;accompagnement personnalis&eacute;.
          </p>
        </BlurFade>

        <BlurFade delay={0.35} inView>
          <div className="flex justify-center mt-10">
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
          </div>
        </BlurFade>

        <BlurFade delay={0.45} inView>
          <div className="mt-16">
            <p className="text-2xl md:text-3xl font-bold text-primary-foreground/95 tracking-tight">
              Un p&egrave;re stable aujourd&apos;hui, c&apos;est un enfant plus &eacute;quilibr&eacute; demain.
            </p>
          </div>
        </BlurFade>
      </div>
    </section>
  );
}
