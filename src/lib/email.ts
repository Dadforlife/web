import { ServerClient } from "postmark";
import { render } from "@react-email/render";

const postmark = new ServerClient(process.env.POSTMARK_API_TOKEN || "");

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
  if (!process.env.POSTMARK_API_TOKEN) {
    console.warn("[Email] POSTMARK_API_TOKEN not set, skipping email send");
    return null;
  }

  try {
    const html = await render(react);

    const response = await postmark.sendEmail({
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
