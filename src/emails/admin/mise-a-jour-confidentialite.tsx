import { Link, Section, Text } from "@react-email/components";
import * as React from "react";
import {
  BaseLayout,
  paragraph,
  buttonStyle,
  infoBox,
} from "../components/base-layout";

interface Props {
  fullName: string;
  effectiveDate: string;
  privacyUrl: string;
}

export default function MiseAJourConfidentialite({
  fullName,
  effectiveDate,
  privacyUrl,
}: Props) {
  return (
    <BaseLayout
      preview="Mise à jour de notre politique de confidentialité"
      heading="Politique de confidentialité mise à jour"
    >
      <Text style={paragraph}>Bonjour {fullName},</Text>
      <Text style={paragraph}>
        Notre politique de confidentialité a été mise à jour. Les modifications
        prendront effet le <strong>{effectiveDate}</strong>.
      </Text>
      <Section style={infoBox}>
        <Text style={{ ...paragraph, margin: 0, fontSize: "13px" }}>
          La protection de vos données personnelles est une priorité pour Dad for
          Life. Nous vous invitons à prendre connaissance des changements
          apportés.
        </Text>
      </Section>
      <Section style={{ textAlign: "center" as const, margin: "24px 0" }}>
        <Link href={privacyUrl} style={buttonStyle}>
          Voir la politique de confidentialité
        </Link>
      </Section>
    </BaseLayout>
  );
}
