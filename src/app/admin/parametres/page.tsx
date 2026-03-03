import { getSettings } from "./actions";
import { SettingsForm } from "./settings-form";
import { PageHeader } from "@/components/admin/page-header";
import { Button } from "@/components/ui/button";
import { Cog, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default async function AdminParametresPage() {
  const settings = await getSettings();

  return (
    <div className="space-y-6 max-w-3xl">
      <PageHeader
        title="Paramètres"
        description="Configuration générale de la plateforme"
        icon={Cog}
        backHref="/admin"
      >
        <Button variant="outline" asChild>
          <Link href="/admin/parametres/roles">
            <ShieldCheck className="h-4 w-4" />
            Gérer les rôles
          </Link>
        </Button>
      </PageHeader>

      <SettingsForm initialValues={settings} />
    </div>
  );
}
