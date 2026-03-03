import { FORUM_LIMITS, sanitizeForStorage } from "./sanitize";

export type DiscussionStatus = "active" | "flagged" | "archived";

export interface CreateDiscussionInput {
  title: string;
  categoryId: string;
  content: string;
  isAnonymous: boolean;
}

export interface CreateMessageInput {
  content: string;
  discussionId: string;
}

export interface ReportInput {
  reason: string;
  discussionId?: string;
  messageId?: string;
}

export function validateCreateDiscussion(
  raw: unknown
): { success: true; data: CreateDiscussionInput } | { success: false; error: string } {
  if (!raw || typeof raw !== "object") {
    return { success: false, error: "Données invalides." };
  }
  const body = raw as Record<string, unknown>;
  const title = sanitizeForStorage(
    body.title,
    FORUM_LIMITS.titleMaxLength
  );
  const content = sanitizeForStorage(
    body.content,
    FORUM_LIMITS.contentMaxLength
  );
  const categoryId = typeof body.categoryId === "string" ? body.categoryId.trim() : "";
  const isAnonymous = Boolean(body.isAnonymous);

  if (!title.length) return { success: false, error: "Le titre est requis." };
  if (title.length < 3)
    return { success: false, error: "Le titre doit faire au moins 3 caractères." };
  if (!categoryId) return { success: false, error: "La catégorie est requise." };
  if (!content.length) return { success: false, error: "Le contenu est requis." };
  if (content.length < 10)
    return { success: false, error: "Le message doit faire au moins 10 caractères." };

  return {
    success: true,
    data: { title, categoryId, content, isAnonymous },
  };
}

export function validateCreateMessage(
  raw: unknown
): { success: true; data: CreateMessageInput } | { success: false; error: string } {
  if (!raw || typeof raw !== "object") {
    return { success: false, error: "Données invalides." };
  }
  const body = raw as Record<string, unknown>;
  const content = sanitizeForStorage(
    body.content,
    FORUM_LIMITS.messageMaxLength
  );
  const discussionId = typeof body.discussionId === "string" ? body.discussionId.trim() : "";

  if (!content.length) return { success: false, error: "La réponse est requise." };
  if (content.length < 3)
    return { success: false, error: "La réponse doit faire au moins 3 caractères." };
  if (!discussionId) return { success: false, error: "Discussion invalide." };

  return {
    success: true,
    data: { content, discussionId },
  };
}

export function validateReport(
  raw: unknown
): { success: true; data: ReportInput } | { success: false; error: string } {
  if (!raw || typeof raw !== "object") {
    return { success: false, error: "Données invalides." };
  }
  const body = raw as Record<string, unknown>;
  const reason = sanitizeForStorage(
    body.reason,
    FORUM_LIMITS.reportReasonMaxLength
  );
  const discussionId = typeof body.discussionId === "string" ? body.discussionId.trim() || undefined : undefined;
  const messageId = typeof body.messageId === "string" ? body.messageId.trim() || undefined : undefined;

  if (!reason.length) return { success: false, error: "La raison du signalement est requise." };
  if (reason.length < 10)
    return { success: false, error: "Veuillez décrire la raison (au moins 10 caractères)." };
  const hasTarget = (discussionId && !messageId) || (!discussionId && messageId);
  if (!hasTarget) return { success: false, error: "Indiquez une discussion ou un message à signaler." };

  return {
    success: true,
    data: { reason, discussionId, messageId },
  };
}
