import { Link, Section, Text } from "@react-email/components";
import * as React from "react";
import {
  BaseLayout,
  paragraph,
  buttonStyle,
  infoBox,
  warmColor,
} from "../components/base-layout";

interface Props {
  fullName: string;
  featuredMemberName: string;
  featuredMemberStory: string;
  profileUrl: string;
}

export default function MiseEnAvantMembre({
  fullName,
  featuredMemberName,
  featuredMemberStory,
  profileUrl,
}: Props) {
  return (
    <BaseLayout
      preview={`Découvrez le parcours de ${featuredMemberName}`}
      heading="Membre mis en avant"
    >
      <Text style={paragraph}>Bonjour {fullName},</Text>
      <Text style={paragraph}>
        Nous souhaitons mettre en avant{" "}
        <strong>{featuredMemberName}</strong>, un membre actif de notre
        communauté.
      </Text>
      <Section style={infoBox}>
        <Text
          style={{
            ...paragraph,
            margin: "0 0 8px",
            fontSize: "14px",
            fontStyle: "italic",
          }}
        >
          « {featuredMemberStory} »
        </Text>
        <Text
          style={{
            margin: 0,
            fontSize: "12px",
            color: warmColor,
            fontWeight: 600,
          }}
        >
          — {featuredMemberName}
        </Text>
      </Section>
      <Section style={{ textAlign: "center" as const, margin: "24px 0" }}>
        <Link href={profileUrl} style={buttonStyle}>
          Découvrir son parcours
        </Link>
      </Section>
    </BaseLayout>
  );
}
