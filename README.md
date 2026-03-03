This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

### Confirmation d’email (inscription)

Après inscription, les utilisateurs doivent confirmer leur adresse email. À configurer dans Supabase :

1. **Authentication → URL Configuration** : ajouter l’URL de redirection (ex. `http://localhost:3000/auth/callback` et l’URL de prod) dans **Redirect URLs**.
2. **Authentication → Providers → Email** : activer **Confirm email** pour exiger la confirmation avant connexion.
3. **Authentication → Email Templates** : personnaliser le template « Confirm signup » si besoin.
4. Définir `NEXT_PUBLIC_APP_URL` dans `.env.local` (ex. `http://localhost:3000` en dev, `https://votredomaine.com` en prod) pour que le lien dans l’email pointe vers votre app.

### Espace Papas (forum)

Le forum des pères utilise Prisma sur la même base PostgreSQL (Supabase).

1. **Migration Supabase** : appliquer `supabase/migrations/004_espace_papas.sql` (tables `categories`, `discussions`, `messages`, `reports` + RLS + seed des catégories).
2. **Variables d’environnement** : dans `.env.local`, ajouter `DATABASE_URL` (et éventuellement `DIRECT_URL` pour les migrations Prisma) avec l’URL de connexion Postgres de Supabase (Settings → Database → Connection string).
3. **Générer le client Prisma** : `npm run db:generate` (ou `npx prisma generate`).
4. **Accès** : `/espace-papas` (réservé aux utilisateurs connectés ; redirection vers la page de connexion si besoin).

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
