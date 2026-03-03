"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
type ForumSearchFormProps = {
  categories: { id: string; name: string }[];
  defaultQuery: string;
  defaultCategoryId: string;
};

export function ForumSearchForm({
  categories,
  defaultQuery,
  defaultCategoryId,
}: ForumSearchFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const q = (form.elements.namedItem("q") as HTMLInputElement).value.trim();
    const category = (form.elements.namedItem("category") as HTMLSelectElement).value;
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (category) params.set("category", category);
    startTransition(() => {
      router.push(`/espace-papas?${params.toString()}`);
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col sm:flex-row gap-2 flex-1 max-w-xl"
      role="search"
    >
      <div className="relative flex-1">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none"
          aria-hidden
        />
        <input
          type="search"
          name="q"
          defaultValue={defaultQuery}
          placeholder="Rechercher une discussion…"
          className="w-full h-9 pl-9 pr-3 rounded-md border border-input bg-background text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          aria-label="Rechercher"
        />
      </div>
      <select
        name="category"
        defaultValue={defaultCategoryId}
        className="h-9 rounded-md border border-input bg-background px-3 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        aria-label="Filtrer par catégorie"
      >
        <option value="">Toutes les catégories</option>
        {categories.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>
      <Button type="submit" variant="secondary" disabled={isPending}>
        {isPending ? "Recherche…" : "Filtrer"}
      </Button>
    </form>
  );
}
