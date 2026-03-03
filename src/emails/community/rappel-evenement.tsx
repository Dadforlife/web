import { Link, Section, Text } from "@react-email/components";
import * as React from "react";
import {
  BaseLayout,
  paragraph,
  buttonStyle,
  warningBox,
  label,
  value,
} from "../components/base-layout";

interface Props {
  fullName: string;
  eventTitle: string;
  eventDate: string;
  eventLocation: string;
  eventUrl: string;
}

export default function RappelEvenement({
  fullName,
  eventTitle,
  eventDate,
  eventLocation,
  eventUrl,
}: Props) {
  return (
    <BaseLayout
      preview={`Rappel : ${eventTitle} arrive bientôt`}
      heading="Rappel d'événement"
    >
      <Text style={paragraph}>Bonjour {fullName},</Text>
      <Text style={paragraph}>
        L&apos;événement auquel vous êtes inscrit approche !
      </Text>
      <Section style={warningBox}>
        <Text style={label}>Événement</Text>
        <Text style={value}>{eventTitle}</Text>
        <Text style={label}>Date</Text>
        <Text style={value}>{eventDate}</Text>
        <Text style={label}>Lieu</Text>
        <Text style={{ ...value, margin: 0 }}>{eventLocation}</Text>
      </Section>
      <Text style={paragraph}>
        Nous avons hâte de vous y retrouver !
      </Text>
      <Section style={{ textAlign: "center" as const, margin: "24px 0" }}>
        <Link href={eventUrl} style={buttonStyle}>
          Voir les détails
        </Link>
      </Section>
    </BaseLayout>
  );
}
