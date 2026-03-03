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
  resourceTitle: string;
  programmeName: string;
  resourceUrl: string;
}

export default function RessourceAjoutee({
  fullName,
  resourceTitle,
  programmeName,
  resourceUrl,
}: Props) {
  return (
    <BaseLayout
      preview={`Nouvelle ressource ajoutée : ${resourceTitle}`}
      heading="Nouvelle ressource disponible"
    >
      <Text style={paragraph}>Bonjour {fullName},</Text>
      <Text style={paragraph}>
        Une nouvelle ressource a été ajoutée à votre programme
        « <strong>{programmeName}</strong> » :
      </Text>
      <Section style={infoBox}>
        <Text style={{ ...paragraph, margin: 0, fontWeight: 600 }}>
          {resourceTitle}
        </Text>
      </Section>
      <Text style={paragraph}>
        Cette ressource est conçue pour vous accompagner dans votre parcours.
        Consultez-la dès maintenant.
      </Text>
      <Section style={{ textAlign: "center" as const, margin: "24px 0" }}>
        <Link href={resourceUrl} style={buttonStyle}>
          Consulter la ressource
        </Link>
      </Section>
    </BaseLayout>
  );
}
