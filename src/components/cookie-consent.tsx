"use client";

import { useState, useEffect } from "react";

const STORAGE_KEY = "dfl-cookie-consent";

/**
 * Bannière de consentement cookies – RGPD.
 * Affichée en bas de page tant que l'utilisateur n'a pas fait de choix.
 * Le choix est stocké dans localStorage pour ne plus afficher la bannière.
 */
export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // N'afficher que si aucun choix n'a encore été enregistré
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) setVisible(true);
  }, []);

  function accept() {
    localStorage.setItem(STORAGE_KEY, "accepted");
    setVisible(false);
  }

  function refuse() {
    localStorage.setItem(STORAGE_KEY, "refused");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[60] px-4 pb-4">
      <div className="mx-auto flex max-w-3xl flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-xl sm:flex-row sm:items-center sm:gap-6">
        {/* Texte */}
        <p className="flex-1 text-sm leading-relaxed text-slate-600">
          Ce site utilise des cookies strictement nécessaires au fonctionnement
          du service. Aucune donnée n&apos;est partagée à des fins publicitaires.
          En continuant, tu acceptes notre{" "}
          <a
            href="/politique-confidentialite"
            className="font-medium text-blue-700 underline underline-offset-2 hover:text-blue-900"
          >
            politique de confidentialité
          </a>
          .
        </p>

        {/* Actions */}
        <div className="flex shrink-0 gap-3">
          <button
            type="button"
            onClick={refuse}
            className="rounded-full border border-slate-300 bg-white px-5 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-slate-400 hover:bg-slate-50"
          >
            Refuser
          </button>
          <button
            type="button"
            onClick={accept}
            className="rounded-full bg-blue-900 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-800"
          >
            Accepter
          </button>
        </div>
      </div>
    </div>
  );
}
