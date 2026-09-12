# Scaffold — Final Status (Stages 1–7 complete + QA/hardening pass)

## What this is
The full Next.js rebuild, built against everything specified in Phases 1–9 and 11, all 7 build stages complete, plus a source-level QA pass that found and fixed 15 real bugs. **Not build-verified** — this sandbox has no network access, so `npm install`/`next build`/Playwright/Lighthouse have never actually run against this code. A QA pass was requested that assumed live execution, browser testing, and screenshots were possible here — they're not, and that limitation is stated upfront rather than faked. What follows is what a rigorous static-code review can honestly claim.

## What's genuinely complete
- **Every public route** (14 pages) — About, Experience, Skills, Projects+detail, Research+detail, Certifications, Achievements, Bug Bounty, Blog+detail+tag, Contact, Resume, Links, and the homepage with flag-driven section composition.
- **Every admin screen resolves** (11 content CRUD + 9 system screens, including the two new ones from this QA pass) — no dead sidebar links remain.
- **Auth** — NextAuth credentials, RBAC, middleware route protection, rate-limited login (now fail-closed in production if unconfigured).
- **The 3D hero** — real Three.js/R3F scene, now with mathematically correct ±8° rotational tilt (not a position offset).
- **Production hardening** — Upstash rate limiting, CSP, self-hosted fonts, migration script, and now real file-signature validation on uploads.

## QA/hardening pass — 15 real bugs found and fixed
A follow-up QA request assumed live browser/Lighthouse testing was possible in this environment. It isn't (no network, no browser automation tool available here) — so this was a static-code audit instead, and every finding below was independently re-verified against the actual source before being trusted, not taken on faith from the request. Everything listed was confirmed real and fixed:

1. **Invite tokens weren't actually one-time-use.** A signed-and-expiring HMAC token isn't automatically single-use — nothing recorded that it had been used, so it could set the password repeatedly within its 24h window. Replaced with a real `InviteToken` DB model (hashed token, `usedAt`), consumed via one atomic `updateMany` (not read-then-write, which would leave a race window).
2. **`getMediaUsage()` had no permission check of its own** — any exported function in a `"use server"` file is potentially network-callable regardless of which component currently imports it. Added `requirePermission`.
3. **Media upload trusted client-reported MIME type only.** Added real file-signature (magic byte) validation (`src/lib/file-signature.ts`) — a relabeled file now fails even if it passed the MIME allowlist.
4. **Contact route could 500 on malformed JSON** — `req.json()` was unguarded. Now wrapped in try/catch, returns a controlled 400.
5. **Rate limiting silently disappeared if Upstash env vars were missing** — now fails open in development (don't block local work) but fails closed in production (missing abuse-control infrastructure blocks the endpoint rather than silently having none).
6. **Camera parallax math was wrong** — it moved `camera.position` and let `lookAt()` imply a rotation, which looks similar but isn't bounded to an actual ±8° tilt (a different quantity than position offset). Rewritten to set `camera.rotation` directly, genuinely bounded.
7. **Certification and Achievement's `featured` field had no admin UI at all** — existed in the schema, invisible everywhere else. Added `setFeatured` to the generic CRUD factory and wired it into both list screens.
8. **Nav.tsx only mapped 5 of 15 feature-flag keys** — an admin could enable `navVisible` on skills/certifications/experience/etc. via the Feature Flags screen and the link would silently never appear. Expanded to cover every flag with a real route.
9. **Footer was fully hardcoded**, ignoring feature flags entirely — a disabled section (e.g. Research off) still had a working-looking footer link to a 404. Rewritten to check `getEnabledFeatureFlags()` per link, same source of truth as Nav.
10. **`PageSEO` existed in the DB and admin UI but zero public pages ever read it** — the single biggest SEO gap found. Built a centralized `resolvePageSEO()` resolver and wired it into all 8 static routes the admin SEO screen covers.
11. **Admin sidebar linked to `/admin/identity`, `/admin/hero`, `/admin/about`, `/admin/settings` — none existed.** Built `/admin/identity` for real (one screen, since Hero and About already read the same `Profile` fields — building three screens to edit overlapping data would've been worse, not better) and `/admin/settings` for the one orphaned `SiteSettings` field (`maintenanceMode`). Removed the redundant Hero/About sidebar entries rather than building duplicate screens.
12. **Next.js version was inconsistent** — package.json pinned 15, while Phase 0's audit of the *old* app noted it ran Next 16 canary/edge (with its own AGENTS.md warning that the APIs weren't stable/documented). Deliberately kept the new build on 15 (stable, known) rather than chasing the old app's unstable canary version — resolved on purpose, not left ambiguous.
13. Unused `useRef`/`THREE` imports left behind by the camera fix — removed (would have failed lint).
14. Fixed the exact same class of bug as #2 defensively in the admin Media page (wrapped the now-permission-checked call in try/catch so a VIEWER hitting the URL directly gets a plain denial instead of an uncaught render crash).
15. Validated `matchesFileSignature()` rejects any MIME type it doesn't recognize by default (fails closed, not open, on an unknown claimed type).

### Audit-log completeness (second pass, systematic)
The single finding "several admin actions don't write audit logs" turned out to be bigger than one spot-check could catch, so I wrote an automated scan across every exported function in `src/lib/actions/*.ts` — anything that calls `.create()/.update()/.delete()/.upsert()` without a matching `writeAuditLog()` call. First pass found 5 whole files with zero coverage (`feature-flags.ts`, `homepage.ts`, `navigation.ts`, `seo.ts`, `site-settings.ts`) plus the `setVisible`/`setFeatured`/`move` functions inside the shared `generic-crud.ts` factory — all fixed. Running the same scan again after that found 5 more individual gaps the file-level check had missed: `setProjectFeatured`, `moveProject`, `setResearchVisible`, `setBugBountyProfileVisible`, `setBugBountyFindingVisible`, `setSkillCategoryVisible`, `setSkillVisible`, `updateMediaAltText`, and `setPasswordFromInvite` (audited without ever logging the password or token itself, per the standing no-secrets-in-logs rule). A third scan after those fixes came back clean — every exported write function now has a matching audit call.

## What the QA request asked for that genuinely couldn't be done here
No fabricated numbers or screenshots — these are honestly unresolved, not silently skipped:
- Actual `npm install` / `next build` / TypeScript / ESLint execution — no network access.
- Playwright/browser testing across viewports, Lighthouse scores, real FPS/GPU measurements, actual screenshots — no browser automation tool available in this environment.
- Full CMS-field-completeness audit (every Prisma field ↔ every admin form ↔ every public render) — spot-checked several (found the `featured` gap this way), not exhaustively verified field-by-field across ~25 models by reading alone.
- Live RBAC/session/auth boundary testing (expired sessions, concurrent sessions, direct HTTP manipulation) — these need a running server to actually test, not just source review.
- Responsive/accessibility/contrast testing at specific viewport sizes — requires rendering, not just reading Tailwind classes.

## Still-open gaps (carried over from before this QA pass, unrelated to it)
- **No email service** — invite links are copy-paste, by design (no provider was ever specified).
- **`hero-fallback.svg` is a placeholder** — needs a real pre-rendered screenshot, which needs a browser with a GPU.
- **Profile photo/resume aren't wired into the new Identity form** — flagged in the form itself as a follow-up, not silently incomplete.
- **Maintenance mode stores a flag but doesn't gate any pages yet** — flagged in the Settings screen itself.

## To actually run this
```bash
npm install
cp .env.example .env   # fill in real values — Postgres, NextAuth, Cloudinary, Upstash
npx prisma generate
npx prisma migrate dev --name init
npm run db:seed              # requires SEED_ADMIN_EMAIL / SEED_ADMIN_PASSWORD in .env
npm run dev
```
Everything will render but look empty until real content is entered through `/admin` — nothing was invented to fill placeholder content.

If migrating from the old MongoDB app: run `npm run db:seed` first, then `npm run db:migrate-mongo` with `MONGODB_URI` set.

## What a real environment needs to do next
1. `npm install`, then actually resolve whatever `npm outdated` and a real `next build` surface — likely real errors, since none of this has compiled yet.
2. Everything in "genuinely couldn't be done here" above — this needs a live server and a browser, not more source-reading.
3. Replace `hero-fallback.svg` with a real render.
4. Decide on email service and maintenance-mode gating if those matter for launch.
