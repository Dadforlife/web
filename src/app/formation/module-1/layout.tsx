import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Module 1 : Stabilisation Émotionnelle",
  description:
    "Écoutez les 4 épisodes du module de stabilisation émotionnelle : sortir du mode survie, la règle des 24h, construire son sanctuaire, maîtriser son narratif.",
  path: "/formation/module-1",
  noIndex: true,
});

export default function Module1Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
