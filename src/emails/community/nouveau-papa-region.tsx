import { Link, Section, Text } from "@react-email/components";
import * as React from "react";
import {
  BaseLayout,
  paragraph,
  buttonStyle,
  infoBox,
} from "../components/base-layout";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://dadforlife.org";

interface Props {
  fullName: string;
  newMemberName: string;
  region: string;
}

export default function NouveauPapaRegion({
  fullName,
  newMemberName,
  region,
}: Props) {
  return (
    <BaseLayout
      preview={`Un nouveau papa de ${region} a rejoint Papa pour la vie`}
      heading="Un papa près de chez vous"
    >
      <Text style={paragraph}>Bonjour {fullName},</Text>
      <Text style={paragraph}>
        <strong>{newMemberName}</strong> de la région{" "}
        <strong>{region}</strong> vient de rejoindre Papa pour la vie.
      </Text>
      <Section style={infoBox}>
        <Text style={{ ...paragraph, margin: 0, fontSize: "13px" }}>
          Les échanges entre papas d&apos;une même région peuvent faciliter le
          soutien au quotidien et les rencontres locales.
        </Text>
      </Section>
      <Section style={{ textAlign: "center" as const, margin: "24px 0" }}>
        <Link href={`${baseUrl}/espace-papas`} style={buttonStyle}>
          Découvrir son profil
        </Link>
      </Section>
    </BaseLayout>
  );
}
