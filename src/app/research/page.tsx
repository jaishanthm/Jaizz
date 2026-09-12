import Link from "next/link";
import { notFound } from "next/navigation";
import { isFeatureEnabled } from "@/lib/feature-flags";
import { getPublishedResearch } from "@/lib/data/research";
import { resolvePageSEO } from "@/lib/seo";

export const revalidate = 3600;

export async function generateMetadata() {
  return resolvePageSEO(
    "/research",
    "Security Research & Vulnerability Disclosures — Jaishanth M",
    "Documented vulnerability analyses, attack path investigations, and responsible disclosures by Jaishanth M."
  );
}

export default async function ResearchPage() {
  if (!(await isFeatureEnabled("research"))) notFound();
  const research = await getPublishedResearch();

  return (
    <main className="max-w-6xl mx-auto px-6 py-16">
      {/* Header breadcrumb & cyber tag */}
      <div className="flex items-center gap-3 mb-6">
        <span className="text-xs font-mono text-[var(--color-cool-cyan)] tracking-widest uppercase">
          // INTEL // VULNERABILITY RESEARCH
        </span>
        <div className="h-[1px] flex-1 bg-gradient-to-r from-[var(--color-border-glow)] to-transparent" />
      </div>

      <div className="mb-12">
        <h1 className="font-heading text-4xl sm:text-5xl font-extrabold text-[var(--color-text-primary)] mb-4">
          Security Research & Disclosures
        </h1>
        <p className="text-base sm:text-lg text-[var(--color-text-secondary)] max-w-3xl leading-relaxed font-sans">
          Technical vulnerability assessments, attack path simulations, and responsible disclosures across modern web architectures, authentication protocols, and Active Directory domains.
        </p>
      </div>

      <div className="space-y-8">
        {research.map((item) => (
          <div
            key={item.id}
            className="glass-panel-elevated p-8 sm:p-10 rounded-2xl border border-[var(--color-border-glow)] hover:border-[var(--color-cool-cyan)] transition-all group"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
                <span className="px-2.5 py-1 rounded bg-[rgba(0,229,255,0.12)] text-[var(--color-cool-cyan)] border border-[rgba(0,229,255,0.3)] font-semibold">
                  {item.disclosureStatus === "PUBLISHED" ? "RESPONSIBLE DISCLOSURE" : item.disclosureStatus}
                </span>
                {item.researchType && (
                  <span className="px-2 py-0.5 rounded bg-[rgba(11,17,32,0.8)] text-[var(--color-text-muted)] border border-[var(--color-border)]">
                    {item.researchType}
                  </span>
                )}
              </div>
              <span className="font-mono text-xs text-[var(--color-text-muted)]">
                {new Date(item.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
              </span>
            </div>

            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[var(--color-text-primary)] mb-4 group-hover:text-[var(--color-cool-cyan)] transition-colors leading-snug">
              <Link href={`/research/${item.slug}`}>
                {item.title}
              </Link>
            </h2>

            <p className="text-base text-[var(--color-text-secondary)] leading-relaxed mb-6 font-sans">
              {item.summary}
            </p>

            {item.targetContext && (
              <div className="mb-6 font-mono text-xs text-[var(--color-text-muted)] p-3 rounded-xl bg-[rgba(11,17,32,0.6)] border border-[var(--color-border)]">
                <span className="text-[var(--color-electric-blue)] font-bold">TARGET_SURFACE:</span> {item.targetContext}
              </div>
            )}

            <div className="pt-4 border-t border-[var(--color-border-subtle)] flex items-center justify-between">
              <Link
                href={`/research/${item.slug}`}
                className="btn-magnetic px-5 py-2.5 rounded-xl text-xs font-mono font-medium text-white bg-[var(--color-electric-blue)] hover:bg-[var(--color-primary-hover)] flex items-center gap-2 shadow-[0_0_15px_rgba(43,108,255,0.3)] transition-all"
              >
                <span>Read Full Technical Breakdown</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>

              {item.tags && item.tags.length > 0 && (
                <div className="hidden sm:flex items-center gap-2 font-mono text-xs text-[var(--color-text-muted)]">
                  {item.tags.slice(0, 3).map((t) => (
                    <span key={t.id} className="px-2 py-0.5 rounded bg-[rgba(11,17,32,0.8)]">
                      #{t.tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {research.length === 0 && (
          <p className="text-sm font-mono text-[var(--color-text-muted)]">
            No published security research entries available.
          </p>
        )}
      </div>
    </main>
  );
}
