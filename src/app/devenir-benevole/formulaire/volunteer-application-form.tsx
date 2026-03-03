"use client";

import { useActionState, useEffect, useRef } from "react";
import { Loader2, CheckCircle2, AlertCircle, ArrowRight } from "lucide-react";
import { submitVolunteerApplication, type VolunteerApplicationState } from "./actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const AVAILABILITY_OPTIONS = [
  { value: "", label: "Choisir une disponibilite" },
  { value: "1-2h", label: "1 a 2h / semaine" },
  { value: "3-4h", label: "3 a 4h / semaine" },
  { value: "5h+", label: "5h ou plus / semaine" },
  { value: "variable", label: "Variable selon les besoins" },
];

const initialState: VolunteerApplicationState = null;

export function VolunteerApplicationForm() {
  const [state, action, isPending] = useActionState(
    submitVolunteerApplication,
    initialState
  );
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.success) {
      formRef.current?.reset();
    }
  }, [state]);

  return (
    <Card className="rounded-3xl border-slate-200 bg-white/95 shadow-xl shadow-slate-200/60">
      <CardHeader className="space-y-3">
        <CardTitle className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
          Candidature benevole
        </CardTitle>
        <p className="text-sm leading-relaxed text-slate-600">
          Remplissez ce formulaire en 2 minutes. Nous vous recontactons sous 72h
          ouvrables pour un premier echange.
        </p>
      </CardHeader>
      <CardContent>
        <form ref={formRef} action={action} className="space-y-6">
          <input
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            className="hidden"
            aria-hidden
          />

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="fullName">Nom complet *</Label>
              <Input
                id="fullName"
                name="fullName"
                placeholder="Ex: Julien Martin"
                required
                aria-invalid={Boolean(state?.errors?.fullName)}
              />
              {state?.errors?.fullName && (
                <p className="text-xs text-destructive">{state.errors.fullName}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="vous@email.fr"
                required
                aria-invalid={Boolean(state?.errors?.email)}
              />
              {state?.errors?.email && (
                <p className="text-xs text-destructive">{state.errors.email}</p>
              )}
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="phone">Telephone</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                placeholder="06 12 34 56 78"
                aria-invalid={Boolean(state?.errors?.phone)}
              />
              {state?.errors?.phone && (
                <p className="text-xs text-destructive">{state.errors.phone}</p>
              )}
            </div>
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
          </div>

          <div className="space-y-2">
            <Label htmlFor="availability">Disponibilite estimee *</Label>
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

          <div className="space-y-2">
            <Label htmlFor="motivation">Pourquoi souhaitez-vous nous rejoindre ? *</Label>
            <Textarea
              id="motivation"
              name="motivation"
              rows={6}
              required
              placeholder="Expliquez votre motivation, ce que vous souhaitez apporter et ce qui vous touche dans la mission."
              aria-invalid={Boolean(state?.errors?.motivation)}
            />
            <p className="text-xs text-slate-500">Minimum 80 caracteres.</p>
            {state?.errors?.motivation && (
              <p className="text-xs text-destructive">{state.errors.motivation}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="experience">
              Avez-vous une experience utile (ecoute, mediation, social, juridique) ?
            </Label>
            <Textarea
              id="experience"
              name="experience"
              rows={4}
              placeholder="Optionnel: decrivez vos experiences ou competences pertinentes."
              aria-invalid={Boolean(state?.errors?.experience)}
            />
            {state?.errors?.experience && (
              <p className="text-xs text-destructive">{state.errors.experience}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
              <input
                type="checkbox"
                name="consent"
                className="mt-0.5 h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary"
                aria-invalid={Boolean(state?.errors?.consent)}
              />
              <span className="text-sm leading-relaxed text-slate-700">
                J'accepte d'etre contacte(e) par l'equipe Papa pour la vie concernant
                cette candidature. *
              </span>
            </label>
            {state?.errors?.consent && (
              <p className="text-xs text-destructive">{state.errors.consent}</p>
            )}
          </div>

          {state && (
            <div
              className={`flex items-start gap-2 rounded-xl border px-4 py-3 text-sm ${
                state.success
                  ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                  : "border-destructive/40 bg-destructive/10 text-destructive"
              }`}
            >
              {state.success ? (
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
              ) : (
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              )}
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
