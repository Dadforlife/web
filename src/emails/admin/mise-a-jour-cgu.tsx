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
  cguUrl: string;
}

export default function MiseAJourCGU({
  fullName,
  effectiveDate,
  cguUrl,
}: Props) {
  return (
    <BaseLayout
      preview="Mise à jour de nos Conditions Générales d'Utilisation"
      heading="Mise à jour des CGU"
    >
      <Text style={paragraph}>Bonjour {fullName},</Text>
      <Text style={paragraph}>
        Nous vous informons que nos Conditions Générales d&apos;Utilisation ont
        été mises à jour. Ces modifications entreront en vigueur le{" "}
        <strong>{effectiveDate}</strong>.
      </Text>
      <Section style={infoBox}>
        <Text style={{ ...paragraph, margin: 0, fontSize: "13px" }}>
          Nous vous encourageons à consulter les nouvelles conditions pour rester
          informé des règles qui régissent l&apos;utilisation de la plateforme.
        </Text>
      </Section>
      <Section style={{ textAlign: "center" as const, margin: "24px 0" }}>
        <Link href={cguUrl} style={buttonStyle}>
          Consulter les CGU
        </Link>
      </Section>
      <Text style={paragraph}>
        En continuant à utiliser Papa pour la vie après cette date, vous acceptez
        les nouvelles conditions.
      </Text>
    </BaseLayout>
  );
}
