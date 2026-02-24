# Dad for Life – Suivi de l’upgrade

## ✅ Fait

- **Upgrade des dépendances** : Next 15, React 19, Tailwind 4, Supabase SSR à jour.
- **Phase 1 – cookies() async** : `server.ts` utilise `await cookies()` ; tous les appelants (`navbar`, `auth/actions`, `auth/callback`) utilisent `await createClient()`.
- **Phase 1 – Build de vérification** : `npm run build` OK (warnings ESLint corrigés).
- **Phase 2 – Palette + animations CSS** : `globals.css` avec `@theme`, couleurs (primary, warm, chart, etc.), `fade-in-up`, `gradient-shift`, dark mode.

- **Phase 2 – Redesign Hero + Piliers + Landing** : fait (Pillars avec palette thème + animations échelonnées ; Hero et landing avec fade-in-up décalés).

- **Phase 2 – Redesign Dashboard + Programme** : fait (palette thème, badges chart-4/warm, cartes avec bordures primary/warm/chart-4, animations échelonnées).
- **Phase 2 – Redesign Annuaire + Calendrier** : fait (palette thème dans PartnerCard/EventCard, input avec ring, animations échelonnées).

- **Phase 2 – Redesign Navbar + Footer** : fait (bordure, shadow, CTA Rejoindre en warm, focus ring sur les liens, footer avec bande warm et focus sur les liens).
- **Phase 2 – Redesign pages Auth (split layout)** : fait (layout split : gauche branding + citation, droite formulaire ; login/register/confirm adaptés, inputs avec border-input/ring, confirm avec chart-4).

## 🔄 À faire

- **Build final + vérification complète**

---
*Dernière maj : Navbar, Footer et Auth (split layout) terminés.*
