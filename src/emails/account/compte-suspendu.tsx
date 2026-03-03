import { Text, Section } from "@react-email/components";
import * as React from "react";
import {
  BaseLayout,
  paragraph,
  alertBox,
} from "../components/base-layout";

interface Props {
  fullName: string;
  reason: string;
  contactEmail: string;
}

export default function CompteSuspendu({
  fullName,
  reason,
  contactEmail,
}: Props) {
  return (
    <BaseLayout
      preview="Votre compte Papa pour la vie a été suspendu"
      heading="Compte suspendu"
    >
      <Text style={paragraph}>Bonjour {fullName},</Text>
      <Text style={paragraph}>
        Nous vous informons que votre compte Papa pour la vie a été temporairement
        suspendu. Voici la raison de cette décision :
      </Text>
      <Section style={alertBox}>
        <Text style={{ ...paragraph, margin: 0, fontWeight: 500 }}>
          {reason}
        </Text>
      </Section>
      <Text style={paragraph}>
        Pendant la suspension, vous ne pourrez pas accéder à votre espace
        personnel ni participer aux discussions.
      </Text>
      <Text style={paragraph}>
        Si vous pensez qu&apos;il s&apos;agit d&apos;une erreur ou si vous
        souhaitez contester cette décision, veuillez nous contacter à{" "}
        <strong>{contactEmail}</strong>.
      </Text>
      <Text style={paragraph}>
        Cordialement,
        <br />
        L&apos;équipe Papa pour la vie
      </Text>
    </BaseLayout>
  );
}
