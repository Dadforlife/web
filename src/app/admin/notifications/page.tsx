import { requireAdmin } from "@/lib/auth-helpers";
import { PageHeader } from "@/components/admin/page-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Bell, History } from "lucide-react";
import Link from "next/link";
import {
  GlobalNotificationForm,
  GroupNotificationForm,
  IndividualNotificationForm,
} from "./notification-form";

export default async function AdminNotificationsPage() {
  await requireAdmin();

  return (
    <div className="space-y-6 max-w-3xl">
      <PageHeader
        title="Notifications"
        description="Envoyer des notifications aux utilisateurs"
        icon={Bell}
        backHref="/admin"
      >
        <Button variant="outline" size="sm" asChild>
          <Link href="/admin/notifications/historique">
            <History className="h-4 w-4" />
            Historique
          </Link>
        </Button>
      </PageHeader>

      <Tabs defaultValue="global">
        <TabsList>
          <TabsTrigger value="global">Globale</TabsTrigger>
          <TabsTrigger value="group">Par groupe</TabsTrigger>
          <TabsTrigger value="individual">Individuelle</TabsTrigger>
        </TabsList>

        <TabsContent value="global">
          <GlobalNotificationForm />
        </TabsContent>

        <TabsContent value="group">
          <GroupNotificationForm />
        </TabsContent>

        <TabsContent value="individual">
          <IndividualNotificationForm />
        </TabsContent>
      </Tabs>
    </div>
  );
}
