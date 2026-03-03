import { Link, Section, Text } from "@react-email/components";
import * as React from "react";
import {
  BaseLayout,
  paragraph,
  buttonStyle,
  infoBox,
  primaryColor,
} from "../components/base-layout";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://dadforlife.org";

interface Props {
  fullName: string;
  topics: string[];
  discussionLinks: { title: string; url: string }[];
}

export default function SujetsInterets({
  fullName,
  topics,
  discussionLinks,
}: Props) {
  return (
    <BaseLayout
      preview="Des papas parlent de sujets qui vous intéressent"
      heading="Des sujets qui vous intéressent"
    >
      <Text style={paragraph}>Bonjour {fullName},</Text>
      <Text style={paragraph}>
        Des papas discutent en ce moment de sujets qui pourraient vous
        intéresser : <strong>{topics.join(", ")}</strong>.
      </Text>
      <Section style={infoBox}>
        <Text style={{ ...paragraph, margin: "0 0 8px", fontWeight: 600, fontSize: "14px" }}>
          Discussions en cours
        </Text>
        {discussionLinks.map((d, i) => (
          <Text
            key={i}
            style={{
              ...paragraph,
              margin: i < discussionLinks.length - 1 ? "0 0 6px" : 0,
              fontSize: "14px",
            }}
          >
            •{" "}
            <Link href={d.url} style={{ color: primaryColor, textDecoration: "underline" }}>
              {d.title}
            </Link>
          </Text>
        ))}
      </Section>
      <Section style={{ textAlign: "center" as const, margin: "24px 0" }}>
        <Link href={`${baseUrl}/espace-papas`} style={buttonStyle}>
          Rejoindre la discussion
        </Link>
      </Section>
    </BaseLayout>
  );
}
