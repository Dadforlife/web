import { Link, Section, Text } from "@react-email/components";
import * as React from "react";
import {
  BaseLayout,
  paragraph,
  buttonStyle,
  infoBox,
  primaryColor,
} from "../components/base-layout";

interface Props {
  fullName: string;
  discussionTitle: string;
  replierName: string;
  replyPreview: string;
  discussionUrl: string;
}

export default function DiscussionReponse({
  fullName,
  discussionTitle,
  replierName,
  replyPreview,
  discussionUrl,
}: Props) {
  return (
    <BaseLayout
      preview={`${replierName} a répondu à votre discussion "${discussionTitle}"`}
      heading="Votre discussion a reçu une réponse"
    >
      <Text style={paragraph}>Bonjour {fullName},</Text>
      <Text style={paragraph}>
        Bonne nouvelle ! <strong>{replierName}</strong> a répondu à votre
        discussion « <strong>{discussionTitle}</strong> ».
      </Text>
      <Section style={infoBox}>
        <Text
          style={{
            ...paragraph,
            margin: 0,
            fontSize: "14px",
            fontStyle: "italic",
          }}
        >
          « {replyPreview} »
        </Text>
        <Text
          style={{
            margin: "8px 0 0",
            fontSize: "12px",
            color: primaryColor,
            fontWeight: 600,
          }}
        >
          — {replierName}
        </Text>
      </Section>
      <Section style={{ textAlign: "center" as const, margin: "24px 0" }}>
        <Link href={discussionUrl} style={buttonStyle}>
          Voir la réponse
        </Link>
      </Section>
    </BaseLayout>
  );
}
