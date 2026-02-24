import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { DiagnosticForm } from "./diagnostic-form";
import { ClipboardCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Demande d\u2019accompagnement \u2013 Diagnostic initial | Dad for Life",
  description:
    "Questionnaire de diagnostic pour \u00e9valuer votre situation et d\u00e9terminer le niveau d\u2019accompagnement adapt\u00e9. Adh\u00e9sion gratuite, confidentiel, sans engagement.",
};

export default async function DiagnosticPage() {
  let isLoggedIn = false;

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    isLoggedIn = !!user;
  } catch {
    // Supabase pas configur\u00e9
  }

  return (
    <section className="relative min-h-screen py-16 sm:py-20 md:py-24 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 gradient-mesh" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-primary/[0.03] blur-[120px] -translate-y-1/4 translate-x-1/4" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-warm/[0.04] blur-[100px] translate-y-1/4 -translate-x-1/4" />

      <div className="relative container mx-auto px-4 max-w-2xl">
        {/* Header */}
        <div className="text-center mb-10 space-y-4">
          <div className="flex justify-center">
            <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center">
              <ClipboardCheck className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground tracking-tight">
            Demande d&apos;accompagnement
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-xl mx-auto">
            Ce questionnaire rapide permet d&apos;&eacute;valuer votre situation
            et de d&eacute;terminer le niveau d&apos;accompagnement adapt&eacute;.
          </p>
          <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-chart-4" />
              Gratuit
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-chart-4" />
              Confidentiel
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-chart-4" />
              5 min
            </span>
          </div>
        </div>

        {/* Form */}
        <DiagnosticForm isLoggedIn={isLoggedIn} />
      </div>
    </section>
  );
}
