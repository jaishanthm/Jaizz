import type { MetadataRoute } from "next";
import { getSEOSettings } from "@/lib/data/profile";

export const dynamic = "force-dynamic";

export default async function robots(): Promise<MetadataRoute.Robots> {
  let base = "https://jaiz.vercel.app";
  try {
    const seo = await getSEOSettings();
    if (seo?.canonicalBaseUrl) base = seo.canonicalBaseUrl;
  } catch {
    // Fall back to default base if database is unavailable
  }
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/admin/", "/api/admin/"] },
    sitemap: `${base}/sitemap.xml`,
  };
}
