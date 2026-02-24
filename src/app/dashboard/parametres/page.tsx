"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar";
import {
  Settings,
  User,
  Mail,
  Phone,
  CalendarDays,
  Shield,
  Bell,
  Save,
  Check,
} from "lucide-react";
import { useDashboardUser } from "@/components/dashboard-provider";

function getInitials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function formatDate(dateStr: string) {
  if (!dateStr) return "—";
  try {
    return new Intl.DateTimeFormat("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date(dateStr));
  } catch {
    return "—";
  }
}

export default function ParametresPage() {
  const user = useDashboardUser();
  const [fullName, setFullName] = useState(user.fullName || "");
  const [phone, setPhone] = useState(user.phone || "");
  const [notifications, setNotifications] = useState(true);
  const [saved, setSaved] = useState(false);

  function handleSave() {
    // TODO: Implémenter la mise à jour via Supabase
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  return (
    <div className="space-y-8 max-w-3xl">
      {/* En-tête */}
      <div className="space-y-4 animate-fade-in-up">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
            <Settings className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">
              Paramètres
            </h1>
            <p className="text-muted-foreground mt-1">
              Gérez votre profil et vos préférences
            </p>
          </div>
        </div>
      </div>

      {/* Profil */}
      <Card className="rounded-2xl animate-fade-in-up" style={{ animationDelay: "0.1s", animationFillMode: "both" }}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Mon profil
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Avatar + infos rapides */}
          <div className="flex items-center gap-5">
            <Avatar className="h-16 w-16 border-2 border-primary/20">
              <AvatarFallback className="bg-primary/10 text-primary text-xl font-bold">
                {getInitials(user.fullName || user.email)}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-lg font-bold text-foreground">
                {user.fullName || "Utilisateur"}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className="text-xs">
                  <CalendarDays className="h-3 w-3 mr-1" />
                  Membre depuis {formatDate(user.createdAt)}
                </Badge>
              </div>
            </div>
          </div>

          <Separator />

          {/* Formulaire */}
          <div className="space-y-5">
            {/* Nom complet */}
            <div>
              <label className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                Nom complet
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Votre nom complet"
                className="w-full px-4 py-3 rounded-xl border-2 border-input bg-background text-sm font-medium focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary transition-colors"
              />
            </div>

            {/* Email (lecture seule) */}
            <div>
              <label className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                Email
              </label>
              <input
                type="email"
                value={user.email}
                disabled
                className="w-full px-4 py-3 rounded-xl border-2 border-input bg-muted text-sm font-medium text-muted-foreground cursor-not-allowed"
              />
              <p className="text-xs text-muted-foreground mt-1.5">
                L&apos;email ne peut pas être modifié
              </p>
            </div>

            {/* Téléphone */}
            <div>
              <label className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                Téléphone
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Votre numéro de téléphone"
                className="w-full px-4 py-3 rounded-xl border-2 border-input bg-background text-sm font-medium focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary transition-colors"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card className="rounded-2xl animate-fade-in-up" style={{ animationDelay: "0.2s", animationFillMode: "both" }}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">
                Notifications par email
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Recevoir les rappels de visio et les nouveaux modules
              </p>
            </div>
            <button
              onClick={() => setNotifications(!notifications)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                notifications ? "bg-primary" : "bg-muted-foreground/30"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm ${
                  notifications ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Sécurité */}
      <Card className="rounded-2xl animate-fade-in-up" style={{ animationDelay: "0.3s", animationFillMode: "both" }}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Sécurité
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">
                Changer le mot de passe
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Un email de réinitialisation vous sera envoyé
              </p>
            </div>
            <Button variant="outline" size="sm" className="rounded-lg">
              Réinitialiser
            </Button>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-destructive">
                Supprimer mon compte
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Cette action est irréversible
              </p>
            </div>
            <Button variant="outline" size="sm" className="rounded-lg text-destructive border-destructive/30 hover:bg-destructive/5">
              Supprimer
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Bouton sauvegarder */}
      <div className="flex justify-end animate-fade-in-up" style={{ animationDelay: "0.4s", animationFillMode: "both" }}>
        <Button
          onClick={handleSave}
          className="bg-primary hover:bg-primary/90 rounded-xl h-11 px-8 font-semibold"
          disabled={saved}
        >
          {saved ? (
            <>
              <Check className="mr-2 h-4 w-4" />
              Enregistré
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Enregistrer les modifications
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
