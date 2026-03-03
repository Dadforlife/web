"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Heart,
  Mail,
  BookOpen,
  ArrowRight,
  Info,
  Clock,
  CheckCircle,
  MapPin,
  User,
} from "lucide-react";
import Link from "next/link";

interface RequestData {
  id: string;
  fatherFirstName: string;
  fatherCity: string;
  status: string;
  createdAt: string;
}

interface Props {
  fullName: string;
  request: RequestData;
}

const STATUS_LABELS: Record<string, string> = {
  pending: "En attente",
  reviewing: "En cours d\u2019analyse",
  contacted: "P\u00e8re contact\u00e9",
  active: "Accompagnement actif",
  completed: "Termin\u00e9",
  rejected: "Refus\u00e9e",
};

function deriveSteps(status: string) {
  const order = ["pending", "reviewing", "contacted", "active"];
  const currentIdx = order.indexOf(status);

  return [
    {
      title: "Demande enregistr\u00e9e",
      description: "Votre demande d\u2019accompagnement a bien \u00e9t\u00e9 prise en compte.",
      status: currentIdx >= 0 ? "completed" : "pending",
    },
    {
      title: "Analyse par l\u2019\u00e9quipe",
      description: "Notre \u00e9quipe examine votre demande et identifie les besoins.",
      status: currentIdx > 0 ? "completed" : currentIdx === 0 ? "in_progress" : "pending",
    },
    {
      title: "Prise de contact",
      description: "Un b\u00e9n\u00e9vole ou professionnel prendra contact avec le p\u00e8re.",
      status: currentIdx > 2 ? "completed" : currentIdx === 2 ? "in_progress" : currentIdx > 1 ? "in_progress" : "pending",
    },
    {
      title: "Accompagnement actif",
      description: "Le programme d\u2019accompagnement d\u00e9marre.",
      status: status === "active" || status === "completed" ? "completed" : currentIdx === 2 ? "pending" : "pending",
    },
  ];
}

function StepIcon({ status }: { status: string }) {
  if (status === "completed") return <CheckCircle className="h-5 w-5 text-chart-4" />;
  if (status === "in_progress") return <Clock className="h-5 w-5 text-warm" />;
  return <div className="h-5 w-5 rounded-full border-2 border-muted-foreground/30" />;
}

export function MamanDashboardContent({ fullName, request }: Props) {
  const firstName = fullName?.split(" ")[0] || "Utilisatrice";
  const steps = deriveSteps(request.status);
  const statusLabel = STATUS_LABELS[request.status] || request.status;
  const createdDate = new Date(request.createdAt).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="space-y-8 max-w-5xl">
      <div className="space-y-2 animate-fade-in-up">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">
          Bonjour, {firstName}
        </h1>
        <p className="text-muted-foreground">
          Suivi de votre demande d&apos;accompagnement
        </p>
      </div>

      <div className="rounded-2xl bg-primary/5 border border-primary/10 p-5 flex items-start gap-4 animate-fade-in-up" style={{ animationDelay: "0.05s", animationFillMode: "both" }}>
        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
          <Info className="h-5 w-5 text-primary" />
        </div>
        <div>
          <p className="text-sm font-medium text-foreground leading-relaxed">
            Vous avez demand&eacute; un accompagnement pour le p&egrave;re de votre enfant.
            Notre &eacute;quipe travaille pour lui proposer un parcours adapt&eacute;.
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            Vous serez inform&eacute;e par notification &agrave; chaque &eacute;tape.
          </p>
        </div>
      </div>

      {/* Request summary card */}
      <Card className="rounded-2xl animate-fade-in-up" style={{ animationDelay: "0.08s", animationFillMode: "both" }}>
        <CardContent className="pt-6">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2 text-sm">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">{request.fatherFirstName}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>{request.fatherCity}</span>
            </div>
            <Badge variant="outline" className="text-xs">
              {statusLabel}
            </Badge>
            <span className="text-xs text-muted-foreground ml-auto">
              D&eacute;pos&eacute;e le {createdDate}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Steps */}
      <Card className="rounded-2xl animate-fade-in-up" style={{ animationDelay: "0.1s", animationFillMode: "both" }}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-primary shrink-0" />
            &Eacute;tat de la demande
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-1">
          {steps.map((step, i) => (
            <div
              key={step.title}
              className="flex items-start gap-4 p-3 rounded-lg"
            >
              <div className="flex flex-col items-center">
                <StepIcon status={step.status} />
                {i < steps.length - 1 && (
                  <div className="w-px h-8 bg-border mt-1" />
                )}
              </div>
              <div className="flex-1 min-w-0 -mt-0.5">
                <p className="text-sm font-semibold">{step.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Card className="rounded-2xl hover:shadow-lg transition-shadow animate-fade-in-up" style={{ animationDelay: "0.2s", animationFillMode: "both" }}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Messagerie
            </CardTitle>
            <Mail className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              &Eacute;changez avec l&apos;&eacute;quipe Papa pour la vie.
            </p>
            <Button variant="outline" size="sm" asChild className="rounded-xl">
              <Link href="/dashboard/messagerie">
                Ouvrir la messagerie
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="rounded-2xl hover:shadow-lg transition-shadow animate-fade-in-up" style={{ animationDelay: "0.3s", animationFillMode: "both" }}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Ressources
            </CardTitle>
            <BookOpen className="h-4 w-4 text-warm" />
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              D&eacute;couvrez les ressources sur la coparentalit&eacute;.
            </p>
            <Button variant="outline" size="sm" asChild className="rounded-xl">
              <Link href="/accompagnement">
                Voir les ressources
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
