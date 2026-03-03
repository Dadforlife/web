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
  volunteerName: string;
  parentName: string;
  type: string;
  message?: string;
  city?: string;
  preferredDate?: string;
  dashboardUrl: string;
}

export default function NouvelleDemande({
  volunteerName,
  parentName,
  type,
  message,
  city,
  preferredDate,
  dashboardUrl,
}: Props) {
  const typeLabel =
    type === "accompagnement_terrain"
      ? "Accompagnement terrain"
      : "Rendez-vous téléphonique";

  return (
    <BaseLayout
      preview={`Nouvelle demande de rendez-vous de ${parentName}`}
      heading="Nouvelle demande de rendez-vous"
    >
      <Text style={paragraph}>Bonjour {volunteerName},</Text>
      <Text style={paragraph}>
        <strong>{parentName}</strong> souhaite prendre rendez-vous avec un
        bénévole. Voici les détails de sa demande :
      </Text>
      <Section style={infoBox}>
        <Text style={label}>Type</Text>
        <Text style={value}>{typeLabel}</Text>
        {city && (
          <>
            <Text style={label}>Ville</Text>
            <Text style={value}>{city}</Text>
          </>
        )}
        {preferredDate && (
          <>
            <Text style={label}>Date souhaitée</Text>
            <Text style={value}>{preferredDate}</Text>
          </>
        )}
        {message && (
          <>
            <Text style={label}>Message</Text>
            <Text style={{ ...value, marginBottom: 0 }}>{message}</Text>
          </>
        )}
      </Section>
      <Section style={{ textAlign: "center" as const, margin: "24px 0" }}>
        <Link href={dashboardUrl} style={buttonStyle}>
          Voir les demandes
        </Link>
      </Section>
      <Text style={paragraph}>
        Vous pouvez accepter cette demande depuis votre espace bénévole.
      </Text>
      <Text style={paragraph}>
        Merci pour votre engagement,
        <br />
        L&apos;équipe Papa pour la vie
      </Text>
    </BaseLayout>
  );
}
