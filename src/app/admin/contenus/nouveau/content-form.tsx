"use client";

import { useActionState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createContent } from "../actions";

export function ContentForm() {
  const [, formAction, isPending] = useActionState(
    async (_prev: unknown, formData: FormData) => {
      await createContent(formData);
    },
    null,
  );

  return (
    <Card className="rounded-2xl">
      <CardContent className="p-6">
        <form action={formAction} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Titre</Label>
            <Input
              id="title"
              name="title"
              placeholder="Titre du contenu"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Type</Label>
            <Select name="type" defaultValue="article">
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Sélectionner un type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="article">Article</SelectItem>
                <SelectItem value="resource">Ressource</SelectItem>
                <SelectItem value="page">Page</SelectItem>
                <SelectItem value="programme">Programme</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="body">Contenu</Label>
            <Textarea
              id="body"
              name="body"
              placeholder="Rédigez le contenu ici…"
              className="min-h-[300px]"
              required
            />
          </div>

          <div className="flex items-center gap-3">
            <Switch id="isPublished" name="isPublished" />
            <Label htmlFor="isPublished">Publier immédiatement</Label>
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={isPending}>
              {isPending ? "Création…" : "Créer le contenu"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
