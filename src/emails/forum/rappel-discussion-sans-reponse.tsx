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
  discussionTitle: string;
  daysSincePost: number;
  discussionUrl: string;
}

export default function RappelDiscussionSansReponse({
  fullName,
  discussionTitle,
  daysSincePost,
  discussionUrl,
}: Props) {
  return (
    <BaseLayout
      preview={`Votre discussion "${discussionTitle}" attend une réponse`}
      heading="Votre discussion attend des réponses"
    >
      <Text style={paragraph}>Bonjour {fullName},</Text>
      <Text style={paragraph}>
        Votre discussion « <strong>{discussionTitle}</strong> » n&apos;a pas
        encore reçu de réponse depuis {daysSincePost} jours.
      </Text>
      <Section style={warningBox}>
        <Text style={{ ...paragraph, margin: 0, fontSize: "13px" }}>
          Astuce : vous pouvez préciser votre situation ou poser une question
          plus spécifique pour encourager les réponses des autres papas.
        </Text>
      </Section>
      <Section style={{ textAlign: "center" as const, margin: "24px 0" }}>
        <Link href={discussionUrl} style={buttonStyle}>
          Voir ma discussion
        </Link>
      </Section>
    </BaseLayout>
  );
}
