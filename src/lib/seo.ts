import type { Metadata } from "next";

// ─── Site-wide SEO constants ────────────────────────────────────────────────

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.dadforlife.org";
export const SITE_NAME = "Papa pour la vie";
export const SITE_LOCALE = "fr_FR";
export const SITE_LANG = "fr";

export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.png`;

export const ORGANIZATION = {
  name: "Papa pour la vie",
  legalName: "Association Papa pour la vie",
  url: SITE_URL,
  email: "contact@dadforlife.org",
  phone: "+33764278987",
  address: {
    street: "30 rue de l'Ouche Buron",
    postalCode: "44300",
    city: "Nantes",
    country: "FR",
  },
  logo: `${SITE_URL}/logo.svg`,
  foundingDate: "2024",
  description:
    "Association loi 1901 d'accompagnement, de soutien et de formation des pères dans leur rôle parental.",
} as const;

// ─── Metadata helpers ───────────────────────────────────────────────────────

/**
 * Build a full Metadata object for any page.
 * Merges page-specific fields with site-wide defaults.
 */
export function buildMetadata({
  title,
  description,
  path = "",
  ogImage,
  ogType = "website",
  noIndex = false,
  keywords,
}: {
  title: string;
  description: string;
  path?: string;
  ogImage?: string;
  ogType?: "website" | "article";
  noIndex?: boolean;
  keywords?: string[];
}): Metadata {
  const url = `${SITE_URL}${path}`;
  const image = ogImage || DEFAULT_OG_IMAGE;

  return {
    title,
    description,
    ...(keywords && { keywords }),
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      locale: SITE_LOCALE,
      type: ogType,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
    ...(noIndex && {
      robots: {
        index: false,
        follow: false,
      },
    }),
  };
}

/**
 * Build metadata for a blog article with article-specific OG tags.
 */
export function buildArticleMetadata({
  title,
  description,
  slug,
  publishedAt,
  updatedAt,
  authorName,
  ogImage,
  keywords,
}: {
  title: string;
  description: string;
  slug: string;
  publishedAt: string;
  updatedAt?: string;
  authorName?: string;
  ogImage?: string;
  keywords?: string[];
}): Metadata {
  const url = `${SITE_URL}/blog/${slug}`;
  const image = ogImage || DEFAULT_OG_IMAGE;

  return {
    title: `${title} | Blog ${SITE_NAME}`,
    description,
    ...(keywords && { keywords }),
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      locale: SITE_LOCALE,
      type: "article",
      publishedTime: publishedAt,
      ...(updatedAt && { modifiedTime: updatedAt }),
      ...(authorName && { authors: [authorName] }),
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

/**
 * Extract a meta description from a body of text.
 * Strips HTML tags, truncates to ~155 characters at a word boundary.
 */
export function extractMetaDescription(body: string, maxLength = 155): string {
  const text = body
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim();

  if (text.length <= maxLength) return text;

  const truncated = text.slice(0, maxLength);
  const lastSpace = truncated.lastIndexOf(" ");
  return `${truncated.slice(0, lastSpace > 80 ? lastSpace : maxLength)}...`;
}
