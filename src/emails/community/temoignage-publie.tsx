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
  testimonialAuthor: string;
  testimonialPreview: string;
  testimonialUrl: string;
}

export default function TemoignagePublie({
  fullName,
  testimonialAuthor,
  testimonialPreview,
  testimonialUrl,
}: Props) {
  return (
    <BaseLayout
      preview={`Nouveau témoignage de ${testimonialAuthor} sur Papa pour la vie`}
      heading="Témoignage inspirant"
    >
      <Text style={paragraph}>Bonjour {fullName},</Text>
      <Text style={paragraph}>
        Un nouveau témoignage inspirant a été publié par{" "}
        <strong>{testimonialAuthor}</strong>.
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
          « {testimonialPreview} »
        </Text>
        <Text
          style={{
            margin: "8px 0 0",
            fontSize: "12px",
            color: primaryColor,
            fontWeight: 600,
          }}
        >
          — {testimonialAuthor}
        </Text>
      </Section>
      <Section style={{ textAlign: "center" as const, margin: "24px 0" }}>
        <Link href={testimonialUrl} style={buttonStyle}>
          Lire le témoignage
        </Link>
      </Section>
    </BaseLayout>
  );
}
