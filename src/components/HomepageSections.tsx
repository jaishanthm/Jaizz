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
import { prisma } from "@/lib/prisma";

// ============================================================================
// 1. ABOUT SECTION
// ============================================================================
export async function AboutSection() {
  const profile = await getProfile();
  if (!profile) return null;

  return (
    <section id="about" className="py-24 px-6 relative border-t border-[var(--color-border)]">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-xs font-mono text-[var(--color-cool-cyan)] tracking-widest uppercase">
            // 01. DOSSIER & PHILOSOPHY
          </span>
          <div className="h-[1px] flex-1 bg-gradient-to-r from-[var(--color-border-glow)] to-transparent" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-7">
            <h2 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight mb-6 text-[var(--color-text-primary)]">
              I build, break, and understand systems.
            </h2>
            <p className="text-base sm:text-lg text-[var(--color-text-secondary)] leading-relaxed mb-6 font-sans">
              {profile.longBio || profile.shortBio}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-8">
              <div className="glass-card p-4 rounded-xl border border-[var(--color-border)]">
                <div className="font-mono text-xs text-[var(--color-cool-cyan)] mb-1">01. RESEARCH</div>
                <div className="text-sm font-semibold text-[var(--color-text-primary)] mb-1">Web VAPT</div>
                <p className="text-xs text-[var(--color-text-muted)]">Responsible disclosure, CORS flaws, access controls.</p>
              </div>
              <div className="glass-card p-4 rounded-xl border border-[var(--color-border)]">
                <div className="font-mono text-xs text-[var(--color-electric-blue)] mb-1">02. SYSTEMS</div>
                <div className="text-sm font-semibold text-[var(--color-text-primary)] mb-1">Active Directory</div>
                <p className="text-xs text-[var(--color-text-muted)]">Kerberos attacks, Kerberoasting, hardening.</p>
              </div>
              <div className="glass-card p-4 rounded-xl border border-[var(--color-border)]">
                <div className="font-mono text-xs text-emerald-400 mb-1">03. TOOLING</div>
                <div className="text-sm font-semibold text-[var(--color-text-primary)] mb-1">Automation</div>
                <p className="text-xs text-[var(--color-text-muted)]">Threat reconnaissance and packet telemetry tools.</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <Link
                href="/about"
                className="btn-magnetic px-5 py-2.5 rounded-xl text-sm font-medium bg-[var(--color-electric-blue)] text-white hover:bg-[var(--color-primary-hover)] transition-all shadow-[0_0_15px_rgba(43,108,255,0.3)]"
              >
                Read Complete Background →
              </Link>
              <Link
                href="/resume"
                className="btn-magnetic px-5 py-2.5 rounded-xl text-sm font-medium glass-card text-[var(--color-text-primary)] hover:border-[var(--color-border-glow)] transition-all"
              >
                View Dossier
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="glass-panel-elevated p-6 rounded-2xl border border-[var(--color-border-glow)] relative">
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-[var(--color-border-subtle)] font-mono text-xs">
                <span className="text-[var(--color-cool-cyan)]">VERIFIED IDENTITY HUB</span>
                <span className="text-[var(--color-text-muted)]">UID: 2026-MCET-CY</span>
              </div>
              <div className="space-y-3.5 text-sm">
                <div className="flex justify-between items-center py-1 border-b border-[var(--color-border-subtle)]">
                  <span className="text-[var(--color-text-muted)]">Institution</span>
                  <span className="font-medium text-[var(--color-text-primary)] text-right">MCET Pollachi</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-[var(--color-border-subtle)]">
                  <span className="text-[var(--color-text-muted)]">Degree</span>
                  <span className="font-medium text-[var(--color-text-primary)] text-right">B.E. Cybersecurity</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-[var(--color-border-subtle)]">
                  <span className="text-[var(--color-text-muted)]">Bug Bounty</span>
                  <span className="font-mono text-xs text-[var(--color-cool-cyan)]">Bugcrowd /h/jaishanth</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-[var(--color-border-subtle)]">
                  <span className="text-[var(--color-text-muted)]">TryHackMe</span>
                  <span className="font-mono text-xs text-emerald-400">Top 1% Global Ranking</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-[var(--color-text-muted)]">Availability</span>
                  <span className="font-medium text-[var(--color-text-primary)] text-right">Internship & Collaborations</span>
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
// 2. EXPERIENCE SECTION
// ============================================================================
export async function ExperienceSection() {
  const experiences = await getVisibleExperience();
  if (experiences.length === 0) return null;

  return (
    <section id="experience" className="py-24 px-6 relative border-t border-[var(--color-border)]">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-xs font-mono text-[var(--color-cool-cyan)] tracking-widest uppercase">
            // 02. TRACK RECORD
          </span>
          <div className="h-[1px] flex-1 bg-gradient-to-r from-[var(--color-border-glow)] to-transparent" />
        </div>

        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <div>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight text-[var(--color-text-primary)]">
              Security Experience & Research
            </h2>
            <p className="text-sm text-[var(--color-text-secondary)] mt-2">
              Systematic vulnerability discovery, offensive testing, and responsible disclosures.
            </p>
          </div>
          <Link href="/experience" className="text-sm font-mono text-[var(--color-cool-cyan)] hover:underline whitespace-nowrap">
            Full Engagement History →
          </Link>
        </div>

        <div className="space-y-6">
          {experiences.map((exp) => (
            <div
              key={exp.id}
              className="glass-card p-6 sm:p-8 rounded-2xl border border-[var(--color-border)] hover:border-[var(--color-border-glow)] transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                <div>
                  <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-[rgba(43,108,255,0.15)] text-[var(--color-cool-cyan)] text-xs font-mono mb-2">
                    {exp.current ? "CURRENT ENGAGEMENT" : "COMPLETED"}
                  </div>
                  <h3 className="font-heading text-xl font-bold text-[var(--color-text-primary)]">
                    {exp.role}
                  </h3>
                  <div className="text-sm font-medium text-[var(--color-electric-blue)] mt-0.5">
                    {exp.organization} {exp.location ? `· ${exp.location}` : ""}
                  </div>
                </div>
                <div className="font-mono text-xs text-[var(--color-text-muted)] sm:text-right">
                  {new Date(exp.startDate).toLocaleDateString("en-US", { month: "short", year: "numeric" })} —{" "}
                  {exp.current
                    ? "Present"
                    : exp.endDate
                    ? new Date(exp.endDate).toLocaleDateString("en-US", { month: "short", year: "numeric" })
                    : "Present"}
                </div>
              </div>

              <p className="text-sm sm:text-base text-[var(--color-text-secondary)] leading-relaxed mb-4">
                {exp.description}
              </p>

              {exp.achievements && exp.achievements.length > 0 && (
                <ul className="space-y-2 mb-4 font-sans text-sm text-[var(--color-text-secondary)]">
                  {exp.achievements.map((ach) => (
                    <li key={ach.id} className="flex items-start gap-2">
                      <span className="text-[var(--color-cool-cyan)] font-mono">&gt;</span>
                      <span>{ach.text}</span>
                    </li>
                  ))}
                </ul>
              )}

              {exp.organizationUrl && (
                <div className="pt-2">
                  <a
                    href={exp.organizationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-mono text-[var(--color-cool-cyan)] hover:underline"
                  >
                    <span>Verified Organization: {exp.organizationUrl}</span>
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
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
// 3. SKILLS SECTION
// ============================================================================
export async function SkillsSection() {
  const categories = await getVisibleSkillCategories();
  if (categories.length === 0) return null;

  return (
    <section id="skills" className="py-24 px-6 relative border-t border-[var(--color-border)]">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-xs font-mono text-[var(--color-cool-cyan)] tracking-widest uppercase">
            // 03. TECHNICAL MATRIX
          </span>
          <div className="h-[1px] flex-1 bg-gradient-to-r from-[var(--color-border-glow)] to-transparent" />
        </div>

        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <div>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight text-[var(--color-text-primary)]">
              Core Capabilities & Tooling
            </h2>
            <p className="text-sm text-[var(--color-text-secondary)] mt-2">
              Verified skills across offensive security, systems infrastructure, and exploit tooling. Zero arbitrary percentage bars.
            </p>
          </div>
          <Link href="/skills" className="text-sm font-mono text-[var(--color-cool-cyan)] hover:underline whitespace-nowrap">
            View Complete Matrix →
          </Link>
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
                className={`glass-card p-6 rounded-2xl border border-[var(--color-border)] border-t-2 ${accentClass} flex flex-col justify-between`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-heading text-lg font-bold text-[var(--color-text-primary)]">
                      {cat.name}
                    </h3>
                    <span className="font-mono text-xs text-[var(--color-text-muted)]">
                      {cat.skills.length} SKILLS
                    </span>
                  </div>

                  <ul className="space-y-2.5">
                    {cat.skills.map((skill) => (
                      <li
                        key={skill.id}
                        className="flex items-center gap-2.5 text-sm text-[var(--color-text-secondary)] font-sans"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-cool-cyan)]" />
                        <span>{skill.name}</span>
                      </li>
                    ))}
                  </ul>
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
// 4. PROJECTS SECTION
// ============================================================================
export async function ProjectsSection() {
  const projects = await getFeaturedProjects(3);
  if (projects.length === 0) return null;

  return (
    <section id="projects" className="py-24 px-6 relative border-t border-[var(--color-border)]">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-xs font-mono text-[var(--color-cool-cyan)] tracking-widest uppercase">
            // 04. ENGINEERING & IMPLEMENTATIONS
          </span>
          <div className="h-[1px] flex-1 bg-gradient-to-r from-[var(--color-border-glow)] to-transparent" />
        </div>

        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <div>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight text-[var(--color-text-primary)]">
              Featured Security Tools & Software
            </h2>
            <p className="text-sm text-[var(--color-text-secondary)] mt-2">
              Offensive engines, threat mapping utilities, and packet inspection pipelines built from scratch.
            </p>
          </div>
          <Link href="/projects" className="text-sm font-mono text-[var(--color-cool-cyan)] hover:underline whitespace-nowrap">
            All Projects & Architecture →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <div
              key={project.id}
              className="glass-card rounded-2xl border border-[var(--color-border)] hover:border-[var(--color-border-glow)] transition-all flex flex-col justify-between p-6 group"
            >
              <div>
                <div className="flex items-center justify-between mb-3 font-mono text-xs">
                  <span className="px-2 py-0.5 rounded bg-[rgba(43,108,255,0.15)] text-[var(--color-cool-cyan)]">
                    {project.category || "Security Tool"}
                  </span>
                  <span className="text-[var(--color-text-muted)]">STATUS: ACTIVE</span>
                </div>

                <h3 className="font-heading text-xl font-bold text-[var(--color-text-primary)] mb-3 group-hover:text-[var(--color-cool-cyan)] transition-colors">
                  <Link href={`/projects/${project.slug}`}>
                    {project.name}
                  </Link>
                </h3>

                <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed mb-6">
                  {project.shortDescription}
                </p>
              </div>

              <div className="pt-4 border-t border-[var(--color-border-subtle)] flex items-center justify-between">
                <Link
                  href={`/projects/${project.slug}`}
                  className="text-xs font-mono text-[var(--color-cool-cyan)] hover:underline flex items-center gap-1"
                >
                  <span>Architecture Details</span>
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>

                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-mono text-[var(--color-text-muted)] hover:text-white flex items-center gap-1"
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
      </div>
    </section>
  );
}

// ============================================================================
// 5. RESEARCH SECTION
// ============================================================================
export async function ResearchSection() {
  const research = (await getPublishedResearch()).slice(0, 3);
  if (research.length === 0) return null;

  return (
    <section id="research" className="py-24 px-6 relative border-t border-[var(--color-border)]">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-xs font-mono text-[var(--color-cool-cyan)] tracking-widest uppercase">
            // 05. DISCOVERY & VULNERABILITY ANALYSIS
          </span>
          <div className="h-[1px] flex-1 bg-gradient-to-r from-[var(--color-border-glow)] to-transparent" />
        </div>

        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <div>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight text-[var(--color-text-primary)]">
              Security Research & Disclosures
            </h2>
            <p className="text-sm text-[var(--color-text-secondary)] mt-2">
              Vulnerability breakdowns, attack path methodologies, and defensive mitigation engineering.
            </p>
          </div>
          <Link href="/research" className="text-sm font-mono text-[var(--color-cool-cyan)] hover:underline whitespace-nowrap">
            All Research Writeups →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {research.map((item) => (
            <div
              key={item.id}
              className="glass-panel-elevated rounded-2xl border border-[var(--color-border-glow)] p-6 sm:p-8 flex flex-col justify-between group hover:shadow-[0_0_30px_rgba(43,108,255,0.25)] transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-4 font-mono text-xs">
                  <span className="px-2.5 py-1 rounded bg-[rgba(0,229,255,0.12)] text-[var(--color-cool-cyan)] border border-[rgba(0,229,255,0.3)]">
                    {item.disclosureStatus === "PUBLISHED" ? "RESPONSIBLE DISCLOSURE" : item.disclosureStatus}
                  </span>
                  <span className="text-[var(--color-text-muted)]">
                    {new Date(item.date).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                  </span>
                </div>

                <h3 className="font-heading text-xl sm:text-2xl font-bold text-[var(--color-text-primary)] mb-3 group-hover:text-[var(--color-cool-cyan)] transition-colors leading-snug">
                  <Link href={`/research/${item.slug}`}>
                    {item.title}
                  </Link>
                </h3>

                <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed mb-6 font-sans">
                  {item.summary}
                </p>

                {item.targetContext && (
                  <div className="mb-6 font-mono text-xs text-[var(--color-text-muted)]">
                    <span className="text-[var(--color-electric-blue)]">TARGET_CONTEXT:</span> {item.targetContext}
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-[var(--color-border-subtle)] flex items-center justify-between">
                <Link
                  href={`/research/${item.slug}`}
                  className="text-sm font-mono text-[var(--color-cool-cyan)] hover:underline flex items-center gap-1.5"
                >
                  <span>Read Technical Dossier</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
                <span className="text-xs font-mono text-[var(--color-text-muted)]">
                  {item.researchType || "Analysis"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// 6. CERTIFICATIONS SECTION
// ============================================================================
export async function CertificationsSection() {
  const certs = await getVisibleCertifications();
  if (certs.length === 0) return null;

  return (
    <section id="certifications" className="py-24 px-6 relative border-t border-[var(--color-border)]">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-xs font-mono text-[var(--color-cool-cyan)] tracking-widest uppercase">
            // 06. VALIDATED CREDENTIALS
          </span>
          <div className="h-[1px] flex-1 bg-gradient-to-r from-[var(--color-border-glow)] to-transparent" />
        </div>

        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <div>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight text-[var(--color-text-primary)]">
              Certifications & Industry Credentials
            </h2>
            <p className="text-sm text-[var(--color-text-secondary)] mt-2">
              Verified certifications in network defense, ethical hacking methodology, and web application testing.
            </p>
          </div>
          <Link href="/certifications" className="text-sm font-mono text-[var(--color-cool-cyan)] hover:underline whitespace-nowrap">
            View All Credentials →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {certs.map((cert) => (
            <div
              key={cert.id}
              className="glass-card rounded-2xl border border-[var(--color-border)] hover:border-[var(--color-border-glow)] transition-all overflow-hidden flex flex-col"
            >
              {cert.imageMedia && (
                <div className="relative w-full h-44 bg-[var(--color-bg-surface)] border-b border-[var(--color-border)] overflow-hidden">
                  <Image
                    src={cert.imageMedia.url}
                    alt={cert.name}
                    fill
                    className="object-cover opacity-90 hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-bg-surface)] via-transparent to-transparent opacity-80" />
                </div>
              )}

              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="font-mono text-xs text-[var(--color-cool-cyan)] mb-1.5">
                    {cert.issuer}
                  </div>
                  <h3 className="font-heading text-lg font-bold text-[var(--color-text-primary)] mb-2">
                    {cert.name}
                  </h3>
                  {cert.description && (
                    <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed mb-4">
                      {cert.description}
                    </p>
                  )}
                </div>

                <div className="pt-3 border-t border-[var(--color-border-subtle)] flex items-center justify-between font-mono text-[11px] text-[var(--color-text-muted)]">
                  <span>Issued: {new Date(cert.issueDate).toLocaleDateString("en-US", { month: "short", year: "numeric" })}</span>
                  <span className="text-emerald-400">VERIFIED</span>
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
// 7. ACHIEVEMENTS SECTION
// ============================================================================
export async function AchievementsSection() {
  const achievements = await getVisibleAchievements();
  if (achievements.length === 0) return null;

  return (
    <section id="achievements" className="py-24 px-6 relative border-t border-[var(--color-border)]">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-xs font-mono text-[var(--color-cool-cyan)] tracking-widest uppercase">
            // 07. RECOGNITION & RANKINGS
          </span>
          <div className="h-[1px] flex-1 bg-gradient-to-r from-[var(--color-border-glow)] to-transparent" />
        </div>

        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <div>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight text-[var(--color-text-primary)]">
              Competitive Milestones & Rankings
            </h2>
            <p className="text-sm text-[var(--color-text-secondary)] mt-2">
              Provable rankings and security research milestones.
            </p>
          </div>
          <Link href="/achievements" className="text-sm font-mono text-[var(--color-cool-cyan)] hover:underline whitespace-nowrap">
            All Achievements →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {achievements.map((ach) => (
            <div
              key={ach.id}
              className="glass-panel-elevated p-6 rounded-2xl border border-[var(--color-border-glow)] flex items-start gap-4"
            >
              <div className="w-12 h-12 rounded-xl bg-[rgba(43,108,255,0.2)] border border-[var(--color-electric-blue)] flex items-center justify-center text-[var(--color-cool-cyan)] flex-shrink-0 font-mono font-bold">
                #1
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono text-xs text-[var(--color-cool-cyan)]">{ach.category}</span>
                  <span className="text-xs text-emerald-400 font-mono">VERIFIED</span>
                </div>
                <h3 className="font-heading text-lg font-bold text-[var(--color-text-primary)] mb-2">
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
                    className="inline-flex items-center gap-1 text-xs font-mono text-[var(--color-cool-cyan)] hover:underline"
                  >
                    <span>View Public Profile</span>
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
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
// 8. BUG BOUNTY SECTION
// ============================================================================
export async function BugBountySection() {
  const profiles = await getVisibleBugBountyProfiles();
  if (profiles.length === 0) return null;

  return (
    <section id="bug-bounty" className="py-24 px-6 relative border-t border-[var(--color-border)]">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-xs font-mono text-[var(--color-cool-cyan)] tracking-widest uppercase">
            // 08. RESPONSIBLE DISCLOSURE
          </span>
          <div className="h-[1px] flex-1 bg-gradient-to-r from-[var(--color-border-glow)] to-transparent" />
        </div>

        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <div>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight text-[var(--color-text-primary)]">
              Bug Bounty & Responsible Disclosure
            </h2>
            <p className="text-sm text-[var(--color-text-secondary)] mt-2">
              Active researcher participating in public and private vulnerability disclosure programs.
            </p>
          </div>
          <Link href="/bug-bounty" className="text-sm font-mono text-[var(--color-cool-cyan)] hover:underline whitespace-nowrap">
            Bug Bounty Overview →
          </Link>
        </div>

        {profiles.map((profile) => (
          <div
            key={profile.id}
            className="glass-card p-6 sm:p-8 rounded-2xl border border-[var(--color-border)] hover:border-[var(--color-border-glow)] transition-all mb-6"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <div>
                <span className="font-mono text-xs text-[var(--color-cool-cyan)] uppercase">
                  PLATFORM: {profile.platform}
                </span>
                <h3 className="font-heading text-2xl font-bold text-[var(--color-text-primary)]">
                  @{profile.researcherName || "jaishanth"}
                </h3>
              </div>
              <a
                href={profile.profileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-magnetic px-4 py-2 rounded-xl text-xs font-mono bg-[rgba(43,108,255,0.2)] text-[var(--color-cool-cyan)] border border-[var(--color-electric-blue)] hover:bg-[rgba(43,108,255,0.3)] transition-all"
              >
                Inspect Researcher Profile ↗
              </a>
            </div>

            <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed mb-6">
              {profile.description}
            </p>

            {profile.findings && profile.findings.length > 0 && (
              <div className="space-y-3 pt-4 border-t border-[var(--color-border-subtle)]">
                <div className="font-mono text-xs text-[var(--color-text-muted)] uppercase">
                  DISCLOSED FINDINGS & ACKNOWLEDGEMENTS
                </div>
                {profile.findings.map((f) => (
                  <div key={f.id} className="p-3.5 rounded-xl bg-[rgba(11,17,32,0.6)] border border-[var(--color-border)] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="font-medium text-sm text-[var(--color-text-primary)]">{f.title}</div>
                      {f.description && <div className="text-xs text-[var(--color-text-muted)] mt-0.5">{f.description}</div>}
                    </div>
                    <div className="flex items-center gap-2">
                      {f.severity && (
                        <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono text-[10px] border border-amber-500/30">
                          {f.severity}
                        </span>
                      )}
                      {f.isHallOfFame && (
                        <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-mono text-[10px] border border-purple-500/30">
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
// 9. EDUCATION SECTION
// ============================================================================
export async function EducationSection() {
  const education = await prisma.education.findMany({ where: { visible: true }, orderBy: { sortOrder: "asc" } });
  if (education.length === 0) return null;
  const ed = education[0];

  return (
    <section id="education" className="py-24 px-6 relative border-t border-[var(--color-border)]">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-xs font-mono text-[var(--color-cool-cyan)] tracking-widest uppercase">
            // 09. ACADEMIC RIGOR
          </span>
          <div className="h-[1px] flex-1 bg-gradient-to-r from-[var(--color-border-glow)] to-transparent" />
        </div>

        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <div>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight text-[var(--color-text-primary)]">
              Formal Education & Systems Foundations
            </h2>
            <p className="text-sm text-[var(--color-text-secondary)] mt-2">
              Theoretical foundation in cryptography, operating system internals, and network architectures.
            </p>
          </div>
          <Link href="/about#education" className="text-sm font-mono text-[var(--color-cool-cyan)] hover:underline whitespace-nowrap">
            Academic Background →
          </Link>
        </div>

        <div className="glass-panel-elevated p-8 rounded-2xl border border-[var(--color-border-glow)]">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
            <div>
              <span className="font-mono text-xs text-[var(--color-cool-cyan)]">DEGREE CANDIDATE (2022 – 2026)</span>
              <h3 className="font-heading text-2xl font-bold text-[var(--color-text-primary)] mt-1">
                {ed.institution}
              </h3>
              <div className="text-base text-[var(--color-electric-blue)] font-medium mt-1">
                {ed.degree} {ed.field ? `— ${ed.field}` : ""}
              </div>
            </div>
            {ed.location && (
              <span className="font-mono text-xs text-[var(--color-text-muted)]">
                {ed.location}
              </span>
            )}
          </div>

          <p className="text-sm sm:text-base text-[var(--color-text-secondary)] leading-relaxed mb-4">
            {ed.description}
          </p>

          {ed.websiteUrl && (
            <a
              href={ed.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-mono text-[var(--color-cool-cyan)] hover:underline"
            >
              <span>Institution Portal: {ed.websiteUrl}</span>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          )}
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// 10. BLOG SECTION
// ============================================================================
export async function BlogSection() {
  const posts = (await getPublishedPosts()).slice(0, 3);
  if (posts.length === 0) return null;

  return (
    <section id="blog" className="py-24 px-6 relative border-t border-[var(--color-border)]">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-xs font-mono text-[var(--color-cool-cyan)] tracking-widest uppercase">
            // 10. TECHNICAL DISPATCHES
          </span>
          <div className="h-[1px] flex-1 bg-gradient-to-r from-[var(--color-border-glow)] to-transparent" />
        </div>

        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <div>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight text-[var(--color-text-primary)]">
              Latest Security Notes & Articles
            </h2>
            <p className="text-sm text-[var(--color-text-secondary)] mt-2">
              Field observations, OSINT pipelines, and defensive engineering insights.
            </p>
          </div>
          <Link href="/blog" className="text-sm font-mono text-[var(--color-cool-cyan)] hover:underline whitespace-nowrap">
            All Articles →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {posts.map((post) => (
            <div
              key={post.id}
              className="glass-card p-6 sm:p-8 rounded-2xl border border-[var(--color-border)] hover:border-[var(--color-border-glow)] transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="font-mono text-xs text-[var(--color-text-muted)] mb-3">
                  {post.publishedAt
                    ? new Date(post.publishedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                    : "Published"}
                </div>
                <h3 className="font-heading text-xl font-bold text-[var(--color-text-primary)] mb-3 group-hover:text-[var(--color-cool-cyan)] transition-colors">
                  <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                </h3>
                <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed mb-6 font-sans">
                  {post.excerpt}
                </p>
              </div>

              <div className="pt-4 border-t border-[var(--color-border-subtle)]">
                <Link
                  href={`/blog/${post.slug}`}
                  className="text-xs font-mono text-[var(--color-cool-cyan)] hover:underline flex items-center gap-1.5"
                >
                  <span>Read Article</span>
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
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
// 11. CONTACT SECTION
// ============================================================================
export function ContactSection() {
  return (
    <section id="contact" className="py-24 px-6 relative border-t border-[var(--color-border)]">
      <div className="max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full cyber-tag mb-6 text-xs font-mono tracking-wider uppercase border border-[var(--color-border-glow)]">
          <span className="status-dot-pulsar" />
          <span>OPEN A SECURE CHANNEL</span>
        </div>

        <h2 className="font-heading text-3xl sm:text-5xl font-extrabold tracking-tight text-[var(--color-text-primary)] mb-6">
          Ready to Collaborate on Security Research?
        </h2>

        <p className="text-base sm:text-lg text-[var(--color-text-secondary)] leading-relaxed mb-10 max-w-2xl mx-auto font-sans">
          Whether you have an inquiry regarding vulnerability disclosures, security tooling collaboration, or offensive security internship opportunities, my transmission line is open.
        </p>

        <div className="flex flex-wrap justify-center items-center gap-4">
          <Link
            href="/contact"
            className="btn-magnetic px-8 py-3.5 rounded-xl font-medium text-sm text-white bg-[var(--color-electric-blue)] hover:bg-[var(--color-primary-hover)] shadow-[0_0_25px_rgba(43,108,255,0.4)] border border-[rgba(255,255,255,0.15)] transition-all"
          >
            Open Encrypted Channel →
          </Link>
          <a
            href="mailto:jaishanthcys@gmail.com"
            className="btn-magnetic px-8 py-3.5 rounded-xl font-medium text-sm glass-card text-[var(--color-cool-cyan)] border border-[rgba(0,229,255,0.2)] hover:border-[var(--color-cool-cyan)] transition-all"
          >
            jaishanthcys@gmail.com
          </a>
        </div>
      </div>
    </section>
  );
}
