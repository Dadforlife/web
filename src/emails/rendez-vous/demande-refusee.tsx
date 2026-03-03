import { Link, Section, Text } from "@react-email/components";
import * as React from "react";
import {
  BaseLayout,
  paragraph,
  buttonStyle,
  infoBox,
  label,
  value,
} from "../components/base-layout";

interface Props {
  parentName: string;
  type: string;
  responseNote?: string;
  dashboardUrl: string;
}

export default function DemandeRefusee({
  parentName,
  type,
  responseNote,
  dashboardUrl,
}: Props) {
  const typeLabel =
    type === "accompagnement_terrain"
      ? "Accompagnement terrain"
      : "Rendez-vous téléphonique";

  return (
    <BaseLayout
      preview="Mise à jour de votre demande de rendez-vous"
      heading="Mise à jour de votre demande"
    >
      <Text style={paragraph}>Bonjour {parentName},</Text>
      <Text style={paragraph}>
        Nous vous informons que votre demande de <strong>{typeLabel}</strong> n&apos;a
        pas pu être prise en charge pour le moment.
      </Text>
      {responseNote && (
        <Section style={infoBox}>
          <Text style={label}>Motif</Text>
          <Text style={{ ...value, marginBottom: 0 }}>{responseNote}</Text>
        </Section>
      )}
      <Text style={paragraph}>
        N&apos;hésitez pas à soumettre une nouvelle demande ou à nous contacter
        pour trouver une solution adaptée.
      </Text>
      <Section style={{ textAlign: "center" as const, margin: "24px 0" }}>
        <Link href={dashboardUrl} style={buttonStyle}>
          Faire une nouvelle demande
        </Link>
      </Section>
      <Text style={paragraph}>
        Nous restons à vos côtés,
        <br />
        L&apos;équipe Papa pour la vie
      </Text>
    </BaseLayout>
  );
}
