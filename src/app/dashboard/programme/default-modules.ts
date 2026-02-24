import type { ProgrammeModuleDisplay } from "./programme-content";

/** Modules par défaut (fallback si program_modules vide en base) */
export const DEFAULT_MODULES: Omit<ProgrammeModuleDisplay, "status">[] = [
  {
    number: 1,
    title: "Comprendre la séparation",
    description:
      "Identifier les étapes du deuil relationnel et poser les bases d'une reconstruction sereine.",
    duration: "45 min",
    hasVideo: true,
    hasText: true,
    checklist: [
      "Lire le guide d'introduction",
      "Regarder la vidéo témoignage",
      "Compléter l'exercice d'auto-évaluation",
    ],
  },
  {
    number: 2,
    title: "Gérer ses émotions",
    description:
      "Apprendre à canaliser colère, tristesse et anxiété pour rester un père présent et stable.",
    duration: "50 min",
    hasVideo: true,
    hasText: true,
    checklist: [
      "Lire le module sur l'intelligence émotionnelle",
      "Pratiquer l'exercice de respiration guidée",
      "Tenir le journal émotionnel pendant 3 jours",
    ],
  },
  {
    number: 3,
    title: "Droits et devoirs parentaux",
    description:
      "Comprendre le cadre juridique de la garde, la pension alimentaire et l'autorité parentale.",
    duration: "60 min",
    hasVideo: true,
    hasText: true,
    checklist: [
      "Lire le guide juridique simplifié",
      "Regarder l'interview de l'avocate partenaire",
      "Préparer sa liste de questions juridiques",
    ],
  },
  {
    number: 4,
    title: "Communication avec l'autre parent",
    description:
      "Techniques de communication non-violente pour maintenir un dialogue constructif.",
    duration: "55 min",
    hasVideo: true,
    hasText: true,
    checklist: [
      "Lire le guide de la communication bienveillante",
      "Pratiquer les scénarios de médiation",
      "Mettre en place un canal de communication structuré",
    ],
  },
  {
    number: 5,
    title: "Construire la coparentalité",
    description:
      "Mettre en place un cadre de coparentalité efficace centré sur le bien-être de l'enfant.",
    duration: "50 min",
    hasVideo: true,
    hasText: true,
    checklist: [
      "Lire le guide de la coparentalité",
      "Créer son planning parental partagé",
      "Définir les règles communes entre foyers",
    ],
  },
  {
    number: 6,
    title: "Mon nouveau cadre de vie",
    description:
      "Planifier l'avenir, consolider les acquis et rejoindre la communauté de pères accompagnés.",
    duration: "40 min",
    hasVideo: true,
    hasText: true,
    checklist: [
      "Rédiger son plan d'action personnel",
      "Fixer ses objectifs à 3 et 6 mois",
      "Rejoindre un groupe de suivi",
    ],
  },
];

function formatDuration(minutes: number | null): string {
  if (minutes == null) return "— min";
  return `${minutes} min`;
}

export function dbModuleToDisplay(
  row: {
    module_number: number;
    title: string;
    description: string | null;
    duration_minutes: number | null;
    video_url: string | null;
    content: string | null;
  },
  fallback: (typeof DEFAULT_MODULES)[0]
): Omit<ProgrammeModuleDisplay, "status"> {
  return {
    number: row.module_number,
    title: row.title,
    description: row.description ?? fallback.description,
    duration: formatDuration(row.duration_minutes),
    hasVideo: Boolean(row.video_url),
    hasText: Boolean(row.content),
    checklist: fallback.checklist,
  };
}
