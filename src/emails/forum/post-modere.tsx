import { Text, Section } from "@react-email/components";
import * as React from "react";
import {
  BaseLayout,
  paragraph,
  alertBox,
} from "../components/base-layout";

interface Props {
  fullName: string;
  discussionTitle: string;
  action: string;
  reason: string;
  contactEmail: string;
}

export default function PostModere({
  fullName,
  discussionTitle,
  action,
  reason,
  contactEmail,
}: Props) {
  return (
    <BaseLayout
      preview="Votre publication a été modérée"
      heading="Publication modérée"
    >
      <Text style={paragraph}>Bonjour {fullName},</Text>
      <Text style={paragraph}>
        Après examen par notre équipe de modération, votre publication dans la
        discussion « <strong>{discussionTitle}</strong> » a fait l&apos;objet
        de la mesure suivante :
      </Text>
      <Section style={alertBox}>
        <Text style={{ ...paragraph, margin: "0 0 4px", fontWeight: 600, fontSize: "13px" }}>
          Action : {action}
        </Text>
        <Text style={{ ...paragraph, margin: 0, fontSize: "13px" }}>
          Motif : {reason}
        </Text>
      </Section>
      <Text style={paragraph}>
        Nous vous rappelons que tous les échanges sur Papa pour la vie doivent
        rester bienveillants et respectueux. Nous comptons sur votre
        compréhension.
      </Text>
      <Text style={paragraph}>
        Si vous souhaitez contester cette décision, vous pouvez nous écrire à{" "}
        <strong>{contactEmail}</strong>.
      </Text>
    </BaseLayout>
  );
}
