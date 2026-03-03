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
  moduleName: string;
  programmeName: string;
  moduleUrl: string;
}

export default function NouveauModule({
  fullName,
  moduleName,
  programmeName,
  moduleUrl,
}: Props) {
  return (
    <BaseLayout
      preview={`Nouveau module disponible : ${moduleName}`}
      heading="Nouveau module disponible"
    >
      <Text style={paragraph}>Bonjour {fullName},</Text>
      <Text style={paragraph}>
        Un nouveau module est maintenant accessible dans votre programme
        « <strong>{programmeName}</strong> » :
      </Text>
      <Section style={infoBox}>
        <Text style={{ ...paragraph, margin: 0, fontWeight: 600, fontSize: "16px" }}>
          {moduleName}
        </Text>
      </Section>
      <Text style={paragraph}>
        Poursuivez votre apprentissage à votre rythme. Chaque module vous
        rapproche de vos objectifs.
      </Text>
      <Section style={{ textAlign: "center" as const, margin: "24px 0" }}>
        <Link href={moduleUrl} style={buttonStyle}>
          Commencer le module
        </Link>
      </Section>
    </BaseLayout>
  );
}
