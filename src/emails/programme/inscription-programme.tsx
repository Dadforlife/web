import { Link, Section, Text } from "@react-email/components";
import * as React from "react";
import {
  BaseLayout,
  paragraph,
  buttonStyle,
  infoBox,
  label,
  value,
} from "../components/base-layout";

interface Props {
  fullName: string;
  programmeName: string;
  startDate: string;
  programmeUrl: string;
}

export default function InscriptionProgramme({
  fullName,
  programmeName,
  startDate,
  programmeUrl,
}: Props) {
  return (
    <BaseLayout
      preview={`Inscription confirmée au programme "${programmeName}"`}
      heading="Inscription confirmée"
    >
      <Text style={paragraph}>Bonjour {fullName},</Text>
      <Text style={paragraph}>
        Votre inscription au programme d&apos;accompagnement a bien été
        enregistrée. Voici les détails :
      </Text>
      <Section style={infoBox}>
        <Text style={label}>Programme</Text>
        <Text style={value}>{programmeName}</Text>
        <Text style={label}>Date de début</Text>
        <Text style={{ ...value, margin: 0 }}>{startDate}</Text>
      </Section>
      <Text style={paragraph}>
        Nous vous enverrons un rappel avant chaque séance. Préparez-vous à
        avancer dans votre parcours !
      </Text>
      <Section style={{ textAlign: "center" as const, margin: "24px 0" }}>
        <Link href={programmeUrl} style={buttonStyle}>
          Voir le programme
        </Link>
      </Section>
    </BaseLayout>
  );
}
