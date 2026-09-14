import Link from "next/link";
import { notFound } from "next/navigation";
import { isFeatureEnabled } from "@/lib/feature-flags";
import { getResearchBySlug } from "@/lib/data/research";
import Markdown from "@/components/Markdown";

export const revalidate = 3600;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const research = await getResearchBySlug(slug);
  if (!research) return {};
  return {
    title: research.seoTitle ?? `${research.title} — Jaishanth M.`,
    description: research.seoDescription ?? research.summary,
  };
}

export default async function ResearchDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  if (!(await isFeatureEnabled("research"))) notFound();
  const { slug } = await params;
  const research = await getResearchBySlug(slug);
  if (!research) notFound();

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "/" },
      { "@type": "ListItem", position: 2, name: "Research", item: "/research" },
      { "@type": "ListItem", position: 3, name: research.title },
    ],
  };

  return (
    <main className="max-w-4xl mx-auto px-6 py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* Editorial Breadcrumb */}
      <div className="flex items-center gap-2 text-xs font-mono text-zinc-500 mb-8">
        <Link href="/" className="hover:text-white transition-colors">HOME</Link>
        <span>/</span>
        <Link href="/research" className="hover:text-white transition-colors">RESEARCH</Link>
        <span>/</span>
        <span className="text-[var(--color-signal-red)]">{research.slug}</span>
      </div>

      {/* Article Header Dossier */}
      <header className="p-8 sm:p-12 rounded-lg border border-[var(--color-border)] bg-[#101014] mb-12">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6 font-mono text-xs">
          <span className="px-2.5 py-0.5 rounded-xs bg-red-950/40 text-red-300 border border-red-900/40 font-semibold uppercase text-[10px]">
            {research.disclosureStatus === "PUBLISHED" ? "RESPONSIBLE DISCLOSURE" : research.disclosureStatus}
          </span>
          <span className="text-zinc-500">
            DISCLOSED: {new Date(research.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
          </span>
        </div>

        <h1 className="font-editorial text-3xl sm:text-5xl font-black text-white mb-6 leading-tight">
          {research.title}
        </h1>

        <p className="text-base sm:text-lg text-[var(--color-text-secondary)] leading-relaxed mb-8 font-sans">
          {research.summary}
        </p>

        <div className="pt-6 border-t border-white/[0.06] grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
          {research.targetContext && (
            <div>
              <span className="text-zinc-500 block mb-1">TARGET ARCHITECTURE:</span>
              <span className="text-zinc-200 font-semibold">{research.targetContext}</span>
            </div>
          )}
          {research.researchType && (
            <div>
              <span className="text-zinc-500 block mb-1">RESEARCH CLASSIFICATION:</span>
              <span className="text-zinc-200 font-semibold">{research.researchType}</span>
            </div>
          )}
        </div>
      </header>

      {/* Methodology Section */}
      {research.methodology && (
        <div className="mb-12 p-6 rounded-lg border border-white/[0.08] bg-[#111115]">
          <div className="font-mono text-xs text-[var(--color-signal-red)] uppercase tracking-wider mb-2 font-bold">
            // RESEARCH METHODOLOGY
          </div>
          <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed font-sans">
            {research.methodology}
          </p>
        </div>
      )}

      {/* Main Content Body */}
      <article className="p-8 sm:p-12 rounded-lg border border-[var(--color-border)] bg-[#101014] mb-12">
        <div className="prose prose-invert max-w-none text-[var(--color-text-secondary)] leading-relaxed">
          <Markdown content={research.content} />
        </div>
      </article>

      {/* Systemic Impact & Defensive Remediation */}
      {(research.impact || research.remediation) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
          {research.impact && (
            <div className="p-6 rounded-lg border border-red-900/30 bg-red-950/15">
              <h2 className="font-mono text-xs uppercase tracking-wider text-red-400 font-bold mb-2">
                // SYSTEMIC ADVERSARIAL IMPACT
              </h2>
              <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed font-sans">
                {research.impact}
              </p>
            </div>
          )}
          {research.remediation && (
            <div className="p-6 rounded-lg border border-emerald-900/30 bg-emerald-950/15">
              <h2 className="font-mono text-xs uppercase tracking-wider text-emerald-400 font-bold mb-2">
                // DEFENSIVE REMEDIATION & HARDENING
              </h2>
              <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed font-sans">
                {research.remediation}
              </p>
            </div>
          )}
        </div>
      )}

      {/* References */}
      {research.references && research.references.length > 0 && (
        <section className="mt-8 pt-8 border-t border-[var(--color-border)]">
          <h2 className="font-mono text-xs uppercase tracking-widest text-zinc-400 mb-4">
            // ADVISORIES & REFERENCES
          </h2>
          <ul className="space-y-2.5 text-sm font-mono">
            {research.references.map((ref) => (
              <li key={ref.id}>
                <a
                  href={ref.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-zinc-300 hover:text-[var(--color-signal-red)] transition-colors flex items-center gap-1.5"
                >
                  <span>{ref.label}</span>
                  <span>↗</span>
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Related Project Link */}
      {research.relatedProject && (
        <section className="mt-10 pt-8 border-t border-[var(--color-border)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="font-mono text-xs text-zinc-500 block mb-1">ASSOCIATED TOOLING:</span>
            <span className="font-editorial font-bold text-xl text-white">
              {research.relatedProject.name}
            </span>
          </div>
          <Link
            href={`/projects/${research.relatedProject.slug}`}
            className="btn-editorial-secondary px-4 py-2 text-xs font-mono"
          >
            Inspect Tooling →
          </Link>
        </section>
      )}
    </main>
  );
}
