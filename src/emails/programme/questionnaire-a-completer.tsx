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
  questionnaireName: string;
  deadline: string;
  questionnaireUrl: string;
}

export default function QuestionnaireACompleter({
  fullName,
  questionnaireName,
  deadline,
  questionnaireUrl,
}: Props) {
  return (
    <BaseLayout
      preview={`Questionnaire à compléter : ${questionnaireName}`}
      heading="Questionnaire à compléter"
    >
      <Text style={paragraph}>Bonjour {fullName},</Text>
      <Text style={paragraph}>
        Un questionnaire attend votre réponse dans le cadre de votre
        accompagnement :
      </Text>
      <Section style={warningBox}>
        <Text style={{ ...paragraph, margin: "0 0 8px", fontWeight: 600 }}>
          {questionnaireName}
        </Text>
        <Text style={{ ...paragraph, margin: 0, fontSize: "13px" }}>
          À compléter avant le <strong>{deadline}</strong>
        </Text>
      </Section>
      <Text style={paragraph}>
        Vos réponses nous aident à adapter votre accompagnement et à mieux
        comprendre vos besoins.
      </Text>
      <Section style={{ textAlign: "center" as const, margin: "24px 0" }}>
        <Link href={questionnaireUrl} style={buttonStyle}>
          Répondre au questionnaire
        </Link>
      </Section>
    </BaseLayout>
  );
}
