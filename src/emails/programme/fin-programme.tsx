import { Link, Section, Text } from "@react-email/components";
import * as React from "react";
import {
  BaseLayout,
  paragraph,
  buttonStyle,
  secondaryButtonStyle,
  infoBox,
  warmColor,
} from "../components/base-layout";

interface Props {
  fullName: string;
  programmeName: string;
  certificateUrl?: string;
}

export default function FinProgramme({
  fullName,
  programmeName,
  certificateUrl,
}: Props) {
  return (
    <BaseLayout
      preview={`Félicitations ! Vous avez terminé le programme "${programmeName}"`}
      heading="Programme terminé !"
    >
      <Text style={paragraph}>Bonjour {fullName},</Text>
      <Text style={paragraph}>
        Félicitations ! Vous avez terminé le programme
        « <strong>{programmeName}</strong> ». C&apos;est un accomplissement
        remarquable et une étape importante dans votre parcours.
      </Text>
      <Section style={infoBox}>
        <Text
          style={{
            ...paragraph,
            margin: 0,
            textAlign: "center" as const,
            fontSize: "18px",
            color: warmColor,
            fontWeight: 700,
          }}
        >
          Programme complété avec succès
        </Text>
      </Section>
      <Text style={paragraph}>
        Le chemin que vous avez parcouru montre votre engagement envers votre
        rôle de père. Continuez à appliquer ce que vous avez appris au
        quotidien.
      </Text>
      {certificateUrl && (
        <Section style={{ textAlign: "center" as const, margin: "24px 0" }}>
          <Link href={certificateUrl} style={secondaryButtonStyle}>
            Télécharger mon certificat
          </Link>
        </Section>
      )}
      <Text style={paragraph}>
        Merci pour votre confiance et votre investissement.
        <br />
        L&apos;équipe Papa pour la vie
      </Text>
    </BaseLayout>
  );
}
