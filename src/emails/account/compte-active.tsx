import { Link, Section, Text } from "@react-email/components";
import * as React from "react";
import { BaseLayout, paragraph, buttonStyle } from "../components/base-layout";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://dadforlife.org";

interface Props {
  fullName: string;
}

export default function CompteActive({ fullName }: Props) {
  return (
    <BaseLayout
      preview="Votre compte Papa pour la vie est maintenant activé !"
      heading="Compte activé avec succès"
    >
      <Text style={paragraph}>Bonjour {fullName},</Text>
      <Text style={paragraph}>
        Bonne nouvelle ! Votre compte Papa pour la vie a été activé avec succès.
        Vous avez maintenant accès à l&apos;ensemble de nos services et
        ressources.
      </Text>
      <Text style={paragraph}>
        Vous pouvez dès à présent vous connecter et commencer à utiliser votre
        espace personnel.
      </Text>
      <Section style={{ textAlign: "center" as const, margin: "24px 0" }}>
        <Link href={`${baseUrl}/dashboard`} style={buttonStyle}>
          Accéder à mon espace
        </Link>
      </Section>
    </BaseLayout>
  );
}
