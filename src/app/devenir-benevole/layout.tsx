import { buildMetadata } from "@/lib/seo";
import { webPageJsonLd, faqJsonLd, breadcrumbJsonLd, jsonLd } from "@/lib/structured-data";

export const metadata = buildMetadata({
  title: "Devenir Bénévole - Rejoignez notre équipe",
  description:
    "Rejoignez Papa pour la vie : mettez votre empathie et votre calme au service du lien parent-enfant. Devenez accompagnateur de terrain, écoutant ou apportez votre expertise. Ensemble, luttons contre l'isolement et l'injustice.",
  path: "/devenir-benevole",
  keywords: [
    "devenir bénévole",
    "bénévolat association",
    "accompagnateur terrain",
    "volontariat parental",
    "bénévole Nantes",
    "soutien pères bénévole",
  ],
});

const faqData = [
  {
    question: "Quelles sont les missions d'un bénévole ?",
    answer:
      "Les bénévoles peuvent assurer des accompagnements terrain (tribunaux, passages de bras), des écoutes téléphoniques de soutien, ou apporter leur expertise métier (juridique, psychologique, médiation).",
  },
  {
    question: "Faut-il des compétences particulières ?",
    answer:
      "Pas de diplôme requis. Nous recherchons des personnes empathiques, calmes, disponibles et motivées. Une formation interne est assurée par l'association.",
  },
  {
    question: "Combien de temps faut-il consacrer au bénévolat ?",
    answer:
      "Le volume est flexible et s'adapte à votre disponibilité. Vous choisissez vos créneaux et le nombre de pères que vous souhaitez accompagner.",
  },
];

export default function DevenirBenevoleLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd(
          webPageJsonLd({
            title: "Devenir Bénévole",
            description:
              "Devenez un pilier pour les parents isolés. Missions terrain, écoute, expertise : rejoignez une équipe soudée.",
            path: "/devenir-benevole",
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
            { name: "Devenir Bénévole", path: "/devenir-benevole" },
          ])
        )}
      />
      {children}
    </>
  );
}
