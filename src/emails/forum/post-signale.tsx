import { Text, Section } from "@react-email/components";
import * as React from "react";
import {
  BaseLayout,
  paragraph,
  warningBox,
} from "../components/base-layout";

interface Props {
  fullName: string;
  discussionTitle: string;
  reason: string;
}

export default function PostSignale({
  fullName,
  discussionTitle,
  reason,
}: Props) {
  return (
    <BaseLayout
      preview="Votre message a été signalé par un membre"
      heading="Votre publication a été signalée"
    >
      <Text style={paragraph}>Bonjour {fullName},</Text>
      <Text style={paragraph}>
        Votre publication dans la discussion « <strong>{discussionTitle}</strong>
        » a été signalée par un membre de la communauté.
      </Text>
      <Section style={warningBox}>
        <Text style={{ ...paragraph, margin: "0 0 4px", fontWeight: 600, fontSize: "13px" }}>
          Motif du signalement :
        </Text>
        <Text style={{ ...paragraph, margin: 0, fontSize: "13px" }}>
          {reason}
        </Text>
      </Section>
      <Text style={paragraph}>
        Notre équipe de modération va examiner votre publication. En attendant,
        assurez-vous que vos messages respectent les règles de la communauté.
      </Text>
      <Text style={paragraph}>
        Si vous avez des questions, n&apos;hésitez pas à nous contacter à{" "}
        <strong>contact@dadforlife.org</strong>.
      </Text>
    </BaseLayout>
  );
}
