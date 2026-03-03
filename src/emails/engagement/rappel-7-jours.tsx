import { Link, Section, Text } from "@react-email/components";
import * as React from "react";
import {
  BaseLayout,
  paragraph,
  buttonStyle,
  infoBox,
  primaryColor,
} from "../components/base-layout";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://dadforlife.org";

interface Props {
  fullName: string;
  lastVisitDate: string;
  popularDiscussions: { title: string; url: string }[];
}

export default function Rappel7Jours({
  fullName,
  lastVisitDate,
  popularDiscussions,
}: Props) {
  return (
    <BaseLayout
      preview="Vous nous manquez ! Découvrez ce qui s'est passé sur Papa pour la vie"
      heading="On ne vous a pas vu depuis un moment"
    >
      <Text style={paragraph}>Bonjour {fullName},</Text>
      <Text style={paragraph}>
        Cela fait quelques jours que vous n&apos;êtes pas venu sur Papa pour la vie
        (dernière visite : {lastVisitDate}). La communauté continue d&apos;échanger
        et de s&apos;entraider — voici ce que vous avez manqué :
      </Text>
      {popularDiscussions.length > 0 && (
        <Section style={infoBox}>
          <Text style={{ ...paragraph, margin: "0 0 8px", fontWeight: 600, fontSize: "14px" }}>
            Discussions populaires
          </Text>
          {popularDiscussions.map((d, i) => (
            <Text
              key={i}
              style={{
                ...paragraph,
                margin: i < popularDiscussions.length - 1 ? "0 0 6px" : 0,
                fontSize: "14px",
              }}
            >
              •{" "}
              <Link href={d.url} style={{ color: primaryColor, textDecoration: "underline" }}>
                {d.title}
              </Link>
            </Text>
          ))}
        </Section>
      )}
      <Section style={{ textAlign: "center" as const, margin: "24px 0" }}>
        <Link href={`${baseUrl}/espace-papas`} style={buttonStyle}>
          Revenir sur la plateforme
        </Link>
      </Section>
    </BaseLayout>
  );
}
