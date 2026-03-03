"use client";

import Link from "next/link";
import { motion, useInView } from "motion/react";
import { useRef } from "react";
import {
  ArrowRight,
  Scale,
  Building2,
  RefreshCw,
  Train,
  Package,
  Users,
  FileSearch,
  Heart,
  Shield,
  MessageCircle,
  Phone,
  ClipboardList,
  Link2,
  UserCheck,
  UserPlus,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

function useFadeInView(delay = 0) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return { ref, inView, delay };
}

function SectionFade({
  children,
  className = "",
  delay = 0,
  id,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  id?: string;
}) {
  const { ref, inView } = useFadeInView(delay);
  return (
    <motion.section
      ref={ref}
      id={id}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={fadeUp}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.section>
  );
}

const POURQUOI_ITEMS = [
  {
    title: "Apaiser les tensions",
    description:
      "Une présence neutre et rassurante contribue à désamorcer les situations tendues et à maintenir un climat plus serein pour tous, notamment les enfants.",
    icon: MessageCircle,
  },
  {
    title: "Dissuader les débordements",
    description:
      "Savoir que vous n'êtes pas seul peut décourager les comportements agressifs ou les pressions de l'autre partie et vous aider à rester dans le cadre.",
    icon: Shield,
  },
  {
    title: "Soutien moral",
    description:
      "Un accompagnant à vos côtés vous offre un point d'ancrage dans les moments difficiles : vous n'avez plus à porter seul le poids de ces étapes.",
    icon: Heart,
  },
];

const LIEUX_JUDICIAIRE = [
  { label: "Tribunaux (audiences JAF)", icon: Scale },
  { label: "Commissariats (plaintes, mains courantes)", icon: Building2 },
];

const LIEUX_QUOTIDIEN = [
  { label: "Passages de bras (échanges de garde)", icon: RefreshCw },
  { label: "Gares", icon: Train },
  { label: "Déménagements", icon: Package },
];

const LIEUX_SOCIAL = [
  { label: "Points rencontre", icon: Users },
  { label: "Expertises psy / sociales", icon: FileSearch },
];

const ETAPES_PROTOCOLE = [
  { num: 1, titre: "Prise de contact", desc: "Vous nous contactez et nous exposons brièvement votre besoin.", icon: Phone },
  { num: 2, titre: "Analyse", desc: "Nous analysons votre situation et les lieux ou moments à couvrir.", icon: ClipboardList },
  { num: 3, titre: "Mise en relation", desc: "Nous vous mettons en relation avec un bénévole disponible et formé.", icon: Link2 },
  { num: 4, titre: "Intervention", desc: "L'accompagnant vous rejoint sur le lieu et à l'heure convenus.", icon: UserCheck },
];

export default function AccompagnementPage() {
  return (
    <main role="main" className="min-h-screen bg-background text-foreground">
      <section className="relative min-h-[78vh] flex flex-col justify-center overflow-hidden bg-gradient-to-b from-background via-background to-muted/30">
        <div className="absolute inset-0 gradient-mesh opacity-70" />
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-35"
          style={{ backgroundImage: "url(/accompagnement-bg.svg)" }}
          aria-hidden
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/85 via-background/70 to-background/95" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[620px] h-[420px] bg-primary/10 rounded-full blur-[110px]" />
        <div className="relative mx-auto w-full max-w-5xl px-4 py-20 sm:py-28">
          <motion.div
            className="text-center space-y-7"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="inline-block rounded-full border border-primary/25 bg-card/75 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary backdrop-blur-sm">
              Accompagnement terrain premium
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.08]">
              Ne restez plus seul
              <span className="gradient-text block mt-2">
                face aux moments les plus sensibles
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto">
              Une pr&eacute;sence humaine, neutre et structurante pour vous soutenir lors des
              audiences, passages de bras et situations &agrave; forte tension.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <Link
                href="/diagnostic"
                className="inline-flex items-center gap-2 rounded-xl bg-warm px-7 py-3.5 text-base font-semibold text-warm-foreground shadow-lg hover:bg-warm/90 transition-all"
              >
                Demander un accompagnement
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="#protocole"
                className="inline-flex items-center gap-2 rounded-xl border border-border bg-card/80 px-7 py-3.5 text-base font-semibold text-foreground backdrop-blur-sm hover:bg-card transition-all"
              >
                Voir le protocole
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-3xl mx-auto pt-1">
              <div className="glass border border-border/60 rounded-xl p-3">
                <p className="text-xl font-bold">Pr&eacute;sence neutre</p>
                <p className="text-xs text-muted-foreground">Sans escalade ni confrontation</p>
              </div>
              <div className="glass border border-border/60 rounded-xl p-3">
                <p className="text-xl font-bold">Soutien terrain</p>
                <p className="text-xs text-muted-foreground">Dans les moments &agrave; risque</p>
              </div>
              <div className="glass border border-border/60 rounded-xl p-3">
                <p className="text-xl font-bold">Cadre clair</p>
                <p className="text-xs text-muted-foreground">M&eacute;thode et professionnalisme</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <SectionFade className="py-16 sm:py-24 bg-background">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-center text-sm font-semibold text-warm uppercase tracking-wider mb-3">
            Pourquoi ce service
          </h2>
          <p className="text-center text-3xl md:text-4xl font-bold max-w-3xl mx-auto mb-5">
            Une pr&eacute;sence qui change concr&egrave;tement votre mani&egrave;re de traverser le conflit
          </p>
          <p className="text-center text-muted-foreground text-lg max-w-2xl mx-auto mb-12">
            L&apos;accompagnement terrain ne remplace ni l&apos;avocat ni le juge :
            il vous apporte un appui humain dans les moments o&ugrave; tout peut d&eacute;raper.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {POURQUOI_ITEMS.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl bg-card/90 p-8 border border-border/60 text-center shadow-sm"
              >
                <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-5">
                  <item.icon className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-bold mb-3">
                  {item.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed text-sm">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </SectionFade>

      <SectionFade className="py-16 sm:py-24 bg-muted/30" delay={0.05}>
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-center text-sm font-semibold text-warm uppercase tracking-wider mb-3">
            Nos lieux d&apos;intervention
          </h2>
          <p className="text-center text-3xl md:text-4xl font-bold max-w-3xl mx-auto mb-5">
            Nous intervenons l&agrave; o&ugrave; votre stabilit&eacute; est en jeu
          </p>
          <p className="text-center text-muted-foreground text-lg max-w-2xl mx-auto mb-12">
            Nous pouvons vous accompagner dans les contextes judiciaires, au quotidien et dans le cadre du suivi social.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <div className="rounded-2xl bg-card p-6 sm:p-8 shadow-sm border border-border/60">
              <div className="flex items-center gap-3 mb-5">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Scale className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold">Judiciaire</h3>
              </div>
              <ul className="space-y-3">
                {LIEUX_JUDICIAIRE.map(({ label, icon: Icon }) => (
                  <li key={label} className="flex items-center gap-3">
                    <Icon className="h-4 w-4 shrink-0 text-primary" />
                    <span className="text-sm">{label}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl bg-card p-6 sm:p-8 shadow-sm border border-border/60">
              <div className="flex items-center gap-3 mb-5">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <RefreshCw className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold">Quotidien</h3>
              </div>
              <ul className="space-y-3">
                {LIEUX_QUOTIDIEN.map(({ label, icon: Icon }) => (
                  <li key={label} className="flex items-center gap-3">
                    <Icon className="h-4 w-4 shrink-0 text-primary" />
                    <span className="text-sm">{label}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl bg-card p-6 sm:p-8 shadow-sm border border-border/60">
              <div className="flex items-center gap-3 mb-5">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Users className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold">Social</h3>
              </div>
              <ul className="space-y-3">
                {LIEUX_SOCIAL.map(({ label, icon: Icon }) => (
                  <li key={label} className="flex items-center gap-3">
                    <Icon className="h-4 w-4 shrink-0 text-primary" />
                    <span className="text-sm">{label}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </SectionFade>

      <SectionFade id="protocole" className="py-16 sm:py-24 bg-background" delay={0.05}>
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="text-center text-sm font-semibold text-warm uppercase tracking-wider mb-3">
            Le protocole
          </h2>
          <p className="text-center text-3xl md:text-4xl font-bold max-w-3xl mx-auto mb-5">
            Une m&eacute;thode simple, rapide et professionnelle
          </p>
          <p className="text-center text-muted-foreground text-lg max-w-xl mx-auto mb-12">
            Un parcours simple et transparent, de la première prise de contact jusqu&apos;à l&apos;intervention sur le terrain.
          </p>
          <div className="overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm">
            <div className="divide-y divide-border/60">
              {ETAPES_PROTOCOLE.map(({ num, titre, desc, icon: Icon }) => (
                <div
                  key={num}
                  className="flex flex-col sm:flex-row sm:items-center gap-4 p-5 sm:p-6"
                >
                  <div className="flex items-center gap-4 sm:gap-6 min-w-0">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-sm">
                      {num}
                    </span>
                    <div className="flex items-center gap-3 min-w-0">
                      <Icon className="h-5 w-5 shrink-0 text-primary" />
                      <span className="font-semibold">{titre}</span>
                    </div>
                  </div>
                  <p className="text-muted-foreground text-sm sm:ml-[4.5rem] sm:pl-0 pl-14">
                    {desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </SectionFade>

      <SectionFade className="py-12 sm:py-16 bg-muted/30 border-y border-border/60" delay={0.05}>
        <div className="mx-auto max-w-2xl px-4 text-center">
          <p className="text-muted-foreground mb-4">
            Vous cherchez un <strong className="text-foreground">parcours structur&eacute;</strong>{" "}
            sur plusieurs mois (stabilisation, cadre parental, plan d&apos;action) ?
          </p>
          <Link
            href="/suivi"
            className="inline-flex items-center gap-2 text-primary font-semibold hover:underline"
          >
            Découvrir Notre suivi
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </SectionFade>

      <SectionFade className="relative py-16 sm:py-24 bg-primary overflow-hidden" delay={0.1}>
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-chart-2/80" />
        <div className="absolute -top-20 -left-12 h-64 w-64 rounded-full bg-white/10 blur-[90px]" />
        <div className="absolute -bottom-20 -right-12 h-64 w-64 rounded-full bg-warm/20 blur-[90px]" />
        <div className="relative mx-auto max-w-3xl px-4 text-center">
          <div className="rounded-3xl border border-white/20 bg-white/10 backdrop-blur-md p-8 sm:p-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-primary-foreground mb-4">
              Pr&ecirc;t &agrave; faire le premier pas ?
            </h2>
            <p className="text-primary-foreground/90 mb-8">
              Demandez un accompagnement ou rejoignez notre &eacute;quipe de b&eacute;n&eacute;voles.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                size="lg"
                className="w-full sm:w-auto bg-warm text-warm-foreground hover:bg-warm/90 rounded-xl px-8 font-semibold shadow-lg"
                asChild
              >
                <Link href="/diagnostic" className="inline-flex items-center gap-2">
                  Demander un accompagnement
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto rounded-xl px-8 font-semibold border-2 border-white/45 bg-transparent text-primary-foreground hover:bg-white/10"
                asChild
              >
                <Link href="/#programme" className="inline-flex items-center gap-2">
                  <UserPlus className="h-4 w-4" />
                  Devenir b&eacute;n&eacute;vole
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </SectionFade>
    </main>
  );
}
