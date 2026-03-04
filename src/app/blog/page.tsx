import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { buildMetadata, extractMetaDescription } from "@/lib/seo";
import { breadcrumbJsonLd, jsonLd } from "@/lib/structured-data";
import { CalendarDays, ArrowRight, BookOpen } from "lucide-react";

export const metadata = buildMetadata({
  title: "Blog - Conseils et ressources pour les pères",
  description:
    "Articles, conseils et ressources pour les pères en situation de séparation. Paternité responsable, droits des pères, bien-être parental et accompagnement.",
  path: "/blog",
  keywords: [
    "blog pères",
    "conseils paternité",
    "articles séparation",
    "droits des pères",
    "ressources parentales",
    "blog papa pour la vie",
  ],
});

async function getArticles() {
  try {
    return await prisma.content.findMany({
      where: {
        type: "article",
        isPublished: true,
      },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        body: true,
        metaDescription: true,
        featuredImageUrl: true,
        publishedAt: true,
        createdAt: true,
        author: {
          select: { fullName: true },
        },
      },
    });
  } catch {
    return [];
  }
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

export default async function BlogPage() {
  const articles = await getArticles();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd(
          breadcrumbJsonLd([
            { name: "Accueil", path: "/" },
            { name: "Blog", path: "/blog" },
          ])
        )}
      />

      <main className="min-h-screen bg-background">
        {/* Hero */}
        <section className="bg-gradient-to-b from-muted/50 to-background py-16 sm:py-24">
          <div className="mx-auto max-w-5xl px-4 text-center">
            <span className="inline-block rounded-full border border-primary/25 bg-card/75 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary backdrop-blur-sm mb-6">
              Blog
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mb-5">
              Conseils et ressources
              <span className="gradient-text block mt-1">pour les pères</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Articles, guides pratiques et t&eacute;moignages pour accompagner les p&egrave;res
              dans leur r&ocirc;le parental et leur parcours de s&eacute;paration.
            </p>
          </div>
        </section>

        {/* Articles grid */}
        <section className="py-12 sm:py-16">
          <div className="mx-auto max-w-6xl px-4">
            {articles.length === 0 ? (
              <div className="text-center py-20">
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-muted mb-6">
                  <BookOpen className="h-8 w-8 text-muted-foreground" />
                </div>
                <h2 className="text-xl font-semibold mb-3">
                  Bient&ocirc;t de nouveaux articles
                </h2>
                <p className="text-muted-foreground max-w-md mx-auto mb-8">
                  Nous pr&eacute;parons des contenus pour vous aider dans votre parcours.
                  Revenez bient&ocirc;t !
                </p>
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 text-primary font-semibold hover:underline"
                >
                  Retour &agrave; l&apos;accueil
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {articles.map((article) => {
                  const description =
                    article.excerpt ||
                    article.metaDescription ||
                    extractMetaDescription(article.body);
                  const date = article.publishedAt || article.createdAt;

                  return (
                    <article
                      key={article.id}
                      className="group rounded-2xl border border-border/60 bg-card shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                    >
                      {article.featuredImageUrl && (
                        <div className="relative aspect-[16/9] overflow-hidden">
                          <Image
                            src={article.featuredImageUrl}
                            alt={article.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            loading="lazy"
                          />
                        </div>
                      )}
                      <div className="p-6">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                          <CalendarDays className="h-4 w-4" />
                          <time dateTime={date.toISOString()}>
                            {formatDate(date)}
                          </time>
                        </div>
                        <h2 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                          <Link href={`/blog/${article.slug}`}>
                            {article.title}
                          </Link>
                        </h2>
                        <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                          {description}
                        </p>
                        <Link
                          href={`/blog/${article.slug}`}
                          className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
                        >
                          Lire l&apos;article
                          <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* CTA */}
        <section className="py-12 sm:py-16 bg-muted/30 border-t border-border/60">
          <div className="mx-auto max-w-2xl px-4 text-center">
            <h2 className="text-2xl font-bold mb-4">
              Besoin d&apos;un accompagnement personnalis&eacute; ?
            </h2>
            <p className="text-muted-foreground mb-6">
              Nos articles vous informent, mais notre &eacute;quipe peut vous accompagner
              concr&egrave;tement dans votre parcours.
            </p>
            <Link
              href="/diagnostic"
              className="inline-flex items-center gap-2 rounded-xl bg-warm px-7 py-3.5 text-base font-semibold text-warm-foreground shadow-lg hover:bg-warm/90 transition-all"
            >
              Faire mon diagnostic gratuit
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
