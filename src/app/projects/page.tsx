import Link from "next/link";
import { notFound } from "next/navigation";
import { isFeatureEnabled } from "@/lib/feature-flags";
import { getVisibleProjects } from "@/lib/data/projects";
import { resolvePageSEO } from "@/lib/seo";

export const revalidate = 3600;

export async function generateMetadata() {
  return resolvePageSEO(
    "/projects",
    "Security Projects & Tools — Jaishanth M",
    "Cybersecurity tooling, threat reconnaissance systems, and network traffic analyzers built by Jaishanth M."
  );
}

export default async function ProjectsPage() {
  const enabled = await isFeatureEnabled("projects");
  if (!enabled) notFound();

  const projects = await getVisibleProjects();

  return (
    <main className="max-w-6xl mx-auto px-6 py-16">
      {/* Header breadcrumb & cyber tag */}
      <div className="flex items-center gap-3 mb-6">
        <span className="text-xs font-mono text-[var(--color-cool-cyan)] tracking-widest uppercase">
          // REPOSITORY // SECURITY TOOLING
        </span>
        <div className="h-[1px] flex-1 bg-gradient-to-r from-[var(--color-border-glow)] to-transparent" />
      </div>

      <div className="mb-12">
        <h1 className="font-heading text-4xl sm:text-5xl font-extrabold text-[var(--color-text-primary)] mb-4">
          Offensive Tools & Security Systems
        </h1>
        <p className="text-base sm:text-lg text-[var(--color-text-secondary)] max-w-3xl leading-relaxed font-sans">
          Purpose-built offensive security utilities, automated threat surface mappers, and packet dissection pipelines engineered for high-throughput reconnaissance and laboratory simulations.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((project) => (
          <div
            key={project.id}
            className="glass-card rounded-2xl border border-[var(--color-border)] hover:border-[var(--color-border-glow)] transition-all flex flex-col justify-between p-6 sm:p-7 group"
          >
            <div>
              <div className="flex items-center justify-between mb-4 font-mono text-xs">
                <span className="px-2.5 py-1 rounded bg-[rgba(43,108,255,0.15)] text-[var(--color-cool-cyan)] border border-[rgba(43,108,255,0.3)]">
                  {project.category || "Offensive Security Tool"}
                </span>
                <span className="text-[var(--color-text-muted)]">STATUS: ACTIVE</span>
              </div>

              <h2 className="font-heading text-xl font-bold text-[var(--color-text-primary)] mb-3 group-hover:text-[var(--color-cool-cyan)] transition-colors">
                <Link href={`/projects/${project.slug}`}>
                  {project.name}
                </Link>
              </h2>

              <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed mb-6 font-sans">
                {project.shortDescription}
              </p>

              {project.technologies && project.technologies.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-6">
                  {project.technologies.map((t) => (
                    <span
                      key={t.skillId}
                      className="px-2 py-0.5 rounded bg-[rgba(11,17,32,0.6)] text-[var(--color-text-muted)] text-[11px] font-mono border border-[var(--color-border)]"
                    >
                      {t.skill.name}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-[var(--color-border-subtle)] flex items-center justify-between">
              <Link
                href={`/projects/${project.slug}`}
                className="text-xs font-mono text-[var(--color-cool-cyan)] hover:underline flex items-center gap-1"
              >
                <span>Architecture Deep-Dive</span>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </Link>

              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-mono text-[var(--color-text-muted)] hover:text-white flex items-center gap-1 transition-colors"
                >
                  <span>GitHub</span>
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                  </svg>
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
