import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { CreateDiscussionForm } from "./create-discussion-form";

export default async function NouvelleDiscussionPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/auth/login?redirectTo=/espace-papas/nouvelle");
  }

  const rawCategories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });

  // Plain serializable objects for client component
  const categories = rawCategories.map((c) => ({ id: c.id, name: c.name }));

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8 sm:py-10">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-foreground tracking-tight">
          Ouvrir une discussion
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Choisissez un titre, une catégorie et décrivez votre sujet. Vous pouvez
          publier en anonyme.
        </p>
      </header>
      <CreateDiscussionForm categories={categories} />
    </div>
  );
}
