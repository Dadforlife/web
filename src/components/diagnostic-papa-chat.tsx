"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { saveDiagnostic } from "@/app/dashboard/diagnostic/actions";

// ─────────────────────────────────────────────────────────────────────────────
// DiagnosticPapaChat – Formulaire conversationnel pour association pères
// Style sobre, professionnel, rassurant. Ton neutre. Focus père + intérêt enfant.
// Une question à la fois, réponses stockées dans formData, submit → console.
// ─────────────────────────────────────────────────────────────────────────────

/** Toutes les clés du formulaire (réponses utilisateur) */
interface FormData {
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
}

/** Scores calculés à partir du formulaire */
export interface DiagnosticScores {
  tension: number;
  risqueJuridique: number;
  stabiliteEmotionnelle: number;
  preparationStrategique: number;
}

/** Résultat du calcul global et classification */
export interface DiagnosticResult {
  scores: DiagnosticScores;
  globalRisk: number;
  classification:
    | "Situation maîtrisée"
    | "Sous tension"
    | "Conflit élevé"
    | "Risque critique";
  planTitle: string;
  planContent: string;
}

/** Un message dans le fil du chat */
interface Message {
  id: number;
  sender: "bot" | "user";
  text: string;
}

/** Constantes des étapes du flow (logique conditionnelle intégrée) */
const STEPS = {
  INTRO: 0,
  SITUATION: 1,
  ENFANTS_NOMBRE: 2,
  ENFANTS_AGE: 3,
  ENFANTS_RESIDENCE: 4,
  DECISION_JUGE: 5,
  DECISION_RESPECTEE: 6,
  DETAIL_NON_RESPECT: 7,
  COMMUNICATION: 8,
  PROBLEMES_COMM: 9,
  AVOCAT: 10,
  CONSULTATION_AVOCAT: 11,
  PROCEDURES: 12,
  RISQUE: 13,
  MESSAGE_REGRETTE: 14,
  FIN: 15,
  RESULTS: 16,
  QUITTER: 17,
} as const;

const MESSAGE_INTRO =
  "Merci d'avoir rejoint l'association. Nous allons comprendre ta situation pour pouvoir t'accompagner efficacement. Tout reste confidentiel. On commence ?";

const MESSAGE_QUITTER =
  "Pas de souci. Tu peux revenir quand tu le souhaites. Prends soin de toi.";

// Items des problèmes de communication qui ajoutent +1 au score tension (sans "Autre")
const PROBLEMES_TENSION = [
  "Refus de dialogue",
  "Messages agressifs",
  "Blocage d'accès aux enfants",
  "Manipulation des enfants",
  "Fausses accusations",
];

// ─────────────────────────────────────────────────────────────────────────────
// Scoring : calcul des 4 scores à partir de formData
// ─────────────────────────────────────────────────────────────────────────────

function scoreTension(formData: FormData): number {
  let s = 0;
  const comm = formData.communication;
  if (comm === "Correcte") s = 0;
  else if (comm === "Tendue") s = 2;
  else if (comm === "Très conflictuelle") s = 4;
  else if (comm === "Inexistante") s = 3;

  const problemes = formData.problemesComm ?? [];
  const nbProblemes = problemes.filter((p) => PROBLEMES_TENSION.includes(p)).length;
  s = Math.min(10, s + nbProblemes);
  return s;
}

function scoreRisqueJuridique(formData: FormData): number {
  let s = 0;
  const decisionJuge = formData.decisionJuge;
  const decisionRespectee = formData.decisionRespectee;

  if (decisionJuge === "Oui") {
    if (decisionRespectee === "Oui") s = 0;
    else if (decisionRespectee === "Partiellement") s = 3;
    else if (decisionRespectee === "Non") s = 5;
  } else {
    s = 0;
  }

  const procedures = formData.proceduresExistantes ?? [];
  if (procedures.includes("Main courante")) s += 1;
  if (procedures.includes("Plainte")) s += 3;
  if (procedures.includes("Signalement")) s += 3;
  if (procedures.includes("Expertise psychologique")) s += 2;
  if (procedures.includes("Enquête sociale")) s += 3;

  const procedureEnCours = decisionJuge === "Procédure en cours";
  const pasAvocat = formData.avocat === "Non";
  if (procedureEnCours && pasAvocat) s += 3;

  return Math.min(15, s);
}

function scoreStabiliteEmotionnelle(formData: FormData): number {
  let s = 0;
  if (formData.communication === "Très conflictuelle") s += 2;
  if (formData.risquePrincipal === "Être accusé injustement") s += 2;
  if (formData.risquePrincipal === "Conflit permanent") s += 2;

  const problemes = formData.problemesComm ?? [];
  const plusieursTensions = problemes.filter((p) => PROBLEMES_TENSION.includes(p)).length >= 2;
  if (plusieursTensions && formData.avocat === "Non") s += 2;
  if (formData.messageRegrette === "Oui") s += 2;

  return Math.min(10, s);
}

function scorePreparationStrategique(formData: FormData): number {
  let s = 0;
  if (formData.avocat === "Oui") s += 3;
  if (formData.decisionJuge === "Oui") s += 2;
  if (formData.residenceEnfants === "Garde alternée") s += 2;

  const procedures = formData.proceduresExistantes ?? [];
  const aucuneProcedure =
    procedures.length === 0 ||
    (procedures.length === 1 && procedures[0] === "Aucune procédure");
  if (aucuneProcedure) s += 2;
  if (formData.communication === "Correcte") s += 2;

  return Math.min(10, s);
}

export function calculateScores(formData: FormData): DiagnosticScores {
  return {
    tension: scoreTension(formData),
    risqueJuridique: scoreRisqueJuridique(formData),
    stabiliteEmotionnelle: scoreStabiliteEmotionnelle(formData),
    preparationStrategique: scorePreparationStrategique(formData),
  };
}

function computeGlobalRisk(scores: DiagnosticScores): number {
  return (
    scores.tension * 1.5 +
    scores.risqueJuridique * 2 +
    scores.stabiliteEmotionnelle * 1.5 -
    scores.preparationStrategique * 1
  );
}

function getClassification(globalRisk: number): DiagnosticResult["classification"] {
  if (globalRisk <= 10) return "Situation maîtrisée";
  if (globalRisk <= 20) return "Sous tension";
  if (globalRisk <= 30) return "Conflit élevé";
  return "Risque critique";
}

// ─────────────────────────────────────────────────────────────────────────────
// Profil et plan d'action selon classification (ton neutre, responsabilisant)
// ─────────────────────────────────────────────────────────────────────────────

export function generateProfile(scores: DiagnosticScores): {
  classification: DiagnosticResult["classification"];
  globalRisk: number;
  planTitle: string;
  planContent: string;
} {
  const globalRisk = Math.round(computeGlobalRisk(scores) * 10) / 10;
  const classification = getClassification(globalRisk);

  const plans: Record<
    DiagnosticResult["classification"],
    { title: string; content: string }
  > = {
    "Situation maîtrisée": {
      title: "Prévention et leadership",
      content:
        "Ta situation est stable. Nous te recommandons notre module de prévention et de leadership parental : maintenir une communication structurée, garder des traces écrites des échanges importants et rester centré sur l'intérêt de l'enfant. Cela te permettra de consolider ta posture et d'anticiper d'éventuelles tensions.",
    },
    "Sous tension": {
      title: "Plan de stabilisation sur 7 jours",
      content:
        "Nous te proposons un plan de stabilisation sur 7 jours : limiter les échanges aux sujets essentiels (école, santé, rendez-vous), privilégier l'écrit (SMS ou mail) pour garder des traces, éviter les réponses à chaud. L'objectif est de désamorcer la tension tout en protégeant ta relation avec tes enfants. Calme et structure sont tes meilleurs atouts.",
    },
    "Conflit élevé": {
      title: "Communication écrite et organisation des preuves",
      content:
        "Un plan structuré s'impose : communiquer uniquement par écrit (mails ou SMS conservés), noter les dates et faits importants, classer les preuves (messages, décisions, refus). Ne pas réagir aux provocations. L'association peut t'accompagner pour mettre en place cette organisation. L'objectif est de te protéger et de préserver l'intérêt de l'enfant dans un cadre clair.",
    },
    "Risque critique": {
      title: "Consultation avocat et suivi prioritaire",
      content:
        "Nous te recommandons de consulter un avocat spécialisé en droit de la famille rapidement, tout en gardant le calme et en évitant toute escalade. En parallèle, notre équipe peut t'offrir un suivi prioritaire : structurer tes preuves, cadrer ta communication et t'accompagner dans les prochaines étapes. Agir de façon posée et organisée reste essentiel pour toi et pour tes enfants.",
    },
  };

  const { title, content } = plans[classification];
  return {
    classification,
    globalRisk,
    planTitle: title,
    planContent: content,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Composant principal
// ─────────────────────────────────────────────────────────────────────────────

export default function DiagnosticPapaChat() {
  const router = useRouter();
  const [step, setStep] = useState<number>(STEPS.INTRO);
  const [formData, setFormData] = useState<FormData>({});
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [multiSelect, setMultiSelect] = useState<string[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [result, setResult] = useState<{
    scores: DiagnosticScores;
    classification: DiagnosticResult["classification"];
    globalRisk: number;
    planTitle: string;
    planContent: string;
  } | null>(null);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [submitError, setSubmitError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const nextId = useRef(0);
  const introSentRef = useRef(false);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Message d'introduction au premier rendu (une seule fois, même en Strict Mode)
  useEffect(() => {
    if (introSentRef.current) return;
    introSentRef.current = true;
    setIsTyping(true);
    const id = nextId.current++;
    setTimeout(() => {
      setMessages((prev) => [...prev, { id, sender: "bot", text: MESSAGE_INTRO }]);
      setIsTyping(false);
    }, 500);
  }, []);

  // ─── Helpers messages ─────────────────────────────────────────────────────

  const addBotMessage = useCallback((text: string) => {
    setIsTyping(true);
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { id: nextId.current++, sender: "bot", text },
      ]);
      setIsTyping(false);
    }, 500);
  }, []);

  const addUserMessage = useCallback((text: string) => {
    setMessages((prev) => [
      ...prev,
      { id: nextId.current++, sender: "user", text },
    ]);
  }, []);

  // ─── Navigation (une seule question affichée à la fois via le dernier message) ───

  const goToNextStep = useCallback(
    (nextStep: number) => {
      setStep(nextStep);
      const botMessages: Record<number, string> = {
        [STEPS.SITUATION]: "Quelle est ta situation actuelle ?",
        [STEPS.ENFANTS_NOMBRE]: "Combien d'enfants as-tu ?",
        [STEPS.ENFANTS_AGE]: "Quel âge ont-ils ?",
        [STEPS.ENFANTS_RESIDENCE]:
          "Où vivent principalement les enfants ?",
        [STEPS.DECISION_JUGE]:
          "Y a-t-il une décision officielle du juge concernant la garde ?",
        [STEPS.DECISION_RESPECTEE]: "Cette décision est-elle respectée ?",
        [STEPS.DETAIL_NON_RESPECT]:
          "Peux-tu expliquer ce qui n'est pas respecté ?",
        [STEPS.COMMUNICATION]:
          "Comment décrirais-tu la communication avec la mère ?",
        [STEPS.PROBLEMES_COMM]:
          "Quels problèmes rencontres-tu ? (Sélectionne tout ce qui s'applique)",
        [STEPS.AVOCAT]: "As-tu un avocat ?",
        [STEPS.CONSULTATION_AVOCAT]: "As-tu déjà consulté un avocat ?",
        [STEPS.PROCEDURES]:
          "Y a-t-il déjà eu : (Sélectionne tout ce qui s'applique)",
        [STEPS.RISQUE]:
          "Aujourd'hui, quel est ton principal risque selon toi ?",
        [STEPS.MESSAGE_REGRETTE]:
          "As-tu déjà envoyé un message que tu regrettes ?",
        [STEPS.FIN]:
          "Merci. Nous allons analyser ta situation et te proposer un accompagnement adapté.",
        [STEPS.QUITTER]: MESSAGE_QUITTER,
      };
      const msg = botMessages[nextStep];
      if (msg) addBotMessage(msg);
    },
    [addBotMessage]
  );

  // ─── Réponses : choix fermés (boutons) ────────────────────────────────────

  const handleChoice = useCallback(
    (label: string) => {
      addUserMessage(label);

      switch (step) {
        case STEPS.INTRO:
          if (label === "Oui") goToNextStep(STEPS.SITUATION);
          else goToNextStep(STEPS.QUITTER);
          break;

        case STEPS.SITUATION:
          setFormData((prev) => ({ ...prev, situation: label }));
          goToNextStep(STEPS.ENFANTS_NOMBRE);
          break;

        case STEPS.ENFANTS_RESIDENCE:
          setFormData((prev) => ({ ...prev, residenceEnfants: label }));
          goToNextStep(STEPS.DECISION_JUGE);
          break;

        case STEPS.DECISION_JUGE:
          setFormData((prev) => ({ ...prev, decisionJuge: label }));
          if (label === "Oui") goToNextStep(STEPS.DECISION_RESPECTEE);
          else goToNextStep(STEPS.COMMUNICATION);
          break;

        case STEPS.DECISION_RESPECTEE:
          setFormData((prev) => ({ ...prev, decisionRespectee: label }));
          if (label === "Oui") goToNextStep(STEPS.COMMUNICATION);
          else goToNextStep(STEPS.DETAIL_NON_RESPECT);
          break;

        case STEPS.COMMUNICATION:
          setFormData((prev) => ({ ...prev, communication: label }));
          if (label === "Tendue" || label === "Très conflictuelle")
            goToNextStep(STEPS.PROBLEMES_COMM);
          else goToNextStep(STEPS.AVOCAT);
          break;

        case STEPS.AVOCAT:
          setFormData((prev) => ({ ...prev, avocat: label }));
          if (label === "Non") goToNextStep(STEPS.CONSULTATION_AVOCAT);
          else goToNextStep(STEPS.PROCEDURES);
          break;

        case STEPS.CONSULTATION_AVOCAT:
          setFormData((prev) => ({ ...prev, consultationAvocat: label }));
          goToNextStep(STEPS.PROCEDURES);
          break;

        case STEPS.RISQUE:
          setFormData((prev) => ({ ...prev, risquePrincipal: label }));
          goToNextStep(STEPS.MESSAGE_REGRETTE);
          break;

        case STEPS.MESSAGE_REGRETTE:
          setFormData((prev) => ({ ...prev, messageRegrette: label }));
          goToNextStep(STEPS.FIN);
          break;

        default:
          break;
      }
    },
    [step, addUserMessage, goToNextStep]
  );

  // ─── Réponses libres (champ texte / number / textarea) ─────────────────────

  const handleTextSubmit = useCallback(() => {
    const value = inputValue.trim();
    if (!value) return;

    addUserMessage(value);
    setInputValue("");

    switch (step) {
      case STEPS.ENFANTS_NOMBRE:
        setFormData((prev) => ({
          ...prev,
          nombreEnfants: parseInt(value, 10) || 0,
        }));
        goToNextStep(STEPS.ENFANTS_AGE);
        break;
      case STEPS.ENFANTS_AGE:
        setFormData((prev) => ({ ...prev, ageEnfants: value }));
        goToNextStep(STEPS.ENFANTS_RESIDENCE);
        break;
      case STEPS.DETAIL_NON_RESPECT:
        setFormData((prev) => ({ ...prev, detailNonRespect: value }));
        goToNextStep(STEPS.COMMUNICATION);
        break;
      default:
        break;
    }
  }, [inputValue, step, addUserMessage, goToNextStep]);

  // ─── Multi-select (sélection multiple) ─────────────────────────────────────

  const toggleMultiSelect = useCallback((item: string) => {
    setMultiSelect((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  }, []);

  const handleMultiSelectSubmit = useCallback(() => {
    if (multiSelect.length === 0) return;
    addUserMessage(multiSelect.join(", "));

    switch (step) {
      case STEPS.PROBLEMES_COMM:
        setFormData((prev) => ({ ...prev, problemesComm: [...multiSelect] }));
        goToNextStep(STEPS.AVOCAT);
        break;
      case STEPS.PROCEDURES:
        setFormData((prev) => ({
          ...prev,
          proceduresExistantes: [...multiSelect],
        }));
        goToNextStep(STEPS.RISQUE);
        break;
      default:
        break;
    }
    setMultiSelect([]);
  }, [multiSelect, step, addUserMessage, goToNextStep]);

  // ─── Soumission finale : enregistrement en BDD puis message ─────────────────

  async function handleSubmit() {
    if (!result) return;
    setSubmitStatus("loading");
    setSubmitError(null);

    const payload = {
      scores: result.scores,
      classification: result.classification,
      globalRisk: result.globalRisk,
      planTitle: result.planTitle,
      planContent: result.planContent,
    };

    const res = await saveDiagnostic(formData, payload);

    if (res.success) {
      setSubmitStatus("success");
      addBotMessage(
        "Tes réponses ont bien été enregistrées. Un membre de l'équipe te contactera prochainement."
      );
      setStep(-1);
      // Retirer la fiche dialogue et afficher uniquement la carte météo
      router.replace("/dashboard/diagnostic");
    } else {
      setSubmitStatus("error");
      setSubmitError(res.error);
    }
  }

  // ─── Réinitialisation (bouton Quitter à l’étape « Plus tard ») ─────────────

  const handleQuitter = useCallback(() => {
    setStep(STEPS.INTRO);
    setFormData({});
    setMessages([]);
    setInputValue("");
    setMultiSelect([]);
    setResult(null);
    setSubmitStatus("idle");
    setSubmitError(null);
    nextId.current = 0;
    addBotMessage(MESSAGE_INTRO);
  }, [addBotMessage]);

  // ─── Rendu des options par étape (une seule question à la fois) ───────────

  const renderInput = () => {
    if (step === -1 || isTyping) return null;

    // Étape « Plus tard » : message fin + bouton quitter
    if (step === STEPS.QUITTER) {
      return (
        <div className="flex justify-center pt-3">
          <button
            type="button"
            onClick={handleQuitter}
            className="rounded-full border border-slate-300 bg-white px-6 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:border-slate-400 hover:bg-slate-50"
          >
            Quitter
          </button>
        </div>
      );
    }

    const choiceSteps: Record<number, string[]> = {
      [STEPS.INTRO]: ["Oui", "Plus tard"],
      [STEPS.SITUATION]: [
        "En couple",
        "En séparation",
        "Séparé",
        "Divorcé",
        "Procédure en cours",
      ],
      [STEPS.ENFANTS_RESIDENCE]: [
        "Chez moi",
        "Chez leur mère",
        "Garde alternée",
        "Situation instable",
      ],
      [STEPS.DECISION_JUGE]: ["Oui", "Non", "Procédure en cours"],
      [STEPS.DECISION_RESPECTEE]: ["Oui", "Partiellement", "Non"],
      [STEPS.COMMUNICATION]: [
        "Correcte",
        "Tendue",
        "Très conflictuelle",
        "Inexistante",
      ],
      [STEPS.AVOCAT]: ["Oui", "Non"],
      [STEPS.CONSULTATION_AVOCAT]: ["Oui", "Non"],
      [STEPS.RISQUE]: [
        "Perdre du temps avec mes enfants",
        "Perdre la garde",
        "Augmentation de pension",
        "Être accusé injustement",
        "Conflit permanent",
        "Je ne sais pas",
      ],
      [STEPS.MESSAGE_REGRETTE]: ["Oui", "Non"],
    };

    const multiSelectSteps: Record<number, string[]> = {
      [STEPS.PROBLEMES_COMM]: [
        "Refus de dialogue",
        "Messages agressifs",
        "Blocage d'accès aux enfants",
        "Manipulation des enfants",
        "Fausses accusations",
        "Autre",
      ],
      [STEPS.PROCEDURES]: [
        "Main courante",
        "Plainte",
        "Signalement",
        "Expertise psychologique",
        "Enquête sociale",
        "Aucune procédure",
      ],
    };

    const textSteps: Record<number, { placeholder: string; type: string }> = {
      [STEPS.ENFANTS_NOMBRE]: {
        placeholder: "Nombre d'enfants",
        type: "number",
      },
      [STEPS.ENFANTS_AGE]: {
        placeholder: "Ex : 3 ans, 7 ans",
        type: "text",
      },
      [STEPS.DETAIL_NON_RESPECT]: {
        placeholder: "Décris la situation...",
        type: "textarea",
      },
    };

    // Étape finale : bouton Terminer → calcul des scores et affichage des résultats
    if (step === STEPS.FIN) {
      return (
        <div className="flex justify-center pt-3">
          <button
            type="button"
            onClick={() => {
              const scores = calculateScores(formData);
              const profile = generateProfile(scores);
              setResult({
                scores,
                classification: profile.classification,
                globalRisk: profile.globalRisk,
                planTitle: profile.planTitle,
                planContent: profile.planContent,
              });
              setStep(STEPS.RESULTS);
            }}
            className="rounded-full bg-blue-900 px-8 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-800"
          >
            Terminer
          </button>
        </div>
      );
    }

    // Vue Résultats : bouton Confirmer et envoyer
    if (step === STEPS.RESULTS) {
      return (
        <div className="space-y-2 pt-3">
          {submitError && (
            <p className="text-center text-sm text-red-600">{submitError}</p>
          )}
          <div className="flex justify-center">
            <button
              type="button"
              onClick={() => void handleSubmit()}
              disabled={submitStatus === "loading"}
              className="rounded-full bg-blue-900 px-8 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-800 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitStatus === "loading" ? "Envoi en cours…" : "Confirmer et envoyer"}
            </button>
          </div>
        </div>
      );
    }

    if (choiceSteps[step]) {
      return (
        <div className="flex flex-wrap gap-2 pt-3">
          {choiceSteps[step].map((label) => (
            <button
              key={label}
              type="button"
              onClick={() => handleChoice(label)}
              className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm text-slate-700 transition-colors hover:border-blue-400 hover:bg-blue-50 hover:text-blue-700"
            >
              {label}
            </button>
          ))}
        </div>
      );
    }

    if (multiSelectSteps[step]) {
      return (
        <div className="space-y-3 pt-3">
          <div className="flex flex-wrap gap-2">
            {multiSelectSteps[step].map((item) => {
              const selected = multiSelect.includes(item);
              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => toggleMultiSelect(item)}
                  className={`rounded-full border px-4 py-2 text-sm transition-colors ${
                    selected
                      ? "border-blue-500 bg-blue-100 text-blue-800"
                      : "border-slate-300 bg-white text-slate-700 hover:border-blue-400 hover:bg-blue-50"
                  }`}
                >
                  {selected ? "✓ " : ""}
                  {item}
                </button>
              );
            })}
          </div>
          {multiSelect.length > 0 && (
            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleMultiSelectSubmit}
                className="rounded-full bg-blue-900 px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-800"
              >
                Valider
              </button>
            </div>
          )}
        </div>
      );
    }

    if (textSteps[step]) {
      const { placeholder, type } = textSteps[step];
      return (
        <div className="flex gap-2 pt-3">
          {type === "textarea" ? (
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={placeholder}
              rows={3}
              className="flex-1 resize-none rounded-xl border border-slate-300 px-4 py-2 text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleTextSubmit();
                }
              }}
            />
          ) : (
            <input
              type={type}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={placeholder}
              min={type === "number" ? 0 : undefined}
              className="flex-1 rounded-full border border-slate-300 px-4 py-2 text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
              onKeyDown={(e) => {
                if (e.key === "Enter") handleTextSubmit();
              }}
            />
          )}
          <button
            type="button"
            onClick={handleTextSubmit}
            className="rounded-full bg-blue-900 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-800"
          >
            Envoyer
          </button>
        </div>
      );
    }

    return null;
  };

  // ─── Rendu : interface minimaliste, div centrée, bulles simples ───────────

  return (
    <div className="mx-auto flex h-[600px] max-w-lg flex-col overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 shadow-lg">
      <div className="border-b border-slate-200 bg-white px-6 py-4">
        <h2 className="text-base font-semibold text-slate-800">
          Évaluation de situation
        </h2>
        <p className="text-xs text-slate-500">
          Confidentiel · Association d&apos;accompagnement
        </p>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${
              msg.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                msg.sender === "bot"
                  ? "bg-white text-slate-700 shadow-sm"
                  : "bg-blue-900 text-white"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="flex gap-1 rounded-2xl bg-white px-4 py-3 shadow-sm">
              <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:0ms]" />
              <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:150ms]" />
              <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:300ms]" />
            </div>
          </div>
        )}

        {step === STEPS.RESULTS && result && (
          <div className="flex justify-start">
            <div className="max-w-[90%] rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <h3 className="mb-3 text-sm font-semibold text-slate-800">
                Résultats de ton évaluation
              </h3>
              <div className="mb-3 grid grid-cols-2 gap-2 text-xs">
                <div className="rounded-lg bg-slate-50 px-3 py-2">
                  <span className="text-slate-500">Tension</span>
                  <p className="font-medium text-slate-800">{result.scores.tension}/10</p>
                </div>
                <div className="rounded-lg bg-slate-50 px-3 py-2">
                  <span className="text-slate-500">Risque juridique</span>
                  <p className="font-medium text-slate-800">{result.scores.risqueJuridique}/15</p>
                </div>
                <div className="rounded-lg bg-slate-50 px-3 py-2">
                  <span className="text-slate-500">Stabilité émotionnelle</span>
                  <p className="font-medium text-slate-800">{result.scores.stabiliteEmotionnelle}/10</p>
                </div>
                <div className="rounded-lg bg-slate-50 px-3 py-2">
                  <span className="text-slate-500">Préparation stratégique</span>
                  <p className="font-medium text-slate-800">{result.scores.preparationStrategique}/10</p>
                </div>
              </div>
              <div className="mb-3 rounded-lg bg-blue-50 px-3 py-2">
                <span className="text-xs text-slate-500">Score global</span>
                <p className="font-semibold text-blue-900">{result.globalRisk}</p>
                <p className="text-xs font-medium text-slate-700">{result.classification}</p>
              </div>
              <div className="rounded-lg border border-slate-100 bg-slate-50/50 px-3 py-2">
                <p className="text-xs font-semibold text-slate-700">{result.planTitle}</p>
                <p className="mt-1 text-xs leading-relaxed text-slate-600">
                  {result.planContent}
                </p>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="border-t border-slate-200 bg-white px-4 py-3">
        {renderInput()}
      </div>
    </div>
  );
}
