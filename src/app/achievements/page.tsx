import { notFound } from "next/navigation";
import Link from "next/link";
import { isFeatureEnabled } from "@/lib/feature-flags";
import { getVisibleAchievements } from "@/lib/data/credentials";
import { resolvePageSEO } from "@/lib/seo";

export const revalidate = 3600;

export async function generateMetadata() {
  return resolvePageSEO(
    "/achievements",
    "Achievements & Security Milestones — Jaishanth M.",
    "TryHackMe Top 5% ranking, Bugcrowd security research recognitions, and competitive milestones achieved by Jaishanth M."
  );
}

export default async function AchievementsPage() {
  if (!(await isFeatureEnabled("achievements"))) notFound();
  const achievements = await getVisibleAchievements();

  return (
    <main className="max-w-4xl mx-auto px-6 py-16">
      {/* Editorial Breadcrumb */}
      <div className="flex items-center gap-2 text-xs font-mono text-zinc-500 mb-8">
        <Link href="/" className="hover:text-white transition-colors">HOME</Link>
        <span>/</span>
        <span className="text-[var(--color-signal-red)]">HONORS & MILESTONES</span>
      </div>

      <div className="mb-16">
        <h1 className="font-editorial text-4xl sm:text-6xl font-black text-white mb-4 uppercase tracking-tight">
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
            className="p-8 sm:p-10 rounded-lg border border-[var(--color-border)] bg-[#101014] hover:border-white/20 transition-all flex flex-col sm:flex-row items-start gap-6 group"
          >
            <div className="w-12 h-12 rounded-sm bg-zinc-900 border border-[var(--color-border)] flex items-center justify-center text-[var(--color-signal-red)] font-mono font-bold text-lg flex-shrink-0">
              ★
            </div>

            <div className="flex-1">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2 font-mono text-xs">
                <span className="text-zinc-500 uppercase">
                  {ach.category}
                </span>
                <span className="text-[10px] text-zinc-400 font-mono">VERIFIED HONORS</span>
              </div>

              <h2 className="font-editorial text-xl sm:text-2xl font-bold text-white mb-3">
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
                    className="inline-flex items-center gap-1.5 text-xs font-mono text-zinc-400 hover:text-white transition-colors"
                  >
                    <span>Public Profile Proof: {ach.url} ↗</span>
                  </a>
                </div>
              )}
            </div>
          </div>
        ))}

        {achievements.length === 0 && (
          <p className="text-sm font-mono text-zinc-500">
            No achievements published yet.
          </p>
        )}
      </div>
    </main>
  );
}
