"use server";

import { auth, signIn } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export type DiagnosticInput = {
  fullName?: string;
  email?: string;
  phone?: string;
  password?: string;
  situation: string;
  nombreEnfants: number;
  ageEnfants: string;
  residenceEnfants: string;
  decisionJustice: string;
  communication: string;
  avocat: string;
  preoccupation: string;
  source: string;
};

type SubmitResult =
  | { success: true; isNewUser: boolean }
  | { success: false; error: string };

function computeScores(input: DiagnosticInput) {
  let tension = 0;
  if (input.communication === "Tendue") tension = 2;
  else if (input.communication === "Très conflictuelle") tension = 4;
  else if (input.communication === "Inexistante") tension = 3;

  let risqueJuridique = 0;
  if (input.decisionJustice === "Oui") {
    risqueJuridique = 2;
  } else if (input.decisionJustice === "Procédure en cours") {
    risqueJuridique = 3;
    if (input.avocat === "Non") risqueJuridique += 3;
  }

  let stabiliteEmotionnelle = 0;
  if (input.communication === "Très conflictuelle") stabiliteEmotionnelle += 2;
  if (input.communication === "Inexistante") stabiliteEmotionnelle += 1;
  if (input.avocat === "Non" && input.communication !== "Correcte") {
    stabiliteEmotionnelle += 1;
  }

  let preparationStrategique = 0;
  if (input.avocat === "Oui") preparationStrategique += 3;
  if (input.decisionJustice === "Oui") preparationStrategique += 2;
  if (input.residenceEnfants === "Garde alternée") preparationStrategique += 2;
  if (input.communication === "Correcte") preparationStrategique += 2;

  const globalRisk =
    Math.round(
      (tension * 1.5 +
        risqueJuridique * 2 +
        stabiliteEmotionnelle * 1.5 -
        preparationStrategique * 1) *
        10
    ) / 10;

  let classification: string;
  if (globalRisk <= 10) classification = "Situation maîtrisée";
  else if (globalRisk <= 20) classification = "Sous tension";
  else if (globalRisk <= 30) classification = "Conflit élevé";
  else classification = "Risque critique";

  const plans: Record<string, { title: string; content: string }> = {
    "Situation maîtrisée": {
      title: "Prévention et leadership",
      content:
        "Votre situation est stable. Nous vous recommandons notre module de prévention et de leadership parental : maintenir une communication structurée, garder des traces écrites des échanges importants et rester centré sur l\u2019intérêt de l\u2019enfant.",
    },
    "Sous tension": {
      title: "Plan de stabilisation sur 7 jours",
      content:
        "Nous vous proposons un plan de stabilisation sur 7 jours : limiter les échanges aux sujets essentiels, privilégier l\u2019écrit pour garder des traces, éviter les réponses à chaud.",
    },
    "Conflit élevé": {
      title: "Communication écrite et organisation des preuves",
      content:
        "Un plan structuré s\u2019impose : communiquer uniquement par écrit, noter les dates et faits importants, classer les preuves. Ne pas réagir aux provocations.",
    },
    "Risque critique": {
      title: "Consultation avocat et suivi prioritaire",
      content:
        "Nous vous recommandons de consulter un avocat spécialisé en droit de la famille rapidement, tout en gardant le calme et en évitant toute escalade.",
    },
  };

  const plan = plans[classification] ?? plans["Situation maîtrisée"];

  return {
    scores: { tension, risqueJuridique, stabiliteEmotionnelle, preparationStrategique },
    globalRisk,
    classification,
    planTitle: plan.title,
    planContent: plan.content,
  };
}

export async function submitDiagnostic(input: DiagnosticInput): Promise<SubmitResult> {
  try {
    if (
      !input.situation ||
      !input.residenceEnfants ||
      !input.decisionJustice ||
      !input.communication ||
      !input.avocat ||
      !input.source
    ) {
      return { success: false, error: "Veuillez remplir toutes les questions de l'évaluation." };
    }

    const session = await auth();
    let userId: string;
    let isNewUser = false;

    if (session?.user?.id) {
      userId = session.user.id;
    } else {
      if (!input.fullName || !input.email || !input.password) {
        return { success: false, error: "Veuillez remplir tous les champs obligatoires." };
      }
      if (input.password.length < 6) {
        return { success: false, error: "Le mot de passe doit contenir au moins 6 caractères." };
      }

      const existing = await prisma.user.findUnique({ where: { email: input.email } });
      if (existing) {
        return { success: false, error: "Cet email est déjà utilisé. Veuillez vous connecter ou utiliser un autre email." };
      }

      const passwordHash = await bcrypt.hash(input.password, 12);
      const newUser = await prisma.user.create({
        data: {
          email: input.email,
          fullName: input.fullName,
          phone: input.phone || null,
          passwordHash,
          emailVerified: new Date(),
          primaryRole: "papa_aide",
          roles: ["member"],
        },
      });

      userId = newUser.id;
      isNewUser = true;

      try {
        await signIn("credentials", { email: input.email, password: input.password, redirect: false });
      } catch {
        // User can log in manually
      }
    }

    const result = computeScores(input);

    await prisma.diagnostic.create({
      data: {
        userId,
        formData: {
          situation: input.situation,
          nombreEnfants: input.nombreEnfants,
          ageEnfants: input.ageEnfants,
          residenceEnfants: input.residenceEnfants,
          decisionJustice: input.decisionJustice,
          communication: input.communication,
          avocat: input.avocat,
          preoccupation: input.preoccupation,
          source: input.source,
        },
        scoreTension: result.scores.tension,
        scoreRisqueJuridique: result.scores.risqueJuridique,
        scoreStabiliteEmotionnelle: result.scores.stabiliteEmotionnelle,
        scorePreparationStrategique: result.scores.preparationStrategique,
        scoreGlobal: result.globalRisk,
        classification: result.classification,
        planTitle: result.planTitle,
        planContent: result.planContent,
      },
    });

    return { success: true, isNewUser };
  } catch (e) {
    console.error("submitDiagnostic exception:", e);
    return { success: false, error: "Une erreur inattendue s\u2019est produite. Veuillez réessayer." };
  }
}
