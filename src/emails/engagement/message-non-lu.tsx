import { Link, Section, Text } from "@react-email/components";
import * as React from "react";
import {
  BaseLayout,
  paragraph,
  buttonStyle,
  warningBox,
} from "../components/base-layout";

interface Props {
  fullName: string;
  unreadCount: number;
  discussionTitle: string;
  discussionUrl: string;
}

export default function MessageNonLu({
  fullName,
  unreadCount,
  discussionTitle,
  discussionUrl,
}: Props) {
  return (
    <BaseLayout
      preview={`Vous avez ${unreadCount} message(s) non lu(s) sur Papa pour la vie`}
      heading="Messages non lus"
    >
      <Text style={paragraph}>Bonjour {fullName},</Text>
      <Text style={paragraph}>
        Vous avez <strong>{unreadCount} message{unreadCount > 1 ? "s" : ""} non
        lu{unreadCount > 1 ? "s" : ""}</strong> dans la discussion
        « <strong>{discussionTitle}</strong> ».
      </Text>
      <Section style={warningBox}>
        <Text style={{ ...paragraph, margin: 0, fontSize: "13px" }}>
          D&apos;autres papas attendent peut-être votre réponse. Prenez un moment
          pour consulter vos messages.
        </Text>
      </Section>
      <Section style={{ textAlign: "center" as const, margin: "24px 0" }}>
        <Link href={discussionUrl} style={buttonStyle}>
          Lire mes messages
        </Link>
      </Section>
    </BaseLayout>
  );
}
