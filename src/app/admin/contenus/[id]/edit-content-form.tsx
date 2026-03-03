"use client";

import { useState, useActionState } from "react";
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
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { Trash2 } from "lucide-react";
import { updateContent, deleteContent } from "../actions";

interface EditContentFormProps {
  content: {
    id: string;
    title: string;
    type: string;
    body: string;
    isPublished: boolean;
  };
}

export function EditContentForm({ content }: EditContentFormProps) {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [, formAction, isPending] = useActionState(
    async (_prev: unknown, formData: FormData) => {
      await updateContent(content.id, formData);
    },
    null,
  );

  async function handleDelete() {
    setIsDeleting(true);
    await deleteContent(content.id);
  }

  return (
    <>
      <Card className="rounded-2xl">
        <CardContent className="p-6">
          <form action={formAction} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Titre</Label>
              <Input
                id="title"
                name="title"
                defaultValue={content.title}
                placeholder="Titre du contenu"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Select name="type" defaultValue={content.type}>
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
                defaultValue={content.body}
                placeholder="Rédigez le contenu ici…"
                className="min-h-[300px]"
                required
              />
            </div>

            <div className="flex items-center gap-3">
              <Switch
                id="isPublished"
                name="isPublished"
                defaultChecked={content.isPublished}
              />
              <Label htmlFor="isPublished">Publié</Label>
            </div>

            <div className="flex items-center justify-between">
              <Button
                type="button"
                variant="destructive"
                onClick={() => setDeleteOpen(true)}
              >
                <Trash2 className="h-4 w-4" />
                Supprimer
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Enregistrement…" : "Enregistrer"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Supprimer le contenu"
        description="Cette action est irréversible. Le contenu sera définitivement supprimé."
        confirmLabel="Supprimer"
        variant="destructive"
        loading={isDeleting}
        onConfirm={handleDelete}
      />
    </>
  );
}
