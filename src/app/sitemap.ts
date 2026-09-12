import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { getEnabledFeatureFlags } from "@/lib/feature-flags";
import { getSEOSettings } from "@/lib/data/profile";

// Phase 2 §3 / Phase 3 §1 — sitemap built from enabled + sitemapEligible
// flags and visible+published content only. Never includes /admin or drafts.

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [seo, flags, pageSeoList] = await Promise.all([
    getSEOSettings(),
    getEnabledFeatureFlags(),
    prisma.pageSEO.findMany({ select: { path: true, noindex: true } }),
  ]);

  const base = seo?.canonicalBaseUrl ?? "https://jaiz.vercel.app";
  const eligibleKeys = new Set(flags.filter((f) => f.sitemapEligible).map((f) => f.key));
  const noindexPaths = new Set(pageSeoList.filter((p) => p.noindex).map((p) => p.path));

  const staticRoutes: MetadataRoute.Sitemap = [];
  if (!noindexPaths.has("/")) {
    staticRoutes.push({ url: base, lastModified: new Date() });
  }

  const routeByFlag: Record<string, string> = {
    about: "/about", experience: "/experience", skills: "/skills",
    projects: "/projects", research: "/research", bug_bounty: "/bug-bounty",
    certifications: "/certifications", achievements: "/achievements",
    blog: "/blog", contact: "/contact", resume: "/resume", links: "/links",
  };
  
  for (const [key, path] of Object.entries(routeByFlag)) {
    if (eligibleKeys.has(key) && !noindexPaths.has(path)) {
      staticRoutes.push({ url: `${base}${path}` });
    }
  }

  const entries: MetadataRoute.Sitemap = [...staticRoutes];

  if (eligibleKeys.has("projects")) {
    const projects = await prisma.project.findMany({ where: { visible: true }, select: { slug: true, updatedAt: true } });
    entries.push(...projects.map((p) => ({ url: `${base}/projects/${p.slug}`, lastModified: p.updatedAt })));
  }
  if (eligibleKeys.has("research")) {
    const research = await prisma.research.findMany({ where: { visible: true, disclosureStatus: "PUBLISHED" }, select: { slug: true, updatedAt: true } });
    entries.push(...research.map((r) => ({ url: `${base}/research/${r.slug}`, lastModified: r.updatedAt })));
  }
  if (eligibleKeys.has("blog")) {
    const posts = await prisma.blogPost.findMany({ where: { status: "PUBLISHED" }, select: { slug: true, updatedAt: true } });
    entries.push(...posts.map((p) => ({ url: `${base}/blog/${p.slug}`, lastModified: p.updatedAt })));
  }

  return entries;
}
