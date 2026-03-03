import { ProgrammeContent } from "./programme-content";
import type { ProgrammeModuleDisplay } from "./programme-content";
import { DEFAULT_MODULES } from "./default-modules";

export default async function ProgrammePage() {
  const modules: ProgrammeModuleDisplay[] = DEFAULT_MODULES.map((mod) => ({
    ...mod,
    status: "not_started" as const,
  }));

  return <ProgrammeContent modules={modules} />;
}
