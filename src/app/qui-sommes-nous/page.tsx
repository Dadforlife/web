"use client";

import Link from "next/link";
import { motion, useInView } from "motion/react";
import { useRef } from "react";
import {
  Heart,
  Shield,
  GraduationCap,
  AlertTriangle,
  Users,
  LayoutGrid,
  CheckCircle2,
  Lock,
  Baby,
  Scale,
  Target,
  ArrowRight,
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
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const { ref, inView } = useFadeInView(delay);
  return (
    <motion.section
      ref={ref}
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

export default function QuiSommesNousPage() {
  return (
    <main role="main" className="min-h-screen">
      <section className="relative min-h-[85vh] flex flex-col justify-center overflow-hidden bg-gradient-to-b from-slate-50 via-white to-zinc-50/80">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-[0.12]"
          style={{ backgroundImage: 'url(/qui-sommes-nous-hero.svg)' }}
          aria-hidden
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,hsl(218_55%_28%_/_.06),transparent)]" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-sky-200/20 rounded-full blur-[100px]" />
        <div className="relative mx-auto w-full max-w-6xl px-4 py-24 sm:py-32">
          <motion.div
            className="text-center space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-slate-900 leading-[1.1]">
              Construire des pères solides pour des familles équilibrées.
            </h1>
            <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto">
              Papa pour la vie accompagne les pères confrontés à des défis familiaux.
              Notre mission : vous apaiser, vous protéger et vous former pour
              assumer pleinement votre rôle.
            </p>
            <div className="pt-4">
              <Link
                href="/diagnostic"
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-base font-semibold text-primary-foreground shadow-md hover:bg-primary/90 hover:shadow-lg transition-all duration-200"
              >
                Commencer un accompagnement
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <SectionFade className="py-24">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-center text-2xl font-semibold text-slate-500 uppercase tracking-wider mb-4">
            Notre mission
          </h2>
          <p className="text-center text-slate-700 text-lg max-w-3xl mx-auto mb-16">
            Nous agissons selon trois axes indissociables :{" "}
            <strong className="text-slate-900">Apaiser</strong> votre situation
            et vos émotions,{" "}
            <strong className="text-slate-900">Protéger</strong> vos droits et
            votre lien avec vos enfants,{" "}
            <strong className="text-slate-900">Former</strong> des pères
            responsables et présents.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Apaiser",
                description:
                  "Retrouver un équilibre émotionnel et une clarté pour prendre des décisions éclairées dans l'intérêt de tous.",
                icon: Heart,
              },
              {
                title: "Protéger",
                description:
                  "Connaître et faire valoir vos droits, préserver votre place de père et le lien avec vos enfants.",
                icon: Shield,
              },
              {
                title: "Former",
                description:
                  "Acquérir les repères et les compétences pour assumer votre rôle de père de façon durable et sereine.",
                icon: GraduationCap,
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-2xl bg-white p-8 shadow-sm border border-slate-100 text-center"
              >
                <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-5">
                  <item.icon className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">
                  {item.title}
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </SectionFade>

      <SectionFade className="py-24 bg-slate-50/50" delay={0.1}>
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-center text-2xl font-semibold text-slate-500 uppercase tracking-wider mb-4">
            Pourquoi Papa pour la vie ?
          </h2>
          <p className="text-center text-slate-700 text-lg max-w-2xl mx-auto mb-16">
            Les pères que nous accompagnons font souvent face à des réalités
            difficiles. Nous proposons un cadre structuré pour y répondre.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              {
                title: "Conflits familiaux",
                description:
                  "Séparation, désaccords parentaux, tensions qui pèsent sur le quotidien et sur les enfants.",
                icon: AlertTriangle,
              },
              {
                title: "Isolement des pères",
                description:
                  "Manque de relais, sentiment d'être seul face aux démarches et aux enjeux juridiques ou émotionnels.",
                icon: Users,
              },
              {
                title: "Manque de cadre structuré",
                description:
                  "Besoin d'un parcours clair, d'outils et de repères pour avancer sans s'éparpiller.",
                icon: LayoutGrid,
              },
            ].map((item) => (
              <motion.div
                key={item.title}
                className="rounded-2xl bg-white p-6 shadow-sm border border-slate-100 hover:shadow-md hover:border-slate-200 transition-all duration-300"
                whileHover={{ y: -4 }}
              >
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-600 mb-4">
                  <item.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </SectionFade>

      <SectionFade className="py-24" delay={0.05}>
        <div className="mx-auto max-w-6xl px-4 text-center">
          <h2 className="text-2xl font-semibold text-slate-500 uppercase tracking-wider mb-8">
            Notre vision
          </h2>
          <blockquote className="max-w-4xl mx-auto">
            <p className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 leading-tight">
              Un père stable aujourd&apos;hui, un enfant plus équilibré demain.
            </p>
          </blockquote>
          <p className="mt-8 text-lg text-slate-600 max-w-2xl mx-auto">
            Nous croyons que l&apos;accompagnement des pères est un levier
            décisif pour l&apos;équilibre des familles et le bien-être des
            enfants.
          </p>
        </div>
      </SectionFade>

      <SectionFade className="py-24" delay={0.05}>
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-center text-2xl font-semibold text-slate-500 uppercase tracking-wider mb-4">
            Notre approche
          </h2>
          <p className="text-center text-slate-700 text-lg max-w-2xl mx-auto mb-12">
            Un cadre clair et des principes partagés avec vous.
          </p>
          <ul className="max-w-2xl mx-auto space-y-4">
            {[
              "Responsable : nous vous encourageons à assumer vos choix et vos actes.",
              "Structurée : un parcours défini, des étapes et des objectifs identifiés.",
              "Humaine : écoute et respect de votre situation, sans jugement.",
              "Orientée solutions : concentrée sur les actions concrètes et les résultats.",
            ].map((text, i) => (
              <motion.li
                key={i}
                className="flex items-start gap-4 rounded-xl bg-white p-4 shadow-sm border border-slate-100"
                initial={{ opacity: 0, x: -12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
              >
                <CheckCircle2 className="h-6 w-6 shrink-0 text-primary mt-0.5" />
                <span className="text-slate-700">{text}</span>
              </motion.li>
            ))}
          </ul>
        </div>
      </SectionFade>

      <SectionFade className="py-24 bg-slate-50/50" delay={0.1}>
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-center text-2xl font-semibold text-slate-500 uppercase tracking-wider mb-4">
            Notre engagement
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
            {[
              {
                title: "Confidentialité",
                description: "Vos données et votre parcours restent strictement protégés.",
                icon: Lock,
              },
              {
                title: "Intérêt de l'enfant",
                description: "Chaque action est réfléchie en priorité sous l'angle du bien-être de l'enfant.",
                icon: Baby,
              },
              {
                title: "Neutralité",
                description: "Nous ne prenons pas parti ; nous vous outillons pour avancer.",
                icon: Scale,
              },
              {
                title: "Accompagnement sérieux",
                description: "Méthode structurée, professionnels qualifiés, suivi rigoureux.",
                icon: Target,
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-2xl bg-white p-6 shadow-sm border border-slate-100 text-center"
              >
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-600 mb-4">
                  <item.icon className="h-6 w-6" />
                </div>
                <h3 className="font-bold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </SectionFade>

      <section className="py-24 bg-slate-900 text-white">
        <div className="mx-auto max-w-6xl px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            <p className="text-2xl sm:text-3xl md:text-4xl font-bold leading-tight max-w-3xl mx-auto">
              Être père est une mission. Nous vous aidons à l&apos;assumer
              pleinement.
            </p>
            <div>
              <Link
                href="/diagnostic"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 text-base font-semibold text-slate-900 shadow-md hover:bg-slate-100 transition-all duration-200"
              >
                Commencer un accompagnement
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
