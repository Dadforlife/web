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
  categoryName: string;
  discussionTitle: string;
  authorName: string;
  discussionUrl: string;
}

export default function NouvelleDiscussionCategorie({
  fullName,
  categoryName,
  discussionTitle,
  authorName,
  discussionUrl,
}: Props) {
  return (
    <BaseLayout
      preview={`Nouvelle discussion dans "${categoryName}" par ${authorName}`}
      heading="Nouvelle discussion"
    >
      <Text style={paragraph}>Bonjour {fullName},</Text>
      <Text style={paragraph}>
        <strong>{authorName}</strong> a créé une nouvelle discussion dans la
        catégorie « <strong>{categoryName}</strong> » que vous suivez.
      </Text>
      <Section style={infoBox}>
        <Text style={{ ...paragraph, margin: 0, fontWeight: 600 }}>
          {discussionTitle}
        </Text>
      </Section>
      <Section style={{ textAlign: "center" as const, margin: "24px 0" }}>
        <Link href={discussionUrl} style={buttonStyle}>
          Voir la discussion
        </Link>
      </Section>
    </BaseLayout>
  );
}
