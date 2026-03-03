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
  newEmail: string;
  confirmUrl: string;
}

export default function ModificationEmail({
  fullName,
  newEmail,
  confirmUrl,
}: Props) {
  return (
    <BaseLayout
      preview="Confirmez votre nouvelle adresse email"
      heading="Modification d'adresse email"
    >
      <Text style={paragraph}>Bonjour {fullName},</Text>
      <Text style={paragraph}>
        Vous avez demandé à modifier votre adresse email. Pour confirmer le
        changement vers <strong>{newEmail}</strong>, veuillez cliquer sur le
        bouton ci-dessous.
      </Text>
      <Section style={{ textAlign: "center" as const, margin: "24px 0" }}>
        <Link href={confirmUrl} style={buttonStyle}>
          Confirmer la nouvelle adresse
        </Link>
      </Section>
      <Section style={infoBox}>
        <Text style={{ ...paragraph, margin: 0, fontSize: "13px" }}>
          Ce lien expire dans 24 heures. Si vous n&apos;avez pas demandé ce
          changement, veuillez ignorer cet email. Votre adresse actuelle reste
          inchangée.
        </Text>
      </Section>
    </BaseLayout>
  );
}
