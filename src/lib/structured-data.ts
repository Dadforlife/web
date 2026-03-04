import { ORGANIZATION, SITE_URL, SITE_NAME } from "@/lib/seo";

// ─── Type helpers for JSON-LD ───────────────────────────────────────────────

type JsonLdScript = {
  __html: string;
};

/**
 * Serialize a JSON-LD object for embedding in a <script> tag.
 */
export function jsonLd(data: Record<string, unknown>): JsonLdScript {
  return { __html: JSON.stringify(data) };
}

// ─── Organization schema ────────────────────────────────────────────────────

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: ORGANIZATION.name,
    legalName: ORGANIZATION.legalName,
    url: ORGANIZATION.url,
    logo: ORGANIZATION.logo,
    email: ORGANIZATION.email,
    telephone: ORGANIZATION.phone,
    foundingDate: ORGANIZATION.foundingDate,
    description: ORGANIZATION.description,
    address: {
      "@type": "PostalAddress",
      streetAddress: ORGANIZATION.address.street,
      addressLocality: ORGANIZATION.address.city,
      postalCode: ORGANIZATION.address.postalCode,
      addressCountry: ORGANIZATION.address.country,
    },
    sameAs: [
      // Add social profiles here when available
    ],
  };
}

// ─── WebSite schema (enables Google Sitelinks search) ───────────────────────

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    inLanguage: "fr",
    description: ORGANIZATION.description,
    publisher: {
      "@type": "Organization",
      name: ORGANIZATION.name,
      logo: {
        "@type": "ImageObject",
        url: ORGANIZATION.logo,
      },
    },
  };
}

// ─── WebPage schema ─────────────────────────────────────────────────────────

export function webPageJsonLd({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: title,
    description,
    url: `${SITE_URL}${path}`,
    isPartOf: {
      "@type": "WebSite",
      name: SITE_NAME,
      url: SITE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: ORGANIZATION.name,
    },
  };
}

// ─── Article schema (for blog posts) ────────────────────────────────────────

export function articleJsonLd({
  title,
  description,
  slug,
  publishedAt,
  updatedAt,
  authorName,
  imageUrl,
}: {
  title: string;
  description: string;
  slug: string;
  publishedAt: string;
  updatedAt?: string;
  authorName?: string;
  imageUrl?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    url: `${SITE_URL}/blog/${slug}`,
    datePublished: publishedAt,
    ...(updatedAt && { dateModified: updatedAt }),
    author: {
      "@type": "Organization",
      name: authorName || ORGANIZATION.name,
      url: ORGANIZATION.url,
    },
    publisher: {
      "@type": "Organization",
      name: ORGANIZATION.name,
      logo: {
        "@type": "ImageObject",
        url: ORGANIZATION.logo,
      },
    },
    ...(imageUrl && {
      image: {
        "@type": "ImageObject",
        url: imageUrl,
      },
    }),
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_URL}/blog/${slug}`,
    },
    inLanguage: "fr",
  };
}

// ─── FAQ schema ─────────────────────────────────────────────────────────────

export function faqJsonLd(
  faqs: Array<{ question: string; answer: string }>
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

// ─── BreadcrumbList schema ──────────────────────────────────────────────────

export function breadcrumbJsonLd(
  items: Array<{ name: string; path: string }>
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  };
}

// ─── NonprofitOrganization schema ───────────────────────────────────────────

export function nonprofitJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "NGO",
    name: ORGANIZATION.name,
    legalName: ORGANIZATION.legalName,
    url: ORGANIZATION.url,
    logo: ORGANIZATION.logo,
    email: ORGANIZATION.email,
    telephone: ORGANIZATION.phone,
    description: ORGANIZATION.description,
    foundingDate: ORGANIZATION.foundingDate,
    areaServed: {
      "@type": "Country",
      name: "France",
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: ORGANIZATION.address.street,
      addressLocality: ORGANIZATION.address.city,
      postalCode: ORGANIZATION.address.postalCode,
      addressCountry: ORGANIZATION.address.country,
    },
    knowsAbout: [
      "Paternité",
      "Soutien parental",
      "Médiation familiale",
      "Accompagnement des pères",
      "Séparation parentale",
      "Garde d'enfants",
    ],
  };
}
