import { requireAdmin } from "@/lib/auth-helpers";
import { PageHeader } from "@/components/admin/page-header";
import { FileText } from "lucide-react";
import { ContentForm } from "./content-form";

export default async function NouveauContenuPage() {
  await requireAdmin();

  return (
    <div className="space-y-6 max-w-3xl">
      <PageHeader
        title="Nouveau contenu"
        description="Créer un nouvel article, ressource, page ou programme"
        icon={FileText}
        backHref="/admin/contenus"
      />
      <ContentForm />
    </div>
  );
}
