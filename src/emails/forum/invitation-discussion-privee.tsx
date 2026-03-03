import { Link, Section, Text } from "@react-email/components";
import * as React from "react";
import {
  BaseLayout,
  paragraph,
  buttonStyle,
  infoBox,
} from "../components/base-layout";

interface Props {
  fullName: string;
  invitedBy: string;
  discussionTitle: string;
  discussionUrl: string;
}

export default function InvitationDiscussionPrivee({
  fullName,
  invitedBy,
  discussionTitle,
  discussionUrl,
}: Props) {
  return (
    <BaseLayout
      preview={`${invitedBy} vous invite à rejoindre une discussion privée`}
      heading="Invitation à une discussion privée"
    >
      <Text style={paragraph}>Bonjour {fullName},</Text>
      <Text style={paragraph}>
        <strong>{invitedBy}</strong> vous invite à rejoindre une discussion
        privée : « <strong>{discussionTitle}</strong> ».
      </Text>
      <Section style={infoBox}>
        <Text style={{ ...paragraph, margin: 0, fontSize: "13px" }}>
          Les discussions privées vous permettent d&apos;échanger en toute
          confidentialité avec d&apos;autres papas.
        </Text>
      </Section>
      <Section style={{ textAlign: "center" as const, margin: "24px 0" }}>
        <Link href={discussionUrl} style={buttonStyle}>
          Rejoindre la discussion
        </Link>
      </Section>
    </BaseLayout>
  );
}
