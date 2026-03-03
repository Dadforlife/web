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
  resetUrl: string;
}

export default function MotDePasseOublie({ fullName, resetUrl }: Props) {
  return (
    <BaseLayout
      preview="Réinitialisez votre mot de passe Papa pour la vie"
      heading="Réinitialisation de votre mot de passe"
    >
      <Text style={paragraph}>Bonjour {fullName},</Text>
      <Text style={paragraph}>
        Nous avons reçu une demande de réinitialisation de votre mot de passe.
        Cliquez sur le bouton ci-dessous pour choisir un nouveau mot de passe.
      </Text>
      <Section style={{ textAlign: "center" as const, margin: "24px 0" }}>
        <Link href={resetUrl} style={buttonStyle}>
          Réinitialiser mon mot de passe
        </Link>
      </Section>
      <Section style={infoBox}>
        <Text style={{ ...paragraph, margin: 0, fontSize: "13px" }}>
          Ce lien expire dans 1 heure. Si vous n&apos;avez pas demandé cette
          réinitialisation, vous pouvez ignorer cet email. Votre mot de passe
          actuel reste inchangé.
        </Text>
      </Section>
    </BaseLayout>
  );
}
