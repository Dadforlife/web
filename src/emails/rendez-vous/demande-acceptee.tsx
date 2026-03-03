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
  volunteerName: string;
  type: string;
  responseNote?: string;
  dashboardUrl: string;
}

export default function DemandeAcceptee({
  parentName,
  volunteerName,
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
      preview={`Votre demande de rendez-vous a été acceptée par ${volunteerName}`}
      heading="Demande de rendez-vous acceptée !"
    >
      <Text style={paragraph}>Bonjour {parentName},</Text>
      <Text style={paragraph}>
        Bonne nouvelle ! <strong>{volunteerName}</strong> a accepté votre
        demande de rendez-vous.
      </Text>
      <Section style={infoBox}>
        <Text style={label}>Type de rendez-vous</Text>
        <Text style={value}>{typeLabel}</Text>
        <Text style={label}>Bénévole</Text>
        <Text style={{ ...value, marginBottom: responseNote ? undefined : 0 }}>
          {volunteerName}
        </Text>
        {responseNote && (
          <>
            <Text style={label}>Message du bénévole</Text>
            <Text style={{ ...value, marginBottom: 0 }}>{responseNote}</Text>
          </>
        )}
      </Section>
      <Text style={paragraph}>
        Le bénévole va vous contacter prochainement pour convenir des modalités
        du rendez-vous.
      </Text>
      <Section style={{ textAlign: "center" as const, margin: "24px 0" }}>
        <Link href={dashboardUrl} style={buttonStyle}>
          Voir mes demandes
        </Link>
      </Section>
      <Text style={paragraph}>
        À très bientôt,
        <br />
        L&apos;équipe Papa pour la vie
      </Text>
    </BaseLayout>
  );
}
