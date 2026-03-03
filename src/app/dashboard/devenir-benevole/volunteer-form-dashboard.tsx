"use client";

import { useActionState } from "react";
import { Loader2, CheckCircle2, AlertCircle, ArrowRight } from "lucide-react";
import { submitAuthenticatedVolunteerApplication, type VolunteerFormState } from "./actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const AVAILABILITY_OPTIONS = [
  { value: "", label: "Choisir une disponibilité" },
  { value: "1-2h", label: "1 à 2h / semaine" },
  { value: "3-4h", label: "3 à 4h / semaine" },
  { value: "5h+", label: "5h ou plus / semaine" },
  { value: "variable", label: "Variable selon les besoins" },
];

interface VolunteerFormDashboardProps {
  user: {
    fullName: string;
    email: string;
    phone: string;
  };
}

export function VolunteerFormDashboard({ user }: VolunteerFormDashboardProps) {
  const [state, action, isPending] = useActionState<VolunteerFormState, FormData>(
    submitAuthenticatedVolunteerApplication,
    null
  );

  if (state?.success) {
    return (
      <Card className="rounded-2xl">
        <CardContent className="py-12 text-center space-y-4">
          <div className="h-16 w-16 rounded-full bg-chart-4/10 flex items-center justify-center mx-auto">
            <CheckCircle2 className="h-8 w-8 text-chart-4" />
          </div>
          <h2 className="text-xl font-bold text-foreground">Candidature envoyée</h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            {state.message}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="rounded-2xl">
      <CardHeader className="space-y-1">
        <CardTitle className="text-xl font-bold">Ma candidature</CardTitle>
        <p className="text-sm text-muted-foreground">
          Vos informations personnelles sont pré-remplies depuis votre compte.
        </p>
      </CardHeader>
      <CardContent>
        <form action={action} className="space-y-6">
          {/* Champs pré-remplis (lecture seule) */}
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Nom complet</Label>
              <Input value={user.fullName} disabled className="bg-muted cursor-not-allowed" />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input value={user.email} disabled className="bg-muted cursor-not-allowed" />
            </div>
          </div>

          {/* Champs à remplir */}
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="city">Ville *</Label>
              <Input
                id="city"
                name="city"
                placeholder="Ex: Lyon"
                required
                aria-invalid={Boolean(state?.errors?.city)}
              />
              {state?.errors?.city && (
                <p className="text-xs text-destructive">{state.errors.city}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="availability">Disponibilité estimée *</Label>
              <select
                id="availability"
                name="availability"
                required
                aria-invalid={Boolean(state?.errors?.availability)}
                className="border-input focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 aria-invalid:border-destructive flex h-10 w-full rounded-md border bg-transparent px-3 py-2 text-sm outline-none transition-[color,box-shadow] focus-visible:ring-[3px]"
              >
                {AVAILABILITY_OPTIONS.map((opt) => (
                  <option key={opt.value || "default"} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              {state?.errors?.availability && (
                <p className="text-xs text-destructive">{state.errors.availability}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="motivation">Pourquoi souhaitez-vous devenir bénévole ? *</Label>
            <Textarea
              id="motivation"
              name="motivation"
              rows={5}
              required
              placeholder="Expliquez votre motivation, ce que vous souhaitez apporter et ce qui vous touche dans la mission."
              aria-invalid={Boolean(state?.errors?.motivation)}
            />
            <p className="text-xs text-muted-foreground">Minimum 80 caractères.</p>
            {state?.errors?.motivation && (
              <p className="text-xs text-destructive">{state.errors.motivation}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="experience">
              Avez-vous une expérience utile (écoute, médiation, social, juridique) ?
            </Label>
            <Textarea
              id="experience"
              name="experience"
              rows={3}
              placeholder="Optionnel : décrivez vos expériences ou compétences pertinentes."
            />
          </div>

          {state && !state.success && (
            <div className="flex items-start gap-2 rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <p>{state.message}</p>
            </div>
          )}

          <Button
            type="submit"
            size="lg"
            disabled={isPending}
            className="h-11 w-full rounded-xl text-base font-semibold sm:w-auto"
          >
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Envoi en cours...
              </>
            ) : (
              <>
                Envoyer ma candidature
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
