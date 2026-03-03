"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Shield,
  Mail,
  Lock,
  User,
  Phone,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Heart,
  HandHeart,
  Briefcase,
  ArrowLeft,
  Baby,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { register } from "../actions";

type PrimaryRole = "papa_aide" | "maman_demande" | "papa_benevole" | "professionnel";

const roleOptions: {
  value: PrimaryRole;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  {
    value: "papa_aide",
    label: "Papa accompagné",
    description: "Je suis un papa et j'ai besoin d'accompagnement",
    icon: Heart,
  },
  {
    value: "maman_demande",
    label: "Maman",
    description: "Je demande un accompagnement pour le père de mon enfant",
    icon: Baby,
  },
  {
    value: "papa_benevole",
    label: "Papa bénévole",
    description: "Je suis un papa et je veux devenir bénévole accompagnateur",
    icon: HandHeart,
  },
  {
    value: "professionnel",
    label: "Professionnel",
    description: "Je suis avocat, médiateur, coach ou psychologue",
    icon: Briefcase,
  },
];

export default function RegisterPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<PrimaryRole | null>(null);

  async function handleSubmit(formData: FormData) {
    setError(null);
    setLoading(true);
    try {
      const result = await register(formData);
      if (result?.error) {
        setError(result.error);
      }
    } catch {
      // redirect() throws NEXT_REDIRECT, expected behavior
    } finally {
      setLoading(false);
    }
  }

  if (!selectedRole) {
    return (
      <div className="w-full max-w-lg mx-auto px-4 sm:px-0">
        <Card className="border border-border/70 shadow-xl rounded-2xl overflow-hidden bg-card/90 backdrop-blur-sm">
          <CardHeader className="text-center space-y-5 pb-3">
            <div className="flex justify-center">
              <div className="h-16 w-16 rounded-2xl bg-primary/10 ring-1 ring-border/70 flex items-center justify-center">
                <Shield className="h-8 w-8 text-primary" />
              </div>
            </div>
            <CardTitle className="text-2xl md:text-3xl font-bold tracking-tight">
              Rejoindre Papa pour la vie
            </CardTitle>
            <p className="text-muted-foreground leading-relaxed">
              Choisissez votre profil pour commencer
            </p>
          </CardHeader>
          <CardContent className="space-y-3 pb-6">
            {roleOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setSelectedRole(option.value)}
                className="w-full flex items-center gap-4 p-4 rounded-xl border-2 border-border bg-background text-left transition-all hover:border-primary/40 hover:bg-primary/5 hover:shadow-sm group"
              >
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/15 transition-colors">
                  <option.icon className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground">
                    {option.label}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {option.description}
                  </p>
                </div>
              </button>
            ))}
            <p className="text-center text-sm text-muted-foreground pt-3">
              D&eacute;j&agrave; membre ?{" "}
              <Link
                href="/auth/login"
                className="text-primary hover:underline font-medium"
              >
                Se connecter
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const selectedRoleOption = roleOptions.find((r) => r.value === selectedRole)!;

  return (
    <div className="w-full max-w-md mx-auto px-4 sm:px-0">
      <Card className="border border-border/70 shadow-xl rounded-2xl overflow-hidden bg-card/90 backdrop-blur-sm">
        <CardHeader className="text-center space-y-5 pb-3">
          <div className="flex justify-center">
            <div className="h-16 w-16 rounded-2xl bg-primary/10 ring-1 ring-border/70 flex items-center justify-center">
              <selectedRoleOption.icon className="h-8 w-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl md:text-3xl font-bold tracking-tight">
            {selectedRoleOption.label}
          </CardTitle>
          <p className="text-muted-foreground leading-relaxed">
            {selectedRoleOption.description}
          </p>
          <button
            type="button"
            onClick={() => setSelectedRole(null)}
            className="inline-flex self-center items-center gap-1.5 text-xs font-medium text-primary hover:underline"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Changer de profil
          </button>
        </CardHeader>
        <CardContent>
          <form action={handleSubmit} className="space-y-5">
            <input type="hidden" name="primaryRole" value={selectedRole} />
            {error && (
              <div className="flex items-center gap-2 p-4 rounded-xl bg-destructive/10 text-destructive text-sm font-medium">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {error}
              </div>
            )}
            <div className="space-y-2">
              <label htmlFor="fullname" className="text-sm font-semibold">
                Nom complet
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  id="fullname"
                  name="fullname"
                  type="text"
                  required
                  placeholder="Jean Dupont"
                  className="w-full pl-11 pr-4 py-3 rounded-xl border-2 border-input bg-background text-sm font-medium focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary transition-colors"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-semibold">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="votre@email.fr"
                  className="w-full pl-11 pr-4 py-3 rounded-xl border-2 border-input bg-background text-sm font-medium focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary transition-colors"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="phone" className="text-sm font-semibold">
                T&eacute;l&eacute;phone{" "}
                <span className="text-muted-foreground font-normal">(optionnel)</span>
              </label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="06 12 34 56 78"
                  className="w-full pl-11 pr-4 py-3 rounded-xl border-2 border-input bg-background text-sm font-medium focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary transition-colors"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-semibold">
                Mot de passe
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  minLength={6}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-4 py-3 rounded-xl border-2 border-input bg-background text-sm font-medium focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary transition-colors"
                />
              </div>
              <p className="text-xs text-muted-foreground">Minimum 6 caract&egrave;res</p>
            </div>
            <Button
              className="w-full rounded-xl h-11 font-semibold"
              size="lg"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Cr&eacute;ation...
                </>
              ) : (
                "Cr\u00e9er mon compte"
              )}
            </Button>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-muted-foreground">
              <div className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-chart-4" />
                Donn&eacute;es confidentielles
              </div>
              <div className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-chart-4" />
                Sans engagement
              </div>
            </div>
            <p className="text-center text-sm text-muted-foreground">
              D&eacute;j&agrave; membre ?{" "}
              <Link
                href="/auth/login"
                className="text-primary hover:underline font-medium"
              >
                Se connecter
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
