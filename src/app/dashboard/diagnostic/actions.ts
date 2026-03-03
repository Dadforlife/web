"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export type DiagnosticFormData = {
  situation?: string;
  nombreEnfants?: number;
  ageEnfants?: string;
  residenceEnfants?: string;
  decisionJuge?: string;
  decisionRespectee?: string;
  detailNonRespect?: string;
  communication?: string;
  problemesComm?: string[];
  avocat?: string;
  consultationAvocat?: string;
  proceduresExistantes?: string[];
  risquePrincipal?: string;
  messageRegrette?: string;
};

export type DiagnosticResultPayload = {
  scores: {
    tension: number;
    risqueJuridique: number;
    stabiliteEmotionnelle: number;
    preparationStrategique: number;
  };
  classification: string;
  globalRisk: number;
  planTitle: string;
  planContent: string;
};

export async function saveDiagnostic(
  formData: DiagnosticFormData,
  result: DiagnosticResultPayload
): Promise<{ success: true; id: string } | { success: false; error: string }> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Non connecté. Reconnecte-toi puis réessaie." };
    }

    const row = await prisma.diagnostic.create({
      data: {
        userId: session.user.id,
        formData: formData as object,
        scoreTension: result.scores.tension,
        scoreRisqueJuridique: result.scores.risqueJuridique,
        scoreStabiliteEmotionnelle: result.scores.stabiliteEmotionnelle,
        scorePreparationStrategique: result.scores.preparationStrategique,
        scoreGlobal: result.globalRisk,
        classification: result.classification,
        planTitle: result.planTitle,
        planContent: result.planContent,
      },
      select: { id: true },
    });

    return { success: true, id: row.id };
  } catch (e) {
    console.error("saveDiagnostic exception:", e);
    return {
      success: false,
      error: e instanceof Error ? e.message : "Une erreur inattendue s'est produite.",
    };
  }
}

export type LatestDiagnostic = {
  id: string;
  created_at: string;
  classification: string;
  score_global: number;
  plan_title: string;
  plan_content: string;
  score_tension: number;
  score_risque_juridique: number;
  score_stabilite_emotionnelle: number;
  score_preparation_strategique: number;
};

export async function getLatestDiagnostic(): Promise<LatestDiagnostic | null> {
  try {
    const session = await auth();
    if (!session?.user?.id) return null;

    const data = await prisma.diagnostic.findFirst({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    });

    if (!data) return null;

    return {
      id: data.id,
      created_at: data.createdAt.toISOString(),
      classification: data.classification,
      score_global: Number(data.scoreGlobal),
      plan_title: data.planTitle,
      plan_content: data.planContent,
      score_tension: data.scoreTension,
      score_risque_juridique: data.scoreRisqueJuridique,
      score_stabilite_emotionnelle: data.scoreStabiliteEmotionnelle,
      score_preparation_strategique: data.scorePreparationStrategique,
    };
  } catch {
    return null;
  }
}
