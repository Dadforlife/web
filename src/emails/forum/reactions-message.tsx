import { Link, Section, Text } from "@react-email/components";
import * as React from "react";
import {
  BaseLayout,
  paragraph,
  buttonStyle,
  infoBox,
  warmColor,
} from "../components/base-layout";

interface Props {
  fullName: string;
  reactionsCount: number;
  discussionTitle: string;
  discussionUrl: string;
}

export default function ReactionsMessage({
  fullName,
  reactionsCount,
  discussionTitle,
  discussionUrl,
}: Props) {
  return (
    <BaseLayout
      preview={`Votre message a reçu ${reactionsCount} réactions !`}
      heading="Votre message est apprécié !"
    >
      <Text style={paragraph}>Bonjour {fullName},</Text>
      <Text style={paragraph}>
        Votre message dans la discussion « <strong>{discussionTitle}</strong> »
        a reçu <strong>{reactionsCount} réactions</strong> de la part
        d&apos;autres papas !
      </Text>
      <Section style={infoBox}>
        <Text
          style={{
            ...paragraph,
            margin: 0,
            fontSize: "24px",
            textAlign: "center" as const,
            color: warmColor,
            fontWeight: 700,
          }}
        >
          {reactionsCount} réactions
        </Text>
      </Section>
      <Text style={paragraph}>
        Continuez à partager votre expérience, vos messages aident d&apos;autres
        pères.
      </Text>
      <Section style={{ textAlign: "center" as const, margin: "24px 0" }}>
        <Link href={discussionUrl} style={buttonStyle}>
          Voir les réactions
        </Link>
      </Section>
    </BaseLayout>
  );
}
