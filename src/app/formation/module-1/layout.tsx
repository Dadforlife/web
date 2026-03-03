import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Module 1 : Stabilisation Émotionnelle | Papa pour la vie",
  description:
    "Écoutez les 4 épisodes du module de stabilisation émotionnelle : sortir du mode survie, la règle des 24h, construire son sanctuaire, maîtriser son narratif.",
};

export default function Module1Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
