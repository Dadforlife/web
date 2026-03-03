import { Link, Section, Text } from "@react-email/components";
import * as React from "react";
import {
  BaseLayout,
  paragraph,
  buttonStyle,
  infoBox,
  primaryColor,
} from "../components/base-layout";

interface Props {
  fullName: string;
  dashboardUrl: string;
}

export default function Bienvenue({ fullName, dashboardUrl }: Props) {
  return (
    <BaseLayout
      preview={`Bienvenue sur Papa pour la vie, ${fullName} ! Votre espace personnel est prêt.`}
      heading="Bienvenue sur Papa pour la vie !"
    >
      <Text style={paragraph}>Bonjour {fullName},</Text>
      <Text style={paragraph}>
        Nous sommes ravis de vous accueillir dans la communauté Papa pour la vie.
        Vous avez fait un pas important en rejoignant un réseau de pères qui
        s&apos;entraident et se soutiennent.
      </Text>
      <Text style={paragraph}>Voici ce que vous pouvez faire dès maintenant :</Text>
      <Section style={infoBox}>
        <Text style={{ ...paragraph, margin: "0 0 8px", fontSize: "14px" }}>
          <strong style={{ color: primaryColor }}>1.</strong> Complétez votre{" "}
          <strong>diagnostic personnalisé</strong> pour recevoir un plan d&apos;action
          adapté à votre situation.
        </Text>
        <Text style={{ ...paragraph, margin: "0 0 8px", fontSize: "14px" }}>
          <strong style={{ color: primaryColor }}>2.</strong> Rejoignez{" "}
          <strong>l&apos;Espace Papas</strong> pour échanger avec d&apos;autres pères.
        </Text>
        <Text style={{ ...paragraph, margin: 0, fontSize: "14px" }}>
          <strong style={{ color: primaryColor }}>3.</strong> Accédez à nos{" "}
          <strong>programmes d&apos;accompagnement</strong> et ressources.
        </Text>
      </Section>
      <Section style={{ textAlign: "center" as const, margin: "24px 0" }}>
        <Link href={dashboardUrl} style={buttonStyle}>
          Accéder à mon espace
        </Link>
      </Section>
      <Text style={paragraph}>
        N&apos;hésitez pas à explorer la plateforme. Nous sommes là pour vous
        accompagner à chaque étape.
      </Text>
      <Text style={paragraph}>
        À très bientôt,
        <br />
        L&apos;équipe Papa pour la vie
      </Text>
    </BaseLayout>
  );
}
