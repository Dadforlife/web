import { EventCard } from "@/components/event-card";
import { Calendar } from "lucide-react";

const events = [
  {
    title: "Groupe de parole - Gestion du stress",
    description:
      "Échangez avec d'autres pères sur les techniques de gestion du stress liées à la séparation.",
    date: "Mar. 25 mars",
    time: "20h00",
    duration: "1h30",
    maxParticipants: 12,
    currentParticipants: 8,
    type: "groupe_parole" as const,
  },
  {
    title: "Visio juridique - Questions/Réponses",
    description:
      "Session de questions-réponses avec Me Sophie Durand, avocate spécialisée en droit familial.",
    date: "Jeu. 27 mars",
    time: "19h00",
    duration: "1h",
    maxParticipants: 20,
    currentParticipants: 14,
    type: "visio_juridique" as const,
  },
  {
    title: "Atelier - Communication bienveillante",
    description:
      "Apprenez les techniques de communication non-violente pour des échanges constructifs avec l'autre parent.",
    date: "Sam. 29 mars",
    time: "10h00",
    duration: "2h",
    maxParticipants: 15,
    currentParticipants: 6,
    type: "atelier" as const,
  },
  {
    title: "Conférence - La coparentalité positive",
    description:
      "Conférence du Dr. Philippe Martin sur les fondamentaux d'une coparentalité centrée sur l'enfant.",
    date: "Mar. 1 avril",
    time: "20h30",
    duration: "1h30",
    maxParticipants: 50,
    currentParticipants: 23,
    type: "conference" as const,
  },
  {
    title: "Groupe de parole - Mon rôle de père",
    description:
      "Un espace bienveillant pour discuter de votre identité de père après la séparation.",
    date: "Jeu. 3 avril",
    time: "20h00",
    duration: "1h30",
    maxParticipants: 12,
    currentParticipants: 4,
    type: "groupe_parole" as const,
  },
];

export default function CalendrierPage() {
  return (
    <div className="space-y-8 max-w-4xl">
      {/* En-tête */}
      <div className="space-y-4 animate-fade-in-up">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
            <Calendar className="h-6 w-6 text-primary" />
          </div>
          <div className="min-w-0">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">
              Calendrier
            </h1>
            <p className="text-muted-foreground mt-1">
              Retrouvez toutes nos prochaines rencontres en visioconférence :
              groupes de parole, ateliers, visio juridiques et conférences.
            </p>
          </div>
        </div>
      </div>

      {/* Liste des événements */}
      <div className="space-y-4">
        {events.map((event, i) => (
          <div
            key={event.title + event.date}
            className="animate-fade-in-up"
            style={{ animationDelay: `${0.1 + i * 0.06}s`, animationFillMode: "both" }}
          >
            <EventCard {...event} />
          </div>
        ))}
      </div>
    </div>
  );
}
