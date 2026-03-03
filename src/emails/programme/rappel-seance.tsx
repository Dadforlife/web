import { Link, Section, Text } from "@react-email/components";
import * as React from "react";
import {
  BaseLayout,
  paragraph,
  buttonStyle,
  warningBox,
  label,
  value,
} from "../components/base-layout";

interface Props {
  fullName: string;
  sessionTitle: string;
  sessionDate: string;
  sessionUrl: string;
}

export default function RappelSeance({
  fullName,
  sessionTitle,
  sessionDate,
  sessionUrl,
}: Props) {
  return (
    <BaseLayout
      preview={`Rappel : séance "${sessionTitle}" prévue le ${sessionDate}`}
      heading="Rappel de séance"
    >
      <Text style={paragraph}>Bonjour {fullName},</Text>
      <Text style={paragraph}>
        Votre prochaine séance d&apos;accompagnement approche !
      </Text>
      <Section style={warningBox}>
        <Text style={label}>Séance</Text>
        <Text style={value}>{sessionTitle}</Text>
        <Text style={label}>Date</Text>
        <Text style={{ ...value, margin: 0 }}>{sessionDate}</Text>
      </Section>
      <Text style={paragraph}>
        Pensez à préparer vos questions et vos réflexions pour tirer le meilleur
        de cette séance.
      </Text>
      <Section style={{ textAlign: "center" as const, margin: "24px 0" }}>
        <Link href={sessionUrl} style={buttonStyle}>
          Accéder à la séance
        </Link>
      </Section>
    </BaseLayout>
  );
}
