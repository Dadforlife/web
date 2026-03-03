"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Gift, Users, ArrowRight } from "lucide-react";

const donAmounts = [5, 10, 20, 50];

export default function DonPage() {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(20);
  const [customAmount, setCustomAmount] = useState("");

  const currentAmount = customAmount ? Number(customAmount) : selectedAmount;

  return (
    <div className="space-y-8 max-w-3xl">
      {/* En-tête */}
      <div className="space-y-4 animate-fade-in-up">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-warm/10 flex items-center justify-center shrink-0">
            <Heart className="h-6 w-6 text-warm" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">
              Faire un don
            </h1>
            <p className="text-muted-foreground mt-1">
              Aide un autre père à traverser cette épreuve
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 animate-fade-in-up" style={{ animationDelay: "0.1s", animationFillMode: "both" }}>
        <Card className="rounded-2xl text-center p-5">
          <Gift className="h-8 w-8 text-primary mx-auto mb-3" />
          <p className="text-sm font-semibold text-foreground">Accès au programme</p>
          <p className="text-xs text-muted-foreground mt-1">
            Ton don permet de maintenir le programme gratuit pour tous
          </p>
        </Card>
        <Card className="rounded-2xl text-center p-5">
          <Users className="h-8 w-8 text-chart-2 mx-auto mb-3" />
          <p className="text-sm font-semibold text-foreground">Soutien communautaire</p>
          <p className="text-xs text-muted-foreground mt-1">
            Finance les groupes de parole et les visios mensuelles
          </p>
        </Card>
        <Card className="rounded-2xl text-center p-5">
          <Heart className="h-8 w-8 text-warm mx-auto mb-3" />
          <p className="text-sm font-semibold text-foreground">Solidarité entre pères</p>
          <p className="text-xs text-muted-foreground mt-1">
            Chaque euro aide un père dans son combat
          </p>
        </Card>
      </div>

      {/* Formulaire de don */}
      <Card className="rounded-2xl animate-fade-in-up" style={{ animationDelay: "0.2s", animationFillMode: "both" }}>
        <CardHeader>
          <CardTitle>Choisis ton montant</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Montants prédéfinis */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {donAmounts.map((amount) => (
              <button
                key={amount}
                onClick={() => {
                  setSelectedAmount(amount);
                  setCustomAmount("");
                }}
                className={`h-14 rounded-xl border-2 font-bold text-lg transition-all ${
                  selectedAmount === amount && !customAmount
                    ? "border-warm bg-warm/10 text-warm shadow-sm"
                    : "border-border hover:border-warm/40 text-foreground hover:bg-warm/5"
                }`}
              >
                {amount}&euro;
              </button>
            ))}
          </div>

          {/* Montant personnalisé */}
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-2 block">
              Ou entre un montant libre
            </label>
            <div className="relative max-w-xs">
              <input
                type="number"
                min="1"
                placeholder="Montant"
                value={customAmount}
                onChange={(e) => {
                  setCustomAmount(e.target.value);
                  setSelectedAmount(null);
                }}
                className="w-full pl-4 pr-10 py-3 rounded-xl border-2 border-input bg-background text-sm font-medium focus:outline-none focus:ring-2 focus:ring-warm focus:border-warm transition-colors"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-muted-foreground">
                &euro;
              </span>
            </div>
          </div>

          {/* Bouton de don */}
          <Button
            size="lg"
            className="w-full sm:w-auto bg-warm text-warm-foreground hover:bg-warm/90 shadow-md shadow-warm/20 font-semibold rounded-xl h-12 px-10 text-base"
            disabled={!currentAmount || currentAmount <= 0}
          >
            Faire un don de {currentAmount || "..."}&euro;
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>

          <p className="text-xs text-muted-foreground">
            Les dons sont gérés de manière sécurisée. Papa pour la vie est une association
            à but non lucratif. Merci pour ta générosité.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
