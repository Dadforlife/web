/**
 * Sanitization du contenu forum (Espace Papas).
 * Protection XSS : on n'autorise aucun HTML, uniquement du texte brut.
 */

const ENTITY_MAP: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
  "/": "&#x2F;",
  "`": "&#x60;",
  "=": "&#x3D;",
};

export function escapeHtml(text: string): string {
  return String(text).replace(/[&<>"'`=/]/g, (s) => ENTITY_MAP[s] ?? s);
}

/**
 * Sanitize pour affichage : échappe les entités HTML.
 * À utiliser avant d'afficher du contenu utilisateur.
 */
export function sanitizeForDisplay(input: string): string {
  if (typeof input !== "string") return "";
  return escapeHtml(input).replace(/\n/g, "<br />");
}

/**
 * Normalise le contenu avant enregistrement : trim, longueur max, pas de HTML.
 * Retourne la chaîne nettoyée (texte brut uniquement).
 */
export function sanitizeForStorage(input: unknown, maxLength: number): string {
  if (typeof input !== "string") return "";
  const trimmed = input.trim().slice(0, maxLength);
  // Supprimer tout caractère de balise ou script
  return trimmed.replace(/<[^>]*>/g, "").trim();
}

export const FORUM_LIMITS = {
  titleMaxLength: 200,
  contentMaxLength: 10_000,
  messageMaxLength: 5_000,
  reportReasonMaxLength: 1_000,
} as const;
