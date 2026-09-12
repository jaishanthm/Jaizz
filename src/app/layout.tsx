import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import BackgroundEngine from "@/components/BackgroundEngine";
import { getProfile, getVisibleSocialLinks, getSEOSettings } from "@/lib/data/profile";
import { prisma } from "@/lib/prisma";
import MaintenancePage from "@/components/MaintenancePage";
import { headers } from "next/headers";

// Root layout: global nav/footer, base metadata, and the site-wide Person +
// WebSite JSON-LD from Phase 2 §2.
//
// Font loading — the Stage 7 TODO closed out: next/font/google self-hosts
// both fonts at build time (no runtime request to fonts.googleapis.com),
// which is also why the CSP in next.config.ts doesn't need a Google Fonts
// origin — this choice simplified that TODO too, not just this one.

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSEOSettings();
  return {
    title: { default: seo?.siteTitle ?? "Jaishanth M", template: `%s — ${seo?.siteName ?? "Jaishanth M"}` },
    description: seo?.siteDescription ?? "Cybersecurity student and security researcher.",
    metadataBase: seo ? new URL(seo.canonicalBaseUrl) : undefined,
    robots: { index: seo?.robotsIndex ?? true, follow: seo?.robotsFollow ?? true },
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [profile, socialLinks, seo, settings] = await Promise.all([
    getProfile(),
    getVisibleSocialLinks(),
    getSEOSettings(),
    prisma.siteSettings.findUnique({ where: { id: "singleton" } }),
  ]);

  const headersList = await headers();
  const currentPath = headersList.get("x-pathname") || "";
  const isMaintenanceMode = settings?.maintenanceMode ?? false;
  const isAdminOrAuth = currentPath.startsWith("/admin") || currentPath.startsWith("/api/auth");

  if (isMaintenanceMode && !isAdminOrAuth) {
    return (
      <html lang="en" className={`${spaceGrotesk.variable} ${inter.variable}`}>
        <body>
          <MaintenancePage />
        </body>
      </html>
    );
  }

  const personJsonLd = profile && seo
    ? {
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "Person",
            "@id": `${seo.canonicalBaseUrl}/#person`,
            name: profile.displayName,
            jobTitle: profile.professionalTitle,
            url: seo.canonicalBaseUrl,
            sameAs: socialLinks.map((l) => l.url),
          },
          {
            "@type": "WebSite",
            "@id": `${seo.canonicalBaseUrl}/#website`,
            url: seo.canonicalBaseUrl,
            name: seo.siteName,
            publisher: { "@id": `${seo.canonicalBaseUrl}/#person` },
          },
        ],
      }
    : null;

  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${inter.variable}`}>
      <body className="font-sans antialiased text-[var(--color-text-primary)] bg-[var(--color-bg-primary)] min-h-screen relative selection:bg-[var(--color-electric-blue)] selection:text-white">
        {personJsonLd && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
          />
        )}
        <BackgroundEngine />
        <div className="relative z-10 flex flex-col min-h-screen">
          <Nav />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
