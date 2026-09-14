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

  const disallowed = [
    "/admin",
    "/admin/",
    "/login",
    "/api/admin",
    "/api/admin/",
    "/api/auth",
    "/api/auth/",
  ];

  const publicAllowed = [
    "/",
    "/_next/static/",
    "/profile.jpg",
    "/og-image.png",
    "/about",
    "/skills",
    "/projects",
    "/projects/",
    "/research",
    "/research/",
    "/bug-bounty",
    "/experience",
    "/certifications",
    "/achievements",
    "/blog",
    "/blog/",
    "/contact",
    "/links",
    "/resume",
  ];

  return {
    rules: [
      {
        userAgent: "*",
        allow: publicAllowed,
        disallow: disallowed,
      },
      {
        userAgent: "Googlebot",
        allow: [
          "/",
          "/*.js$",
          "/*.css$",
          "/_next/static/",
          "/profile.jpg",
          "/og-image.png",
        ],
        disallow: disallowed,
      },
      {
        userAgent: "Googlebot-Image",
        allow: [
          "/",
          "/profile.jpg",
          "/og-image.png",
          "/_next/static/",
        ],
        disallow: disallowed,
      },
      {
        userAgent: "Bingbot",
        allow: publicAllowed,
        disallow: disallowed,
        crawlDelay: 0,
      },
      {
        userAgent: [
          "GPTBot",
          "ChatGPT-User",
          "ClaudeBot",
          "Claude-Web",
          "PerplexityBot",
          "Google-Extended",
          "CCBot",
          "cohere-ai",
          "Anthropic-AI",
          "Bytespider",
          "FacebookBot",
          "Amazonbot",
        ],
        allow: publicAllowed,
        disallow: disallowed,
      },
      {
        userAgent: [
          "Applebot",
          "Twitterbot",
          "facebookexternalhit",
          "LinkedInBot",
          "Discordbot",
          "Slackbot",
        ],
        allow: publicAllowed,
        disallow: disallowed,
      },
    ],
    sitemap: [
      `${base}/sitemap.xml`,
      `${base}/image-sitemap.xml`,
    ],
  };
}
