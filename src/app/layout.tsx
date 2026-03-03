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

export const metadata: Metadata = {
  title: "Papa pour la vie - Accompagnement des pères dans leur rôle parental",
  description:
    "Association loi 1901 d'accompagnement, de soutien et de formation des pères. Promotion d'une paternité responsable, engagée et stable. Parcours structuré et réseau de professionnels qualifiés.",
  openGraph: {
    title: "Papa pour la vie - Accompagnement structuré des pères",
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
