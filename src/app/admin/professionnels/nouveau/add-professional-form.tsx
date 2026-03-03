"use client";

import { useActionState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AlertCircle, Loader2 } from "lucide-react";
import { createProfessional } from "./actions";

const SPECIALTIES = [
  { value: "avocat", label: "Avocat" },
  { value: "mediateur", label: "Médiateur" },
  { value: "coach", label: "Coach" },
  { value: "psychologue", label: "Psychologue" },
];

export function AddProfessionalForm() {
  const [state, formAction, isPending] = useActionState(
    createProfessional,
    null,
  );

  return (
    <Card className="rounded-2xl">
      <CardContent className="p-6">
        <form action={formAction} className="space-y-6">
          {state?.error && (
            <div className="flex items-center gap-2 p-4 rounded-xl bg-destructive/10 text-destructive text-sm font-medium">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {state.error}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="fullName">Nom complet *</Label>
              <Input
                id="fullName"
                name="fullName"
                placeholder="Jean Dupont"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="email@exemple.fr"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Téléphone</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                placeholder="06 12 34 56 78"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe *</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Min. 8 caractères"
                minLength={8}
                required
              />
              <p className="text-xs text-muted-foreground">
                Mot de passe temporaire à communiquer au professionnel.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="professionalRole">Spécialité *</Label>
              <Select name="professionalRole" required>
                <SelectTrigger id="professionalRole" className="w-full">
                  <SelectValue placeholder="Choisir une spécialité" />
                </SelectTrigger>
                <SelectContent>
                  {SPECIALTIES.map((s) => (
                    <SelectItem key={s.value} value={s.value}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="professionalStatus">Statut initial</Label>
              <Select name="professionalStatus" defaultValue="valide">
                <SelectTrigger id="professionalStatus" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="valide">Validé</SelectItem>
                  <SelectItem value="en_attente">En attente</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="registrationNumber">
              N° d&apos;inscription professionnelle{" "}
              <span className="text-muted-foreground font-normal">
                (optionnel)
              </span>
            </Label>
            <Input
              id="registrationNumber"
              name="registrationNumber"
              placeholder="Ex : CNBF-12345"
            />
            <p className="text-xs text-muted-foreground">
              Numéro d&apos;inscription au barreau, CNMA, etc.
            </p>
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Création en cours…
                </>
              ) : (
                "Créer le professionnel"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
