import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Accompagnement Terrain | Papa pour la vie",
  description:
    "Une présence humaine et neutre pour vous soutenir dans chaque étape clé de votre séparation. Tribunaux, passages de bras, points rencontre : ne restez plus seul face au conflit.",
  openGraph: {
    title: "Accompagnement Terrain : Ne restez plus seul face au conflit | Papa pour la vie",
    description:
      "Une présence humaine et neutre pour vous soutenir dans chaque étape clé de votre séparation.",
  },
};

export default function AccompagnementLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
