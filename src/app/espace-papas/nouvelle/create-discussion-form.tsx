"use client";

import { useActionState } from "react";
import Link from "next/link";
import { createDiscussion } from "../actions";
import { Button } from "@/components/ui/button";
type CreateDiscussionFormProps = {
  categories: { id: string; name: string }[];
};

export function CreateDiscussionForm({ categories }: CreateDiscussionFormProps) {
  const [state, formAction] = useActionState(
    async (_: { error?: string } | null, formData: FormData) => {
      const result = await createDiscussion(formData);
      return result;
    },
    null as { error?: string } | null
  );

  return (
    <form action={formAction} className="space-y-6">
      {state?.error && (
        <div
          role="alert"
          className="rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive"
        >
          {state.error}
        </div>
      )}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-foreground mb-1.5">
          Titre <span className="text-destructive">*</span>
        </label>
        <input
          id="title"
          name="title"
          type="text"
          required
          maxLength={200}
          placeholder="Ex. Comment gérer les week-ends avec ma fille ?"
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        />
      </div>
      <div>
        <label htmlFor="categoryId" className="block text-sm font-medium text-foreground mb-1.5">
          Catégorie <span className="text-destructive">*</span>
        </label>
        <select
          id="categoryId"
          name="categoryId"
          required
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <option value="">Choisir une catégorie</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="content" className="block text-sm font-medium text-foreground mb-1.5">
          Contenu <span className="text-destructive">*</span>
        </label>
        <textarea
          id="content"
          name="content"
          required
          rows={6}
          maxLength={10_000}
          placeholder="Décrivez votre situation ou votre question…"
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-y min-h-[120px]"
        />
      </div>
      <div className="flex items-center gap-2">
        <input
          id="isAnonymous"
          name="isAnonymous"
          type="checkbox"
          className="h-4 w-4 rounded border-input text-primary focus:ring-ring"
        />
        <label htmlFor="isAnonymous" className="text-sm text-foreground">
          Publier anonymement
        </label>
      </div>
      <div className="flex flex-wrap gap-3">
        <Button type="submit">Publier la discussion</Button>
        <Button type="button" variant="outline" asChild>
          <Link href="/espace-papas">Annuler</Link>
        </Button>
      </div>
    </form>
  );
}
