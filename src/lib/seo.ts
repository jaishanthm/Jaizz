import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";

// QA fix — the single biggest SEO gap found: PageSEO had a full admin
// screen (Stage 5) and was never once read by a public page. This is the
// centralized resolver Phase 2/the QA pass calls for: PageSEO row (if any)
// → falls back to a computed default from global SEOSettings. Every static
// route's generateMetadata() should go through this, not read SEOSettings
// directly and never check for a per-page override.

export async function resolvePageSEO(path: string, fallbackTitle?: string, fallbackDescription?: string): Promise<Metadata> {
  const [pageSeo, global] = await Promise.all([
    prisma.pageSEO.findUnique({ where: { path }, include: { ogImage: true } }),
    prisma.sEOSettings.findUnique({ where: { id: "singleton" } }),
  ]);

  const title = pageSeo?.seoTitle || fallbackTitle || global?.siteTitle || "Jaishanth M";
  const description = pageSeo?.seoDescription || fallbackDescription || global?.siteDescription || undefined;
  const canonical = pageSeo?.canonicalUrl || (global ? `${global.canonicalBaseUrl}${path}` : undefined);

  return {
    title,
    description,
    alternates: canonical ? { canonical } : undefined,
    robots: pageSeo?.noindex
      ? { index: false, follow: !pageSeo.nofollow }
      : undefined, // undefined lets the root layout's global robots default apply
    openGraph: {
      title,
      description,
      url: canonical,
      images: pageSeo?.ogImage ? [{ url: pageSeo.ogImage.url }] : undefined,
    },
  };
}
