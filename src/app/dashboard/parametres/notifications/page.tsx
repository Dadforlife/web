import { Bell, Mail, ArrowLeft } from "lucide-react";
import Link from "next/link";
import {
  getNotificationPreferences,
  saveNotificationPreferences,
} from "./actions";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

const categories = [
  {
    id: "Account",
    label: "Compte",
    description: "Inscription, mot de passe, sécurité du compte",
    emailKey: "emailAccount",
    inappKey: "inappAccount",
  },
  {
    id: "Forum",
    label: "Forum / Espace Papas",
    description: "Messages, réponses, mentions, modération",
    emailKey: "emailForum",
    inappKey: "inappForum",
  },
  {
    id: "Community",
    label: "Communauté",
    description: "Nouveaux membres, événements, newsletter",
    emailKey: "emailCommunity",
    inappKey: "inappCommunity",
  },
  {
    id: "Programme",
    label: "Programme",
    description: "Accompagnement, séances, modules, ressources",
    emailKey: "emailProgramme",
    inappKey: "inappProgramme",
  },
  {
    id: "Admin",
    label: "Administratif",
    description: "CGU, confidentialité, maintenance",
    emailKey: "emailAdmin",
    inappKey: "inappAdmin",
  },
  {
    id: "Engagement",
    label: "Engagement",
    description: "Rappels, discussions populaires, réactivation",
    emailKey: "emailEngagement",
    inappKey: "inappEngagement",
  },
];

export default async function NotificationPreferencesPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/auth/login");
  }

  const prefs = await getNotificationPreferences();
  if (!prefs) {
    redirect("/auth/login");
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <Link
          href="/dashboard/parametres"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour aux paramètres
        </Link>
        <h1 className="text-2xl font-bold text-foreground">
          Préférences de notifications
        </h1>
        <p className="text-muted-foreground mt-1">
          Choisissez comment et quand vous souhaitez être notifié.
        </p>
      </div>

      <form action={saveNotificationPreferences}>
        <div className="bg-background rounded-xl border border-border/60 overflow-hidden">
          {/* Table header */}
          <div className="grid grid-cols-[1fr_80px_80px] items-center gap-4 px-6 py-3 border-b border-border/60 bg-muted/30">
            <span className="text-sm font-semibold text-foreground">
              Catégorie
            </span>
            <span className="text-center">
              <Mail className="h-4 w-4 mx-auto text-muted-foreground" />
              <span className="text-[10px] text-muted-foreground mt-0.5 block">
                Email
              </span>
            </span>
            <span className="text-center">
              <Bell className="h-4 w-4 mx-auto text-muted-foreground" />
              <span className="text-[10px] text-muted-foreground mt-0.5 block">
                In-app
              </span>
            </span>
          </div>

          {/* Category rows */}
          {categories.map((cat, index) => (
            <div
              key={cat.id}
              className={`grid grid-cols-[1fr_80px_80px] items-center gap-4 px-6 py-4 ${
                index < categories.length - 1
                  ? "border-b border-border/30"
                  : ""
              }`}
            >
              <div>
                <p className="text-sm font-medium text-foreground">
                  {cat.label}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {cat.description}
                </p>
              </div>
              <div className="flex justify-center">
                <label className="relative inline-flex cursor-pointer">
                  <input
                    type="checkbox"
                    name={cat.emailKey}
                    defaultChecked={
                      prefs[cat.emailKey as keyof typeof prefs] as boolean
                    }
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-muted rounded-full peer peer-checked:bg-primary transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-4" />
                </label>
              </div>
              <div className="flex justify-center">
                <label className="relative inline-flex cursor-pointer">
                  <input
                    type="checkbox"
                    name={cat.inappKey}
                    defaultChecked={
                      prefs[cat.inappKey as keyof typeof prefs] as boolean
                    }
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-muted rounded-full peer peer-checked:bg-primary transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-4" />
                </label>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end mt-6">
          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors"
          >
            Enregistrer les préférences
          </button>
        </div>
      </form>
    </div>
  );
}
