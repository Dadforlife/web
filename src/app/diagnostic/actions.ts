"use server";

import { createClient } from "@/lib/supabase/server";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export type DiagnosticInput = {
  // Section A – Informations générales (uniquement si non connecté)
  fullName?: string;
  email?: string;
  phone?: string;
  password?: string;
  // Section B – Situation familiale
  situation: string;
  nombreEnfants: number;
  ageEnfants: string;
  residenceEnfants: string;
  decisionJustice: string;
  // Section C – Situation personnelle
  communication: string;
  avocat: string;
  preoccupation: string;
  source: string;
};

type SubmitResult =
  | { success: true; isNewUser: boolean }
  | { success: false; error: string };

// ─────────────────────────────────────────────────────────────────────────────
// Scoring simplifié (même formule que le chat existant, adapté au formulaire)
// ─────────────────────────────────────────────────────────────────────────────

function computeScores(input: DiagnosticInput) {
  // Tension (0‑10)
  let tension = 0;
  if (input.communication === "Tendue") tension = 2;
  else if (input.communication === "Très conflictuelle") tension = 4;
  else if (input.communication === "Inexistante") tension = 3;

  // Risque juridique (0‑15)
  let risqueJuridique = 0;
  if (input.decisionJustice === "Oui") {
    risqueJuridique = 2;
  } else if (input.decisionJustice === "Procédure en cours") {
    risqueJuridique = 3;
    if (input.avocat === "Non") risqueJuridique += 3;
  }

  // Stabilité émotionnelle (0‑10)
  let stabiliteEmotionnelle = 0;
  if (input.communication === "Très conflictuelle") stabiliteEmotionnelle += 2;
  if (input.communication === "Inexistante") stabiliteEmotionnelle += 1;
  if (input.avocat === "Non" && input.communication !== "Correcte") {
    stabiliteEmotionnelle += 1;
  }

  // Préparation stratégique (0‑10)
  let preparationStrategique = 0;
  if (input.avocat === "Oui") preparationStrategique += 3;
  if (input.decisionJustice === "Oui") preparationStrategique += 2;
  if (input.residenceEnfants === "Garde alternée") preparationStrategique += 2;
  if (input.communication === "Correcte") preparationStrategique += 2;

  // Score global
  const globalRisk =
    Math.round(
      (tension * 1.5 +
        risqueJuridique * 2 +
        stabiliteEmotionnelle * 1.5 -
        preparationStrategique * 1) *
        10
    ) / 10;

  // Classification
  let classification: string;
  if (globalRisk <= 10) classification = "Situation maîtrisée";
  else if (globalRisk <= 20) classification = "Sous tension";
  else if (globalRisk <= 30) classification = "Conflit élevé";
  else classification = "Risque critique";

  // Plans d'action (vouvoiement)
  const plans: Record<string, { title: string; content: string }> = {
    "Situation maîtrisée": {
      title: "Prévention et leadership",
      content:
        "Votre situation est stable. Nous vous recommandons notre module de prévention et de leadership parental : maintenir une communication structurée, garder des traces écrites des échanges importants et rester centré sur l\u2019intérêt de l\u2019enfant. Cela vous permettra de consolider votre posture et d\u2019anticiper d\u2019éventuelles tensions.",
    },
    "Sous tension": {
      title: "Plan de stabilisation sur 7 jours",
      content:
        "Nous vous proposons un plan de stabilisation sur 7 jours : limiter les échanges aux sujets essentiels (école, santé, rendez-vous), privilégier l\u2019écrit (SMS ou mail) pour garder des traces, éviter les réponses à chaud. L\u2019objectif est de désamorcer la tension tout en protégeant votre relation avec vos enfants. Calme et structure sont vos meilleurs atouts.",
    },
    "Conflit élevé": {
      title: "Communication écrite et organisation des preuves",
      content:
        "Un plan structuré s\u2019impose : communiquer uniquement par écrit (mails ou SMS conservés), noter les dates et faits importants, classer les preuves (messages, décisions, refus). Ne pas réagir aux provocations. L\u2019association peut vous accompagner pour mettre en place cette organisation. L\u2019objectif est de vous protéger et de préserver l\u2019intérêt de l\u2019enfant dans un cadre clair.",
    },
    "Risque critique": {
      title: "Consultation avocat et suivi prioritaire",
      content:
        "Nous vous recommandons de consulter un avocat spécialisé en droit de la famille rapidement, tout en gardant le calme et en évitant toute escalade. En parallèle, notre équipe peut vous offrir un suivi prioritaire : structurer vos preuves, cadrer votre communication et vous accompagner dans les prochaines étapes. Agir de façon posée et organisée reste essentiel pour vous et pour vos enfants.",
    },
  };

  const plan = plans[classification] ?? plans["Situation maîtrisée"];

  return {
    scores: {
      tension,
      risqueJuridique,
      stabiliteEmotionnelle,
      preparationStrategique,
    },
    globalRisk,
    classification,
    planTitle: plan.title,
    planContent: plan.content,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Action principale
// ─────────────────────────────────────────────────────────────────────────────

export async function submitDiagnostic(
  input: DiagnosticInput
): Promise<SubmitResult> {
  try {
    const supabase = await createClient();

    // --- Validation des champs diagnostic (B + C) ---
    if (
      !input.situation ||
      !input.residenceEnfants ||
      !input.decisionJustice ||
      !input.communication ||
      !input.avocat ||
      !input.source
    ) {
      return {
        success: false,
        error: "Veuillez remplir toutes les questions du diagnostic.",
      };
    }

    // --- Déterminer l'état d'authentification ---
    const {
      data: { user: existingUser },
    } = await supabase.auth.getUser();

    let userId: string;
    let isNewUser = false;

    if (existingUser) {
      // Utilisateur déjà connecté
      userId = existingUser.id;
    } else {
      // Nouveau compte requis
      if (!input.fullName || !input.email || !input.password) {
        return {
          success: false,
          error: "Veuillez remplir tous les champs obligatoires.",
        };
      }
      if (input.password.length < 6) {
        return {
          success: false,
          error: "Le mot de passe doit contenir au moins 6 caractères.",
        };
      }

      const { data: signUpData, error: signUpError } =
        await supabase.auth.signUp({
          email: input.email,
          password: input.password,
          options: {
            data: {
              full_name: input.fullName,
              phone: input.phone || undefined,
            },
          },
        });

      if (signUpError) {
        if (signUpError.message.includes("already registered")) {
          return {
            success: false,
            error:
              "Cet email est déjà utilisé. Veuillez vous connecter ou utiliser un autre email.",
          };
        }
        if (
          signUpError.message.toLowerCase().includes("rate limit") ||
          signUpError.message.toLowerCase().includes("rate_limit")
        ) {
          return {
            success: false,
            error:
              "Trop de tentatives d'inscription. Veuillez réessayer dans quelques minutes.",
          };
        }
        return { success: false, error: signUpError.message };
      }

      if (!signUpData.user) {
        return {
          success: false,
          error: "Erreur lors de la création du compte.",
        };
      }

      userId = signUpData.user.id;
      isNewUser = true;

      // Définir la session côté serveur pour que l'insert respecte la RLS (auth.uid() = user_id)
      if (signUpData.session) {
        const { error: sessionError } = await supabase.auth.setSession({
          access_token: signUpData.session.access_token,
          refresh_token: signUpData.session.refresh_token,
        });
        if (sessionError) {
          console.error("submitDiagnostic setSession error:", sessionError);
        }
      }
    }

    // --- Calculer les scores ---
    const result = computeScores(input);

    // --- Sauvegarder le diagnostic ---
    const { error: insertError } = await supabase.from("diagnostics").insert({
      user_id: userId,
      form_data: {
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
      score_tension: result.scores.tension,
      score_risque_juridique: result.scores.risqueJuridique,
      score_stabilite_emotionnelle: result.scores.stabiliteEmotionnelle,
      score_preparation_strategique: result.scores.preparationStrategique,
      score_global: result.globalRisk,
      classification: result.classification,
      plan_title: result.planTitle,
      plan_content: result.planContent,
    });

    if (insertError) {
      console.error("submitDiagnostic insert error:", insertError);
      return {
        success: false,
        error:
          "Erreur lors de l\u2019enregistrement du diagnostic. Veuillez réessayer.",
      };
    }

    return { success: true, isNewUser };
  } catch (e) {
    console.error("submitDiagnostic exception:", e);
    return {
      success: false,
      error: "Une erreur inattendue s\u2019est produite. Veuillez réessayer.",
    };
  }
}
