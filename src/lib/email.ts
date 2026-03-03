import { ServerClient } from "postmark";
import { render } from "@react-email/render";

let _postmark: ServerClient | null = null;

function getPostmarkClient(): ServerClient | null {
  const token = process.env.POSTMARK_API_TOKEN;
  if (!token) return null;
  if (!_postmark) {
    _postmark = new ServerClient(token);
  }
  return _postmark;
}

export const EMAIL_FROM =
  process.env.EMAIL_FROM || "Papa pour la vie <notifications@dadforlife.org>";

export async function sendEmail({
  to,
  subject,
  react,
}: {
  to: string;
  subject: string;
  react: React.ReactElement;
}) {
  const client = getPostmarkClient();
  if (!client) {
    console.warn("[Email] POSTMARK_API_TOKEN not set, skipping email send");
    return null;
  }

  try {
    const html = await render(react);

    const response = await client.sendEmail({
      From: EMAIL_FROM,
      To: to,
      Subject: subject,
      HtmlBody: html,
    });

    return { id: response.MessageID };
  } catch (err) {
    console.error("[Email] Unexpected error:", err);
    return null;
  }
}
