import { buildMetadata } from "@/lib/seo";
import { webPageJsonLd, faqJsonLd, breadcrumbJsonLd, jsonLd } from "@/lib/structured-data";

export const metadata = buildMetadata({
  title: "Accompagnement Terrain - Ne restez plus seul face au conflit",
  description:
    "Une présence humaine et neutre pour vous soutenir dans chaque étape clé de votre séparation. Tribunaux, passages de bras, points rencontre : ne restez plus seul face au conflit.",
  path: "/accompagnement",
  keywords: [
    "accompagnement terrain",
    "soutien pères séparation",
    "audience JAF",
    "passage de bras",
    "tribunal père",
    "accompagnement bénévole",
  ],
});

const faqData = [
  {
    question: "Qu'est-ce que l'accompagnement terrain ?",
    answer:
      "L'accompagnement terrain est un service de présence physique neutre pour soutenir les pères lors de moments clés de leur séparation : audiences au tribunal, passages de bras, commissariats, expertises sociales.",
  },
  {
    question: "Qui sont les accompagnants ?",
    answer:
      "Les accompagnants sont des bénévoles formés par l'association Papa pour la vie. Ils sont neutres, bienveillants et n'interviennent pas dans le conflit.",
  },
  {
    question: "Comment demander un accompagnement ?",
    answer:
      "Vous pouvez demander un accompagnement en remplissant notre formulaire de diagnostic en ligne. Nous analysons votre situation et vous mettons en relation avec un bénévole disponible.",
  },
];

export default function AccompagnementLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd(
          webPageJsonLd({
            title: "Accompagnement Terrain",
            description:
              "Une présence humaine et neutre pour vous soutenir dans chaque étape clé de votre séparation.",
            path: "/accompagnement",
          })
        )}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd(faqJsonLd(faqData))}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd(
          breadcrumbJsonLd([
            { name: "Accueil", path: "/" },
            { name: "Accompagnement Terrain", path: "/accompagnement" },
          ])
        )}
      />
      {children}
    </>
  );
}
