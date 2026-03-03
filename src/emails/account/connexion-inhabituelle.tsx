import { Section, Text } from "@react-email/components";
import * as React from "react";
import {
  BaseLayout,
  paragraph,
  alertBox,
  label,
  value,
} from "../components/base-layout";

interface Props {
  fullName: string;
  device: string;
  location: string;
  date: string;
}

export default function ConnexionInhabituelle({
  fullName,
  device,
  location,
  date,
}: Props) {
  return (
    <BaseLayout
      preview="Alerte : connexion inhabituelle détectée sur votre compte"
      heading="Connexion inhabituelle détectée"
    >
      <Text style={paragraph}>Bonjour {fullName},</Text>
      <Text style={paragraph}>
        Nous avons détecté une connexion à votre compte Papa pour la vie depuis un
        appareil ou un emplacement inhabituel. Si c&apos;est bien vous, vous
        pouvez ignorer cet email.
      </Text>
      <Section style={alertBox}>
        <Text style={label}>Appareil</Text>
        <Text style={value}>{device}</Text>
        <Text style={label}>Localisation</Text>
        <Text style={value}>{location}</Text>
        <Text style={label}>Date et heure</Text>
        <Text style={{ ...value, margin: 0 }}>{date}</Text>
      </Section>
      <Text style={paragraph}>
        Si vous ne reconnaissez pas cette activité, nous vous recommandons de
        changer votre mot de passe immédiatement et de contacter notre équipe à{" "}
        <strong>contact@dadforlife.org</strong>.
      </Text>
    </BaseLayout>
  );
}
