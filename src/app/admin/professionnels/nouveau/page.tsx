import { requireAdmin } from "@/lib/auth-helpers";
import { PageHeader } from "@/components/admin/page-header";
import { Briefcase } from "lucide-react";
import { AddProfessionalForm } from "./add-professional-form";

export default async function NouveauProfessionnelPage() {
  await requireAdmin();

  return (
    <div className="space-y-6 max-w-3xl">
      <PageHeader
        title="Ajouter un professionnel"
        description="Créer un compte pour un avocat, médiateur, coach ou psychologue"
        icon={Briefcase}
        backHref="/admin/professionnels"
      />
      <AddProfessionalForm />
    </div>
  );
}
