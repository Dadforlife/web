import { Link, Section, Text, Hr } from "@react-email/components";
import * as React from "react";
import {
  BaseLayout,
  paragraph,
  buttonStyle,
  primaryColor,
} from "../components/base-layout";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://dadforlife.org";

interface Props {
  fullName: string;
  discussions: { title: string; repliesCount: number; url: string }[];
}

export default function DiscussionsPopulaires({
  fullName,
  discussions,
}: Props) {
  return (
    <BaseLayout
      preview="Voici les discussions populaires de la semaine sur Papa pour la vie"
      heading="Discussions populaires cette semaine"
    >
      <Text style={paragraph}>Bonjour {fullName},</Text>
      <Text style={paragraph}>
        Voici les discussions qui ont le plus animé la communauté cette semaine :
      </Text>
      {discussions.map((d, i) => (
        <React.Fragment key={i}>
          <Section style={{ padding: "12px 0" }}>
            <Link
              href={d.url}
              style={{
                color: primaryColor,
                fontSize: "15px",
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              {d.title}
            </Link>
            <Text
              style={{
                color: "#6B7280",
                fontSize: "13px",
                margin: "4px 0 0",
              }}
            >
              {d.repliesCount} réponse{d.repliesCount > 1 ? "s" : ""}
            </Text>
          </Section>
          {i < discussions.length - 1 && (
            <Hr style={{ borderColor: "#E5E7EB", margin: 0 }} />
          )}
        </React.Fragment>
      ))}
      <Section style={{ textAlign: "center" as const, margin: "24px 0" }}>
        <Link href={`${baseUrl}/espace-papas`} style={buttonStyle}>
          Voir toutes les discussions
        </Link>
      </Section>
    </BaseLayout>
  );
}
