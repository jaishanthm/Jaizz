import { notFound } from "next/navigation";
import { isFeatureEnabled } from "@/lib/feature-flags";
import { getVisibleExperience } from "@/lib/data/credentials";
import { resolvePageSEO } from "@/lib/seo";

export const revalidate = 3600;

export async function generateMetadata() {
  return resolvePageSEO(
    "/experience",
    "Security Experience & Research — Jaishanth M",
    "Professional security experience, vulnerability research engagements, and active Bugcrowd research by Jaishanth M."
  );
}

export default async function ExperiencePage() {
  if (!(await isFeatureEnabled("experience"))) notFound();
  const experience = await getVisibleExperience();

  return (
    <main className="max-w-4xl mx-auto px-6 py-16">
      {/* Header breadcrumb & cyber tag */}
      <div className="flex items-center gap-3 mb-6">
        <span className="text-xs font-mono text-[var(--color-cool-cyan)] tracking-widest uppercase">
          // ENGAGEMENTS // PROFESSIONAL EXPERIENCE
        </span>
        <div className="h-[1px] flex-1 bg-gradient-to-r from-[var(--color-border-glow)] to-transparent" />
      </div>

      <div className="mb-12">
        <h1 className="font-heading text-4xl sm:text-5xl font-extrabold text-[var(--color-text-primary)] mb-4">
          Experience & Engagements
        </h1>
        <p className="text-base sm:text-lg text-[var(--color-text-secondary)] max-w-2xl leading-relaxed font-sans">
          Track record of offensive security engagements, vulnerability assessments, and active participation in responsible disclosure ecosystems.
        </p>
      </div>

      <div className="space-y-8">
        {experience.map((e) => {
          const start = e.startDate
            ? new Date(e.startDate).toLocaleDateString("en-US", { month: "short", year: "numeric" })
            : "";
          const end = e.current
            ? "Present"
            : e.endDate
            ? new Date(e.endDate).toLocaleDateString("en-US", { month: "short", year: "numeric" })
            : "Present";
          const dateRange = start && end ? `${start} — ${end}` : start || end;

          return (
            <div
              key={e.id}
              className="glass-panel-elevated p-8 rounded-2xl border border-[var(--color-border)] hover:border-[var(--color-border-glow)] transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4">
                <div>
                  <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-[rgba(43,108,255,0.15)] text-[var(--color-cool-cyan)] text-xs font-mono mb-2">
                    {e.current ? "ACTIVE ENGAGEMENT" : "COMPLETED"}
                  </div>
                  <h2 className="font-heading text-2xl font-bold text-[var(--color-text-primary)]">
                    {e.role}
                  </h2>
                  <div className="text-base font-semibold text-[var(--color-electric-blue)] mt-0.5">
                    {e.organization} {e.location ? `· ${e.location}` : ""}
                  </div>
                </div>

                <div className="font-mono text-xs text-[var(--color-text-muted)] sm:text-right">
                  {dateRange}
                </div>
              </div>

              {e.description && (
                <p className="text-base text-[var(--color-text-secondary)] leading-relaxed mb-6 font-sans">
                  {e.description}
                </p>
              )}

              {e.achievements && e.achievements.length > 0 && (
                <div className="mb-6 space-y-2">
                  <div className="font-mono text-xs uppercase text-[var(--color-cool-cyan)] mb-2">
                    KEY MILESTONES & ACTIVITIES:
                  </div>
                  <ul className="space-y-2 font-sans text-sm text-[var(--color-text-secondary)]">
                    {e.achievements.map((h) => (
                      <li key={h.id} className="flex items-start gap-2">
                        <span className="text-[var(--color-cool-cyan)] font-mono">&gt;</span>
                        <span>{h.text}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {e.organizationUrl && (
                <div className="pt-4 border-t border-[var(--color-border-subtle)]">
                  <a
                    href={e.organizationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-mono text-[var(--color-cool-cyan)] hover:underline"
                  >
                    <span>Organization Verification: {e.organizationUrl}</span>
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              )}
            </div>
          );
        })}

        {experience.length === 0 && (
          <p className="text-sm font-mono text-[var(--color-text-muted)]">
            No experience entries published yet.
          </p>
        )}
      </div>
    </main>
  );
}
