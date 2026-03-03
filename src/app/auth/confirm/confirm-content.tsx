"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MailCheck } from "lucide-react";

export function ConfirmContent() {
  return (
    <div className="w-full max-w-md mx-auto px-4 sm:px-0">
      <Card className="text-center border-2 border-border/80 shadow-xl rounded-2xl overflow-hidden">
        <CardHeader className="space-y-4 pb-2">
          <div className="flex justify-center">
            <div className="h-16 w-16 rounded-2xl bg-chart-4/20 flex items-center justify-center">
              <MailCheck className="h-8 w-8 text-chart-4" />
            </div>
          </div>
          <CardTitle className="text-2xl md:text-3xl font-bold tracking-tight">
            Inscription réussie
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Votre compte a été créé avec succès. Vous pouvez maintenant vous
            connecter.
          </p>
          <Button variant="default" asChild className="mt-4 w-full">
            <Link href="/auth/login">Se connecter</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
