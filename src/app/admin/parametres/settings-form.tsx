"use client";

import { useActionState } from "react";
import { updateSettings } from "./actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Palette, Home, Mail, Server, Loader2, CheckCircle, AlertCircle } from "lucide-react";

interface SettingsFormProps {
  initialValues: Record<string, string>;
}

const initialState = { success: false, message: "" };

export function SettingsForm({ initialValues }: SettingsFormProps) {
  const [state, formAction, pending] = useActionState(updateSettings, initialState);

  return (
    <form action={formAction} className="space-y-6">
      {state.message && (
        <div
          className={`flex items-center gap-2 rounded-lg border px-4 py-3 text-sm ${
            state.success
              ? "border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-950 dark:text-green-300"
              : "border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300"
          }`}
        >
          {state.success ? (
            <CheckCircle className="h-4 w-4 shrink-0" />
          ) : (
            <AlertCircle className="h-4 w-4 shrink-0" />
          )}
          {state.message}
        </div>
      )}

      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Palette className="h-4 w-4 text-primary" />
            Apparence
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="site_logo_url">URL du logo</Label>
            <Input
              id="site_logo_url"
              name="site_logo_url"
              type="url"
              placeholder="https://exemple.com/logo.svg"
              defaultValue={initialValues.site_logo_url ?? ""}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="site_primary_color">Couleur principale</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="site_primary_color"
                  name="site_primary_color"
                  type="color"
                  className="h-9 w-12 p-1 cursor-pointer"
                  defaultValue={initialValues.site_primary_color ?? "#1e40af"}
                />
                <Input
                  type="text"
                  aria-label="Valeur hexadécimale couleur principale"
                  defaultValue={initialValues.site_primary_color ?? "#1e40af"}
                  className="flex-1"
                  readOnly
                  tabIndex={-1}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="site_accent_color">Couleur d&apos;accent</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="site_accent_color"
                  name="site_accent_color"
                  type="color"
                  className="h-9 w-12 p-1 cursor-pointer"
                  defaultValue={initialValues.site_accent_color ?? "#f59e0b"}
                />
                <Input
                  type="text"
                  aria-label="Valeur hexadécimale couleur d'accent"
                  defaultValue={initialValues.site_accent_color ?? "#f59e0b"}
                  className="flex-1"
                  readOnly
                  tabIndex={-1}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Home className="h-4 w-4 text-primary" />
            Page d&apos;accueil
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="homepage_title">Titre</Label>
            <Input
              id="homepage_title"
              name="homepage_title"
              placeholder="Papa pour la vie"
              defaultValue={initialValues.homepage_title ?? ""}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="homepage_subtitle">Sous-titre</Label>
            <Input
              id="homepage_subtitle"
              name="homepage_subtitle"
              placeholder="Accompagnement pour les papas"
              defaultValue={initialValues.homepage_subtitle ?? ""}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Mail className="h-4 w-4 text-primary" />
            Contact
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="support_email">Email de support</Label>
            <Input
              id="support_email"
              name="support_email"
              type="email"
              placeholder="support@papapourlavie.fr"
              defaultValue={initialValues.support_email ?? ""}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Server className="h-4 w-4 text-primary" />
            Configuration SMTP
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="smtp_host">Hôte SMTP</Label>
              <Input
                id="smtp_host"
                name="smtp_host"
                placeholder="smtp.example.com"
                defaultValue={initialValues.smtp_host ?? ""}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="smtp_port">Port</Label>
              <Input
                id="smtp_port"
                name="smtp_port"
                type="number"
                placeholder="587"
                defaultValue={initialValues.smtp_port ?? ""}
              />
            </div>
          </div>
          <Separator />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="smtp_user">Utilisateur</Label>
              <Input
                id="smtp_user"
                name="smtp_user"
                placeholder="user@example.com"
                defaultValue={initialValues.smtp_user ?? ""}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="smtp_password">Mot de passe</Label>
              <Input
                id="smtp_password"
                name="smtp_password"
                type="password"
                placeholder="••••••••"
                defaultValue={initialValues.smtp_password ?? ""}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button type="submit" disabled={pending} size="lg">
          {pending && <Loader2 className="h-4 w-4 animate-spin" />}
          {pending ? "Enregistrement…" : "Enregistrer les paramètres"}
        </Button>
      </div>
    </form>
  );
}
