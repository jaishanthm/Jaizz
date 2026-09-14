# QA Baseline Audit Report — Jaishanth M Professional Portfolio Rebuild

**Date:** September 12, 2026  
**Auditor:** Autonomous Systems & QA Specialist  
**Target Application:** Jaishanth M Professional Portfolio (`https://jaiz.vercel.app`)  
**Scope:** Forensic review of legacy codebase (`portfolio-main (1)`), visual reference (`prism-web-solutions-main`), and initial scaffold shortcomings.

---

## 1. Executive Summary

The initial audit of the original portfolio codebase and early scaffold revealed severe structural, aesthetic, and functional deficiencies. The existing user interface suffered from raw, unpolished navigation, flat visual hierarchy, broken responsive states, lack of depth, unvalidated placeholder metrics, and schema misalignments between Prisma models and data access layers.

This baseline document records the state of the system prior to the comprehensive rebuild, identifying every structural flaw that needed remediation.

---

## 2. Forensic Analysis of Legacy System (`portfolio-main (1)`)

### 2.1 Visual & Interactive Deficiencies
- **Flat Visual Hierarchy:** Lack of atmospheric depth, no modern dark theme system tokens, and generic high-contrast colors without cohesive palette unity.
- **Unfinished Navigation:** Basic unstyled anchor links with no visual feedback, active state indicators, or keyboard accessibility.
- **Broken Mobile Navigation:** No full-screen or drawer menu; navigation items wrapped awkwardly and collided with hero text on screens narrower than 768px.
- **Absence of 3D Canvas / Constellation:** The UI lacked interactive depth. Backgrounds were either flat black or generic CSS gradients with no interactive particle constellations or mouse parallax.
- **Generic Aesthetics:** Looked like a beginner student template rather than an elite cybersecurity researcher and offensive systems engineer platform.

### 2.2 Content & Identity Deficiencies
- **Risk of Unverified Data:** Placeholders with arbitrary skill percentage bars (e.g., "Python 95%", "Penetration Testing 90%"), which violate professional cybersecurity standards.
- **Missing Asset Linkages:** Verified credentials (Cisco Network Defense, CEH Practical, Web Pentest certificates) were present in public directories but unconnected to data models or structured views.
- **Incomplete Research Documentation:** Real vulnerability writeups (CORS misconfiguration, Kerberoasting) lacked disclosure classification tags, target surface contexts, and formal remediation guidance.

### 2.3 Architectural & Scaffold Deficiencies
- **Prisma Schema Field Mismatches:**
  - `SocialLink` lacked unique constraint on `platform` yet seed attempted `where: { platform }`, causing crashes.
  - `BugBountyProfile` and `BugBountyFinding` models referenced non-existent fields (`visibility`, `sortOrder`, `hallOfFame`, `profileId`).
  - `Certification` model referenced `imageMediaId` while seed expected `certificateMediaId`.
  - `Education` model referenced `websiteUrl` while seed provided `website`.
- **Database Connection Gaps:** SQLite had been tentatively used in prior iterations, creating concurrency locks and schema drift against the production PostgreSQL requirement.
- **Feature Flag & Navigation Desynchronization:** 10 of 15 feature flags lacked route mappings in `Nav.tsx`, causing flags toggled "on" in the database to silently disappear from the navigation bar.
- **Production Server Rate-Limiting Lockout:** `src/lib/rate-limit.ts` failed closed on production without Upstash Redis, rendering the contact endpoint non-functional in non-cloud environments.
- **HTML DOM Nesting Error:** `src/app/layout.tsx` was missing the opening `<body>` tag, producing hydration mismatches and parser warnings.

---

## 3. Baseline Audit Checklist Matrix

| Dimension | Baseline State | Severity | Target Requirement |
| :--- | :--- | :--- | :--- |
| **Theme & Tokens** | Fragmented inline hex codes | HIGH | Centralized CSS variables (`#050816`, `#0B1120`, `#2B6CFF`, `#00E5FF`) |
| **Hero Section** | Basic centered text box | HIGH | Two-column spatial layout, live HUD telemetry, 3D Signal Lattice |
| **Identity Integrity** | Unlinked local images, risk of vanity metrics | CRITICAL | 100% verified data, zero fake % bars, MCET Pollachi + Bugcrowd + THM Top 1% |
| **3D Rendering** | Static image or unoptimized WebGL | HIGH | Deferred idle-mounted Three.js/Fiber with ±8° camera parallax & SVG fallback |
| **Background Engine** | Static background | MEDIUM | Interactive 2D canvas constellation with mouse spotlight and 3D card tilt |
| **Navigation** | Incomplete flag mapping, no mobile drawer | HIGH | Dynamic floating glass header, full route mapping, accessible mobile drawer |
| **Standalone Routes** | Plain text stubs | HIGH | Full editorial layouts for all 12 core routes with metadata & JSON-LD |
| **Security Headers** | Inconsistent headers | HIGH | CSP, HSTS, X-Frame-Options DENY, X-Content-Type-Options nosniff |
| **Database & Seed** | Seed crashes due to schema drift | CRITICAL | 100% clean PostgreSQL seed with relational integrity and zero crashes |
| **Build Stability** | Webpack syntax error in layout.tsx | CRITICAL | Clean Next.js 15 production build (`47/47` static pages generated) |

---

## 4. Conclusion & Rebuild Directives

The baseline clearly established that superficial visual tweaks could not solve the fundamental architectural and design deficiencies. A ground-up reconstruction of layout components, data seeding scripts, styling systems, and interactive canvases was mandated. All fixes detailed in this report have been executed and verified in subsequent audit stages.
