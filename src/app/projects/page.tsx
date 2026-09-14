import Link from "next/link";
import { notFound } from "next/navigation";
import { isFeatureEnabled } from "@/lib/feature-flags";
import { getVisibleProjects } from "@/lib/data/projects";
import { resolvePageSEO } from "@/lib/seo";

export const revalidate = 3600;

export async function generateMetadata() {
  return resolvePageSEO(
    "/projects",
    "Security Tools & Software — Jaishanth M.",
    "Offensive security tooling, threat reconnaissance engines, and network packet telemetry pipelines engineered by Jaishanth M."
  );
}

export default async function ProjectsPage() {
  const enabled = await isFeatureEnabled("projects");
  if (!enabled) notFound();

  const projects = await getVisibleProjects();

  return (
    <main className="max-w-6xl mx-auto px-6 py-16">
      {/* Editorial Breadcrumb */}
      <div className="flex items-center gap-2 text-xs font-mono text-zinc-500 mb-8">
        <Link href="/" className="hover:text-white transition-colors">HOME</Link>
        <span>/</span>
        <span className="text-[var(--color-signal-red)]">WORK & SECURITY TOOLS</span>
      </div>

      <div className="mb-16">
        <h1 className="font-editorial text-4xl sm:text-6xl font-black text-white mb-4 uppercase tracking-tight">
          Security Tools & Systems
        </h1>
        <p className="text-base sm:text-lg text-[var(--color-text-secondary)] max-w-3xl leading-relaxed font-sans">
          Purpose-built offensive security utilities, automated threat surface mappers, and packet dissection pipelines engineered for high-throughput reconnaissance and laboratory simulations.
        </p>
      </div>

      <div className="space-y-12">
        {projects.map((project, idx) => (
          <div
            key={project.id}
            className="p-8 sm:p-10 rounded-lg border border-[var(--color-border)] bg-[#101014] hover:border-white/20 transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 font-mono text-xs">
                <div className="flex items-center gap-3">
                  <span className="text-[var(--color-signal-red)] font-bold">0{idx + 1}</span>
                  <span className="text-zinc-500">/</span>
                  <span className="text-zinc-300 uppercase">
                    {project.category || "Offensive Security Tool"}
                  </span>
                </div>
                <span className="text-zinc-500 font-mono text-[11px]">
                  STATUS: {project.status}
                </span>
              </div>

              <h2 className="font-editorial text-2xl sm:text-4xl font-bold text-white mb-4 group-hover:text-white transition-colors">
                <Link href={`/projects/${project.slug}`}>
                  {project.name}
                </Link>
              </h2>

              <p className="text-base text-[var(--color-text-secondary)] leading-relaxed mb-6 font-sans max-w-4xl">
                {project.shortDescription}
              </p>

              {project.technologies && project.technologies.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-8">
                  {project.technologies.map((t) => (
                    <span
                      key={t.skillId}
                      className="px-2.5 py-1 rounded-xs bg-zinc-900 text-zinc-300 text-xs font-mono border border-white/[0.08]"
                    >
                      {t.skill.name}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-6 border-t border-white/[0.06] flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
              <Link
                href={`/projects/${project.slug}`}
                className="text-white hover:text-[var(--color-signal-red)] font-semibold flex items-center gap-1.5 transition-colors"
              >
                <span>Engineering Case Study</span>
                <span>→</span>
              </Link>

              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-zinc-400 hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <span>Repository</span>
                  <span>↗</span>
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
