import { createClient } from "@/lib/supabase/server";
import { ProgrammeContent } from "./programme-content";
import type { ProgrammeModuleDisplay } from "./programme-content";
import {
  DEFAULT_MODULES,
  dbModuleToDisplay,
} from "./default-modules";

export default async function ProgrammePage() {
  const supabase = await createClient();
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  if (!authUser) {
    return (
      <div className="max-w-4xl text-muted-foreground">
        Vous devez être connecté pour voir votre programme.
      </div>
    );
  }

  const userId = authUser.id;

  // Récupérer les modules depuis la base (ou utiliser les défauts)
  const { data: dbModules } = await supabase
    .from("program_modules")
    .select("module_number, title, description, duration_minutes, video_url, content")
    .order("module_number", { ascending: true });

  // Récupérer la progression du parent (utilisateur connecté)
  const { data: progressRows } = await supabase
    .from("program_progress")
    .select("module_number, status")
    .eq("user_id", userId);

  const progressByModule = new Map(
    (progressRows ?? []).map((p) => [p.module_number, p.status as "not_started" | "in_progress" | "completed"])
  );

  const dbModulesByNumber = new Map(
    (dbModules ?? []).map((row) => [row.module_number, row])
  );

  // Toujours 6 modules : priorité aux données DB, sinon défauts ; statut = progression du parent
  const modules: ProgrammeModuleDisplay[] = DEFAULT_MODULES.map((defaultMod) => {
    const dbRow = dbModulesByNumber.get(defaultMod.number);
    const base = dbRow
      ? dbModuleToDisplay(dbRow, defaultMod)
      : { ...defaultMod };
    return {
      ...base,
      status: progressByModule.get(defaultMod.number) ?? "not_started",
    } as ProgrammeModuleDisplay;
  });

  return <ProgrammeContent modules={modules} />;
}
