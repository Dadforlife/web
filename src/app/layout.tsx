import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { LayoutWrapper } from "@/components/layout-wrapper";
import { CookieConsent } from "@/components/cookie-consent";
import { ScrollToTop } from "@/components/scroll-to-top";
import { Toaster } from "@/components/ui/sonner";
import { LogoutToast } from "@/components/logout-toast";
import { Suspense } from "react";
import {
  organizationJsonLd,
  websiteJsonLd,
  nonprofitJsonLd,
  jsonLd,
} from "@/lib/structured-data";
import { SITE_URL, SITE_NAME, SITE_LOCALE, DEFAULT_OG_IMAGE } from "@/lib/seo";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Papa pour la vie - Accompagnement des pères dans leur rôle parental",
    template: "%s | Papa pour la vie",
  },
  description:
    "Association loi 1901 d'accompagnement, de soutien et de formation des pères. Promotion d'une paternité responsable, engagée et stable. Parcours structuré et réseau de professionnels qualifiés.",
  keywords: [
    "accompagnement pères",
    "soutien paternel",
    "paternité responsable",
    "séparation parentale",
    "garde d'enfants",
    "médiation familiale",
    "père isolé",
    "droit des pères",
    "association loi 1901",
    "papa pour la vie",
    "soutien parental Nantes",
    "aide aux pères",
  ],
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    type: "website",
    locale: SITE_LOCALE,
    url: SITE_URL,
    siteName: SITE_NAME,
    title: "Papa pour la vie - Accompagnement structuré des pères",
    description:
      "Un accompagnement personnalisé pour les pères. Stabilisation émotionnelle, cadre parental, communication apaisée. Un père stable aujourd'hui, un enfant plus équilibré demain.",
    images: [
      {
        url: DEFAULT_OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "Papa pour la vie - Accompagnement des pères",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Papa pour la vie - Accompagnement des pères",
    description:
      "Association d'accompagnement, de soutien et de formation des pères dans leur rôle parental.",
    images: [DEFAULT_OG_IMAGE],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
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

        {/* Structured data: Organization + Website + NGO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={jsonLd(organizationJsonLd())}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={jsonLd(websiteJsonLd())}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={jsonLd(nonprofitJsonLd())}
        />
      </head>
      <body className="font-sans overflow-x-hidden min-w-0">
        <LayoutWrapper
          navbar={<Navbar />}
          footer={<Footer />}
        >
          {children}
        </LayoutWrapper>
        <Toaster position="top-center" richColors closeButton />
        <Suspense>
          <LogoutToast />
        </Suspense>
        <CookieConsent />
        <ScrollToTop />
      </body>
    </html>
  );
}
