"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Mail, Lock, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { login } from "../actions";

export function LoginForm() {
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") ?? "";
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    if (redirectTo) formData.set("redirectTo", redirectTo);
    setError(null);
    setLoading(true);
    try {
      const result = await login(formData);
      if (result?.error) {
        setError(result.error);
      }
    } catch {
      // redirect() lance une erreur NEXT_REDIRECT, c'est normal
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md mx-auto px-4 sm:px-0">
      <Card className="border border-border/70 shadow-xl rounded-2xl overflow-hidden bg-card/90 backdrop-blur-sm">
        <CardHeader className="text-center space-y-5 pb-3">
          <div className="flex justify-center">
            <div className="h-16 w-16 rounded-2xl bg-primary/10 ring-1 ring-border/70 flex items-center justify-center">
              <Shield className="h-8 w-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl md:text-3xl font-bold tracking-tight">Connexion</CardTitle>
          <p className="text-muted-foreground leading-relaxed">
            Acc&eacute;dez &agrave; votre espace membre Papa pour la vie pour reprendre
            votre parcours en toute confidentialit&eacute;.
          </p>
          <div className="inline-flex self-center items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
            Espace membre s&eacute;curis&eacute;
          </div>
        </CardHeader>
        <CardContent>
          <form action={handleSubmit} className="space-y-5">
            {error && (
              <div className="flex items-center gap-2 p-4 rounded-xl bg-destructive/10 text-destructive text-sm font-medium">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {error}
              </div>
            )}
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
              <div className="flex items-center justify-between gap-3">
                <label htmlFor="password" className="text-sm font-semibold">
                  Mot de passe
                </label>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  placeholder="••••••••"
                  className="w-full pl-11 pr-4 py-3 rounded-xl border-2 border-input bg-background text-sm font-medium focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary transition-colors"
                />
              </div>
            </div>
            <Button className="w-full rounded-xl h-11 font-semibold" size="lg" type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Connexion...
                </>
              ) : (
                "Se connecter"
              )}
            </Button>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-muted-foreground">
              <div className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-chart-4" />
                Connexion rapide
              </div>
              <div className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-chart-4" />
                Donn&eacute;es prot&eacute;g&eacute;es
              </div>
            </div>
            <p className="text-center text-sm text-muted-foreground">
              Pas encore membre ?{" "}
              <Link
                href="/auth/register"
                className="text-primary hover:underline font-medium"
              >
                Créer un compte
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
