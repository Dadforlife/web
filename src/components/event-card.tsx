import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Users, Video } from "lucide-react";

interface EventCardProps {
  title: string;
  description: string;
  date: string;
  time: string;
  duration: string;
  maxParticipants?: number;
  currentParticipants?: number;
  type: "groupe_parole" | "visio_juridique" | "atelier" | "conference";
}

const typeConfig: Record<string, { label: string; color: string }> = {
  groupe_parole: {
    label: "Groupe de parole",
    color: "bg-primary/10 text-primary hover:bg-primary/10",
  },
  visio_juridique: {
    label: "Visio juridique",
    color: "bg-chart-2/20 text-chart-2 hover:bg-chart-2/20",
  },
  atelier: {
    label: "Atelier",
    color: "bg-chart-4/20 text-chart-4 hover:bg-chart-4/20",
  },
  conference: {
    label: "Conférence",
    color: "bg-warm/20 text-warm hover:bg-warm/20",
  },
};

export function EventCard({
  title,
  description,
  date,
  time,
  duration,
  maxParticipants,
  currentParticipants,
  type,
}: EventCardProps) {
  const config = typeConfig[type] || typeConfig.atelier;

  return (
    <Card className="rounded-2xl hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      <CardContent className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Date */}
          <div className="flex sm:flex-col items-center sm:items-center gap-2 sm:gap-0 sm:min-w-[80px] text-center">
            <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Calendar className="h-6 w-6 text-primary" />
            </div>
            <span className="text-sm font-medium text-foreground sm:mt-2">
              {date}
            </span>
          </div>

          {/* Contenu */}
          <div className="flex-1 min-w-0 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
              <h3 className="font-semibold text-foreground min-w-0">{title}</h3>
              <Badge className={`${config.color} shrink-0 w-fit`}>{config.label}</Badge>
            </div>
            <p className="text-sm text-muted-foreground">{description}</p>
            <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {time} ({duration})
              </span>
              <span className="flex items-center gap-1">
                <Video className="h-3.5 w-3.5" />
                Visioconférence
              </span>
              {maxParticipants && (
                <span className="flex items-center gap-1">
                  <Users className="h-3.5 w-3.5" />
                  {currentParticipants || 0}/{maxParticipants} inscrits
                </span>
              )}
            </div>
            <Button size="sm">S&apos;inscrire</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
