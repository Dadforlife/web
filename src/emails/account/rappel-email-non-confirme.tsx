import { Link, Section, Text } from "@react-email/components";
import * as React from "react";
import {
  BaseLayout,
  paragraph,
  buttonStyle,
  warningBox,
} from "../components/base-layout";

interface Props {
  fullName: string;
  confirmUrl: string;
}

export default function RappelEmailNonConfirme({
  fullName,
  confirmUrl,
}: Props) {
  return (
    <BaseLayout
      preview="Rappel : confirmez votre email pour accéder à toutes les fonctionnalités"
      heading="Votre email n'est pas encore confirmé"
    >
      <Text style={paragraph}>Bonjour {fullName},</Text>
      <Text style={paragraph}>
        Nous avons remarqué que vous n&apos;avez pas encore confirmé votre
        adresse email. Pour profiter de toutes les fonctionnalités de Dad for
        Life, il est important de valider votre email.
      </Text>
      <Section style={warningBox}>
        <Text style={{ ...paragraph, margin: 0, fontSize: "13px" }}>
          Sans confirmation, certaines fonctionnalités comme les notifications
          par email et l&apos;accès au forum seront limitées.
        </Text>
      </Section>
      <Section style={{ textAlign: "center" as const, margin: "24px 0" }}>
        <Link href={confirmUrl} style={buttonStyle}>
          Confirmer mon email
        </Link>
      </Section>
      <Text style={paragraph}>
        Si vous avez déjà confirmé votre email, vous pouvez ignorer ce message.
      </Text>
    </BaseLayout>
  );
}
