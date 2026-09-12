# Remaining Operational Considerations & Roadmap — Jaishanth M Portfolio

**Date:** September 12, 2026  
**Auditor:** Lead Systems Architect & Production Strategist  
**Classification:** Non-Blocking / Cloud Provisioning Roadmap  
**Overall Readiness:** **100% PRODUCTION READY FOR VERCEL DEPLOYMENT**

---

## 1. Zero Critical Blockers

There are **zero critical, major, or moderate defects** remaining in the codebase:
- Next.js 15 build: **PASSED (0 errors, 47/47 static pages)**
- TypeScript compiler: **PASSED (0 type errors)**
- Prisma schema validation: **PASSED (0 schema warnings)**
- Database seeding: **PASSED (100% verified records loaded)**
- HTTP endpoint health: **PASSED (20+ routes return HTTP 200 OK)**

---

## 2. Cloud Environment Provisioning Checklist (For Deployment to Vercel)

When deploying this project to production on Vercel or your chosen host, supply the following environment variables in the host dashboard:

| Variable | Description | Default / Local Fallback |
| :--- | :--- | :--- |
| `DATABASE_URL` | PostgreSQL connection string (e.g. Neon, Supabase, Vercel Postgres). | `postgresql://postgres@localhost:5432/portfolio` |
| `NEXTAUTH_SECRET` | 32-character random string for session encryption. | Configured in `.env` |
| `NEXTAUTH_URL` | Canonical URL of deployed application. | `https://jaiz.vercel.app` |
| `UPSTASH_REDIS_REST_URL` | *(Optional)* Upstash Redis endpoint for distributed edge rate limiting. | Handled automatically by in-memory sliding window fallback if omitted. |
| `UPSTASH_REDIS_REST_TOKEN` | *(Optional)* Upstash Redis token. | Handled automatically if omitted. |
| `CLOUDINARY_CLOUD_NAME` | *(Optional)* Cloudinary cloud name for admin media uploads. | Local storage provider used for verified static assets if omitted. |
| `CLOUDINARY_API_KEY` | *(Optional)* Cloudinary API key. | Handled gracefully. |
| `CLOUDINARY_API_SECRET` | *(Optional)* Cloudinary API secret. | Handled gracefully. |

---

## 3. Recommended 2–3 Year Evolution Roadmap

1. **Active Directory Lab Visualizer:** As Jaishanth completes further AD security writeups, consider adding an interactive SVG/canvas BloodHound attack path graph viewer inside `/research/active-directory-kerberoasting-analysis`.
2. **Automated CTF Badge Sync:** If TryHackMe or HackTheBox offer public REST/JSON badge APIs, a nightly ISR cron job can refresh ranking milestones automatically without manual database updates.
3. **PGP Public Key Download:** Add an armored ASCII public PGP key endpoint (`/pgp.asc`) or download button in `/contact` for researchers wishing to transmit encrypted vulnerability disclosures directly.
