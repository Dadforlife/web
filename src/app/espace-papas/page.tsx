import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DiscussionCard } from "@/components/forum/discussion-card";
import { PlusCircle, Heart, Shield, Users } from "lucide-react";
import { ForumSearchForm } from "./forum-search-form";

const NEW_THRESHOLD_MS = 24 * 60 * 60 * 1000;

type PageProps = {
  searchParams: Promise<{ q?: string; category?: string }>;
};

export default async function EspacePapasPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const q = typeof params.q === "string" ? params.q.trim() : "";
  const categoryId = typeof params.category === "string" ? params.category.trim() : null;

  const rawCategories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });
  const categories = rawCategories.map((c) => ({ id: c.id, name: c.name }));

  const where: Prisma.DiscussionWhereInput = {
    status: { in: ["active", "archived"] },
  };
  if (categoryId) {
    where.categoryId = categoryId;
  }
  if (q.length > 0) {
    where.OR = [
      { title: { contains: q, mode: "insensitive" } },
      { content: { contains: q, mode: "insensitive" } },
    ];
  }

  const discussions = await prisma.discussion.findMany({
    where,
    include: {
      category: true,
      author: { select: { fullName: true } },
      _count: { select: { messages: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  const totalCount = await prisma.discussion.count({
    where: { status: { in: ["active", "archived"] } },
  });

  const now = Date.now();
  const discussionsForClient = discussions.map((d) => ({
    id: d.id,
    title: d.title,
    createdAt: d.createdAt.toISOString(),
    isAnonymous: d.isAnonymous,
    category: { id: d.category.id, name: d.category.name },
    author: d.author,
    _count: d._count,
    isNew: now - d.createdAt.getTime() < NEW_THRESHOLD_MS,
  }));

  return (
    <div className="container mx-auto w-full max-w-6xl px-4 py-8 sm:py-10">
      {/* Header bienveillant */}
      <header className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
          Espace Papas
        </h1>
        <p className="mt-3 text-lg font-medium text-primary/80 italic">
          Ici on ne juge pas. On se comprend.
        </p>
        <p className="mt-2 text-muted-foreground">
          Un espace où chaque père peut raconter son histoire, poser ses
          questions et recevoir le soutien de ceux qui vivent la même chose.
        </p>

        {/* Valeurs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-5">
          <Card className="border-primary/10 bg-primary/5">
            <CardContent className="flex items-center gap-3 py-3">
              <Shield className="h-5 w-5 text-primary shrink-0" />
              <div>
                <p className="text-sm font-semibold text-foreground">
                  Anonymat respecté
                </p>
                <p className="text-xs text-muted-foreground">
                  Publiez anonymement si vous préférez
                </p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-primary/10 bg-primary/5">
            <CardContent className="flex items-center gap-3 py-3">
              <Heart className="h-5 w-5 text-primary shrink-0" />
              <div>
                <p className="text-sm font-semibold text-foreground">
                  Bienveillance
                </p>
                <p className="text-xs text-muted-foreground">
                  Chaque témoignage est accueilli avec respect
                </p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-primary/10 bg-primary/5">
            <CardContent className="flex items-center gap-3 py-3">
              <Users className="h-5 w-5 text-primary shrink-0" />
              <div>
                <p className="text-sm font-semibold text-foreground">
                  Entre pères
                </p>
                <p className="text-xs text-muted-foreground">
                  Des hommes qui comprennent votre parcours
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </header>

      {/* Barre d'actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <ForumSearchForm
          categories={categories}
          defaultQuery={q}
          defaultCategoryId={categoryId ?? ""}
        />
        <Button asChild size="default" className="shrink-0">
          <Link href="/espace-papas/nouvelle" className="inline-flex items-center gap-2">
            <PlusCircle className="h-5 w-5" />
            Partager mon histoire
          </Link>
        </Button>
      </div>

      {/* Compteur */}
      {totalCount > 0 && (
        <p className="text-sm text-muted-foreground mb-4">
          {totalCount} témoignage{totalCount !== 1 ? "s" : ""} partagé{totalCount !== 1 ? "s" : ""}
          {q || categoryId ? ` — ${discussions.length} résultat${discussions.length !== 1 ? "s" : ""}` : ""}
        </p>
      )}

      {/* Liste des discussions */}
      <section className="space-y-4" aria-label="Liste des discussions">
        {discussionsForClient.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border bg-muted/30 p-12 text-center text-muted-foreground">
            {q || categoryId ? (
              <>
                <p className="font-medium">Aucun résultat pour cette recherche.</p>
                <p className="mt-1 text-sm">
                  Essayez d&apos;autres mots-clés ou retirez les filtres.
                </p>
              </>
            ) : (
              <>
                <p className="font-medium">
                  Aucun témoignage pour le moment.
                </p>
                <p className="mt-1 text-sm">
                  Soyez le premier à partager votre histoire.
                </p>
              </>
            )}
            <Button asChild variant="outline" className="mt-4">
              <Link href="/espace-papas/nouvelle">Partager mon histoire</Link>
            </Button>
          </div>
        ) : (
          discussionsForClient.map((d) => (
            <DiscussionCard key={d.id} discussion={d} />
          ))
        )}
      </section>
    </div>
  );
}
