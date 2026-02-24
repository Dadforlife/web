"use client";

import DiagnosticPapaChat from "@/components/diagnostic-papa-chat";
import { DiagnosticResultCard } from "@/components/diagnostic-result-card";

export default function DiagnosticPage() {
  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">
          Diagnostic de situation
        </h1>
        <p className="text-muted-foreground mt-1">
          R&eacute;pondez aux questions pour que nous puissions vous accompagner au mieux.
        </p>
      </div>

      {/* Dernier résultat : météo + détail du plan d'action */}
      <DiagnosticResultCard context="diagnostic" showLink />

      <div className="flex justify-center">
        <DiagnosticPapaChat />
      </div>
    </div>
  );
}
