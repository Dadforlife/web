import { Link, Section, Text } from "@react-email/components";
import * as React from "react";
import {
  BaseLayout,
  paragraph,
  buttonStyle,
  warningBox,
} from "../components/base-layout";

interface Props {
  fullName: string;
  eventTitle: string;
  changeType: string;
  eventUrl: string;
}

export default function EvenementModifie({
  fullName,
  eventTitle,
  changeType,
  eventUrl,
}: Props) {
  return (
    <BaseLayout
      preview={`L'événement "${eventTitle}" a été modifié`}
      heading="Événement modifié"
    >
      <Text style={paragraph}>Bonjour {fullName},</Text>
      <Text style={paragraph}>
        L&apos;événement « <strong>{eventTitle}</strong> » a été modifié.
      </Text>
      <Section style={warningBox}>
        <Text style={{ ...paragraph, margin: 0, fontWeight: 600, fontSize: "14px" }}>
          Modification : {changeType}
        </Text>
      </Section>
      <Text style={paragraph}>
        Consultez les détails mis à jour pour vous assurer que ces changements
        vous conviennent.
      </Text>
      <Section style={{ textAlign: "center" as const, margin: "24px 0" }}>
        <Link href={eventUrl} style={buttonStyle}>
          Voir les détails
        </Link>
      </Section>
    </BaseLayout>
  );
}
