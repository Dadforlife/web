# Espace Papas – Forum

Ce module gère l’Espace Papas (forum des pères) : validation, sanitization, constantes.

## Évolutions prévues (structure)

- **Messages privés (MP)**  
  Tables dédiées (ex. `conversations`, `private_messages`), routes API `/api/messages/...`, pages `/espace-papas/messages` (liste) et `/espace-papas/messages/[id]`. RLS Supabase à prévoir par conversation.

- **Groupes**  
  Tables (ex. `groups`, `group_members`, `group_discussions` ou lien discussion ↔ groupe). Pages `/espace-papas/groupes`, `/espace-papas/groupes/[id]`. Permissions par rôle (membre, modérateur).

- **Modération IA**  
  Service externe ou Edge/API route qui reçoit le contenu (titre, body), appelle un modèle (modération / classification), retourne `approved | flagged | reason`. À brancher avant `createDiscussion` / `createMessage` ou en async après création. Table optionnelle `moderation_log` (content_id, type, result, score).
