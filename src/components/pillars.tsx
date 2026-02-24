import {
  Scale,
  BookOpen,
  Users,
  HeartHandshake,
  Shield,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const pillars = [
  {
    icon: Scale,
    title: "Cadre Juridique",
    description:
      "Accompagnement avec des avocats spécialisés en droit familial pour protéger vos droits parentaux.",
    accent: "primary",
  },
  {
    icon: HeartHandshake,
    title: "Médiation Familiale",
    description:
      "Faciliter le dialogue avec l'autre parent grâce à des médiateurs professionnels certifiés.",
    accent: "chart-2",
  },
  {
    icon: BookOpen,
    title: "Programme Structuré",
    description:
      "Un parcours de 6 semaines pour retrouver stabilité émotionnelle et compétences parentales.",
    accent: "warm",
  },
  {
    icon: Users,
    title: "Communauté",
    description:
      "Échanges entre pairs, groupes de parole et rencontres en visioconférence régulières.",
    accent: "chart-4",
  },
  {
    icon: Shield,
    title: "Coaching Personnel",
    description:
      "Suivi individuel avec des coachs spécialisés pour construire votre nouvelle vie de père.",
    accent: "chart-3",
  },
];

const accentClasses: Record<string, { border: string; bg: string; icon: string }> = {
  primary: {
    border: "border-t-4 border-t-primary",
    bg: "bg-primary/10",
    icon: "text-primary",
  },
  warm: {
    border: "border-t-4 border-t-warm",
    bg: "bg-warm/10",
    icon: "text-warm",
  },
  "chart-2": {
    border: "border-t-4 border-t-chart-2",
    bg: "bg-chart-2/10",
    icon: "text-chart-2",
  },
  "chart-3": {
    border: "border-t-4 border-t-chart-3",
    bg: "bg-chart-3/10",
    icon: "text-chart-3",
  },
  "chart-4": {
    border: "border-t-4 border-t-chart-4",
    bg: "bg-chart-4/10",
    icon: "text-chart-4",
  },
};

export function Pillars() {
  return (
    <section className="py-16 sm:py-24 md:py-28 bg-muted/40 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-5 mb-16 animate-fade-in-up">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground tracking-tight">
            Nos 5 piliers
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Une approche complète pour accompagner chaque père vers la stabilité
            et une coparentalité sereine.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {pillars.map((pillar, index) => {
            const classes = accentClasses[pillar.accent];
            return (
              <Card
                key={pillar.title}
                className={`bg-card shadow-md ${classes.border} hover:shadow-xl hover:-translate-y-2 transition-all duration-300 animate-fade-in-up rounded-2xl overflow-hidden group`}
                style={{
                  animationDelay: `${index * 80}ms`,
                  animationFillMode: "both",
                }}
              >
                <CardHeader>
                  <div
                    className={`h-14 w-14 rounded-2xl ${classes.bg} flex items-center justify-center mb-3 group-hover:scale-105 transition-transform`}
                  >
                    <pillar.icon className={`h-7 w-7 ${classes.icon}`} />
                  </div>
                  <CardTitle className="text-xl">{pillar.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    {pillar.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
