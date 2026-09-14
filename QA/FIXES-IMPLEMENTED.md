# Fixes Implemented & Architectural Changelog — Jaishanth M Portfolio

**Date:** September 12, 2026  
**Auditor:** Systems Architect & Lead Software Engineer  
**Scope:** Complete changelog of defects, schema drift, and styling issues resolved during the rebuild.

---

## 1. Complete Changelog of Implemented Fixes

### 1.1 Database & Seeding Rectification
- **FIX-DB-01: SocialLink Upsert Target**  
  *Issue:* `prisma/seed.ts` attempted to upsert `SocialLink` by `platform`, which had no unique constraint in `schema.prisma`.  
  *Resolution:* Refactored upsert to use deterministic IDs (`where: { id: s.id }`) and removed non-existent `username` attribute.
- **FIX-DB-02: BugBounty Schema Synchronization**  
  *Issue:* Seed referenced `visibility`, `sortOrder`, and `hallOfFame` on `BugBountyProfile` and `BugBountyFinding`.  
  *Resolution:* Updated to exact schema fields: `visible: true`, `order: 0`, `isHallOfFame: true`, `isAcknowledgement: true`, and relation key `bugBountyProfileId`.
- **FIX-DB-03: Certification Image Relation Alignment**  
  *Issue:* Seed targeted `certificateMediaId` on `Certification`.  
  *Resolution:* Aligned to schema field `imageMediaId` linking to `Media.id`.
- **FIX-DB-04: Education URL Alignment**  
  *Issue:* Seed targeted `website` on `Education`.  
  *Resolution:* Aligned to schema field `websiteUrl`.
- **FIX-DB-05: SkillCategory & Skill Ordering**  
  *Issue:* Seed passed `sortOrder` to `SkillCategory` and `Skill`.  
  *Resolution:* Aligned to schema field `order`.
- **FIX-DB-06: Research Date & Disclosure Enum Alignment**  
  *Issue:* `Research` seed had missing required `date` field and invalid enum strings (`"RESPONSIBLE_DISCLOSURE"`).  
  *Resolution:* Provided valid `date: new Date(...)` and valid `DisclosureStatus` enum value `"PUBLISHED"`.

### 1.2 Layout & DOM Structure Fixes
- **FIX-DOM-01: Missing `<body>` Tag in `src/app/layout.tsx`**  
  *Issue:* Webpack failed to compile with `x Expression expected / Unterminated regexp literal` because the opening `<body>` tag was omitted between `<html>` and `{children}`.  
  *Resolution:* Inserted proper semantic `<body className="font-sans antialiased text-[var(--color-text-primary)] bg-[var(--color-bg-primary)] min-h-screen relative ...">`.

### 1.3 Component & Styling Upgrades
- **FIX-UI-01: Two-Column Spatial Hero Section**  
  *Issue:* `HeroSection.tsx` was a rudimentary centered box.  
  *Resolution:* Rebuilt into an asymmetric two-column spatial command center with status pulsar, Space Grotesk typography, Kali terminal simulation, magnetic buttons, and 3D HUD telemetry frame.
- **FIX-UI-02: Editorial Homepage Showcase**  
  *Issue:* `HomepageSections.tsx` contained plain text card placeholders.  
  *Resolution:* Rebuilt all 11 sections with cyber tags, verified badges, multi-column asymmetric grids, cert thumbnails, and zero vanity progress bars.
- **FIX-UI-03: Dynamic Glass Navigation & Focus Trap**  
  *Issue:* `Nav.tsx` mapped only 5 of 15 feature flags and lacked accessible mobile drawer styling.  
  *Resolution:* Upgraded to floating glass header with call-sign branding, complete route mapping, and full keyboard focus trapping (Escape / Tab cycling) in `MobileNav.tsx`.
- **FIX-UI-04: Multi-Column Sized Footer**  
  *Issue:* Footer was hardcoded and risked dead links.  
  *Resolution:* Rebuilt with Explore, Credentials, and Connect columns, checking `getEnabledFeatureFlags()` to eliminate dead links dynamically.
- **FIX-UI-05: High-Fidelity SVG Fallback**  
  *Issue:* `public/hero-fallback.svg` was a rough placeholder polygon.  
  *Resolution:* Replaced with high-fidelity vector graphic showing crystalline icosahedron security core, concentric radar rings, and telemetry markers.

### 1.4 Route Upgrades
- **FIX-ROUTE-01:** Upgraded `/about` with formal researcher dossier and academic foundations.
- **FIX-ROUTE-02:** Upgraded `/projects` and `/projects/[slug]` with engineering specifications and GitHub links.
- **FIX-ROUTE-03:** Upgraded `/research` and `/research/[slug]` with disclosure statuses and remediation callouts.
- **FIX-ROUTE-04:** Upgraded `/skills` with 3-domain capability matrix (no fake percentages).
- **FIX-ROUTE-05:** Upgraded `/certifications` with image thumbnails and credential verification.
- **FIX-ROUTE-06:** Upgraded `/achievements` with competitive ranking honors.
- **FIX-ROUTE-07:** Upgraded `/bug-bounty` with Bugcrowd profile and disclosed finding details.
- **FIX-ROUTE-08:** Upgraded `/blog` and `/blog/[slug]` with dispatches and Schema.org JSON-LD.
- **FIX-ROUTE-09:** Upgraded `/contact` with encrypted channel framing and verified SLA.
- **FIX-ROUTE-10:** Upgraded `/resume` with embedded PDF viewer and download portal.
- **FIX-ROUTE-11:** Upgraded `/links` with identity consolidation and reciprocal `rel="me"`.
- **FIX-ROUTE-12:** Upgraded `/experience` with operational milestones.

### 1.5 Rate Limiting & Resilience
- **FIX-SEC-01: Rate Limiter Fallback**  
  *Issue:* `src/lib/rate-limit.ts` failed closed on production mode when Upstash Redis was unprovisioned, returning HTTP 429 to valid contact form submissions.  
  *Resolution:* Implemented an in-memory sliding window fallback map that enforces abuse protection (5 submissions / hour) without breaking contact functionality when Redis credentials are not configured.
