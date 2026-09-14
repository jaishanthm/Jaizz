import Link from "next/link";
import Image from "next/image";
import { getFeaturedProjects } from "@/lib/data/projects";
import { getPublishedResearch } from "@/lib/data/research";
import { getPublishedPosts } from "@/lib/data/blog";
import {
  getVisibleSkillCategories,
  getVisibleCertifications,
  getVisibleExperience,
  getVisibleAchievements,
  getVisibleBugBountyProfiles,
} from "@/lib/data/credentials";
import { getProfile } from "@/lib/data/profile";
import { getCachedTryHackMeStats } from "@/lib/tryhackme";
import { prisma } from "@/lib/prisma";

// ============================================================================
// 1. ABOUT SECTION — EDITORIAL DOSSIER WITH REAL PORTRAIT
// ============================================================================
export async function AboutSection() {
  const [profile, thmStats] = await Promise.all([
    getProfile(),
    getCachedTryHackMeStats(),
  ]);
  if (!profile) return null;

  const portraitUrl = profile.profileImage?.url || "/profile.jpg";

  return (
    <section id="about" className="py-28 px-6 sm:px-10 relative border-t border-[var(--color-border)]">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-10">
          <span className="text-xs font-mono text-[var(--color-signal-red)] tracking-widest uppercase font-semibold">
            01 // ABOUT & METHODOLOGY
          </span>
          <div className="h-[1px] flex-1 bg-gradient-to-r from-white/10 to-transparent" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Narrative & Methodology (7 cols) */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            <div>
              <h2 className="font-editorial text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight mb-8 text-white leading-[1.08]">
                I build, break, and understand systems.
              </h2>

              <div className="text-base sm:text-lg text-[var(--color-text-secondary)] leading-relaxed space-y-5 font-sans">
                <p>{profile.shortBio}</p>
                {profile.longBio && (
                  <p className="text-zinc-400 text-base">
                    {profile.longBio
                      .replace(/\(MCET Pollachi\)/g, "")
                      .replace(/at Dr\. Mahalingam College of Engineering and Technology/g, "in Cybersecurity")}
                  </p>
                )}
              </div>
            </div>

            {/* Core Capability Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 my-10">
              <div className="p-5 rounded-lg border border-[var(--color-border)] bg-[#111114]">
                <div className="font-mono text-xs text-[var(--color-signal-red)] mb-2 font-semibold">01. OFFENSIVE WEB</div>
                <div className="text-sm font-bold text-white mb-1">VAPT & Access Control</div>
                <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">
                  CORS misconfiguration, IDOR, authorization flaws, and custom exploit verification harnesses.
                </p>
              </div>

              <div className="p-5 rounded-lg border border-[var(--color-border)] bg-[#111114]">
                <div className="font-mono text-xs text-[var(--color-signal-red)] mb-2 font-semibold">02. ACTIVE DIRECTORY</div>
                <div className="text-sm font-bold text-white mb-1">Domain Attack Paths</div>
                <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">
                  Kerberoasting, BloodHound auditing, privilege escalation, and lateral movement analysis.
                </p>
              </div>

              <div className="p-5 rounded-lg border border-[var(--color-border)] bg-[#111114]">
                <div className="font-mono text-xs text-[var(--color-signal-red)] mb-2 font-semibold">03. TOOLING</div>
                <div className="text-sm font-bold text-white mb-1">Exploit Automation</div>
                <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">
                  High-speed attack surface reconnaissance engines and asynchronous telemetry pipelines.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href="/about"
                className="btn-editorial-primary px-6 py-3.5 text-xs font-mono uppercase tracking-wider font-semibold"
              >
                Complete Background →
              </Link>
              <Link
                href="/resume"
                className="btn-editorial-secondary px-6 py-3.5 text-xs font-mono uppercase tracking-wider"
              >
                Security Dossier
              </Link>
            </div>
          </div>

          {/* Right Column: Large Editorial Portrait & Verified Identity (5 cols) */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="w-full max-w-[430px] rounded-lg border border-[var(--color-border)] bg-[#101014] p-3 shadow-2xl">
              <div className="relative aspect-[4/5] w-full rounded-md overflow-hidden bg-zinc-950 border border-white/[0.08] group">
                <Image
                  src={portraitUrl}
                  alt={profile.displayName || "Jaishanth M."}
                  fill
                  className="object-cover grayscale contrast-125 group-hover:grayscale-0 transition-all duration-700"
                  sizes="(max-width: 768px) 100vw, 430px"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-transparent to-transparent opacity-65" />
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs font-mono">
                  <span className="px-2.5 py-1 rounded-xs bg-black/75 backdrop-blur-md border border-white/10 text-white font-medium">
                    JAISHANTH M.
                  </span>
                  <span className="text-[var(--color-signal-red)] font-semibold text-[11px]">
                    RED TEAM OPS
                  </span>
                </div>
              </div>

              {/* Verified Ledger */}
              <div className="mt-4 p-4 rounded-md bg-[#09090b] border border-white/[0.04] space-y-2.5 font-mono text-xs">
                <div className="flex justify-between py-1 border-b border-white/[0.04]">
                  <span className="text-zinc-500">Degree</span>
                  <span className="text-zinc-200 font-medium">B.E. Cybersecurity</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/[0.04]">
                  <span className="text-zinc-500">TryHackMe</span>
                  <span className="text-emerald-400 font-semibold">{thmStats?.percentile || "Top 5%"} Global</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/[0.04]">
                  <span className="text-zinc-500">Bug Bounty</span>
                  <span className="text-zinc-200">Bugcrowd Researcher</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-zinc-500">Focus Area</span>
                  <span className="text-zinc-200">Adversarial Emulation</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// 2. PROJECTS SECTION — EDITORIAL CASE-STUDY COMPOSITION (ALTERNATING)
// ============================================================================
export async function ProjectsSection() {
  const projects = await getFeaturedProjects(3);
  if (projects.length === 0) return null;

  return (
    <section id="projects" className="py-28 px-6 sm:px-10 relative border-t border-[var(--color-border)]">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-10">
          <span className="text-xs font-mono text-[var(--color-signal-red)] tracking-widest uppercase font-semibold">
            02 // SELECTED WORK & TOOLING
          </span>
          <div className="h-[1px] flex-1 bg-gradient-to-r from-white/10 to-transparent" />
        </div>

        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-16 gap-4">
          <div>
            <h2 className="font-editorial text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white">
              Offensive Security Tools
            </h2>
            <p className="text-base sm:text-lg text-[var(--color-text-secondary)] mt-3 max-w-2xl font-sans">
              Purpose-built reconnaissance platforms, packet inspection pipelines, and penetration testing suites engineered from first principles.
            </p>
          </div>
          <Link
            href="/projects"
            className="text-xs font-mono text-zinc-400 hover:text-white transition-colors whitespace-nowrap"
          >
            All Projects [{projects.length}] →
          </Link>
        </div>

        <div className="space-y-16">
          {projects.map((project, idx) => {
            const isReversed = idx % 2 === 1;

            return (
              <div
                key={project.id}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center p-8 sm:p-12 rounded-lg border border-[var(--color-border)] bg-[#101014] hover:border-white/20 transition-all group"
              >
                {/* Content Column */}
                <div className={`lg:col-span-7 ${isReversed ? "lg:order-2" : "lg:order-1"}`}>
                  <div className="flex items-center gap-3 font-mono text-xs mb-4">
                    <span className="text-[var(--color-signal-red)] font-bold text-sm">
                      0{idx + 1}
                    </span>
                    <span className="text-zinc-600">/</span>
                    <span className="text-zinc-400 uppercase tracking-wider">
                      {project.category || "Security Engineering"}
                    </span>
                  </div>

                  <h3 className="font-editorial text-3xl sm:text-4xl font-extrabold text-white mb-4 leading-tight group-hover:text-white">
                    <Link href={`/projects/${project.slug}`} className="hover:text-[var(--color-signal-red)] transition-colors">
                      {project.name}
                    </Link>
                  </h3>

                  <p className="text-base text-[var(--color-text-secondary)] leading-relaxed mb-6 font-sans">
                    {project.shortDescription}
                  </p>

                  {project.technologies && project.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-8">
                      {project.technologies.map((t) => (
                        <span
                          key={t.skillId}
                          className="px-2.5 py-1 rounded-xs bg-zinc-900 border border-white/[0.08] text-xs font-mono text-zinc-300"
                        >
                          {t.skill.name}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex flex-wrap items-center gap-6 pt-6 border-t border-white/[0.06] text-xs font-mono">
                    <Link
                      href={`/projects/${project.slug}`}
                      className="btn-editorial-primary px-5 py-2.5 text-xs font-mono uppercase tracking-wider font-semibold"
                    >
                      <span>Case Study</span>
                      <span>→</span>
                    </Link>

                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-zinc-400 hover:text-white transition-colors"
                      >
                        GitHub Repository ↗
                      </a>
                    )}
                  </div>
                </div>

                {/* Visual Preview Column */}
                <div className={`lg:col-span-5 ${isReversed ? "lg:order-1" : "lg:order-2"}`}>
                  <div className="relative aspect-[16/10] w-full rounded-md overflow-hidden bg-zinc-950 border border-white/[0.08] flex flex-col justify-between p-6 shadow-inner group-hover:border-[var(--color-signal-red)]/40 transition-colors">
                    <div className="flex items-center justify-between font-mono text-[10px] text-zinc-500">
                      <span className="text-[var(--color-signal-red)] font-semibold">SYS // {project.slug.toUpperCase()}</span>
                      <span>PRODUCTION</span>
                    </div>

                    <div className="my-auto text-center py-4">
                      <div className="w-10 h-10 mx-auto mb-3 rounded-sm bg-zinc-900 border border-white/10 flex items-center justify-center font-mono font-bold text-sm text-white">
                        0{idx + 1}
                      </div>
                      <span className="font-heading font-extrabold text-xl text-white block">
                        {project.name.split("—")[0].trim()}
                      </span>
                      <span className="text-xs text-zinc-400 font-mono mt-1 block">
                        Architectural Specification & Proof of Concept
                      </span>
                    </div>

                    <div className="flex items-center justify-between font-mono text-[9px] text-zinc-600 border-t border-white/[0.04] pt-3">
                      <span>SEC_LEVEL: CONFIDENTIAL</span>
                      <span className="text-zinc-400">ENGINEERED BY JAISHANTH</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// 3. RESEARCH SECTION — PUBLICATION-STYLE VULNERABILITY INDEX
// ============================================================================
export async function ResearchSection() {
  const research = (await getPublishedResearch()).slice(0, 3);
  if (research.length === 0) return null;

  return (
    <section id="research" className="py-28 px-6 sm:px-10 relative border-t border-[var(--color-border)]">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-10">
          <span className="text-xs font-mono text-[var(--color-signal-red)] tracking-widest uppercase font-semibold">
            03 // VULNERABILITY DISCLOSURES & PAPERS
          </span>
          <div className="h-[1px] flex-1 bg-gradient-to-r from-white/10 to-transparent" />
        </div>

        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-16 gap-4">
          <div>
            <h2 className="font-editorial text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white">
              Security Research
            </h2>
            <p className="text-base sm:text-lg text-[var(--color-text-secondary)] mt-3 max-w-2xl font-sans">
              Methodological breakdowns, attack vector mechanics, and defensive mitigation strategies documented from responsible disclosures.
            </p>
          </div>
          <Link
            href="/research"
            className="text-xs font-mono text-zinc-400 hover:text-white transition-colors whitespace-nowrap"
          >
            All Research Writeups →
          </Link>
        </div>

        <div className="space-y-6">
          {research.map((item, idx) => (
            <div
              key={item.id}
              className="p-8 sm:p-10 rounded-lg border border-[var(--color-border)] bg-[#101014] hover:border-[var(--color-signal-red)]/50 transition-all group"
            >
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 mb-4 font-mono text-xs">
                <div className="flex items-center gap-3">
                  <span className="text-[var(--color-signal-red)] font-bold">0{idx + 1}</span>
                  <span className="px-2 py-0.5 rounded-xs bg-red-950/40 text-red-300 border border-red-900/50 text-[10px] uppercase font-semibold">
                    {item.disclosureStatus === "PUBLISHED" ? "RESPONSIBLE DISCLOSURE" : item.disclosureStatus}
                  </span>
                  {item.researchType && (
                    <span className="text-zinc-400">{item.researchType}</span>
                  )}
                </div>
                <span className="text-zinc-500">
                  {new Date(item.date).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                </span>
              </div>

              <h3 className="font-editorial text-2xl sm:text-3xl font-bold text-white mb-3 group-hover:text-white transition-colors">
                <Link href={`/research/${item.slug}`}>
                  {item.title}
                </Link>
              </h3>

              <p className="text-base text-[var(--color-text-secondary)] leading-relaxed mb-6 font-sans">
                {item.summary}
              </p>

              {item.targetContext && (
                <div className="mb-6 font-mono text-xs text-zinc-400">
                  <span className="text-zinc-500 font-semibold">TARGET CONTEXT:</span> {item.targetContext}
                </div>
              )}

              <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between font-mono text-xs">
                <Link
                  href={`/research/${item.slug}`}
                  className="text-white hover:text-[var(--color-signal-red)] font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <span>Read Investigation Dossier</span>
                  <span>→</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// 4. SKILLS SECTION — SOPHISTICATED CAPABILITY INDEX
// ============================================================================
export async function SkillsSection() {
  const categories = await getVisibleSkillCategories();
  if (categories.length === 0) return null;

  return (
    <section id="skills" className="py-28 px-6 sm:px-10 relative border-t border-[var(--color-border)]">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-10">
          <span className="text-xs font-mono text-[var(--color-signal-red)] tracking-widest uppercase font-semibold">
            04 // TECHNICAL CAPABILITIES
          </span>
          <div className="h-[1px] flex-1 bg-gradient-to-r from-white/10 to-transparent" />
        </div>

        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-16 gap-4">
          <div>
            <h2 className="font-editorial text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white">
              Technical Capabilities
            </h2>
            <p className="text-base sm:text-lg text-[var(--color-text-secondary)] mt-3 max-w-2xl font-sans">
              Practical capabilities across offensive security, systems auditing, and security tooling. Zero arbitrary percentage meters.
            </p>
          </div>
          <Link
            href="/skills"
            className="text-xs font-mono text-zinc-400 hover:text-white transition-colors whitespace-nowrap"
          >
            Complete Matrix →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((cat, idx) => (
            <div
              key={cat.id}
              className="p-8 rounded-lg border border-[var(--color-border)] bg-[#101014] flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-6 pb-3 border-b border-white/[0.06] font-mono text-xs">
                  <span className="text-[var(--color-signal-red)] font-bold">
                    DOMAIN 0{idx + 1}
                  </span>
                  <span className="text-zinc-500">
                    {cat.skills.length} COMPETENCIES
                  </span>
                </div>

                <h3 className="font-editorial text-xl font-bold text-white mb-6">
                  {cat.name}
                </h3>

                <ul className="space-y-3">
                  {cat.skills.map((skill) => (
                    <li
                      key={skill.id}
                      className="flex items-center justify-between text-sm text-zinc-300 font-sans py-1.5 border-b border-white/[0.02]"
                    >
                      <span>{skill.name}</span>
                      <span className="w-1 h-1 rounded-full bg-[var(--color-signal-red)]" />
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// 5. EXPERIENCE SECTION — CAREER & ENGAGEMENT TIMELINE
// ============================================================================
export async function ExperienceSection() {
  const experiences = await getVisibleExperience();
  if (experiences.length === 0) return null;

  return (
    <section id="experience" className="py-28 px-6 sm:px-10 relative border-t border-[var(--color-border)]">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-10">
          <span className="text-xs font-mono text-[var(--color-signal-red)] tracking-widest uppercase font-semibold">
            05 // TRACK RECORD & ENGAGEMENTS
          </span>
          <div className="h-[1px] flex-1 bg-gradient-to-r from-white/10 to-transparent" />
        </div>

        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-16 gap-4">
          <div>
            <h2 className="font-editorial text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white">
              Experience & Engagements
            </h2>
            <p className="text-base sm:text-lg text-[var(--color-text-secondary)] mt-3 max-w-2xl font-sans">
              Practical security testing, vulnerability investigations, and active security contributions.
            </p>
          </div>
          <Link
            href="/experience"
            className="text-xs font-mono text-zinc-400 hover:text-white transition-colors whitespace-nowrap"
          >
            Engagement History →
          </Link>
        </div>

        <div className="space-y-8">
          {experiences.map((exp) => (
            <div
              key={exp.id}
              className="p-8 sm:p-10 rounded-lg border border-[var(--color-border)] bg-[#101014]"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                <div>
                  <div className="inline-flex items-center gap-2 px-2 py-0.5 rounded-xs bg-zinc-900 text-zinc-300 text-xs font-mono mb-2 border border-white/[0.08]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-signal-red)]" />
                    <span>{exp.current ? "ACTIVE ENGAGEMENT" : "COMPLETED"}</span>
                  </div>
                  <h3 className="font-editorial text-2xl font-bold text-white">
                    {exp.role}
                  </h3>
                  <div className="text-sm font-medium text-zinc-400 mt-1">
                    {exp.organization} {exp.location ? `· ${exp.location}` : ""}
                  </div>
                </div>
                <div className="font-mono text-xs text-zinc-500 sm:text-right">
                  {new Date(exp.startDate).toLocaleDateString("en-US", { month: "short", year: "numeric" })} —{" "}
                  {exp.current
                    ? "Present"
                    : exp.endDate
                    ? new Date(exp.endDate).toLocaleDateString("en-US", { month: "short", year: "numeric" })
                    : "Present"}
                </div>
              </div>

              <p className="text-base text-[var(--color-text-secondary)] leading-relaxed mb-6 font-sans">
                {exp.description}
              </p>

              {exp.achievements && exp.achievements.length > 0 && (
                <ul className="space-y-2 mb-6 font-sans text-sm text-[var(--color-text-secondary)]">
                  {exp.achievements.map((ach) => (
                    <li key={ach.id} className="flex items-start gap-3">
                      <span className="text-[var(--color-signal-red)] font-mono">―</span>
                      <span>{ach.text}</span>
                    </li>
                  ))}
                </ul>
              )}

              {exp.organizationUrl && (
                <div className="pt-4 border-t border-white/[0.06]">
                  <a
                    href={exp.organizationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-mono text-zinc-400 hover:text-white"
                  >
                    <span>Organization: {exp.organizationUrl} ↗</span>
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// 6. EDUCATION SECTION — FORMAL ACADEMIC FOUNDATIONS (ONLY PLACE FOR COLLEGE NAME)
// ============================================================================
export async function EducationSection() {
  const education = await prisma.education.findMany({ where: { visible: true }, orderBy: { sortOrder: "asc" } });
  if (education.length === 0) return null;
  const ed = education[0];

  return (
    <section id="education" className="py-28 px-6 sm:px-10 relative border-t border-[var(--color-border)]">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-10">
          <span className="text-xs font-mono text-[var(--color-signal-red)] tracking-widest uppercase font-semibold">
            06 // ACADEMIC RIGOR & SYSTEMS FOUNDATIONS
          </span>
          <div className="h-[1px] flex-1 bg-gradient-to-r from-white/10 to-transparent" />
        </div>

        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <div>
            <h2 className="font-editorial text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white">
              Formal Education
            </h2>
            <p className="text-base sm:text-lg text-[var(--color-text-secondary)] mt-3 max-w-2xl font-sans">
              Theoretical foundation in cryptography, operating system internals, and network architectures.
            </p>
          </div>
        </div>

        <div className="p-8 sm:p-10 rounded-lg border border-[var(--color-border)] bg-[#101014]">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
            <div>
              <span className="font-mono text-xs text-[var(--color-signal-red)] uppercase">
                DEGREE CANDIDATE ({new Date(ed.startDate).getFullYear()} – {ed.endDate ? new Date(ed.endDate).getFullYear() : "2029"})
              </span>
              <h3 className="font-editorial text-2xl sm:text-3xl font-bold text-white mt-1">
                {ed.institution}
              </h3>
              <div className="text-base text-zinc-300 font-medium mt-1">
                {ed.degree} {ed.field ? `— ${ed.field}` : ""}
              </div>
            </div>
            {ed.location && (
              <span className="font-mono text-xs text-zinc-500">
                {ed.location}
              </span>
            )}
          </div>

          <p className="text-base text-[var(--color-text-secondary)] leading-relaxed mb-6 font-sans">
            {ed.description}
          </p>

          {ed.websiteUrl && (
            <a
              href={ed.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-mono text-zinc-400 hover:text-white"
            >
              <span>Institution Portal: {ed.websiteUrl} ↗</span>
            </a>
          )}
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// 7. CERTIFICATIONS SECTION — CREDENTIAL ARCHIVE
// ============================================================================
export async function CertificationsSection() {
  const certs = await getVisibleCertifications();
  if (certs.length === 0) return null;

  return (
    <section id="certifications" className="py-28 px-6 sm:px-10 relative border-t border-[var(--color-border)]">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-10">
          <span className="text-xs font-mono text-[var(--color-signal-red)] tracking-widest uppercase font-semibold">
            07 // CREDENTIALS & CERTIFICATIONS
          </span>
          <div className="h-[1px] flex-1 bg-gradient-to-r from-white/10 to-transparent" />
        </div>

        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-16 gap-4">
          <div>
            <h2 className="font-editorial text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white">
              Certifications & Industry Credentials
            </h2>
            <p className="text-base sm:text-lg text-[var(--color-text-secondary)] mt-3 max-w-2xl font-sans">
              Verified credentials in network defense, ethical hacking methodology, and practical penetration testing.
            </p>
          </div>
          <Link
            href="/certifications"
            className="text-xs font-mono text-zinc-400 hover:text-white transition-colors whitespace-nowrap"
          >
            All Credentials →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {certs.map((cert) => (
            <div
              key={cert.id}
              className="rounded-lg border border-[var(--color-border)] bg-[#101014] overflow-hidden flex flex-col justify-between hover:border-white/20 transition-all group"
            >
              {cert.imageMedia && (
                <div className="relative w-full h-48 bg-[#09090b] border-b border-white/[0.06] overflow-hidden">
                  <Image
                    src={cert.imageMedia.url}
                    alt={cert.imageMedia.altText || cert.name}
                    fill
                    className="object-cover grayscale contrast-125 group-hover:grayscale-0 transition-all duration-500"
                  />
                </div>
              )}

              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="font-mono text-xs text-[var(--color-signal-red)] mb-1">
                    {cert.issuer}
                  </div>
                  <h3 className="font-editorial text-lg font-bold text-white mb-2">
                    {cert.name}
                  </h3>
                  {cert.description && (
                    <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed mb-4">
                      {cert.description}
                    </p>
                  )}
                </div>

                <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between font-mono text-xs text-zinc-500">
                  <span>Issued: {new Date(cert.issueDate).toLocaleDateString("en-US", { month: "short", year: "numeric" })}</span>
                  {cert.verificationUrl ? (
                    <a
                      href={cert.verificationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-zinc-300 hover:text-[var(--color-signal-red)] transition-colors"
                    >
                      Verify ↗
                    </a>
                  ) : (
                    <span className="text-zinc-400">Authenticated</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// 8. ACHIEVEMENTS SECTION — COMPETITIVE MILESTONES
// ============================================================================
export async function AchievementsSection() {
  const achievements = await getVisibleAchievements();
  if (achievements.length === 0) return null;

  return (
    <section id="achievements" className="py-28 px-6 sm:px-10 relative border-t border-[var(--color-border)]">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-10">
          <span className="text-xs font-mono text-[var(--color-signal-red)] tracking-widest uppercase font-semibold">
            08 // MILESTONES & HONORS
          </span>
          <div className="h-[1px] flex-1 bg-gradient-to-r from-white/10 to-transparent" />
        </div>

        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-16 gap-4">
          <div>
            <h2 className="font-editorial text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white">
              Milestones & Rankings
            </h2>
            <p className="text-base sm:text-lg text-[var(--color-text-secondary)] mt-3 max-w-2xl font-sans">
              Provable platform achievements, rankings, and research recognitions.
            </p>
          </div>
          <Link
            href="/achievements"
            className="text-xs font-mono text-zinc-400 hover:text-white transition-colors whitespace-nowrap"
          >
            All Achievements →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {achievements.map((ach) => (
            <div
              key={ach.id}
              className="p-8 rounded-lg border border-[var(--color-border)] bg-[#101014] flex items-start gap-5 hover:border-white/20 transition-all"
            >
              <div className="w-12 h-12 rounded-sm bg-zinc-900 border border-[var(--color-border)] flex items-center justify-center text-[var(--color-signal-red)] font-mono font-bold text-lg flex-shrink-0">
                ★
              </div>
              <div className="flex-1">
                <div className="font-mono text-xs text-zinc-500 mb-1 uppercase">
                  {ach.category}
                </div>
                <h3 className="font-editorial text-xl font-bold text-white mb-2">
                  {ach.title}
                </h3>
                <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed mb-3">
                  {ach.description}
                </p>
                {ach.url && (
                  <a
                    href={ach.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-mono text-zinc-400 hover:text-white transition-colors"
                  >
                    <span>Public Verification ↗</span>
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// 9. BUG BOUNTY SECTION — RESPONSIBLE DISCLOSURE LEDGER
// ============================================================================
export async function BugBountySection() {
  const profiles = await getVisibleBugBountyProfiles();
  if (profiles.length === 0) return null;

  return (
    <section id="bug-bounty" className="py-28 px-6 sm:px-10 relative border-t border-[var(--color-border)]">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-10">
          <span className="text-xs font-mono text-[var(--color-signal-red)] tracking-widest uppercase font-semibold">
            09 // RESPONSIBLE DISCLOSURE LEDGER
          </span>
          <div className="h-[1px] flex-1 bg-gradient-to-r from-white/10 to-transparent" />
        </div>

        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-16 gap-4">
          <div>
            <h2 className="font-editorial text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white">
              Bug Bounty & Disclosures
            </h2>
            <p className="text-base sm:text-lg text-[var(--color-text-secondary)] mt-3 max-w-2xl font-sans">
              Ethical vulnerability discovery across public and private disclosure scopes.
            </p>
          </div>
          <Link
            href="/bug-bounty"
            className="text-xs font-mono text-zinc-400 hover:text-white transition-colors whitespace-nowrap"
          >
            Bug Bounty Overview →
          </Link>
        </div>

        {profiles.map((profile) => (
          <div
            key={profile.id}
            className="p-8 sm:p-10 rounded-lg border border-[var(--color-border)] bg-[#101014] mb-8"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-white/[0.06]">
              <div>
                <span className="font-mono text-xs text-[var(--color-signal-red)] uppercase">
                  PLATFORM: {profile.platform}
                </span>
                <h3 className="font-editorial text-2xl font-bold text-white mt-1">
                  @{profile.researcherName || "jaishanth"}
                </h3>
              </div>
              <a
                href={profile.profileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-editorial-secondary px-4 py-2 text-xs font-mono"
              >
                Inspect Researcher Profile ↗
              </a>
            </div>

            <p className="text-base text-[var(--color-text-secondary)] leading-relaxed mb-6">
              {profile.description}
            </p>

            {profile.findings && profile.findings.length > 0 && (
              <div className="space-y-3 pt-4 border-t border-white/[0.06]">
                <div className="font-mono text-xs text-zinc-500 uppercase tracking-wider mb-2">
                  DISCLOSED FINDINGS & ACKNOWLEDGEMENTS
                </div>
                {profile.findings.map((f) => (
                  <div key={f.id} className="p-4 rounded-sm bg-zinc-950 border border-white/[0.06] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="font-medium text-sm text-white">{f.title}</div>
                      {f.description && <div className="text-xs text-zinc-400 mt-1">{f.description}</div>}
                    </div>
                    <div className="flex items-center gap-2 font-mono text-[10px]">
                      {f.severity && (
                        <span className="px-2 py-0.5 rounded-xs bg-red-950/40 text-red-300 border border-red-900/40">
                          {f.severity}
                        </span>
                      )}
                      {f.isHallOfFame && (
                        <span className="px-2 py-0.5 rounded-xs bg-amber-950/40 text-amber-300 border border-amber-900/40">
                          HALL OF FAME
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

// ============================================================================
// 10. BLOG SECTION — TECHNICAL DISPATCHES
// ============================================================================
export async function BlogSection() {
  const posts = (await getPublishedPosts()).slice(0, 3);
  if (posts.length === 0) return null;

  return (
    <section id="blog" className="py-28 px-6 sm:px-10 relative border-t border-[var(--color-border)]">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-10">
          <span className="text-xs font-mono text-[var(--color-signal-red)] tracking-widest uppercase font-semibold">
            10 // TECHNICAL WRITING
          </span>
          <div className="h-[1px] flex-1 bg-gradient-to-r from-white/10 to-transparent" />
        </div>

        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-16 gap-4">
          <div>
            <h2 className="font-editorial text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white">
              Security Notes & Dispatches
            </h2>
            <p className="text-base sm:text-lg text-[var(--color-text-secondary)] mt-3 max-w-2xl font-sans">
              Field observations, OSINT pipelines, and defensive engineering insights.
            </p>
          </div>
          <Link
            href="/blog"
            className="text-xs font-mono text-zinc-400 hover:text-white transition-colors whitespace-nowrap"
          >
            All Articles →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {posts.map((post) => (
            <div
              key={post.id}
              className="p-8 rounded-lg border border-[var(--color-border)] bg-[#101014] hover:border-white/20 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="font-mono text-xs text-zinc-500 mb-3 flex items-center justify-between">
                  <span>
                    {post.publishedAt
                      ? new Date(post.publishedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                      : "Published"}
                  </span>
                  {post.readingTimeMins && <span>{post.readingTimeMins} MIN READ</span>}
                </div>
                <h3 className="font-editorial text-2xl font-bold text-white mb-3 group-hover:text-[var(--color-signal-red)] transition-colors">
                  <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                </h3>
                <p className="text-base text-[var(--color-text-secondary)] leading-relaxed mb-6 font-sans">
                  {post.excerpt}
                </p>
              </div>

              <div className="pt-4 border-t border-white/[0.06]">
                <Link
                  href={`/blog/${post.slug}`}
                  className="text-xs font-mono text-zinc-300 hover:text-white flex items-center gap-1.5 transition-colors"
                >
                  <span>Read Article</span>
                  <span>→</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// 11. CONTACT SECTION — DIRECT INQUIRIES
// ============================================================================
export function ContactSection() {
  return (
    <section id="contact" className="py-28 px-6 sm:px-10 relative border-t border-[var(--color-border)]">
      <div className="max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-zinc-900 border border-[var(--color-border)] mb-8 text-xs font-mono tracking-wider uppercase text-zinc-300">
          <span className="status-pulsar" />
          <span>DIRECT TRANSMISSION</span>
        </div>

        <h2 className="font-editorial text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white mb-6">
          Ready to collaborate on security research?
        </h2>

        <p className="text-base sm:text-lg text-[var(--color-text-secondary)] leading-relaxed mb-10 max-w-2xl mx-auto font-sans">
          Whether you have an inquiry regarding vulnerability disclosures, offensive tooling collaboration, or red team internships, my direct channel is open.
        </p>

        <div className="flex flex-wrap justify-center items-center gap-4">
          <Link
            href="/contact"
            className="btn-editorial-primary px-8 py-3.5 text-xs font-mono uppercase tracking-wider font-semibold"
          >
            Open Transmission Channel →
          </Link>
          <a
            href="mailto:jaishanthcys@gmail.com"
            className="btn-editorial-secondary px-8 py-3.5 text-xs font-mono"
          >
            jaishanthcys@gmail.com
          </a>
        </div>
      </div>
    </section>
  );
}
