import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MailCheck } from "lucide-react";

export default function ConfirmPage() {
  return (
    <div className="w-full max-w-md mx-auto">
      <Card className="text-center border-border shadow-sm">
        <CardHeader className="space-y-4">
          <div className="flex justify-center">
            <div className="h-16 w-16 rounded-full bg-chart-4/20 flex items-center justify-center">
              <MailCheck className="h-8 w-8 text-chart-4" />
            </div>
          </div>
          <CardTitle className="text-2xl">Vérifiez votre email</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Un email de confirmation vous a été envoyé. Cliquez sur le lien
            dans cet email pour activer votre compte.
          </p>
          <p className="text-sm text-muted-foreground">
            Vérifiez également votre dossier spam si vous ne trouvez pas
            l&apos;email.
          </p>
          <Button variant="outline" asChild className="mt-4">
            <Link href="/auth/login">Retour à la connexion</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
