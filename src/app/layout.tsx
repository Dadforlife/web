import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { LayoutWrapper } from "@/components/layout-wrapper";
import { CookieConsent } from "@/components/cookie-consent";
import { ScrollToTop } from "@/components/scroll-to-top";

export const metadata: Metadata = {
  title: "Dad for Life - Rester un père à chaque étape de votre vie familiale",
  description:
    "Association d'accompagnement des pères : père solo, en couple ou en instance de séparation. Diagnostic personnalisé, parcours structuré et réseau de professionnels qualifiés pour retrouver stabilité et présence auprès de vos enfants.",
  openGraph: {
    title: "Dad for Life - Accompagnement structuré des pères",
    description:
      "Un accompagnement personnalisé pour les pères. Stabilisation émotionnelle, cadre parental, communication apaisée. Un père stable aujourd'hui, un enfant plus équilibré demain.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <link rel="icon" href="/logo.svg" type="image/svg+xml" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans overflow-x-hidden min-w-0">
        <LayoutWrapper
          navbar={<Navbar />}
          footer={<Footer />}
        >
          {children}
        </LayoutWrapper>
        <CookieConsent />
        <ScrollToTop />
      </body>
    </html>
  );
}
