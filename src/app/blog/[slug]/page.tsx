import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { buildArticleMetadata, extractMetaDescription, SITE_URL } from "@/lib/seo";
import { articleJsonLd, breadcrumbJsonLd, jsonLd } from "@/lib/structured-data";
import { CalendarDays, ArrowLeft, Clock } from "lucide-react";

type Props = {
  params: Promise<{ slug: string }>;
};

async function getArticle(slug: string) {
  try {
    return await prisma.content.findFirst({
      where: {
        slug,
        type: "article",
        isPublished: true,
      },
      include: {
        author: {
          select: { fullName: true },
        },
      },
    });
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticle(slug);

  if (!article) {
    return { title: "Article introuvable" };
  }

  const description =
    article.metaDescription ||
    article.excerpt ||
    extractMetaDescription(article.body);

  return buildArticleMetadata({
    title: article.title,
    description,
    slug: article.slug,
    publishedAt: (article.publishedAt || article.createdAt).toISOString(),
    updatedAt: article.updatedAt.toISOString(),
    authorName: article.author.fullName || undefined,
    ogImage: article.featuredImageUrl || undefined,
  });
}

export async function generateStaticParams() {
  try {
    const articles = await prisma.content.findMany({
      where: { type: "article", isPublished: true },
      select: { slug: true },
    });
    return articles.map((a) => ({ slug: a.slug }));
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

function estimateReadTime(text: string): number {
  const words = text.replace(/<[^>]*>/g, "").split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

/**
 * Generate a table of contents from H2 headings in the body.
 */
function extractHeadings(body: string): Array<{ id: string; text: string }> {
  const regex = /<h2[^>]*>([^<]+)<\/h2>/gi;
  const headings: Array<{ id: string; text: string }> = [];
  let match;
  while ((match = regex.exec(body)) !== null) {
    const text = match[1].trim();
    const id = text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    headings.push({ id, text });
  }
  return headings;
}

/**
 * Add IDs to H2 tags in the body for anchor linking.
 */
function addHeadingIds(body: string): string {
  return body.replace(/<h2([^>]*)>([^<]+)<\/h2>/gi, (_match, attrs, text) => {
    const id = text
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    return `<h2${attrs} id="${id}">${text}</h2>`;
  });
}

export default async function BlogArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = await getArticle(slug);

  if (!article) {
    notFound();
  }

  const description =
    article.metaDescription ||
    article.excerpt ||
    extractMetaDescription(article.body);
  const publishedDate = article.publishedAt || article.createdAt;
  const readTime = estimateReadTime(article.body);
  const headings = extractHeadings(article.body);
  const bodyWithIds = addHeadingIds(article.body);

  return (
    <>
      {/* Structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd(
          articleJsonLd({
            title: article.title,
            description,
            slug: article.slug,
            publishedAt: publishedDate.toISOString(),
            updatedAt: article.updatedAt.toISOString(),
            authorName: article.author.fullName || undefined,
            imageUrl: article.featuredImageUrl || undefined,
          })
        )}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd(
          breadcrumbJsonLd([
            { name: "Accueil", path: "/" },
            { name: "Blog", path: "/blog" },
            { name: article.title, path: `/blog/${article.slug}` },
          ])
        )}
      />

      <main className="min-h-screen bg-background">
        {/* Hero */}
        <section className="bg-gradient-to-b from-muted/50 to-background py-12 sm:py-16">
          <div className="mx-auto max-w-3xl px-4">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8"
            >
              <ArrowLeft className="h-4 w-4" />
              Retour au blog
            </Link>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mb-6">
              {article.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              {article.author.fullName && (
                <span className="font-medium text-foreground">
                  {article.author.fullName}
                </span>
              )}
              <div className="flex items-center gap-1.5">
                <CalendarDays className="h-4 w-4" />
                <time dateTime={publishedDate.toISOString()}>
                  {formatDate(publishedDate)}
                </time>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                <span>{readTime} min de lecture</span>
              </div>
            </div>
          </div>
        </section>

        {/* Featured image */}
        {article.featuredImageUrl && (
          <div className="mx-auto max-w-4xl px-4 -mt-4 mb-10">
            <div className="relative aspect-[2/1] rounded-2xl overflow-hidden shadow-lg">
              <Image
                src={article.featuredImageUrl}
                alt={article.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 896px"
                priority
              />
            </div>
          </div>
        )}

        {/* Content */}
        <div className="mx-auto max-w-3xl px-4 pb-16 sm:pb-24">
          <div className="flex flex-col lg:flex-row gap-10">
            {/* Table of contents (sidebar) */}
            {headings.length > 2 && (
              <aside className="lg:order-last lg:w-56 shrink-0">
                <nav
                  className="sticky top-24 rounded-xl border border-border/60 bg-card p-5"
                  aria-label="Table des matières"
                >
                  <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-3">
                    Sommaire
                  </h2>
                  <ol className="space-y-2">
                    {headings.map((heading) => (
                      <li key={heading.id}>
                        <a
                          href={`#${heading.id}`}
                          className="text-sm text-muted-foreground hover:text-primary transition-colors line-clamp-2"
                        >
                          {heading.text}
                        </a>
                      </li>
                    ))}
                  </ol>
                </nav>
              </aside>
            )}

            {/* Article body */}
            <article className="min-w-0 flex-1">
              <div
                className="prose prose-slate max-w-none prose-headings:scroll-mt-24 prose-h2:text-2xl prose-h2:font-bold prose-h2:mt-10 prose-h2:mb-4 prose-h3:text-xl prose-h3:font-semibold prose-p:leading-relaxed prose-a:text-primary prose-img:rounded-xl"
                dangerouslySetInnerHTML={{ __html: bodyWithIds }}
              />
            </article>
          </div>

          {/* Bottom CTA */}
          <div className="mt-12 sm:mt-16 rounded-2xl border border-border/60 bg-muted/30 p-8 text-center">
            <h2 className="text-xl font-bold mb-3">
              Cet article vous a aid&eacute; ?
            </h2>
            <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
              D&eacute;couvrez notre programme d&apos;accompagnement personnalis&eacute;
              pour aller plus loin dans votre parcours de p&egrave;re.
            </p>
            <Link
              href="/diagnostic"
              className="inline-flex items-center gap-2 rounded-xl bg-warm px-7 py-3.5 text-base font-semibold text-warm-foreground shadow-lg hover:bg-warm/90 transition-all"
            >
              Faire mon diagnostic gratuit
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
