import { Text } from "@react-email/components";
import * as React from "react";
import { BaseLayout, paragraph } from "../components/base-layout";

interface Props {
  fullName: string;
}

export default function CompteSupprime({ fullName }: Props) {
  return (
    <BaseLayout
      preview="Votre compte Papa pour la vie a été supprimé"
      heading="Compte supprimé"
    >
      <Text style={paragraph}>Bonjour {fullName},</Text>
      <Text style={paragraph}>
        Nous vous confirmons que votre compte Papa pour la vie a été supprimé
        conformément à votre demande. Toutes vos données personnelles ont été
        effacées de nos systèmes.
      </Text>
      <Text style={paragraph}>
        Si cette suppression n&apos;a pas été demandée par vous, veuillez nous
        contacter immédiatement à <strong>contact@dadforlife.org</strong>.
      </Text>
      <Text style={paragraph}>
        Nous espérons que Papa pour la vie vous aura été utile. Vous êtes toujours
        le bienvenu si vous souhaitez nous rejoindre à nouveau.
      </Text>
      <Text style={paragraph}>
        Bien à vous,
        <br />
        L&apos;équipe Papa pour la vie
      </Text>
    </BaseLayout>
  );
}
