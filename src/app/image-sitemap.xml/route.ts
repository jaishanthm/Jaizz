import { prisma } from "@/lib/prisma";
import { getSEOSettings } from "@/lib/data/profile";

export const dynamic = "force-dynamic";

export async function GET() {
  const defaultBase = "https://jaiz.vercel.app";
  let base = defaultBase;

  try {
    const seo = await getSEOSettings();
    if (seo?.canonicalBaseUrl) base = seo.canonicalBaseUrl;
  } catch {
    // fallback to defaultBase
  }

  // Gather all public imagery
  const urls: { loc: string; images: { loc: string; title: string }[] }[] = [];

  // 1. Homepage images
  urls.push({
    loc: `${base}`,
    images: [
      {
        loc: `${base}/profile.jpg`,
        title: "Jaishanth M — Cybersecurity Student & Security Researcher",
      },
      {
        loc: `${base}/og-image.png`,
        title: "Jaishanth M — Offensive Security Portfolio & Research Lab",
      },
    ],
  });

  // 2. Project imagery
  try {
    const projects = await prisma.project.findMany({
      where: { visible: true },
      include: { ogImage: true, screenshots: { include: { media: true } } },
    });
    for (const p of projects) {
      const imgs: { loc: string; title: string }[] = [];
      if (p.ogImage?.url) {
        const fullUrl = p.ogImage.url.startsWith("http")
          ? p.ogImage.url
          : `${base}${p.ogImage.url}`;
        imgs.push({ loc: fullUrl, title: `${p.name} — Preview` });
      }
      for (const s of p.screenshots) {
        if (s.media?.url) {
          const fullUrl = s.media.url.startsWith("http")
            ? s.media.url
            : `${base}${s.media.url}`;
          imgs.push({ loc: fullUrl, title: s.caption || `${p.name} Screenshot` });
        }
      }
      if (imgs.length > 0) {
        urls.push({ loc: `${base}/projects/${p.slug}`, images: imgs });
      }
    }
  } catch {
    // ignore
  }

  // 3. Research imagery
  try {
    const research = await prisma.research.findMany({
      where: { visible: true, disclosureStatus: "PUBLISHED" },
      include: { screenshots: { include: { media: true } } },
    });
    for (const r of research) {
      const imgs: { loc: string; title: string }[] = [];
      for (const s of r.screenshots) {
        if (s.media?.url) {
          const fullUrl = s.media.url.startsWith("http")
            ? s.media.url
            : `${base}${s.media.url}`;
          imgs.push({ loc: fullUrl, title: `${r.title} — Vulnerability Research` });
        }
      }
      if (imgs.length > 0) {
        urls.push({ loc: `${base}/research/${r.slug}`, images: imgs });
      }
    }
  } catch {
    // ignore
  }

  // 4. Certification imagery
  try {
    const certs = await prisma.certification.findMany({
      where: { visible: true },
      include: { imageMedia: true },
    });
    const certImgs: { loc: string; title: string }[] = [];
    for (const c of certs) {
      if (c.imageMedia?.url) {
        const fullUrl = c.imageMedia.url.startsWith("http")
          ? c.imageMedia.url
          : `${base}${c.imageMedia.url}`;
        certImgs.push({ loc: fullUrl, title: `${c.name} — ${c.issuer}` });
      }
    }
    if (certImgs.length > 0) {
      urls.push({ loc: `${base}/certifications`, images: certImgs });
    }
  } catch {
    // ignore
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urls
  .map(
    (u) => `  <url>
    <loc>${u.loc}</loc>
${u.images
  .map(
    (img) => `    <image:image>
      <image:loc>${img.loc}</image:loc>
      <image:title>${escapeXml(img.title)}</image:title>
    </image:image>`
  )
  .join("\n")}
  </url>`
  )
  .join("\n")}
</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}

function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case "&":
        return "&amp;";
      case "'":
        return "&apos;";
      case '"':
        return "&quot;";
      default:
        return c;
    }
  });
}
