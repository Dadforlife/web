import { Link, Section, Text } from "@react-email/components";
import * as React from "react";
import {
  BaseLayout,
  paragraph,
  buttonStyle,
  warningBox,
} from "../components/base-layout";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://dadforlife.org";

interface Props {
  fullName: string;
}

export default function ReinitialisationReussie({ fullName }: Props) {
  return (
    <BaseLayout
      preview="Votre mot de passe a été modifié avec succès"
      heading="Mot de passe modifié"
    >
      <Text style={paragraph}>Bonjour {fullName},</Text>
      <Text style={paragraph}>
        Votre mot de passe Papa pour la vie a été réinitialisé avec succès. Vous
        pouvez maintenant vous connecter avec votre nouveau mot de passe.
      </Text>
      <Section style={{ textAlign: "center" as const, margin: "24px 0" }}>
        <Link href={`${baseUrl}/auth/login`} style={buttonStyle}>
          Se connecter
        </Link>
      </Section>
      <Section style={warningBox}>
        <Text style={{ ...paragraph, margin: 0, fontSize: "13px" }}>
          Si vous n&apos;êtes pas à l&apos;origine de cette modification,
          veuillez contacter immédiatement notre équipe à contact@dadforlife.org.
        </Text>
      </Section>
    </BaseLayout>
  );
}
