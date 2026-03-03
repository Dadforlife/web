import { Link, Section, Text } from "@react-email/components";
import * as React from "react";
import {
  BaseLayout,
  paragraph,
  buttonStyle,
} from "../components/base-layout";

interface Props {
  fullName: string;
  newMemberName: string;
  discussionTitle: string;
  discussionUrl: string;
}

export default function PapaRejointDiscussion({
  fullName,
  newMemberName,
  discussionTitle,
  discussionUrl,
}: Props) {
  return (
    <BaseLayout
      preview={`${newMemberName} a rejoint la discussion "${discussionTitle}"`}
      heading="Un papa a rejoint votre discussion"
    >
      <Text style={paragraph}>Bonjour {fullName},</Text>
      <Text style={paragraph}>
        <strong>{newMemberName}</strong> a rejoint la discussion
        « <strong>{discussionTitle}</strong> ».
      </Text>
      <Text style={paragraph}>
        Vous pouvez échanger ensemble et partager vos expériences.
      </Text>
      <Section style={{ textAlign: "center" as const, margin: "24px 0" }}>
        <Link href={discussionUrl} style={buttonStyle}>
          Voir la discussion
        </Link>
      </Section>
    </BaseLayout>
  );
}
