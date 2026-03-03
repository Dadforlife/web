import { Link, Section, Text } from "@react-email/components";
import * as React from "react";
import {
  BaseLayout,
  paragraph,
  buttonStyle,
} from "../components/base-layout";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://dadforlife.org";

interface Props {
  fullName: string;
  daysSinceLastVisit: number;
}

export default function RappelAbsence({
  fullName,
  daysSinceLastVisit,
}: Props) {
  return (
    <BaseLayout
      preview="Vous nous manquez sur Papa pour la vie"
      heading="Vous nous manquez !"
    >
      <Text style={paragraph}>Bonjour {fullName},</Text>
      <Text style={paragraph}>
        Cela fait <strong>{daysSinceLastVisit} jours</strong> que vous ne vous
        êtes pas connecté à Papa pour la vie. La communauté continue de grandir et
        d&apos;échanger — et votre voix compte.
      </Text>
      <Text style={paragraph}>
        Que ce soit pour partager votre expérience, poser une question, ou
        simplement lire les témoignages d&apos;autres papas, nous serions ravis
        de vous revoir.
      </Text>
      <Section style={{ textAlign: "center" as const, margin: "24px 0" }}>
        <Link href={`${baseUrl}/dashboard`} style={buttonStyle}>
          Revenir sur Papa pour la vie
        </Link>
      </Section>
      <Text style={paragraph}>
        Prenez soin de vous.
        <br />
        L&apos;équipe Papa pour la vie
      </Text>
    </BaseLayout>
  );
}
