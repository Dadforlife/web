import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Qui sommes-nous | Papa pour la vie",
  description:
    "Papa pour la vie accompagne les pères en difficulté familiale : apaiser, protéger, former. Découvrez notre mission, notre vision et notre approche structurée pour construire des pères solides et des familles équilibrées.",
  openGraph: {
    title: "Qui sommes-nous | Papa pour la vie",
    description:
      "Construire des pères solides pour des familles équilibrées. Notre mission : apaiser, protéger, former. Accompagnement responsable et orienté solutions.",
  },
};

export default function QuiSommesNousLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
