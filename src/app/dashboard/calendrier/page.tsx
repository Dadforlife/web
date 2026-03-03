import { EventCard } from "@/components/event-card";
import { Calendar } from "lucide-react";

const events: {
  title: string;
  description: string;
  date: string;
  time: string;
  duration: string;
  maxParticipants: number;
  currentParticipants: number;
  type: "groupe_parole" | "visio_juridique" | "atelier" | "conference";
}[] = [];

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
      {events.length > 0 ? (
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
      ) : (
        <div className="text-center py-12 rounded-2xl border border-border/50 bg-card/50">
          <Calendar className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
          <p className="text-muted-foreground">
            Aucun événement prévu pour le moment.
          </p>
          <p className="text-sm text-muted-foreground/70 mt-1">
            Les prochaines rencontres seront affichées ici.
          </p>
        </div>
      )}
    </div>
  );
}
