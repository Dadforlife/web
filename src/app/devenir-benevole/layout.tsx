import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Devenir Bénévole | Papa pour la vie",
  description:
    "Rejoignez Papa pour la vie : mettez votre empathie et votre calme au service du lien parent-enfant. Devenez accompagnateur de terrain, écoutant ou apportez votre expertise. Ensemble, luttons contre l'isolement et l'injustice.",
  openGraph: {
    title: "Devenir Bénévole | Papa pour la vie",
    description:
      "Devenez un pilier pour les parents isolés. Missions terrain, écoute, expertise : rejoignez une équipe soudée et faites la différence.",
  },
};

export default function DevenirBenevoleLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
