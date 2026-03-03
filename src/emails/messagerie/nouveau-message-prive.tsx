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
  senderName: string;
  conversationSubject: string;
  messagePreview: string;
  conversationUrl: string;
}

export default function NouveauMessagePrive({
  fullName,
  senderName,
  conversationSubject,
  messagePreview,
  conversationUrl,
}: Props) {
  return (
    <BaseLayout
      preview={`${senderName} vous a envoyé un message privé`}
      heading="Nouveau message privé"
    >
      <Text style={paragraph}>Bonjour {fullName},</Text>
      <Text style={paragraph}>
        <strong>{senderName}</strong> vous a envoyé un message dans la
        conversation : &laquo;&nbsp;<strong>{conversationSubject}</strong>
        &nbsp;&raquo;.
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
          &laquo;&nbsp;{messagePreview}&nbsp;&raquo;
        </Text>
        <Text
          style={{
            margin: "8px 0 0",
            fontSize: "12px",
            color: primaryColor,
            fontWeight: 600,
          }}
        >
          &mdash; {senderName}
        </Text>
      </Section>
      <Section style={{ textAlign: "center" as const, margin: "24px 0" }}>
        <Link href={conversationUrl} style={buttonStyle}>
          Voir la conversation
        </Link>
      </Section>
    </BaseLayout>
  );
}
