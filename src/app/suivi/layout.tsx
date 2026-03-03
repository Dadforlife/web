import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Notre suivi - Parcours en 6 étapes | Papa pour la vie",
  description:
    "Un parcours structuré en 6 étapes pour retrouver stabilité et sérénité dans votre rôle de père. Suivi progressif sur 3 à 6 mois pour apaiser les tensions et protéger votre lien avec votre enfant.",
  openGraph: {
    title: "Notre suivi - Papa pour la vie",
    description:
      "Notre suivi s'effectue en 6 étapes : stabilisation émotionnelle, cadre parental, communication, finances, leadership paternel, plan d'action. Faites votre diagnostic.",
  },
};

export default function SuiviLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
