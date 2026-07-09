import type { Metadata } from "next";
import type { JobRow, PostRow, SiteSettings, Faq } from "@/lib/types";

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.simplelogistics.co.uk"
).replace(/\/$/, "");

export function absoluteUrl(path: string): string {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

interface PageMetaArgs {
  settings: SiteSettings;
  title: string;
  description: string;
  path: string;
  ogImage?: string | null;
  type?: "website" | "article";
}

/** Consistent per-page metadata: canonical URL, OG and Twitter cards. */
export function buildMetadata({
  settings,
  title,
  description,
  path,
  ogImage,
  type = "website",
}: PageMetaArgs): Metadata {
  const canonical = absoluteUrl(path);
  // Page image → admin-set default → the square brand lockup as last resort.
  const image = ogImage ?? settings.og_image_url;
  const fallbackLogo = "/logo_with_name.png";

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: settings.site_name,
      locale: "en_GB",
      type,
      images: image
        ? [{ url: image, width: 1200, height: 630 }]
        : [{ url: fallbackLogo, width: 500, height: 500 }],
    },
    twitter: {
      // The square logo fallback reads better as a summary thumbnail.
      card: image ? "summary_large_image" : "summary",
      title,
      description,
      images: [image ?? fallbackLogo],
    },
  };
}

/* ------------------------------------------------------------ JSON-LD */

type JsonLdObject = Record<string, unknown>;

export function organizationJsonLd(settings: SiteSettings): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: settings.site_name,
    url: SITE_URL,
    logo: settings.logo_url ?? absoluteUrl("/logo_with_name.png"),
    ...(settings.phone ? { telephone: settings.phone } : {}),
    ...(settings.email ? { email: settings.email } : {}),
    address: {
      "@type": "PostalAddress",
      streetAddress: [settings.address_line1, settings.address_line2]
        .filter(Boolean)
        .join(", "),
      addressLocality: settings.city ?? undefined,
      postalCode: settings.postcode ?? undefined,
      addressCountry: "GB",
    },
    sameAs: [settings.linkedin_url, settings.facebook_url].filter(Boolean),
  };
}

export function jobPostingJsonLd(job: JobRow, settings: SiteSettings): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title,
    description: job.body_html,
    identifier: {
      "@type": "PropertyValue",
      name: settings.site_name,
      value: job.reference,
    },
    datePosted: job.created_at,
    ...(job.closes_at ? { validThrough: job.closes_at } : {}),
    employmentType: job.job_type.toUpperCase().replace("-", "_"),
    industry: job.industry,
    hiringOrganization: {
      "@type": "Organization",
      name: settings.site_name,
      sameAs: SITE_URL,
      logo: settings.logo_url ?? absoluteUrl("/logo_with_name.png"),
    },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: job.location,
        addressCountry: "GB",
      },
    },
    ...(job.salary_text
      ? {
          baseSalary: {
            "@type": "MonetaryAmount",
            currency: "GBP",
            value: { "@type": "QuantitativeValue", value: job.salary_text },
          },
        }
      : {}),
    directApply: false,
  };
}

export function blogPostingJsonLd(post: PostRow, settings: SiteSettings): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    url: absoluteUrl(`/blog/${post.slug}`),
    datePublished: post.published_at ?? post.created_at,
    dateModified: post.updated_at,
    ...(post.cover_image_url ? { image: post.cover_image_url } : {}),
    keywords: post.tags.join(", "),
    articleSection: post.category,
    author: { "@type": "Organization", name: settings.site_name },
    publisher: {
      "@type": "Organization",
      name: settings.site_name,
      logo: {
        "@type": "ImageObject",
        url: settings.logo_url ?? absoluteUrl("/logo_with_name.png"),
      },
    },
    mainEntityOfPage: absoluteUrl(`/blog/${post.slug}`),
  };
}

export function faqJsonLd(faqs: Faq[]): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}

export function breadcrumbJsonLd(items: Array<{ name: string; path: string }>): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

/** Renders a JSON-LD script tag from an RSC. */
export function JsonLd({ data }: { data: JsonLdObject }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
