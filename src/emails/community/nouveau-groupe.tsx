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
  groupName: string;
  groupUrl: string;
}

export default function NouveauGroupe({
  fullName,
  groupName,
  groupUrl,
}: Props) {
  return (
    <BaseLayout
      preview={`Nouveau groupe "${groupName}" disponible sur Papa pour la vie`}
      heading="Nouveau groupe créé"
    >
      <Text style={paragraph}>Bonjour {fullName},</Text>
      <Text style={paragraph}>
        Un nouveau groupe a été créé sur Papa pour la vie :{" "}
        <strong>{groupName}</strong>.
      </Text>
      <Section style={infoBox}>
        <Text style={{ ...paragraph, margin: 0, fontSize: "13px" }}>
          Les groupes vous permettent d&apos;échanger avec des papas qui vivent
          des situations similaires à la vôtre.
        </Text>
      </Section>
      <Section style={{ textAlign: "center" as const, margin: "24px 0" }}>
        <Link href={groupUrl} style={buttonStyle}>
          Découvrir le groupe
        </Link>
      </Section>
    </BaseLayout>
  );
}
