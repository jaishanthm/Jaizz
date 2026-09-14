import { notFound } from "next/navigation";
import Link from "next/link";
import { isFeatureEnabled } from "@/lib/feature-flags";
import { getVisibleExperience } from "@/lib/data/credentials";
import { resolvePageSEO } from "@/lib/seo";

export const revalidate = 3600;

export async function generateMetadata() {
  return resolvePageSEO(
    "/experience",
    "Security Experience & Research — Jaishanth M.",
    "Professional security experience, vulnerability research engagements, and active Bugcrowd research by Jaishanth M."
  );
}

export default async function ExperiencePage() {
  if (!(await isFeatureEnabled("experience"))) notFound();
  const experience = await getVisibleExperience();

  return (
    <main className="max-w-4xl mx-auto px-6 py-16">
      {/* Editorial Breadcrumb */}
      <div className="flex items-center gap-2 text-xs font-mono text-zinc-500 mb-8">
        <Link href="/" className="hover:text-white transition-colors">HOME</Link>
        <span>/</span>
        <span className="text-[var(--color-signal-red)]">EXPERIENCE</span>
      </div>

      <div className="mb-16">
        <h1 className="font-editorial text-4xl sm:text-6xl font-black text-white mb-4 uppercase tracking-tight">
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
              className="p-8 sm:p-10 rounded-lg border border-[var(--color-border)] bg-[#101014] hover:border-white/20 transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4">
                <div>
                  <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-xs bg-zinc-900 text-zinc-300 text-xs font-mono mb-2 border border-white/[0.08]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-signal-red)]" />
                    <span>{e.current ? "ACTIVE ENGAGEMENT" : "COMPLETED"}</span>
                  </div>
                  <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-white">
                    {e.role}
                  </h2>
                  <div className="text-sm font-semibold text-zinc-400 mt-1">
                    {e.organization} {e.location ? `· ${e.location}` : ""}
                  </div>
                </div>

                <div className="font-mono text-xs text-zinc-500 sm:text-right">
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
                  <div className="font-mono text-xs uppercase text-zinc-400 mb-2 font-semibold">
                    KEY ACHIEVEMENTS:
                  </div>
                  <ul className="space-y-2 font-sans text-sm text-[var(--color-text-secondary)]">
                    {e.achievements.map((h) => (
                      <li key={h.id} className="flex items-start gap-3">
                        <span className="text-[var(--color-signal-red)] font-mono">―</span>
                        <span>{h.text}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {e.organizationUrl && (
                <div className="pt-4 border-t border-white/[0.06]">
                  <a
                    href={e.organizationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-mono text-zinc-400 hover:text-white transition-colors"
                  >
                    <span>Organization Portal: {e.organizationUrl} ↗</span>
                  </a>
                </div>
              )}
            </div>
          );
        })}

        {experience.length === 0 && (
          <p className="text-sm font-mono text-zinc-500">
            No experience entries published yet.
          </p>
        )}
      </div>
    </main>
  );
}
