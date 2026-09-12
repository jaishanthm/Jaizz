import { notFound } from "next/navigation";
import { isFeatureEnabled } from "@/lib/feature-flags";
import { getVisibleSkillCategories } from "@/lib/data/credentials";
import { resolvePageSEO } from "@/lib/seo";

export const revalidate = 3600;

export async function generateMetadata() {
  return resolvePageSEO(
    "/skills",
    "Technical Capabilities & Security Skills — Jaishanth M",
    "Comprehensive offensive security, systems infrastructure, and exploit automation capability matrix of Jaishanth M."
  );
}

export default async function SkillsPage() {
  if (!(await isFeatureEnabled("skills"))) notFound();
  const categories = await getVisibleSkillCategories();

  return (
    <main className="max-w-6xl mx-auto px-6 py-16">
      {/* Header breadcrumb & cyber tag */}
      <div className="flex items-center gap-3 mb-6">
        <span className="text-xs font-mono text-[var(--color-cool-cyan)] tracking-widest uppercase">
          // CAPABILITIES // OFFENSIVE & DEFENSIVE MATRIX
        </span>
        <div className="h-[1px] flex-1 bg-gradient-to-r from-[var(--color-border-glow)] to-transparent" />
      </div>

      <div className="mb-12">
        <h1 className="font-heading text-4xl sm:text-5xl font-extrabold text-[var(--color-text-primary)] mb-4">
          Technical Capability Matrix
        </h1>
        <p className="text-base sm:text-lg text-[var(--color-text-secondary)] max-w-3xl leading-relaxed font-sans">
          Zero arbitrary percentage bars or vanity meters. Pure verified proficiencies across web penetration testing, enterprise Active Directory security, network telemetry, and exploit automation.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {categories.map((cat, idx) => {
          const accentClass =
            idx === 0
              ? "border-t-[var(--color-electric-blue)]"
              : idx === 1
              ? "border-t-[var(--color-cool-cyan)]"
              : "border-t-emerald-400";

          return (
            <div
              key={cat.id}
              className={`glass-panel-elevated p-8 rounded-2xl border border-[var(--color-border)] border-t-4 ${accentClass} flex flex-col justify-between`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-xs text-[var(--color-cool-cyan)] font-bold">
                    DOMAIN 0{idx + 1}
                  </span>
                  <span className="font-mono text-xs text-[var(--color-text-muted)]">
                    {cat.skills.length} VERIFIED SKILLS
                  </span>
                </div>

                <h2 className="font-heading text-xl font-bold text-[var(--color-text-primary)] mb-6">
                  {cat.name}
                </h2>

                <ul className="space-y-3">
                  {cat.skills.map((skill) => (
                    <li
                      key={skill.id}
                      className="p-3 rounded-xl bg-[rgba(11,17,32,0.6)] border border-[var(--color-border)] flex items-center gap-3 text-sm text-[var(--color-text-primary)] hover:border-[var(--color-border-glow)] transition-colors"
                    >
                      <span className="w-2 h-2 rounded-full bg-[var(--color-cool-cyan)] flex-shrink-0" />
                      <span className="font-medium">{skill.name}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8 pt-4 border-t border-[var(--color-border-subtle)] font-mono text-[11px] text-[var(--color-text-muted)]">
                VERIFIED IN LABORATORY & CTF ASSESSMENTS
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}
