import { Link, Section, Text, Hr } from "@react-email/components";
import * as React from "react";
import {
  BaseLayout,
  paragraph,
  buttonStyle,
  infoBox,
  primaryColor,
  warmColor,
} from "../components/base-layout";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://dadforlife.org";

interface Props {
  fullName: string;
  month: string;
  highlights: string[];
  statsNewMembers: number;
  statsDiscussions: number;
}

export default function NewsletterMensuelle({
  fullName,
  month,
  highlights,
  statsNewMembers,
  statsDiscussions,
}: Props) {
  return (
    <BaseLayout
      preview={`Newsletter Papa pour la vie — ${month}`}
      heading={`Newsletter — ${month}`}
    >
      <Text style={paragraph}>Bonjour {fullName},</Text>
      <Text style={paragraph}>
        Voici les moments forts de la communauté Papa pour la vie ce mois-ci.
      </Text>

      {/* Stats */}
      <Section
        style={{
          textAlign: "center" as const,
          margin: "24px 0",
          display: "flex",
          gap: "16px",
          justifyContent: "center",
        }}
      >
        <Section
          style={{
            backgroundColor: "#F0F4FF",
            borderRadius: "12px",
            padding: "16px 24px",
            display: "inline-block",
            margin: "0 8px",
          }}
        >
          <Text
            style={{
              color: primaryColor,
              fontSize: "28px",
              fontWeight: 700,
              margin: 0,
            }}
          >
            {statsNewMembers}
          </Text>
          <Text
            style={{ color: primaryColor, fontSize: "12px", margin: "4px 0 0" }}
          >
            Nouveaux membres
          </Text>
        </Section>
        <Section
          style={{
            backgroundColor: "#FEF3C7",
            borderRadius: "12px",
            padding: "16px 24px",
            display: "inline-block",
            margin: "0 8px",
          }}
        >
          <Text
            style={{
              color: warmColor,
              fontSize: "28px",
              fontWeight: 700,
              margin: 0,
            }}
          >
            {statsDiscussions}
          </Text>
          <Text
            style={{ color: warmColor, fontSize: "12px", margin: "4px 0 0" }}
          >
            Discussions actives
          </Text>
        </Section>
      </Section>

      <Hr style={{ borderColor: "#E5E7EB", margin: "24px 0" }} />

      {/* Highlights */}
      <Text style={{ ...paragraph, fontWeight: 600, fontSize: "16px" }}>
        À la une
      </Text>
      <Section style={infoBox}>
        {highlights.map((highlight, i) => (
          <Text
            key={i}
            style={{
              ...paragraph,
              margin: i < highlights.length - 1 ? "0 0 8px" : 0,
              fontSize: "14px",
            }}
          >
            • {highlight}
          </Text>
        ))}
      </Section>

      <Section style={{ textAlign: "center" as const, margin: "24px 0" }}>
        <Link href={`${baseUrl}/espace-papas`} style={buttonStyle}>
          Rejoindre les discussions
        </Link>
      </Section>

      <Text style={paragraph}>
        Merci de faire partie de cette communauté.
        <br />
        L&apos;équipe Papa pour la vie
      </Text>
    </BaseLayout>
  );
}
