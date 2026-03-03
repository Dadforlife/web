import { Section, Text } from "@react-email/components";
import * as React from "react";
import {
  BaseLayout,
  paragraph,
  warningBox,
  label,
  value,
} from "../components/base-layout";

interface Props {
  fullName: string;
  maintenanceDate: string;
  maintenanceDuration: string;
}

export default function MaintenanceProgrammee({
  fullName,
  maintenanceDate,
  maintenanceDuration,
}: Props) {
  return (
    <BaseLayout
      preview={`Maintenance programmée le ${maintenanceDate}`}
      heading="Maintenance programmée"
    >
      <Text style={paragraph}>Bonjour {fullName},</Text>
      <Text style={paragraph}>
        Nous souhaitons vous informer d&apos;une maintenance programmée sur la
        plateforme Papa pour la vie. Pendant cette période, le site pourra être
        temporairement indisponible.
      </Text>
      <Section style={warningBox}>
        <Text style={label}>Date</Text>
        <Text style={value}>{maintenanceDate}</Text>
        <Text style={label}>Durée estimée</Text>
        <Text style={{ ...value, margin: 0 }}>{maintenanceDuration}</Text>
      </Section>
      <Text style={paragraph}>
        Nous mettons tout en œuvre pour limiter les perturbations. Merci pour
        votre compréhension.
      </Text>
      <Text style={paragraph}>
        L&apos;équipe Papa pour la vie
      </Text>
    </BaseLayout>
  );
}
