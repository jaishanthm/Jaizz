import type { MetadataRoute } from "next";
import { getSEOSettings } from "@/lib/data/profile";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const seo = await getSEOSettings();
  const base = seo?.canonicalBaseUrl ?? "https://jaiz.vercel.app";
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/admin/", "/api/admin/"] },
    sitemap: `${base}/sitemap.xml`,
  };
}
