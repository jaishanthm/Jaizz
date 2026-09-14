import { notFound } from "next/navigation";
import Link from "next/link";
import { isFeatureEnabled } from "@/lib/feature-flags";
import { getVisibleSkillCategories } from "@/lib/data/credentials";
import { resolvePageSEO } from "@/lib/seo";

export const revalidate = 3600;

export async function generateMetadata() {
  return resolvePageSEO(
    "/skills",
    "Technical Capabilities & Security Skills — Jaishanth M.",
    "Comprehensive offensive security, systems infrastructure, and exploit automation capability matrix of Jaishanth M."
  );
}

export default async function SkillsPage() {
  if (!(await isFeatureEnabled("skills"))) notFound();
  const categories = await getVisibleSkillCategories();

  return (
    <main className="max-w-6xl mx-auto px-6 py-16">
      {/* Editorial Breadcrumb */}
      <div className="flex items-center gap-2 text-xs font-mono text-zinc-500 mb-8">
        <Link href="/" className="hover:text-white transition-colors">HOME</Link>
        <span>/</span>
        <span className="text-[var(--color-signal-red)]">CAPABILITIES & SKILLS</span>
      </div>

      <div className="mb-16">
        <h1 className="font-editorial text-4xl sm:text-6xl font-black text-white mb-4 uppercase tracking-tight">
          Technical Capabilities
        </h1>
        <p className="text-base sm:text-lg text-[var(--color-text-secondary)] max-w-3xl leading-relaxed font-sans">
          Zero arbitrary percentage bars or vanity meters. Concrete proficiencies across web application penetration testing, enterprise Active Directory auditing, network security, and exploit automation.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {categories.map((cat, idx) => (
          <div
            key={cat.id}
            className="p-8 rounded-lg border border-[var(--color-border)] bg-[#101014] flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/[0.06] font-mono text-xs">
                <span className="text-[var(--color-signal-red)] font-bold">
                  DOMAIN 0{idx + 1}
                </span>
                <span className="text-zinc-500">
                  {cat.skills.length} VERIFIED SKILLS
                </span>
              </div>

              <h2 className="font-editorial text-2xl font-bold text-white mb-6">
                {cat.name}
              </h2>

              <ul className="space-y-3">
                {cat.skills.map((skill) => (
                  <li
                    key={skill.id}
                    className="p-3.5 rounded-sm bg-zinc-950/60 border border-white/[0.04] flex items-center justify-between text-sm text-zinc-300 font-sans hover:border-white/20 transition-colors"
                  >
                    <span className="font-medium">{skill.name}</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-signal-red)]" />
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8 pt-4 border-t border-white/[0.06] font-mono text-[11px] text-zinc-500">
              LABORATORY & ACTIVE DISCLOSURE EVALUATION
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
