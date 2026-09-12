import Link from "next/link";
import { notFound } from "next/navigation";
import { isFeatureEnabled } from "@/lib/feature-flags";
import { getProjectBySlug } from "@/lib/data/projects";
import Markdown from "@/components/Markdown";

export const revalidate = 3600;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return {};
  return {
    title: project.seoTitle ?? `${project.name} — Jaishanth M`,
    description: project.seoDescription ?? project.shortDescription,
  };
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  if (!(await isFeatureEnabled("projects"))) notFound();
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  return (
    <main className="max-w-4xl mx-auto px-6 py-16">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs font-mono text-[var(--color-text-muted)] mb-8">
        <Link href="/" className="hover:text-white transition-colors">Home</Link>
        <span>/</span>
        <Link href="/projects" className="hover:text-white transition-colors">Projects</Link>
        <span>/</span>
        <span className="text-[var(--color-cool-cyan)]">{project.slug}</span>
      </div>

      {/* Hero Card */}
      <div className="glass-panel-elevated p-8 sm:p-10 rounded-2xl border border-[var(--color-border-glow)] mb-12">
        <div className="flex items-center justify-between font-mono text-xs mb-3">
          <span className="px-2.5 py-1 rounded bg-[rgba(43,108,255,0.15)] text-[var(--color-cool-cyan)] border border-[rgba(43,108,255,0.3)]">
            {project.category || "Offensive Security Tool"}
          </span>
          <span className="text-emerald-400">ENGINEERING SPECIFICATION</span>
        </div>

        <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-[var(--color-text-primary)] mb-4">
          {project.name}
        </h1>

        <p className="text-base sm:text-lg text-[var(--color-text-secondary)] leading-relaxed mb-6 font-sans">
          {project.shortDescription}
        </p>

        {/* Action Links */}
        <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-[var(--color-border-subtle)]">
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-magnetic px-5 py-2.5 rounded-xl text-xs font-mono font-medium text-white bg-[var(--color-electric-blue)] hover:bg-[var(--color-primary-hover)] flex items-center gap-2 shadow-[0_0_15px_rgba(43,108,255,0.3)] transition-all"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
              <span>Source Repository</span>
            </a>
          )}
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-magnetic px-5 py-2.5 rounded-xl text-xs font-mono font-medium glass-card text-[var(--color-cool-cyan)] hover:border-[var(--color-cool-cyan)] transition-all"
            >
              Live Deployment ↗
            </a>
          )}
          {project.docsUrl && (
            <a
              href={project.docsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-magnetic px-5 py-2.5 rounded-xl text-xs font-mono font-medium glass-card text-[var(--color-text-secondary)] hover:text-white transition-all"
            >
              Technical Docs ↗
            </a>
          )}
        </div>
      </div>

      {/* Technologies Used */}
      {project.technologies && project.technologies.length > 0 && (
        <section className="mb-10">
          <h2 className="font-mono text-xs uppercase tracking-widest text-[var(--color-cool-cyan)] mb-3">
            // TECHNOLOGIES & PROTOCOLS
          </h2>
          <div className="flex flex-wrap gap-2">
            {project.technologies.map((t) => (
              <span
                key={t.skillId}
                className="px-3 py-1.5 rounded-xl glass-card text-xs font-mono text-[var(--color-text-primary)] border border-[var(--color-border)]"
              >
                {t.skill.name}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Full Description / Markdown */}
      {project.fullDescription && (
        <section className="glass-card p-8 rounded-2xl border border-[var(--color-border)] mb-12">
          <div className="prose prose-invert max-w-none text-[var(--color-text-secondary)] leading-relaxed">
            <Markdown content={project.fullDescription} />
          </div>
        </section>
      )}

      {/* Related Research */}
      {project.relatedResearch && project.relatedResearch.length > 0 && (
        <section className="mt-12 pt-8 border-t border-[var(--color-border)]">
          <h2 className="font-heading text-xl font-bold text-[var(--color-text-primary)] mb-4">
            Related Research Writeups
          </h2>
          <div className="space-y-3">
            {project.relatedResearch.map((r) => (
              <Link
                key={r.id}
                href={`/research/${r.slug}`}
                className="glass-card p-4 rounded-xl border border-[var(--color-border)] hover:border-[var(--color-border-glow)] transition-all flex items-center justify-between group block"
              >
                <span className="font-medium text-sm text-[var(--color-text-primary)] group-hover:text-[var(--color-cool-cyan)] transition-colors">
                  {r.title}
                </span>
                <span className="font-mono text-xs text-[var(--color-cool-cyan)]">View Writeup →</span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
