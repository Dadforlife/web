"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Briefcase,
  Loader2,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { submitProfessionalApplication } from "./actions";

const SPECIALTIES = [
  { value: "avocat", label: "Avocat" },
  { value: "mediateur", label: "M\u00e9diateur" },
  { value: "coach", label: "Coach" },
  { value: "psychologue", label: "Psychologue" },
];

export function ProfessionalApplicationForm() {
  const [state, formAction, isPending] = useActionState(
    submitProfessionalApplication,
    undefined,
  );

  if (state?.success) {
    return (
      <Card className="rounded-2xl border-chart-4/30 bg-chart-4/5">
        <CardContent className="pt-6 flex items-start gap-4">
          <CheckCircle2 className="h-6 w-6 text-chart-4 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-chart-4">Candidature envoy&eacute;e !</p>
            <p className="text-sm text-muted-foreground mt-1">
              Votre candidature a &eacute;t&eacute; soumise avec succ&egrave;s. Notre &eacute;quipe
              l&apos;examinera dans les plus brefs d&eacute;lais. Vous recevrez une notification
              &agrave; chaque &eacute;tape du processus.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="rounded-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Briefcase className="h-5 w-5 text-primary" />
          Formulaire de candidature
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-5">
          {state?.error && (
            <div className="flex items-center gap-2 p-4 rounded-xl bg-destructive/10 text-destructive text-sm font-medium">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {state.error}
            </div>
          )}

          <div className="space-y-2">
            <label htmlFor="professionalRole" className="text-sm font-semibold">
              Sp&eacute;cialit&eacute;
            </label>
            <select
              id="professionalRole"
              name="professionalRole"
              required
              className="w-full px-4 py-3 rounded-xl border-2 border-input bg-background text-sm font-medium focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary transition-colors"
            >
              <option value="">Choisir une sp&eacute;cialit&eacute;</option>
              {SPECIALTIES.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label htmlFor="registrationNumber" className="text-sm font-semibold">
              N&deg; d&apos;inscription professionnelle{" "}
              <span className="text-muted-foreground font-normal">(optionnel)</span>
            </label>
            <input
              id="registrationNumber"
              name="registrationNumber"
              type="text"
              placeholder="Ex: CNBF-12345"
              className="w-full px-4 py-3 rounded-xl border-2 border-input bg-background text-sm font-medium focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary transition-colors"
            />
            <p className="text-xs text-muted-foreground">
              Num&eacute;ro d&apos;inscription au barreau, CNMA, etc.
            </p>
          </div>

          <Button
            type="submit"
            className="w-full rounded-xl h-11 font-semibold"
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Envoi en cours...
              </>
            ) : (
              "Soumettre ma candidature"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
