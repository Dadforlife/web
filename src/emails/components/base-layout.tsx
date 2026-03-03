import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://dadforlife.org";

interface BaseLayoutProps {
  preview: string;
  heading: string;
  children: React.ReactNode;
}

export function BaseLayout({ preview, heading, children }: BaseLayoutProps) {
  return (
    <Html lang="fr">
      <Head />
      <Preview>{preview}</Preview>
      <Body style={body}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Img
              src={`${baseUrl}/logo.svg`}
              width="40"
              height="40"
              alt="Papa pour la vie"
              style={logo}
            />
            <Text style={brandName}>Papa pour la vie</Text>
          </Section>

          <Hr style={hr} />

          {/* Content */}
          <Section style={content}>
            <Heading style={h1}>{heading}</Heading>
            {children}
          </Section>

          <Hr style={hr} />

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              Cet email a été envoyé par{" "}
              <Link href={baseUrl} style={footerLink}>
                Papa pour la vie
              </Link>
              . Si vous ne souhaitez plus recevoir ces emails, vous pouvez{" "}
              <Link
                href={`${baseUrl}/dashboard/parametres/notifications`}
                style={footerLink}
              >
                modifier vos préférences
              </Link>
              .
            </Text>
            <Text style={footerText}>
              Papa pour la vie — Rester un père à chaque étape de votre vie
              familiale.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

// ─── Shared styles ────────────────────────────────────────────────────────────

export const primaryColor = "#2B4470";
export const warmColor = "#F59E0B";
export const mutedColor = "#6B7280";
export const bgColor = "#F9FAFB";

const body: React.CSSProperties = {
  backgroundColor: bgColor,
  fontFamily:
    "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  margin: 0,
  padding: 0,
};

const container: React.CSSProperties = {
  backgroundColor: "#FFFFFF",
  borderRadius: "12px",
  margin: "40px auto",
  maxWidth: "580px",
  border: "1px solid #E5E7EB",
};

const header: React.CSSProperties = {
  padding: "24px 32px",
  display: "flex",
  alignItems: "center",
};

const logo: React.CSSProperties = {
  display: "inline-block",
  verticalAlign: "middle",
};

const brandName: React.CSSProperties = {
  display: "inline-block",
  verticalAlign: "middle",
  fontSize: "18px",
  fontWeight: 700,
  color: primaryColor,
  marginLeft: "10px",
  marginTop: 0,
  marginBottom: 0,
};

const hr: React.CSSProperties = {
  borderColor: "#E5E7EB",
  margin: 0,
};

const content: React.CSSProperties = {
  padding: "32px",
};

const h1: React.CSSProperties = {
  color: primaryColor,
  fontSize: "22px",
  fontWeight: 700,
  lineHeight: "32px",
  margin: "0 0 20px",
};

const footer: React.CSSProperties = {
  padding: "20px 32px",
};

const footerText: React.CSSProperties = {
  color: mutedColor,
  fontSize: "12px",
  lineHeight: "18px",
  margin: "4px 0",
};

const footerLink: React.CSSProperties = {
  color: primaryColor,
  textDecoration: "underline",
};

// ─── Reusable component styles (exported for templates) ───────────────────────

export const paragraph: React.CSSProperties = {
  color: "#374151",
  fontSize: "15px",
  lineHeight: "24px",
  margin: "0 0 16px",
};

export const buttonStyle: React.CSSProperties = {
  backgroundColor: primaryColor,
  borderRadius: "8px",
  color: "#FFFFFF",
  display: "inline-block",
  fontSize: "15px",
  fontWeight: 600,
  lineHeight: "100%",
  padding: "14px 28px",
  textDecoration: "none",
  textAlign: "center" as const,
};

export const secondaryButtonStyle: React.CSSProperties = {
  ...buttonStyle,
  backgroundColor: warmColor,
};

export const infoBox: React.CSSProperties = {
  backgroundColor: "#F0F4FF",
  borderRadius: "8px",
  padding: "16px 20px",
  margin: "16px 0",
  borderLeft: `4px solid ${primaryColor}`,
};

export const warningBox: React.CSSProperties = {
  backgroundColor: "#FEF3C7",
  borderRadius: "8px",
  padding: "16px 20px",
  margin: "16px 0",
  borderLeft: `4px solid ${warmColor}`,
};

export const alertBox: React.CSSProperties = {
  backgroundColor: "#FEE2E2",
  borderRadius: "8px",
  padding: "16px 20px",
  margin: "16px 0",
  borderLeft: "4px solid #EF4444",
};

export const label: React.CSSProperties = {
  color: mutedColor,
  fontSize: "13px",
  fontWeight: 600,
  textTransform: "uppercase" as const,
  letterSpacing: "0.5px",
  margin: "0 0 4px",
};

export const value: React.CSSProperties = {
  color: "#111827",
  fontSize: "15px",
  fontWeight: 500,
  margin: "0 0 12px",
};
