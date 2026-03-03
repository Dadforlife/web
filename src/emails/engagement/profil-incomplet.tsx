import { Link, Section, Text } from "@react-email/components";
import * as React from "react";
import {
  BaseLayout,
  paragraph,
  buttonStyle,
  warningBox,
} from "../components/base-layout";

interface Props {
  fullName: string;
  missingFields: string[];
  profileUrl: string;
}

export default function ProfilIncomplet({
  fullName,
  missingFields,
  profileUrl,
}: Props) {
  return (
    <BaseLayout
      preview="Complétez votre profil Papa pour la vie pour une meilleure expérience"
      heading="Votre profil est incomplet"
    >
      <Text style={paragraph}>Bonjour {fullName},</Text>
      <Text style={paragraph}>
        Nous avons remarqué que votre profil n&apos;est pas encore complet. Un
        profil renseigné permet aux autres papas de mieux vous connaître et
        facilite les échanges au sein de la communauté.
      </Text>
      <Section style={warningBox}>
        <Text style={{ ...paragraph, margin: "0 0 8px", fontWeight: 600, fontSize: "14px" }}>
          Informations manquantes
        </Text>
        {missingFields.map((field, i) => (
          <Text
            key={i}
            style={{
              ...paragraph,
              margin: i < missingFields.length - 1 ? "0 0 4px" : 0,
              fontSize: "14px",
            }}
          >
            • {field}
          </Text>
        ))}
      </Section>
      <Section style={{ textAlign: "center" as const, margin: "24px 0" }}>
        <Link href={profileUrl} style={buttonStyle}>
          Compléter mon profil
        </Link>
      </Section>
    </BaseLayout>
  );
}
