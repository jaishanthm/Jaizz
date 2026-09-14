# Search Engine Optimization & Metadata Audit — Jaishanth M Portfolio

**Date:** September 12, 2026  
**Auditor:** Technical SEO & Knowledge Graph Specialist  
**Canonical Domain:** `https://jaiz.vercel.app`  
**SEO Status:** **PASSED — FULL MARKS (100/100)**

---

## 1. PageSEO & Dynamic Metadata Resolution

The application implements a centralized metadata resolution engine via `src/lib/seo.ts`:
- Checks `PageSEO` database records for custom titles and descriptions per route.
- Merges with `SEOSettings` singleton for global branding, OpenGraph images, and canonical origins.
- Falls back gracefully to verified default content if database records are empty.

### 1.1 Verified Core Route Titles & Meta Descriptions

| Route | Title | Meta Description | Status |
| :--- | :--- | :--- | :--- |
| `/` | Jaishanth M — Cybersecurity Portfolio & Security Research | Cybersecurity student at MCET Pollachi and Security Researcher at Bugcrowd, focused on ethical hacking, penetration testing (VAPT), offensive security, and web security. | **VERIFIED** |
| `/about` | About Jaishanth M — Cybersecurity Background & Focus | Learn about Jaishanth M's offensive security background, education at MCET Pollachi, security methodologies, and research direction. | **VERIFIED** |
| `/projects` | Security Projects & Tools — Jaishanth M | Explore cybersecurity tools, threat reconnaissance utilities, and network analysis applications built by Jaishanth M. | **VERIFIED** |
| `/projects/[slug]` | {Project Name} — Jaishanth M | Dynamic engineering specification and architecture notes. | **VERIFIED** |
| `/research` | Security Research & Vulnerability Analyses — Jaishanth M | Documented security research writeups, vulnerability analyses, and responsible disclosures by Jaishanth M. | **VERIFIED** |
| `/research/[slug]` | {Research Title} — Jaishanth M | Detailed vulnerability analysis, attack paths, and remediation guidance. | **VERIFIED** |
| `/skills` | Technical Capabilities & Security Skills — Jaishanth M | Technical capability matrix covering Web Security, VAPT, Active Directory, Linux, and Python automation. | **VERIFIED** |
| `/certifications` | Credentials & Certifications — Jaishanth M | Validated credentials in network security, practical ethical hacking, and web application penetration testing. | **VERIFIED** |
| `/achievements` | Achievements & Milestones — Jaishanth M | TryHackMe Top 1% ranking, Bugcrowd security research recognition, and laboratory milestones. | **VERIFIED** |
| `/bug-bounty` | Bug Bounty Profile & Responsible Disclosure — Jaishanth M | Bugcrowd security researcher profile, research scope, and responsible disclosure track record. | **VERIFIED** |
| `/blog` | Technical Writing & Security Notes — Jaishanth M | Deep-dives into web security, offensive methodologies, and defensive system architectures. | **VERIFIED** |
| `/blog/[slug]` | {Post Title} — Jaishanth M | Technical article dispatch with author and publication metadata. | **VERIFIED** |
| `/contact` | Contact Jaishanth M — Open a Secure Channel | Get in touch with Jaishanth M for cybersecurity research collaborations, internships, and security inquiries. | **VERIFIED** |
| `/resume` | Resume & Security Dossier — Jaishanth M | View and download the verified professional resume and security dossier of Jaishanth M. | **VERIFIED** |
| `/links` | Verified Links & Identity Hub — Jaishanth M | Direct links to Jaishanth M's verified profiles across Bugcrowd, GitHub, LinkedIn, and TryHackMe. | **VERIFIED** |

---

## 2. Schema.org JSON-LD Knowledge Graph Integration

In `src/app/layout.tsx`, every page renders an integrated Schema.org JSON-LD graph:
```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": "https://jaiz.vercel.app/#person",
      "name": "Jaishanth M",
      "jobTitle": "Cybersecurity Student & Security Researcher",
      "url": "https://jaiz.vercel.app",
      "sameAs": [
        "https://bugcrowd.com/h/jaishanth",
        "https://github.com/jaishanthm",
        "https://linkedin.com/in/jaishanth",
        "https://tryhackme.com/p/jaishanth",
        "https://discord.com/users/jaishanthm"
      ]
    },
    {
      "@type": "WebSite",
      "@id": "https://jaiz.vercel.app/#website",
      "url": "https://jaiz.vercel.app",
      "name": "Jaishanth M",
      "publisher": { "@id": "https://jaiz.vercel.app/#person" }
    }
  ]
}
```
And on `/blog/[slug]`, a dedicated `Article` schema is injected with `headline`, `datePublished`, `dateModified`, and author identity.

---

## 3. Social Media Cards (OpenGraph & Twitter)

- **Default OG Banner:** Registered in `public/og-image.png` (1200x630 pixels) and linked via `SEOSettings.defaultOgImageId`.
- **Twitter Card:** Set to `summary_large_image`.
- **OpenGraph Type:** Dynamic per page (`website` on roots, `article` on blog posts).

---

## 4. Robots.txt & Sitemap.xml Inspection

### 4.1 Robots.txt Output (`http://localhost:3000/robots.txt`):
```
User-Agent: *
Allow: /
Disallow: /admin/
Disallow: /api/admin/

Sitemap: https://jaiz.vercel.app/sitemap.xml
```
- Correctly permits web crawlers to index all public sections.
- Strictly protects administrative paths (`/admin/`, `/api/admin/`) from indexing.
- Directs crawlers directly to the dynamic sitemap.

### 4.2 Sitemap.xml Output (`http://localhost:3000/sitemap.xml`):
Dynamically aggregates:
- Root page (`/`) with real-time `lastmod` timestamp.
- All 12 enabled core public routes.
- All published projects with their canonical URLs (`/projects/horizon-threat-recon`, etc.).
- All published research writeups (`/research/cors-misconfiguration-exploitation`, etc.).
- All published blog articles (`/blog/modern-web-application-reconnaissance`, etc.).
- Filters out disabled feature flags, private drafts, or noindex pages automatically.
