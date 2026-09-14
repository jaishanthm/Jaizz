import { notFound } from "next/navigation";
import Link from "next/link";
import { isFeatureEnabled } from "@/lib/feature-flags";
import { getVisibleBugBountyProfiles } from "@/lib/data/credentials";
import { resolvePageSEO } from "@/lib/seo";

export const revalidate = 3600;

export async function generateMetadata() {
  return resolvePageSEO(
    "/bug-bounty",
    "Bug Bounty Profile & Responsible Disclosure — Jaishanth M.",
    "Active security researcher profile across Bugcrowd, responsible vulnerability disclosures, and hall of fame recognitions."
  );
}

export default async function BugBountyPage() {
  if (!(await isFeatureEnabled("bug_bounty"))) notFound();
  const profiles = await getVisibleBugBountyProfiles();

  return (
    <main className="max-w-5xl mx-auto px-6 py-16">
      {/* Editorial Breadcrumb */}
      <div className="flex items-center gap-2 text-xs font-mono text-zinc-500 mb-8">
        <Link href="/" className="hover:text-white transition-colors">HOME</Link>
        <span>/</span>
        <span className="text-[var(--color-signal-red)]">RESPONSIBLE DISCLOSURE</span>
      </div>

      <div className="mb-16">
        <h1 className="font-editorial text-4xl sm:text-6xl font-black text-white mb-4 uppercase tracking-tight">
          Bug Bounty & Disclosures
        </h1>
        <p className="text-base sm:text-lg text-[var(--color-text-secondary)] max-w-3xl leading-relaxed font-sans">
          Participating in responsible disclosure programs to ethically audit web applications, APIs, and business logic perimeters before adversaries can exploit them.
        </p>
      </div>

      <div className="space-y-10">
        {profiles.map((p) => (
          <div
            key={p.id}
            className="p-8 sm:p-10 rounded-lg border border-[var(--color-border)] bg-[#101014]"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-white/[0.06]">
              <div>
                <span className="font-mono text-xs text-[var(--color-signal-red)] uppercase">
                  PLATFORM: {p.platform}
                </span>
                <h2 className="font-editorial text-2xl sm:text-4xl font-bold text-white mt-1">
                  @{p.researcherName || "jaishanth"}
                </h2>
              </div>
              <a
                href={p.profileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-editorial-secondary px-5 py-2.5 text-xs font-mono inline-flex items-center gap-2 w-fit"
              >
                <span>View Researcher Profile</span>
                <span>↗</span>
              </a>
            </div>

            {p.description && (
              <p className="text-base text-[var(--color-text-secondary)] leading-relaxed mb-8 font-sans">
                {p.description}
              </p>
            )}

            {p.findings && p.findings.length > 0 && (
              <div>
                <h3 className="font-mono text-xs uppercase tracking-wider text-zinc-400 mb-4 font-semibold">
                  // DISCLOSED FINDINGS & ACKNOWLEDGEMENTS
                </h3>
                <div className="space-y-4">
                  {p.findings.map((f) => (
                    <div
                      key={f.id}
                      className="p-6 rounded-sm bg-zinc-950/60 border border-white/[0.04] hover:border-white/10 transition-all"
                    >
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-3">
                        <h4 className="font-editorial text-lg font-bold text-white">
                          {f.url ? (
                            <a href={f.url} target="_blank" rel="noopener noreferrer" className="hover:text-[var(--color-signal-red)] transition-colors">
                              {f.title}
                            </a>
                          ) : (
                            f.title
                          )}
                        </h4>
                        <div className="flex flex-wrap gap-2 font-mono text-[10px]">
                          {f.severity && (
                            <span className="px-2 py-0.5 rounded-xs bg-red-950/40 text-red-300 border border-red-900/40">
                              {f.severity}
                            </span>
                          )}
                          {f.isHallOfFame && (
                            <span className="px-2 py-0.5 rounded-xs bg-amber-950/40 text-amber-300 border border-amber-900/40">
                              HALL OF FAME
                            </span>
                          )}
                          {f.isAcknowledgement && (
                            <span className="px-2 py-0.5 rounded-xs bg-emerald-950/40 text-emerald-300 border border-emerald-900/40">
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
