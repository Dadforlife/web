import { Link, Section, Text } from "@react-email/components";
import * as React from "react";
import { BaseLayout, paragraph, buttonStyle } from "../components/base-layout";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://dadforlife.org";

interface Props {
  fullName: string;
  newMemberName: string;
}

export default function NouveauMembre({ fullName, newMemberName }: Props) {
  return (
    <BaseLayout
      preview={`${newMemberName} a rejoint la communauté Papa pour la vie`}
      heading="Un nouveau papa nous rejoint"
    >
      <Text style={paragraph}>Bonjour {fullName},</Text>
      <Text style={paragraph}>
        <strong>{newMemberName}</strong> vient de rejoindre la communauté Dad
        for Life. Notre réseau d&apos;entraide entre papas continue de grandir !
      </Text>
      <Text style={paragraph}>
        N&apos;hésitez pas à lui souhaiter la bienvenue dans l&apos;Espace Papas.
      </Text>
      <Section style={{ textAlign: "center" as const, margin: "24px 0" }}>
        <Link href={`${baseUrl}/espace-papas`} style={buttonStyle}>
          Aller à l&apos;Espace Papas
        </Link>
      </Section>
    </BaseLayout>
  );
}
