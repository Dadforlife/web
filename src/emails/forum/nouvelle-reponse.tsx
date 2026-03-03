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
  authorName: string;
  replyPreview: string;
  discussionUrl: string;
}

export default function NouvelleReponse({
  fullName,
  discussionTitle,
  authorName,
  replyPreview,
  discussionUrl,
}: Props) {
  return (
    <BaseLayout
      preview={`${authorName} a répondu dans votre discussion "${discussionTitle}"`}
      heading="Nouvelle réponse à votre discussion"
    >
      <Text style={paragraph}>Bonjour {fullName},</Text>
      <Text style={paragraph}>
        <strong>{authorName}</strong> a répondu dans une discussion que vous
        suivez : « <strong>{discussionTitle}</strong> ».
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
          — {authorName}
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
