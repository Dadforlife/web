import { Section, Text } from "@react-email/components";
import * as React from "react";
import {
  BaseLayout,
  paragraph,
  infoBox,
  label,
  value,
} from "../components/base-layout";

interface Props {
  fullName: string;
  changeTitle: string;
  changeDescription: string;
  effectiveDate: string;
}

export default function ChangementFonctionnement({
  fullName,
  changeTitle,
  changeDescription,
  effectiveDate,
}: Props) {
  return (
    <BaseLayout
      preview={`Changement important : ${changeTitle}`}
      heading="Changement de fonctionnement"
    >
      <Text style={paragraph}>Bonjour {fullName},</Text>
      <Text style={paragraph}>
        Nous souhaitons vous informer d&apos;un changement important concernant
        le fonctionnement de Papa pour la vie.
      </Text>
      <Section style={infoBox}>
        <Text style={label}>Changement</Text>
        <Text style={value}>{changeTitle}</Text>
        <Text style={label}>Description</Text>
        <Text style={value}>{changeDescription}</Text>
        <Text style={label}>Date d&apos;effet</Text>
        <Text style={{ ...value, margin: 0 }}>{effectiveDate}</Text>
      </Section>
      <Text style={paragraph}>
        Si vous avez des questions ou des préoccupations, n&apos;hésitez pas à
        nous contacter à <strong>contact@dadforlife.org</strong>.
      </Text>
      <Text style={paragraph}>
        L&apos;équipe Papa pour la vie
      </Text>
    </BaseLayout>
  );
}
