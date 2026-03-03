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
  mentionedBy: string;
  discussionTitle: string;
  messagePreview: string;
  discussionUrl: string;
}

export default function Mention({
  fullName,
  mentionedBy,
  discussionTitle,
  messagePreview,
  discussionUrl,
}: Props) {
  return (
    <BaseLayout
      preview={`${mentionedBy} vous a mentionné dans "${discussionTitle}"`}
      heading="Vous avez été mentionné"
    >
      <Text style={paragraph}>Bonjour {fullName},</Text>
      <Text style={paragraph}>
        <strong>{mentionedBy}</strong> vous a mentionné dans la discussion
        « <strong>{discussionTitle}</strong> ».
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
          « {messagePreview} »
        </Text>
        <Text
          style={{
            margin: "8px 0 0",
            fontSize: "12px",
            color: primaryColor,
            fontWeight: 600,
          }}
        >
          — {mentionedBy}
        </Text>
      </Section>
      <Section style={{ textAlign: "center" as const, margin: "24px 0" }}>
        <Link href={discussionUrl} style={buttonStyle}>
          Voir le message
        </Link>
      </Section>
    </BaseLayout>
  );
}
