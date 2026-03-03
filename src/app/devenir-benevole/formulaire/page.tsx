import Link from "next/link";
import { ArrowLeft, BadgeCheck, ShieldCheck, Users } from "lucide-react";
import { VolunteerApplicationForm } from "./volunteer-application-form";

export default function FormulaireBenevolePage() {
  return (
    <main role="main" className="min-h-screen bg-gradient-to-b from-sky-50/60 via-white to-slate-50/60">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:py-20">
        <Link
          href="/devenir-benevole"
          className="mb-8 inline-flex items-center gap-2 text-slate-600 transition-colors hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour à la page Devenir bénévole
        </Link>

        <div className="grid gap-8 lg:grid-cols-[0.7fr_1.3fr]">
          <aside className="rounded-3xl border border-slate-200 bg-white/80 p-7 shadow-lg shadow-slate-200/50 backdrop-blur sm:p-8">
            <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.09em] text-primary">
              Etape finale
            </span>
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-950">
              Nous avons hâte de vous rencontrer.
            </h1>
            <p className="mt-4 leading-relaxed text-slate-600">
              Votre candidature est l&apos;occasion de rejoindre une équipe engagée,
              structurée et humaine, au service des parents isolés.
            </p>

            <ul className="mt-7 space-y-3">
              <li className="flex items-start gap-3 rounded-xl bg-slate-50 p-3.5">
                <BadgeCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <span className="text-sm text-slate-700">
                  Réponse de l&apos;équipe sous 72h ouvrables.
                </span>
              </li>
              <li className="flex items-start gap-3 rounded-xl bg-slate-50 p-3.5">
                <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <span className="text-sm text-slate-700">
                  Candidature traitée de manière confidentielle.
                </span>
              </li>
              <li className="flex items-start gap-3 rounded-xl bg-slate-50 p-3.5">
                <Users className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <span className="text-sm text-slate-700">
                  Première mission accompagnée en binôme.
                </span>
              </li>
            </ul>

            <p className="mt-7 text-sm text-slate-500">
              Une question avant de postuler ? Ecrivez-nous à{" "}
              <a
                href="mailto:contact@dadforlife.org?subject=Candidature%20b%C3%A9n%C3%A9vole"
                className="font-medium text-primary hover:underline"
              >
                contact@dadforlife.org
              </a>
              .
            </p>
          </aside>

          <div>
            <VolunteerApplicationForm />
          </div>
        </div>
      </div>
    </main>
  );
}
