import { Section, Text } from "@react-email/components";
import * as React from "react";
import {
  BaseLayout,
  paragraph,
  alertBox,
} from "../components/base-layout";

interface Props {
  fullName: string;
  issueDescription: string;
  estimatedResolution: string;
}

export default function ProblemeTechnique({
  fullName,
  issueDescription,
  estimatedResolution,
}: Props) {
  return (
    <BaseLayout
      preview="Problème technique détecté sur Papa pour la vie"
      heading="Problème technique détecté"
    >
      <Text style={paragraph}>Bonjour {fullName},</Text>
      <Text style={paragraph}>
        Nous avons détecté un problème technique qui pourrait affecter votre
        utilisation de la plateforme.
      </Text>
      <Section style={alertBox}>
        <Text style={{ ...paragraph, margin: "0 0 8px", fontWeight: 600, fontSize: "14px" }}>
          Problème identifié
        </Text>
        <Text style={{ ...paragraph, margin: "0 0 8px", fontSize: "13px" }}>
          {issueDescription}
        </Text>
        <Text style={{ ...paragraph, margin: 0, fontSize: "13px" }}>
          <strong>Résolution estimée :</strong> {estimatedResolution}
        </Text>
      </Section>
      <Text style={paragraph}>
        Nos équipes travaillent activement à la résolution de ce problème. Nous
        vous tiendrons informé de l&apos;avancement.
      </Text>
      <Text style={paragraph}>
        Merci pour votre patience.
        <br />
        L&apos;équipe Papa pour la vie
      </Text>
    </BaseLayout>
  );
}
