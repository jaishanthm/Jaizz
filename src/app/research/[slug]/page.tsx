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
    title: research.seoTitle ?? `${research.title} — Jaishanth M`,
    description: research.seoDescription ?? research.summary,
  };
}

export default async function ResearchDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  if (!(await isFeatureEnabled("research"))) notFound();
  const { slug } = await params;
  const research = await getResearchBySlug(slug);
  if (!research) notFound();

  return (
    <main className="max-w-4xl mx-auto px-6 py-16">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs font-mono text-[var(--color-text-muted)] mb-8">
        <Link href="/" className="hover:text-white transition-colors">Home</Link>
        <span>/</span>
        <Link href="/research" className="hover:text-white transition-colors">Research</Link>
        <span>/</span>
        <span className="text-[var(--color-cool-cyan)]">{research.slug}</span>
      </div>

      {/* Header Card */}
      <div className="glass-panel-elevated p-8 sm:p-10 rounded-2xl border border-[var(--color-border-glow)] mb-12">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4 font-mono text-xs">
          <span className="px-2.5 py-1 rounded bg-[rgba(0,229,255,0.12)] text-[var(--color-cool-cyan)] border border-[rgba(0,229,255,0.3)] font-semibold">
            {research.disclosureStatus === "PUBLISHED" ? "RESPONSIBLE DISCLOSURE" : research.disclosureStatus}
          </span>
          <span className="text-[var(--color-text-muted)]">
            PUBLISHED: {new Date(research.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
          </span>
        </div>

        <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-[var(--color-text-primary)] mb-4 leading-tight">
          {research.title}
        </h1>

        <p className="text-base sm:text-lg text-[var(--color-text-secondary)] leading-relaxed mb-6 font-sans">
          {research.summary}
        </p>

        <div className="pt-6 border-t border-[var(--color-border-subtle)] grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
          {research.targetContext && (
            <div>
              <span className="text-[var(--color-text-muted)] block mb-1">TARGET ARCHITECTURE:</span>
              <span className="text-[var(--color-cool-cyan)] font-semibold">{research.targetContext}</span>
            </div>
          )}
          {research.researchType && (
            <div>
              <span className="text-[var(--color-text-muted)] block mb-1">RESEARCH CLASSIFICATION:</span>
              <span className="text-[var(--color-electric-blue)] font-semibold">{research.researchType}</span>
            </div>
          )}
        </div>
      </div>

      {/* Methodology Callout */}
      {research.methodology && (
        <div className="mb-10 p-5 rounded-2xl glass-card border border-[rgba(43,108,255,0.3)] bg-[rgba(43,108,255,0.05)]">
          <div className="font-mono text-xs text-[var(--color-cool-cyan)] uppercase tracking-wider mb-1 font-bold">
            // RESEARCH METHODOLOGY
          </div>
          <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
            {research.methodology}
          </p>
        </div>
      )}

      {/* Content Markdown */}
      <article className="glass-card p-8 sm:p-10 rounded-2xl border border-[var(--color-border)] mb-12">
        <div className="prose prose-invert max-w-none text-[var(--color-text-secondary)] leading-relaxed">
          <Markdown content={research.content} />
        </div>
      </article>

      {/* Impact & Remediation Callouts */}
      {(research.impact || research.remediation) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
          {research.impact && (
            <div className="glass-card p-6 rounded-2xl border border-red-500/20 bg-red-500/5">
              <h2 className="font-mono text-xs uppercase tracking-wider text-red-400 font-bold mb-2">
                // SYSTEMIC IMPACT
              </h2>
              <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                {research.impact}
              </p>
            </div>
          )}
          {research.remediation && (
            <div className="glass-card p-6 rounded-2xl border border-emerald-500/20 bg-emerald-500/5">
              <h2 className="font-mono text-xs uppercase tracking-wider text-emerald-400 font-bold mb-2">
                // DEFENSIVE REMEDIATION
              </h2>
              <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                {research.remediation}
              </p>
            </div>
          )}
        </div>
      )}

      {/* References */}
      {research.references && research.references.length > 0 && (
        <section className="mt-8 pt-8 border-t border-[var(--color-border)]">
          <h2 className="font-mono text-xs uppercase tracking-widest text-[var(--color-cool-cyan)] mb-4">
            // REFERENCES & ADVISORIES
          </h2>
          <ul className="space-y-2 text-sm font-mono">
            {research.references.map((ref) => (
              <li key={ref.id}>
                <a
                  href={ref.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--color-cool-cyan)] hover:underline flex items-center gap-1.5"
                >
                  <span>{ref.label}</span>
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Related Project */}
      {research.relatedProject && (
        <section className="mt-8 pt-8 border-t border-[var(--color-border)] flex items-center justify-between">
          <div>
            <span className="font-mono text-xs text-[var(--color-text-muted)] block">ASSOCIATED SOFTWARE TOOL:</span>
            <span className="font-heading font-bold text-lg text-[var(--color-text-primary)]">
              {research.relatedProject.name}
            </span>
          </div>
          <Link
            href={`/projects/${research.relatedProject.slug}`}
            className="btn-magnetic px-4 py-2 rounded-xl text-xs font-mono text-[var(--color-cool-cyan)] glass-card border border-[var(--color-border)] hover:border-[var(--color-cool-cyan)]"
          >
            Inspect Tool →
          </Link>
        </section>
      )}
    </main>
  );
}
