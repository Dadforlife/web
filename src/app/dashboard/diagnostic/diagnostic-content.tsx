"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import DiagnosticPapaChat from "@/components/diagnostic-papa-chat";
import { DiagnosticResultCard } from "@/components/diagnostic-result-card";
import { getLatestDiagnostic } from "@/app/dashboard/diagnostic/actions";

export function DiagnosticContent() {
  const searchParams = useSearchParams();
  const refaire = searchParams.get("refaire") === "1";
  const [hasDiagnostic, setHasDiagnostic] = useState<boolean | null>(null);

  useEffect(() => {
    getLatestDiagnostic().then((data) => setHasDiagnostic(!!data));
  }, []);

  if (hasDiagnostic === null) {
    return (
      <div className="space-y-6 max-w-6xl">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">
            Évaluation de situation
          </h1>
          <p className="text-muted-foreground mt-1">
            Répondez aux questions pour que nous puissions vous accompagner au mieux.
          </p>
        </div>
        <p className="text-center text-sm text-muted-foreground py-8">
          Chargement…
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">
          Évaluation de situation
        </h1>
        <p className="text-muted-foreground mt-1">
          Répondez aux questions pour que nous puissions vous accompagner au mieux.
        </p>
      </div>

      {!hasDiagnostic ? (
        <div id="diagnostic-questionnaire" className="flex justify-center scroll-mt-6">
          <DiagnosticPapaChat />
        </div>
      ) : (
        <>
          <DiagnosticResultCard context="diagnostic" showLink />
          {refaire && (
            <div id="diagnostic-questionnaire" className="flex justify-center scroll-mt-6">
              <DiagnosticPapaChat />
            </div>
          )}
        </>
      )}
    </div>
  );
}
