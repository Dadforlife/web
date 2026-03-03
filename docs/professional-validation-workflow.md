# Workflow de validation professionnelle

## 1. Candidature

1. Le candidat choisit son role (`benevole`, `avocat`, `mediateur`, `coach`, `psychologue`).
2. Le front appelle `POST /api/professionnels/candidature`.
3. Le profil passe en `professionalStatus = en_attente`.

## 2. Depot des documents

1. Le candidat depose ses pieces (charte, assurance, diplome, identite).
2. Chaque depot appelle `POST /api/professionnels/documents`.
3. Quand tous les documents obligatoires sont presents, le backend bascule le statut a `en_verification`.

## 3. Verification admin

1. L'admin ouvre `admin/professionnels`.
2. L'admin verifie chaque document du dossier.
3. Le score d'entretien et les notes internes sont saisis.
4. L'admin decide: `valide`, `refuse` ou `suspendu`.
5. Toute action est historisee dans `admin_action_logs`.

## 4. Attribution des niveaux

1. Validation initiale:
   - documents verifies
   - entretien complete
   - statut `valide`
   - niveau `reference` (puis `valide` si criteres complets)
2. Promotion `expert`:
   - minimum 5 avis positifs (>= 4)
   - note moyenne strictement > 4/5

## 5. Documents automatiques

1. Depuis la fiche admin, generation de:
   - charte ethique
   - convention de partenariat
2. Document archive dans `generated_documents`.
3. Telechargement via `GET /api/professionnels/documents/generated/[id]`.
4. Signature electronique marquee via `POST /api/professionnels/documents/generated/[id]`.

## 6. Conformite RGPD

1. Suppression compte en self-service via `DELETE /api/professionnels/me/account`.
2. Anonymisation des donnees personnelles.
3. Traçabilite de l'action dans `admin_action_logs`.

