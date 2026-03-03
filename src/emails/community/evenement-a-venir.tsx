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
  fullName: string;
  eventTitle: string;
  eventDate: string;
  eventLocation: string;
  eventUrl: string;
}

export default function EvenementAVenir({
  fullName,
  eventTitle,
  eventDate,
  eventLocation,
  eventUrl,
}: Props) {
  return (
    <BaseLayout
      preview={`Événement à venir : ${eventTitle}`}
      heading="Événement à venir"
    >
      <Text style={paragraph}>Bonjour {fullName},</Text>
      <Text style={paragraph}>
        Un nouvel événement est prévu et pourrait vous intéresser !
      </Text>
      <Section style={infoBox}>
        <Text style={label}>Événement</Text>
        <Text style={value}>{eventTitle}</Text>
        <Text style={label}>Date</Text>
        <Text style={value}>{eventDate}</Text>
        <Text style={label}>Lieu</Text>
        <Text style={{ ...value, margin: 0 }}>{eventLocation}</Text>
      </Section>
      <Section style={{ textAlign: "center" as const, margin: "24px 0" }}>
        <Link href={eventUrl} style={buttonStyle}>
          En savoir plus
        </Link>
      </Section>
    </BaseLayout>
  );
}
