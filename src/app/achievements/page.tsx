import { notFound } from "next/navigation";
import { isFeatureEnabled } from "@/lib/feature-flags";
import { getVisibleAchievements } from "@/lib/data/credentials";
import { resolvePageSEO } from "@/lib/seo";

export const revalidate = 3600;

export async function generateMetadata() {
  return resolvePageSEO(
    "/achievements",
    "Achievements & Security Milestones — Jaishanth M",
    "TryHackMe Top 1% ranking, Bugcrowd security research recognitions, and competitive milestones."
  );
}

export default async function AchievementsPage() {
  if (!(await isFeatureEnabled("achievements"))) notFound();
  const achievements = await getVisibleAchievements();

  return (
    <main className="max-w-4xl mx-auto px-6 py-16">
      {/* Header breadcrumb & cyber tag */}
      <div className="flex items-center gap-3 mb-6">
        <span className="text-xs font-mono text-[var(--color-cool-cyan)] tracking-widest uppercase">
          // RECOGNITION // COMPETITIVE HONORS
        </span>
        <div className="h-[1px] flex-1 bg-gradient-to-r from-[var(--color-border-glow)] to-transparent" />
      </div>

      <div className="mb-12">
        <h1 className="font-heading text-4xl sm:text-5xl font-extrabold text-[var(--color-text-primary)] mb-4">
          Achievements & Milestones
        </h1>
        <p className="text-base sm:text-lg text-[var(--color-text-secondary)] max-w-2xl leading-relaxed font-sans">
          Provable security milestones, global competitive rankings, and acknowledgements across leading ethical hacking platforms.
        </p>
      </div>

      <div className="space-y-6">
        {achievements.map((ach) => (
          <div
            key={ach.id}
            className="glass-panel-elevated p-8 rounded-2xl border border-[var(--color-border-glow)] hover:border-[var(--color-cool-cyan)] transition-all flex flex-col sm:flex-row items-start gap-6 group"
          >
            <div className="w-14 h-14 rounded-2xl bg-[rgba(43,108,255,0.2)] border border-[var(--color-electric-blue)] flex items-center justify-center text-[var(--color-cool-cyan)] flex-shrink-0 font-mono font-bold text-xl shadow-[0_0_15px_rgba(43,108,255,0.3)]">
              ★
            </div>

            <div className="flex-1">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2 font-mono text-xs">
                <span className="px-2.5 py-1 rounded bg-[rgba(0,229,255,0.1)] text-[var(--color-cool-cyan)] border border-[rgba(0,229,255,0.2)]">
                  {ach.category}
                </span>
                <span className="text-emerald-400 font-semibold">VERIFIED HONORS</span>
              </div>

              <h2 className="font-heading text-xl sm:text-2xl font-bold text-[var(--color-text-primary)] mb-3 group-hover:text-[var(--color-cool-cyan)] transition-colors">
                {ach.title}
              </h2>

              {ach.description && (
                <p className="text-sm sm:text-base text-[var(--color-text-secondary)] leading-relaxed mb-4 font-sans">
                  {ach.description}
                </p>
              )}

              {ach.url && (
                <div className="pt-2">
                  <a
                    href={ach.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-mono text-[var(--color-cool-cyan)] hover:underline"
                  >
                    <span>Public Profile Proof: {ach.url}</span>
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              )}
            </div>
          </div>
        ))}

        {achievements.length === 0 && (
          <p className="text-sm font-mono text-[var(--color-text-muted)]">
            No achievements published yet.
          </p>
        )}
      </div>
    </main>
  );
}
