import { buildMetadata } from "@/lib/seo";
import { webPageJsonLd, faqJsonLd, breadcrumbJsonLd, jsonLd } from "@/lib/structured-data";

export const metadata = buildMetadata({
  title: "Notre suivi - Parcours en 6 étapes pour les pères",
  description:
    "Un parcours structuré en 6 étapes pour retrouver stabilité et sérénité dans votre rôle de père. Suivi progressif sur 3 à 6 mois pour apaiser les tensions et protéger votre lien avec votre enfant.",
  path: "/suivi",
  keywords: [
    "programme accompagnement pères",
    "parcours parental",
    "stabilisation émotionnelle",
    "cadre parental",
    "suivi père séparation",
    "formation paternel",
  ],
});

const faqData = [
  {
    question: "Combien de temps dure le programme de suivi ?",
    answer:
      "Le programme de suivi s'étend sur 3 à 6 mois, selon votre situation et votre rythme. Il est structuré en 6 étapes progressives.",
  },
  {
    question: "Quelles sont les 6 étapes du parcours ?",
    answer:
      "Les 6 étapes sont : stabilisation émotionnelle, mise en place d'un cadre parental, communication apaisée, gestion financière, leadership paternel, et plan d'action à long terme.",
  },
  {
    question: "Le programme est-il gratuit ?",
    answer:
      "Papa pour la vie est une association loi 1901. Le diagnostic initial est gratuit. Contactez-nous pour connaître les modalités d'accompagnement.",
  },
];

export default function SuiviLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd(
          webPageJsonLd({
            title: "Notre suivi - Parcours en 6 étapes",
            description:
              "Stabilisation émotionnelle, cadre parental, communication, finances, leadership paternel, plan d'action.",
            path: "/suivi",
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
            { name: "Notre suivi", path: "/suivi" },
          ])
        )}
      />
      {children}
    </>
  );
}
