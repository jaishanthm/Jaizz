import { notFound } from "next/navigation";
import { isFeatureEnabled } from "@/lib/feature-flags";
import { getVisibleBugBountyProfiles } from "@/lib/data/credentials";
import { resolvePageSEO } from "@/lib/seo";

export const revalidate = 3600;

export async function generateMetadata() {
  return resolvePageSEO(
    "/bug-bounty",
    "Bug Bounty Profile & Responsible Disclosure — Jaishanth M",
    "Active security researcher profile across Bugcrowd, responsible vulnerability disclosures, and hall of fame recognitions."
  );
}

export default async function BugBountyPage() {
  if (!(await isFeatureEnabled("bug_bounty"))) notFound();
  const profiles = await getVisibleBugBountyProfiles();

  return (
    <main className="max-w-5xl mx-auto px-6 py-16">
      {/* Header breadcrumb & cyber tag */}
      <div className="flex items-center gap-3 mb-6">
        <span className="text-xs font-mono text-[var(--color-cool-cyan)] tracking-widest uppercase">
          // RESPONSIBLE DISCLOSURE // BUG BOUNTY
        </span>
        <div className="h-[1px] flex-1 bg-gradient-to-r from-[var(--color-border-glow)] to-transparent" />
      </div>

      <div className="mb-12">
        <h1 className="font-heading text-4xl sm:text-5xl font-extrabold text-[var(--color-text-primary)] mb-4">
          Bug Bounty & Disclosures
        </h1>
        <p className="text-base sm:text-lg text-[var(--color-text-secondary)] max-w-3xl leading-relaxed font-sans">
          Participating in responsible disclosure programs to ethically audit web applications, APIs, and business logic perimeters before adversaries can exploit them.
        </p>
      </div>

      <div className="space-y-8">
        {profiles.map((p) => (
          <div
            key={p.id}
            className="glass-panel-elevated p-8 sm:p-10 rounded-2xl border border-[var(--color-border-glow)]"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-[var(--color-border-subtle)]">
              <div>
                <span className="font-mono text-xs text-[var(--color-cool-cyan)] uppercase">
                  PLATFORM: {p.platform}
                </span>
                <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[var(--color-text-primary)] mt-1">
                  @{p.researcherName || "jaishanth"}
                </h2>
              </div>
              <a
                href={p.profileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-magnetic px-5 py-2.5 rounded-xl text-xs font-mono text-[var(--color-cool-cyan)] glass-card border border-[var(--color-electric-blue)] hover:bg-[rgba(43,108,255,0.2)] transition-all inline-flex items-center gap-2 w-fit"
              >
                <span>View Bugcrowd Profile</span>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>

            {p.description && (
              <p className="text-sm sm:text-base text-[var(--color-text-secondary)] leading-relaxed mb-8 font-sans">
                {p.description}
              </p>
            )}

            {p.findings && p.findings.length > 0 && (
              <div>
                <h3 className="font-mono text-xs uppercase tracking-wider text-[var(--color-cool-cyan)] mb-4">
                  // DISCLOSED FINDINGS & ACKNOWLEDGEMENTS
                </h3>
                <div className="space-y-4">
                  {p.findings.map((f) => (
                    <div
                      key={f.id}
                      className="glass-card p-6 rounded-xl border border-[var(--color-border)] hover:border-[var(--color-border-glow)] transition-all"
                    >
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-3">
                        <h4 className="font-heading text-lg font-bold text-[var(--color-text-primary)]">
                          {f.url ? (
                            <a href={f.url} target="_blank" rel="noopener noreferrer" className="hover:text-[var(--color-cool-cyan)] transition-colors">
                              {f.title}
                            </a>
                          ) : (
                            f.title
                          )}
                        </h4>
                        <div className="flex flex-wrap gap-2 font-mono text-[11px]">
                          {f.severity && (
                            <span className="px-2.5 py-1 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                              {f.severity}
                            </span>
                          )}
                          {f.isHallOfFame && (
                            <span className="px-2.5 py-1 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                              HALL OF FAME
                            </span>
                          )}
                          {f.isAcknowledgement && (
                            <span className="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                              ACKNOWLEDGED
                            </span>
                          )}
                        </div>
                      </div>

                      {f.description && (
                        <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed font-sans">
                          {f.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}
