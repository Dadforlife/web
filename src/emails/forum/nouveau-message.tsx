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
  messagePreview: string;
  discussionUrl: string;
}

export default function NouveauMessage({
  fullName,
  discussionTitle,
  authorName,
  messagePreview,
  discussionUrl,
}: Props) {
  return (
    <BaseLayout
      preview={`Nouveau message de ${authorName} dans "${discussionTitle}"`}
      heading="Nouveau message"
    >
      <Text style={paragraph}>Bonjour {fullName},</Text>
      <Text style={paragraph}>
        <strong>{authorName}</strong> a posté un nouveau message dans la
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
          — {authorName}
        </Text>
      </Section>
      <Section style={{ textAlign: "center" as const, margin: "24px 0" }}>
        <Link href={discussionUrl} style={buttonStyle}>
          Voir la discussion
        </Link>
      </Section>
    </BaseLayout>
  );
}
