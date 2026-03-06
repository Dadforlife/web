"use client";

import Link from "next/link";
import { motion, useInView } from "motion/react";
import { type ReactNode, useRef } from "react";
import {
  ArrowRight,
  BadgeCheck,
  Briefcase,
  CheckCircle2,
  ChevronRight,
  Clock3,
  FileSignature,
  Heart,
  MapPin,
  Phone,
  Shield,
  UserPlus,
  Users,
  Video,
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

const motivations = [
  {
    title: "Un impact concret",
    description:
      "Vous redonnez de la stabilité à des parents isolés dans des moments décisifs.",
    icon: Heart,
  },
  {
    title: "Une mission utile aux enfants",
    description:
      "En apaisant les tensions, vous protégez directement l'équilibre émotionnel des enfants.",
    icon: Shield,
  },
  {
    title: "Une équipe bienveillante",
    description:
      "Vous avancez avec des bénévoles formés, un cadre clair et un accompagnement continu.",
    icon: Users,
  },
];

const missions = [
  {
    title: "Accompagnateur terrain",
    description:
      "Présence rassurante lors des échanges de garde, audiences ou démarches sensibles.",
    icon: MapPin,
  },
  {
    title: "Écoute et soutien",
    description:
      "Des appels réguliers pour aider un parent à reprendre confiance et garder le cap.",
    icon: Phone,
  },
  {
    title: "Expertise métier (optionnel)",
    description:
      "Contribution juridique, sociale, administrative ou médiation selon vos compétences.",
    icon: Briefcase,
  },
];

const profilePoints = [
  "Empathie, calme et capacité d'écoute active.",
  "Neutralité et posture non-jugeante en toute circonstance.",
  "Fiabilité, ponctualité et sens des responsabilités.",
  "Adhésion à la charte éthique Papa pour la vie.",
];

const parcours = [
  {
    step: "01",
    title: "Échange de découverte (30 min)",
    description:
      "Nous échangeons sur votre motivation, vos disponibilités et vos questions.",
    icon: Video,
  },
  {
    step: "02",
    title: "Validation du cadre éthique",
    description:
      "Signature de la charte et présentation des bonnes pratiques terrain.",
    icon: FileSignature,
  },
  {
    step: "03",
    title: "Première mission en binôme",
    description:
      "Vous commencez accompagné(e) d'un bénévole expérimenté avant autonomie.",
    icon: UserPlus,
  },
];

const faqs = [
  {
    question: "Combien de temps faut-il prévoir chaque mois ?",
    answer:
      "La plupart des bénévoles commencent avec 3 à 6 heures par mois. Nous adaptons la mission à vos disponibilités.",
  },
  {
    question: "Dois-je avoir une formation spécifique ?",
    answer:
      "Non. Nous vous transmettons un cadre clair, des repères pratiques et un accompagnement continu pour démarrer sereinement.",
  },
  {
    question: "Puis-je aider à distance ?",
    answer:
      "Oui. Certaines missions se font à distance (écoute, orientation, suivi), selon vos préférences et les besoins.",
  },
  {
    question: "Comment se passe la première mission ?",
    answer:
      "Elle s'effectue en binôme afin que vous soyez guidé(e) pas à pas dans un cadre sécurisé et rassurant.",
  },
];

function useFadeInView() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return { ref, inView };
}

function SectionFade({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const { ref, inView } = useFadeInView();
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

export default function DevenirBenevolePage() {
  return (
    <main role="main" className="min-h-screen bg-slate-50/40 text-slate-900">
      <section className="relative overflow-hidden border-b border-slate-200/70 bg-white">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-[0.18]"
          style={{ backgroundImage: "url(/devenir-benevole-hero.svg)" }}
          aria-hidden
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,hsl(204_100%_87%_/_0.45),transparent_45%),radial-gradient(circle_at_80%_0%,hsl(215_100%_94%_/_0.8),transparent_40%)]" />
        <div className="relative mx-auto grid w-full max-w-6xl gap-10 px-4 pb-16 pt-16 sm:pt-20 lg:grid-cols-[1.2fr_0.8fr] lg:items-center lg:pb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-7"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-white/85 px-4 py-1.5 text-sm font-medium text-primary shadow-sm backdrop-blur">
              <BadgeCheck className="h-4 w-4" />
              Rejoindre les bénévoles Papa pour la vie
            </span>
            <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
              Devenez un repère fiable pour des parents qui traversent la tempête.
            </h1>
            <p className="max-w-2xl text-lg leading-relaxed text-slate-600 sm:text-xl">
              Vous offrez présence, calme et dignité dans des moments sensibles.
              Chaque mission contribue à protéger le lien parent-enfant.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href="/devenir-benevole/formulaire"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-7 py-3.5 text-base font-semibold text-primary-foreground shadow-lg shadow-primary/30 transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary/90"
              >
                Je deviens bénévole
                <ArrowRight className="h-5 w-5" />
              </Link>
              <a
                href="mailto:contact@dadforlife.org?subject=Candidature%20b%C3%A9n%C3%A9vole"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white/85 px-7 py-3.5 text-base font-semibold text-slate-700 transition-colors hover:border-primary/40 hover:text-primary"
              >
                Poser une question
                <ChevronRight className="h-5 w-5" />
              </a>
            </div>
            <p className="text-sm text-slate-500">
              Sans engagement immédiat - échange découverte gratuit.
            </p>
          </motion.div>

          <motion.aside
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-3xl border border-white/70 bg-white/85 p-7 shadow-2xl shadow-slate-300/40 backdrop-blur"
          >
            <p className="text-sm font-semibold uppercase tracking-[0.12em] text-slate-500">
              Pourquoi maintenant
            </p>
            <h2 className="mt-3 text-2xl font-bold text-slate-950">
              Votre soutien peut tout changer cette semaine.
            </h2>
            <ul className="mt-6 space-y-3">
              {[
                "Des parents ont besoin d'une présence neutre et apaisante.",
                "Chaque intervention réduit la tension et sécurise les échanges.",
                "Vous êtes formé(e), accompagné(e) et jamais seul(e).",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-slate-700">
                  <BadgeCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </motion.aside>
        </div>

        <div className="relative border-t border-slate-200/70 bg-white/90">
          <div className="mx-auto grid max-w-6xl grid-cols-2 gap-5 px-4 py-6 sm:grid-cols-4">
            {[
              { value: "100%", label: "Gratuit et sans engagement" },
              { value: "100%", label: "Confidentiel" },
              { value: "Sur mesure", label: "Missions adaptées à votre profil" },
              { value: "En continu", label: "Accompagnement des bénévoles" },
            ].map((item) => (
              <div key={item.label} className="rounded-2xl bg-slate-50/80 p-4 text-center">
                <p className="text-2xl font-bold text-slate-900">{item.value}</p>
                <p className="mt-1 text-sm text-slate-600">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <SectionFade className="py-16 sm:py-20" delay={0.05}>
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-center text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            Pourquoi rejoindre Papa pour la vie
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-slate-600">
            Vous rejoignez un collectif structuré, exigeant et profondément humain.
          </p>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {motivations.map((item) => (
              <motion.article
                key={item.title}
                whileHover={{ y: -6 }}
                transition={{ duration: 0.2 }}
                className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm shadow-slate-200/60"
              >
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <item.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-5 text-xl font-semibold text-slate-900">{item.title}</h3>
                <p className="mt-3 leading-relaxed text-slate-600">{item.description}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </SectionFade>

      <SectionFade className="bg-white py-16 sm:py-20" delay={0.08}>
        <div className="mx-auto grid max-w-6xl gap-8 px-4 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-3xl border border-slate-200 bg-slate-50/70 p-7 sm:p-9">
            <p className="text-sm font-semibold uppercase tracking-[0.1em] text-slate-500">
              Vos missions
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950">
              3 façons d'aider selon votre profil
            </h2>
            <p className="mt-4 leading-relaxed text-slate-600">
              Vous choisissez un format compatible avec votre emploi du temps.
              Notre équipe vous oriente vers les missions où vous serez le plus utile.
            </p>
            <Link
              href="/devenir-benevole/formulaire"
              className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80"
            >
              Voir le formulaire de candidature
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid gap-5 sm:grid-cols-3 lg:grid-cols-1">
            {missions.map((item) => (
              <article
                key={item.title}
                className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-sky-100 text-primary">
                  <item.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-slate-900">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  {item.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </SectionFade>

      <SectionFade className="py-16 sm:py-20" delay={0.1}>
        <div className="mx-auto grid max-w-6xl gap-7 px-4 lg:grid-cols-2">
          <article className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm sm:p-9">
            <h2 className="text-2xl font-bold text-slate-950 sm:text-3xl">
              Le profil recherché
            </h2>
            <p className="mt-3 text-slate-600">
              Nous privilégions des personnes stables, fiables et capables de garder
              une posture juste dans des contextes émotionnellement chargés.
            </p>
            <ul className="mt-6 space-y-3">
              {profilePoints.map((text) => (
                <li key={text} className="flex items-start gap-3 rounded-xl bg-slate-50 p-3.5">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <span className="text-slate-700">{text}</span>
                </li>
              ))}
            </ul>
          </article>
          <article className="rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/5 via-sky-50 to-white p-7 sm:p-9">
            <h3 className="text-2xl font-bold text-slate-950">Notre engagement envers vous</h3>
            <ul className="mt-5 space-y-4 text-slate-700">
              <li className="flex items-start gap-3">
                <Clock3 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <span>Un cadre clair pour intervenir avec sécurité et sérénité.</span>
              </li>
              <li className="flex items-start gap-3">
                <Users className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <span>Un référent disponible pour vous accompagner en continu.</span>
              </li>
              <li className="flex items-start gap-3">
                <BadgeCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <span>Des missions cohérentes avec vos compétences et vos limites.</span>
              </li>
            </ul>
            <p className="mt-6 text-sm text-slate-500">
              L'objectif n'est pas d'en faire plus. C'est d'agir juste, au bon moment.
            </p>
          </article>
        </div>
      </SectionFade>

      <SectionFade className="bg-white py-16 sm:py-20" delay={0.12}>
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-center text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            Un parcours d'intégration clair et rapide
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-slate-600">
            Vous savez exactement comment vous lancer, étape par étape.
          </p>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {parcours.map((item) => (
              <motion.article
                key={item.step}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.4 }}
                className="rounded-3xl border border-slate-200 bg-slate-50/70 p-6"
              >
                <p className="text-sm font-semibold tracking-[0.08em] text-primary">
                  ETAPE {item.step}
                </p>
                <div className="mt-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white text-primary shadow-sm">
                  <item.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-slate-900">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  {item.description}
                </p>
              </motion.article>
            ))}
          </div>
        </div>
      </SectionFade>

      <SectionFade className="py-16 sm:py-20" delay={0.14}>
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="text-center text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            Questions fréquentes
          </h2>
          <div className="mt-8 space-y-4">
            {faqs.map((faq) => (
              <details
                key={faq.question}
                className="group rounded-2xl border border-slate-200 bg-white p-5 open:shadow-sm"
              >
                <summary className="cursor-pointer list-none pr-8 text-base font-semibold text-slate-900 marker:content-none">
                  {faq.question}
                </summary>
                <p className="mt-3 leading-relaxed text-slate-600">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </SectionFade>

      <section className="pb-20 pt-6 sm:pb-24">
        <div className="mx-auto max-w-5xl px-4">
          <div className="rounded-[2rem] bg-gradient-to-br from-primary to-sky-600 p-8 text-center text-primary-foreground shadow-2xl shadow-primary/35 sm:p-12">
            <p className="text-sm font-semibold uppercase tracking-[0.1em] text-white/80">
              Prêt(e) à vous engager ?
            </p>
            <h2 className="mx-auto mt-3 max-w-3xl text-3xl font-bold tracking-tight sm:text-4xl">
              Rejoignez une équipe qui agit avec humanité, méthode et impact.
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-white/90">
              Votre implication peut transformer durablement le quotidien d'une famille.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/devenir-benevole/formulaire"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-7 py-3.5 font-semibold text-primary transition-colors hover:bg-slate-100"
              >
                Postuler maintenant
                <ArrowRight className="h-5 w-5" />
              </Link>
              <a
                href="mailto:contact@dadforlife.org?subject=Candidature%20b%C3%A9n%C3%A9vole"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/40 px-7 py-3.5 font-semibold text-white hover:bg-white/10"
              >
                Ecrire à l'équipe
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
