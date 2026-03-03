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
  confirmUrl: string;
}

export default function ConfirmationInscription({
  fullName,
  confirmUrl,
}: Props) {
  return (
    <BaseLayout
      preview="Confirmez votre adresse email pour activer votre compte Papa pour la vie"
      heading="Confirmez votre email"
    >
      <Text style={paragraph}>Bonjour {fullName},</Text>
      <Text style={paragraph}>
        Merci de vous être inscrit sur Papa pour la vie ! Pour activer votre compte
        et accéder à tous nos services, veuillez confirmer votre adresse email
        en cliquant sur le bouton ci-dessous.
      </Text>
      <Section style={{ textAlign: "center" as const, margin: "24px 0" }}>
        <Link href={confirmUrl} style={buttonStyle}>
          Confirmer mon email
        </Link>
      </Section>
      <Section style={infoBox}>
        <Text style={{ ...paragraph, margin: 0, fontSize: "13px" }}>
          Ce lien expire dans 24 heures. Si vous n&apos;avez pas créé de compte
          sur Papa pour la vie, vous pouvez ignorer cet email.
        </Text>
      </Section>
    </BaseLayout>
  );
}
