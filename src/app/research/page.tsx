import Link from "next/link";
import { notFound } from "next/navigation";
import { isFeatureEnabled } from "@/lib/feature-flags";
import { getPublishedResearch } from "@/lib/data/research";
import { resolvePageSEO } from "@/lib/seo";

export const revalidate = 3600;

export async function generateMetadata() {
  return resolvePageSEO(
    "/research",
    "Security Research & Vulnerability Disclosures — Jaishanth M.",
    "Documented vulnerability analyses, attack path investigations, and responsible disclosures by Jaishanth M."
  );
}

export default async function ResearchPage() {
  if (!(await isFeatureEnabled("research"))) notFound();
  const research = await getPublishedResearch();

  return (
    <main className="max-w-6xl mx-auto px-6 py-16">
      {/* Editorial Breadcrumb */}
      <div className="flex items-center gap-2 text-xs font-mono text-zinc-500 mb-8">
        <Link href="/" className="hover:text-white transition-colors">HOME</Link>
        <span>/</span>
        <span className="text-[var(--color-signal-red)]">SECURITY RESEARCH</span>
      </div>

      <div className="mb-16">
        <h1 className="font-editorial text-4xl sm:text-6xl font-black text-white mb-4 uppercase tracking-tight">
          Security Research & Disclosures
        </h1>
        <p className="text-base sm:text-lg text-[var(--color-text-secondary)] max-w-3xl leading-relaxed font-sans">
          Technical vulnerability assessments, attack path simulations, and responsible disclosures across modern web architectures, authentication protocols, and Active Directory domains.
        </p>
      </div>

      <div className="space-y-8">
        {research.map((item, idx) => (
          <div
            key={item.id}
            className="p-8 sm:p-10 rounded-lg border border-[var(--color-border)] bg-[#101014] hover:border-white/20 transition-all group"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 font-mono text-xs">
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-[var(--color-signal-red)] font-bold">0{idx + 1}</span>
                <span className="px-2 py-0.5 rounded-xs bg-red-950/40 text-red-300 border border-red-900/40 font-semibold uppercase text-[10px]">
                  {item.disclosureStatus === "PUBLISHED" ? "RESPONSIBLE DISCLOSURE" : item.disclosureStatus}
                </span>
                {item.researchType && (
                  <span className="text-zinc-400">
                    {item.researchType}
                  </span>
                )}
              </div>
              <span className="text-zinc-500">
                {new Date(item.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
              </span>
            </div>

            <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-white mb-4 group-hover:text-white transition-colors leading-snug">
              <Link href={`/research/${item.slug}`}>
                {item.title}
              </Link>
            </h2>

            <p className="text-base text-[var(--color-text-secondary)] leading-relaxed mb-6 font-sans max-w-4xl">
              {item.summary}
            </p>

            {item.targetContext && (
              <div className="mb-6 font-mono text-xs text-zinc-400">
                <span className="text-zinc-500">TARGET ARCHITECTURE:</span> {item.targetContext}
              </div>
            )}

            <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between font-mono text-xs">
              <Link
                href={`/research/${item.slug}`}
                className="text-white hover:text-[var(--color-signal-red)] font-semibold flex items-center gap-1.5 transition-colors"
              >
                <span>Read Full Technical Breakdown</span>
                <span>→</span>
              </Link>

              {item.tags && item.tags.length > 0 && (
                <div className="hidden sm:flex items-center gap-2 text-zinc-500">
                  {item.tags.slice(0, 3).map((t) => (
                    <span key={t.id} className="px-2 py-0.5 rounded-xs bg-zinc-900 border border-white/[0.04]">
                      #{t.tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {research.length === 0 && (
          <p className="text-sm font-mono text-zinc-500">
            No published security research entries available.
          </p>
        )}
      </div>
    </main>
  );
}
