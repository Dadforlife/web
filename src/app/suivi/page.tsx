"use client";

import Link from "next/link";
import { motion, useInView } from "motion/react";
import { useRef } from "react";
import {
  ArrowRight,
  Heart,
  Scale,
  MessageSquare,
  Wallet,
  Target,
  CalendarCheck,
  User,
  Baby,
  Gavel,
  UserCheck,
  ClipboardList,
  Users,
  TrendingUp,
  Flag,
  AlertTriangle,
} from "lucide-react";

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

const ETAPES = [
  {
    num: 1,
    titre: "Stabilisation émotionnelle",
    resume: "Reprendre le contrôle au lieu de réagir sous pression.",
    detail: "Retrouver un socle intérieur solide pour avancer avec clarté.",
    icon: Heart,
  },
  {
    num: 2,
    titre: "Compréhension du cadre parental",
    resume: "Savoir exactement où vous vous situez.",
    detail: "Comprendre vos droits, vos devoirs et le cadre juridique.",
    icon: Scale,
  },
  {
    num: 3,
    titre: "Communication stratégique",
    resume: "Apprendre à échanger sans aggraver la situation.",
    detail: "Mettre en place une communication structurée et constructive.",
    icon: MessageSquare,
  },
  {
    num: 4,
    titre: "Organisation financière",
    resume: "Reprendre le contrôle de votre budget.",
    detail: "Anticiper les charges et sécuriser votre stabilité.",
    icon: Wallet,
  },
  {
    num: 5,
    titre: "Leadership paternel",
    resume: "Devenir un père stable, présent et structurant.",
    detail: "Renforcer votre posture et votre vision long terme.",
    icon: Target,
  },
  {
    num: 6,
    titre: "Plan d'action 6 mois",
    resume: "Définir des objectifs clairs.",
    detail: "Mettre en place un plan concret et mesurable.",
    icon: CalendarCheck,
  },
];

const CIBLES = [
  { text: "Pères en séparation ou divorce", icon: User },
  { text: "Pères confrontés à un conflit parental", icon: AlertTriangle },
  { text: "Pères souhaitant protéger leur lien avec leur enfant", icon: Baby },
  { text: "Pères voulant éviter l'escalade judiciaire", icon: Gavel },
  { text: "Pères prêts à s'impliquer activement", icon: UserCheck },
];

const PAS_UN = [
  "Ce n'est pas une thérapie",
  "Ce n'est pas un cabinet juridique",
  "Ce n'est pas un espace de confrontation",
  "Ce n'est pas une solution miracle",
];

const DEROULEMENT = [
  { label: "Évaluation personnalisée", icon: ClipboardList },
  { label: "Définition d'un plan adapté", icon: Target },
  { label: "Sessions de suivi régulières", icon: Users },
  { label: "Mise en pratique encadrée", icon: TrendingUp },
  { label: "Autonomie progressive", icon: Flag },
];

export default function SuiviPage() {
  return (
    <main role="main" className="min-h-screen bg-background text-foreground">
      <section className="relative min-h-[88vh] flex flex-col justify-center overflow-hidden bg-gradient-to-b from-background via-background to-muted/40">
        <div className="absolute inset-0 gradient-mesh opacity-70" />
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
          style={{ backgroundImage: "url(/suivi-hero.svg)" }}
          aria-hidden
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/85 via-background/70 to-background/95" />
        <div className="absolute top-0 right-0 w-[min(75vw,680px)] h-[min(75vw,680px)] rounded-full bg-primary/[0.06] blur-[110px] -translate-y-1/3 translate-x-1/4" />

        <div className="relative mx-auto w-full max-w-5xl px-4 py-24 sm:py-32 text-center">
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="inline-block rounded-full border border-primary/25 bg-card/75 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary backdrop-blur-sm">
              Notre suivi premium
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.08]">
              Un parcours d&apos;accompagnement exigeant
              <span className="gradient-text block mt-2">
                pour rester un p&egrave;re solide et pr&eacute;sent
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Sur 3 &agrave; 6 mois, vous avancez avec une m&eacute;thode claire pour apaiser les tensions,
              prot&eacute;ger le lien avec votre enfant et reprendre la direction de votre vie familiale.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <Link
                href="/diagnostic"
                className="inline-flex items-center gap-2 rounded-xl bg-warm px-7 py-3.5 text-base font-semibold text-warm-foreground shadow-lg hover:bg-warm/90 transition-all"
              >
                Faire mon &eacute;valuation
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="#parcours"
                className="inline-flex items-center gap-2 rounded-xl border border-border bg-card/80 px-7 py-3.5 text-base font-semibold text-foreground backdrop-blur-sm hover:bg-card transition-all"
              >
                D&eacute;couvrir le parcours
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-3xl mx-auto pt-2">
              <div className="glass border border-border/60 rounded-xl p-3">
                <p className="text-xl font-bold">6 &eacute;tapes</p>
                <p className="text-xs text-muted-foreground">Progressives et structur&eacute;es</p>
              </div>
              <div className="glass border border-border/60 rounded-xl p-3">
                <p className="text-xl font-bold">3-6 mois</p>
                <p className="text-xs text-muted-foreground">Selon votre situation</p>
              </div>
              <div className="glass border border-border/60 rounded-xl p-3">
                <p className="text-xl font-bold">100% cadr&eacute;</p>
                <p className="text-xs text-muted-foreground">Objectifs concrets et suivis</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <SectionFade id="parcours" className="py-24 bg-background" delay={0.05}>
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-center text-sm font-semibold text-warm uppercase tracking-wider mb-3">
            Le parcours
          </h2>
          <p className="text-center text-3xl md:text-4xl font-bold max-w-3xl mx-auto mb-5">
            Une progression en 6 &eacute;tapes pour retrouver stabilit&eacute; et impact parental
          </p>
          <p className="text-center text-muted-foreground text-lg max-w-2xl mx-auto mb-16">
            Vous avancez avec m&eacute;thode, sans dispersion, vers des r&eacute;sultats visibles dans votre quotidien.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ETAPES.map((etape) => (
              <motion.article
                key={etape.num}
                className="group relative rounded-2xl border border-border/60 bg-card/85 p-7 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all"
                whileHover={{ y: -2 }}
              >
                <span className="absolute top-5 right-5 rounded-full bg-warm/10 px-3 py-1 text-xs font-semibold text-warm">
                  &Eacute;tape {etape.num}
                </span>
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary mb-5 ring-1 ring-border/60">
                  <etape.icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold mb-2">{etape.titre}</h3>
                <p className="text-foreground/85 font-medium mb-2">{etape.resume}</p>
                <p className="text-muted-foreground text-sm leading-relaxed">{etape.detail}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </SectionFade>

      <SectionFade className="py-24 bg-muted/30" delay={0.1}>
        <div className="mx-auto max-w-5xl px-4">
          <h2 className="text-center text-sm font-semibold text-warm uppercase tracking-wider mb-3">
            Pour quels papas
          </h2>
          <p className="text-center text-3xl md:text-4xl font-bold max-w-3xl mx-auto mb-12">
            Un programme pens&eacute; pour les p&egrave;res qui veulent agir
          </p>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {CIBLES.map((item, i) => (
              <motion.li
                key={i}
                className="flex items-center gap-4 rounded-xl bg-card px-6 py-5 shadow-sm border border-border/60"
                initial={{ opacity: 0, x: -12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: i * 0.06, duration: 0.4 }}
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <item.icon className="h-5 w-5" />
                </div>
                <span className="font-medium">{item.text}</span>
              </motion.li>
            ))}
          </ul>
        </div>
      </SectionFade>

      <SectionFade className="py-24 bg-background" delay={0.05}>
        <div className="mx-auto max-w-5xl px-4 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="rounded-2xl border border-border/60 bg-card p-8 shadow-sm">
            <h2 className="text-2xl font-bold mb-6">Ce que ce programme n&apos;est pas</h2>
            <ul className="space-y-3 mb-8">
              {PAS_UN.map((text, i) => (
                <li key={i} className="flex items-center gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
                    —
                  </span>
                  {text}
                </li>
              ))}
            </ul>
            <p className="text-muted-foreground leading-relaxed border-t border-border pt-6">
              Ce programme vise &agrave; <strong className="text-foreground">structurer</strong>,{" "}
              <strong className="text-foreground">apaiser</strong> et{" "}
              <strong className="text-foreground">responsabiliser</strong>.
            </p>
          </div>

          <div className="rounded-2xl border border-border/60 bg-card p-8 shadow-sm">
            <h2 className="text-2xl font-bold mb-6">Le d&eacute;roulement</h2>
            <div className="relative">
              <div className="absolute left-5 top-1 bottom-1 w-px bg-border" />
              <ul className="space-y-6">
                {DEROULEMENT.map((item, i) => (
                  <motion.li
                    key={i}
                    className="relative flex items-start gap-5 pl-14"
                    initial={{ opacity: 0, x: -12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ delay: i * 0.08, duration: 0.4 }}
                  >
                    <span className="absolute left-0 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm">
                      <item.icon className="h-5 w-5" />
                    </span>
                    <span className="font-medium pt-1.5">{item.label}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </SectionFade>

      <SectionFade className="py-12 sm:py-16 bg-muted/30 border-y border-border/60" delay={0.05}>
        <div className="mx-auto max-w-2xl px-4 text-center">
          <p className="text-muted-foreground mb-4">
            Besoin d&apos;une <strong className="text-foreground">pr&eacute;sence &agrave; vos c&ocirc;t&eacute;s</strong>{" "}
            (tribunaux, passages de bras, points rencontre) ?
          </p>
          <Link
            href="/accompagnement"
            className="inline-flex items-center gap-2 text-primary font-semibold hover:underline"
          >
            D&eacute;couvrir l&apos;Accompagnement terrain
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </SectionFade>

      <section className="relative py-24 overflow-hidden bg-primary text-primary-foreground">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-chart-2/85" />
        <div className="absolute -top-24 -left-16 h-72 w-72 rounded-full bg-white/10 blur-[90px]" />
        <div className="absolute -bottom-24 -right-16 h-72 w-72 rounded-full bg-warm/20 blur-[90px]" />
        <div className="relative mx-auto max-w-4xl px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5 }}
            className="rounded-3xl border border-white/20 bg-white/10 backdrop-blur-md p-8 sm:p-12 space-y-7"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold leading-tight">
              Vous voulez prot&eacute;ger votre r&ocirc;le de p&egrave;re ?
            </h2>
            <p className="text-lg text-primary-foreground/90">
              Ne restez pas seul face &agrave; la situation. Agissez avec m&eacute;thode, lucidit&eacute; et accompagnement.
            </p>
            <div>
              <Link
                href="/diagnostic"
                className="inline-flex items-center gap-2 rounded-xl bg-warm px-8 py-4 text-base font-semibold text-warm-foreground shadow-lg hover:bg-warm/90 transition-all"
              >
                Commencer mon &eacute;valuation
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
