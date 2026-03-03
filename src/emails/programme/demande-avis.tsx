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
  programmeName: string;
  feedbackUrl: string;
}

export default function DemandeAvis({
  fullName,
  programmeName,
  feedbackUrl,
}: Props) {
  return (
    <BaseLayout
      preview={`Donnez votre avis sur le programme "${programmeName}"`}
      heading="Votre avis compte"
    >
      <Text style={paragraph}>Bonjour {fullName},</Text>
      <Text style={paragraph}>
        Vous avez récemment participé au programme
        « <strong>{programmeName}</strong> ». Nous aimerions beaucoup connaître
        votre retour d&apos;expérience.
      </Text>
      <Section style={infoBox}>
        <Text style={{ ...paragraph, margin: 0, fontSize: "13px" }}>
          Votre témoignage peut aider d&apos;autres papas à franchir le pas et à
          rejoindre nos programmes d&apos;accompagnement. Cela ne prend que
          quelques minutes.
        </Text>
      </Section>
      <Section style={{ textAlign: "center" as const, margin: "24px 0" }}>
        <Link href={feedbackUrl} style={buttonStyle}>
          Donner mon avis
        </Link>
      </Section>
      <Text style={paragraph}>
        Merci pour votre participation et votre aide précieuse.
        <br />
        L&apos;équipe Papa pour la vie
      </Text>
    </BaseLayout>
  );
}
