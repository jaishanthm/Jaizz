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
    title: project.seoTitle ?? `${project.name} — Jaishanth M.`,
    description: project.seoDescription ?? project.shortDescription,
  };
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  if (!(await isFeatureEnabled("projects"))) notFound();
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "/" },
      { "@type": "ListItem", position: 2, name: "Projects", item: "/projects" },
      { "@type": "ListItem", position: 3, name: project.name },
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
        <Link href="/projects" className="hover:text-white transition-colors">PROJECTS</Link>
        <span>/</span>
        <span className="text-[var(--color-signal-red)]">{project.slug}</span>
      </div>

      {/* Hero Header Block */}
      <div className="p-8 sm:p-12 rounded-lg border border-[var(--color-border)] bg-[#101014] mb-12">
        <div className="flex items-center justify-between font-mono text-xs mb-4">
          <span className="text-[var(--color-signal-red)] font-semibold uppercase tracking-wider">
            {project.category || "Offensive Security Engineering"}
          </span>
          <span className="text-zinc-500">
            STATUS: {project.status}
          </span>
        </div>

        <h1 className="font-editorial text-3xl sm:text-5xl font-black text-white mb-6 leading-tight">
          {project.name}
        </h1>

        <p className="text-base sm:text-lg text-[var(--color-text-secondary)] leading-relaxed mb-8 font-sans">
          {project.shortDescription}
        </p>

        {/* Action CTAs */}
        <div className="flex flex-wrap items-center gap-4 pt-6 border-t border-white/[0.06] font-mono text-xs">
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-editorial-primary px-5 py-2.5 uppercase tracking-wider flex items-center gap-2"
            >
              <span>Source Repository</span>
              <span>↗</span>
            </a>
          )}
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-editorial-secondary px-5 py-2.5 uppercase tracking-wider"
            >
              Live Deployment ↗
            </a>
          )}
          {project.docsUrl && (
            <a
              href={project.docsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-editorial-secondary px-5 py-2.5 uppercase tracking-wider"
            >
              Technical Docs ↗
            </a>
          )}
        </div>
      </div>

      {/* Technologies Used */}
      {project.technologies && project.technologies.length > 0 && (
        <section className="mb-12">
          <h2 className="font-mono text-xs uppercase tracking-widest text-zinc-400 mb-4">
            // TECHNOLOGIES & PROTOCOLS
          </h2>
          <div className="flex flex-wrap gap-2">
            {project.technologies.map((t) => (
              <span
                key={t.skillId}
                className="px-3 py-1.5 rounded-xs bg-zinc-900 text-xs font-mono text-zinc-300 border border-white/[0.08]"
              >
                {t.skill.name}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Full Description / Markdown */}
      {project.fullDescription && (
        <section className="p-8 sm:p-12 rounded-lg border border-[var(--color-border)] bg-[#101014] mb-12">
          <div className="prose prose-invert max-w-none text-[var(--color-text-secondary)] leading-relaxed">
            <Markdown content={project.fullDescription} />
          </div>
        </section>
      )}

      {/* Related Research */}
      {project.relatedResearch && project.relatedResearch.length > 0 && (
        <section className="mt-12 pt-8 border-t border-[var(--color-border)]">
          <h2 className="font-editorial text-2xl font-bold text-white mb-6">
            Associated Security Research
          </h2>
          <div className="space-y-4">
            {project.relatedResearch.map((r) => (
              <Link
                key={r.id}
                href={`/research/${r.slug}`}
                className="p-5 rounded-lg border border-[var(--color-border)] bg-[#101014] hover:border-white/20 transition-all flex items-center justify-between group block"
              >
                <span className="font-medium text-sm text-white group-hover:text-[var(--color-signal-red)] transition-colors">
                  {r.title}
                </span>
                <span className="font-mono text-xs text-zinc-400">View Writeup →</span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
