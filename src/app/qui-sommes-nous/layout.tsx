import { buildMetadata } from "@/lib/seo";
import { webPageJsonLd, breadcrumbJsonLd, jsonLd } from "@/lib/structured-data";

export const metadata = buildMetadata({
  title: "Qui sommes-nous - Notre mission et notre vision",
  description:
    "Papa pour la vie accompagne les pères en difficulté familiale : apaiser, protéger, former. Découvrez notre mission, notre vision et notre approche structurée pour construire des pères solides et des familles équilibrées.",
  path: "/qui-sommes-nous",
  keywords: [
    "association pères",
    "mission papa pour la vie",
    "accompagnement parental",
    "paternité engagée",
    "à propos papa pour la vie",
  ],
});

export default function QuiSommesNousLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd(
          webPageJsonLd({
            title: "Qui sommes-nous",
            description:
              "Construire des pères solides pour des familles équilibrées. Notre mission : apaiser, protéger, former.",
            path: "/qui-sommes-nous",
          })
        )}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd(
          breadcrumbJsonLd([
            { name: "Accueil", path: "/" },
            { name: "Qui sommes-nous", path: "/qui-sommes-nous" },
          ])
        )}
      />
      {children}
    </>
  );
}
