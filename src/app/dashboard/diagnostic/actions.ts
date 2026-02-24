"use server";

import { createClient } from "@/lib/supabase/server";

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
    const supabase = await createClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return { success: false, error: "Non connecté. Reconnecte-toi puis réessaie." };
    }

    const { data: row, error } = await supabase
      .from("diagnostics")
      .insert({
        user_id: user.id,
        form_data: formData,
        score_tension: result.scores.tension,
        score_risque_juridique: result.scores.risqueJuridique,
        score_stabilite_emotionnelle: result.scores.stabiliteEmotionnelle,
        score_preparation_strategique: result.scores.preparationStrategique,
        score_global: result.globalRisk,
        classification: result.classification,
        plan_title: result.planTitle,
        plan_content: result.planContent,
      })
      .select("id")
      .single();

    if (error) {
      console.error("saveDiagnostic error:", error);
      return {
        success: false,
        error: error.message ?? "Erreur lors de l'enregistrement.",
      };
    }

    return { success: true, id: (row?.id as string) ?? "" };
  } catch (e) {
    console.error("saveDiagnostic exception:", e);
    return {
      success: false,
      error: e instanceof Error ? e.message : "Une erreur inattendue s'est produite.",
    };
  }
}

/** Dernier diagnostic enregistré (pour affichage météo + plan) */
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
    const supabase = await createClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) return null;

    const { data, error } = await supabase
      .from("diagnostics")
      .select(
        "id, created_at, classification, score_global, plan_title, plan_content, score_tension, score_risque_juridique, score_stabilite_emotionnelle, score_preparation_strategique"
      )
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error || !data) return null;
    return data as LatestDiagnostic;
  } catch {
    return null;
  }
}
