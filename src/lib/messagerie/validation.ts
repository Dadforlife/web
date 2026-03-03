import { sanitizeForStorage } from "@/lib/forum/sanitize";

export const MESSAGERIE_LIMITS = {
  subjectMaxLength: 200,
  messageMaxLength: 5_000,
} as const;

export interface CreateConversationInput {
  subject: string;
  content: string;
}

export interface CreateMessageInput {
  content: string;
}

export function validateCreateConversation(
  raw: unknown
): { success: true; data: CreateConversationInput } | { success: false; error: string } {
  if (!raw || typeof raw !== "object") {
    return { success: false, error: "Données invalides." };
  }
  const body = raw as Record<string, unknown>;
  const subject = sanitizeForStorage(body.subject, MESSAGERIE_LIMITS.subjectMaxLength);
  const content = sanitizeForStorage(body.content, MESSAGERIE_LIMITS.messageMaxLength);

  if (!subject.length) return { success: false, error: "Le sujet est requis." };
  if (subject.length < 3)
    return { success: false, error: "Le sujet doit faire au moins 3 caractères." };
  if (!content.length) return { success: false, error: "Le message est requis." };
  if (content.length < 3)
    return { success: false, error: "Le message doit faire au moins 3 caractères." };

  return { success: true, data: { subject, content } };
}

export function validateCreateMessage(
  raw: unknown
): { success: true; data: CreateMessageInput } | { success: false; error: string } {
  if (!raw || typeof raw !== "object") {
    return { success: false, error: "Données invalides." };
  }
  const body = raw as Record<string, unknown>;
  const content = sanitizeForStorage(body.content, MESSAGERIE_LIMITS.messageMaxLength);

  if (!content.length) return { success: false, error: "Le message est requis." };
  if (content.length < 3)
    return { success: false, error: "Le message doit faire au moins 3 caractères." };

  return { success: true, data: { content } };
}
