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
import { generateThemeCssVariables } from "@/lib/theme-utils";

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
    title: {
      default: seo?.siteTitle ?? "Jaishanth M. — Offensive Security Student",
      template: `%s — ${seo?.siteName ?? "Jaishanth M."}`,
    },
    description:
      seo?.siteDescription ??
      "Offensive security student building toward Red Team. Documenting vulnerability research, attack path analysis, and security engineering.",
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

  const themeCss = generateThemeCssVariables(settings ?? {});

  if (isMaintenanceMode && !isAdminOrAuth) {
    return (
      <html lang="en" className={`${spaceGrotesk.variable} ${inter.variable}`}>
        <head>
          <style id="dynamic-theme-vars" dangerouslySetInnerHTML={{ __html: themeCss }} />
        </head>
        <body className="bg-[#09090b] text-[#f4f4f5]">
          <MaintenancePage />
        </body>
      </html>
    );
  }

  const profileImageUrl = profile?.profileImage?.url
    ? profile.profileImage.url.startsWith("http")
      ? profile.profileImage.url
      : `${seo?.canonicalBaseUrl ?? "https://jaiz.vercel.app"}${profile.profileImage.url}`
    : undefined;

  const personJsonLd = profile && seo
    ? {
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "Person",
            "@id": `${seo.canonicalBaseUrl}/#person`,
            name: profile.displayName,
            jobTitle: "Offensive Security Student & Security Researcher",
            description: profile.shortBio,
            url: seo.canonicalBaseUrl,
            image: profileImageUrl,
            sameAs: socialLinks.map((l) => l.url),
            knowsAbout: [
              "Offensive Security",
              "Penetration Testing",
              "Red Teaming",
              "Web Application Security",
              "Active Directory Security",
              "Vulnerability Research",
              "Exploit Automation",
            ],
          },
          {
            "@type": "WebSite",
            "@id": `${seo.canonicalBaseUrl}/#website`,
            url: seo.canonicalBaseUrl,
            name: seo.siteName ?? "Jaishanth M.",
            publisher: { "@id": `${seo.canonicalBaseUrl}/#person` },
          },
        ],
      }
    : null;

  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${inter.variable}`}>
      <head>
        <style id="dynamic-theme-vars" dangerouslySetInnerHTML={{ __html: themeCss }} />
      </head>
      <body className="font-sans antialiased text-[var(--color-text-primary)] bg-[var(--color-bg-primary)] min-h-screen relative selection:bg-[var(--color-signal-red)] selection:text-white">
        {personJsonLd && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
          />
        )}
        <BackgroundEngine
          threeDMode={settings?.threeDMode ?? "FULL"}
          accentColor={settings?.accentColor ?? "#ef4444"}
          animationIntensity={settings?.animationIntensity ?? 50}
        />
        <div className="relative z-10 flex flex-col min-h-screen">
          <Nav />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
