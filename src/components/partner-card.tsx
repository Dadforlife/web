import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Mail, Phone, Globe } from "lucide-react";

interface PartnerCardProps {
  name: string;
  type: string;
  description: string;
  city: string;
  email?: string;
  phone?: string;
  website?: string;
}

const typeColors: Record<string, string> = {
  avocat: "bg-primary/10 text-primary hover:bg-primary/10",
  mediateur: "bg-chart-4/20 text-chart-4 hover:bg-chart-4/20",
  coach: "bg-warm/20 text-warm hover:bg-warm/20",
  psychologue: "bg-chart-2/20 text-chart-2 hover:bg-chart-2/20",
  autre: "bg-muted text-muted-foreground hover:bg-muted",
};

const typeLabels: Record<string, string> = {
  avocat: "Avocat",
  mediateur: "Médiateur",
  coach: "Coach",
  psychologue: "Psychologue",
  autre: "Autre",
};

export function PartnerCard({
  name,
  type,
  description,
  city,
  email,
  phone,
  website,
}: PartnerCardProps) {
  return (
    <Card className="rounded-2xl hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
          <CardTitle className="text-lg font-bold min-w-0 break-words">{name}</CardTitle>
          <Badge className={`${typeColors[type] || typeColors.autre} shrink-0 w-fit`}>
            {typeLabels[type] || type}
          </Badge>
        </div>
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <MapPin className="h-3.5 w-3.5" />
          {city}
        </div>
      </CardHeader>
      <CardContent className="space-y-4 px-4 pb-4 pt-0 sm:px-6 sm:pb-6 sm:pt-0">
        <p className="text-sm text-muted-foreground leading-relaxed">
          {description}
        </p>
        <div className="flex flex-wrap gap-2">
          {email && (
            <Button variant="outline" size="sm" asChild>
              <a href={`mailto:${email}`}>
                <Mail className="mr-1.5 h-3.5 w-3.5" />
                Email
              </a>
            </Button>
          )}
          {phone && (
            <Button variant="outline" size="sm" asChild>
              <a href={`tel:${phone}`}>
                <Phone className="mr-1.5 h-3.5 w-3.5" />
                Appeler
              </a>
            </Button>
          )}
          {website && (
            <Button variant="outline" size="sm" asChild>
              <a href={website} target="_blank" rel="noopener noreferrer">
                <Globe className="mr-1.5 h-3.5 w-3.5" />
                Site web
              </a>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
