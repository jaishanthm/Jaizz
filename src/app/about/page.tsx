import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { isFeatureEnabled } from "@/lib/feature-flags";
import { getProfile } from "@/lib/data/profile";
import { prisma } from "@/lib/prisma";
import Markdown from "@/components/Markdown";
import { resolvePageSEO } from "@/lib/seo";

export const revalidate = 3600;

export async function generateMetadata() {
  return resolvePageSEO("/about", "About Jaishanth M — Cybersecurity Researcher & Systems");
}

export default async function AboutPage() {
  if (!(await isFeatureEnabled("about"))) notFound();

  const [profile, education] = await Promise.all([
    getProfile(),
    isFeatureEnabled("education").then((on) =>
      on ? prisma.education.findMany({ where: { visible: true }, orderBy: { sortOrder: "asc" } }) : []
    ),
  ]);

  if (!profile) notFound();

  return (
    <main className="max-w-4xl mx-auto px-6 py-16">
      {/* Header breadcrumb & cyber tag */}
      <div className="flex items-center gap-3 mb-6">
        <span className="text-xs font-mono text-[var(--color-cool-cyan)] tracking-widest uppercase">
          // IDENTITY // DOSSIER
        </span>
        <div className="h-[1px] flex-1 bg-gradient-to-r from-[var(--color-border-glow)] to-transparent" />
      </div>

      {/* Hero Header Card */}
      <div className="glass-panel-elevated p-8 sm:p-10 rounded-2xl border border-[var(--color-border-glow)] mb-12 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          {profile.profileImage ? (
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border-2 border-[var(--color-electric-blue)] shadow-[0_0_20px_rgba(43,108,255,0.4)] flex-shrink-0">
              <Image
                src={profile.profileImage.url}
                alt={profile.displayName}
                fill
                className="object-cover"
                priority
              />
            </div>
          ) : (
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-[rgba(43,108,255,0.15)] border-2 border-[var(--color-electric-blue)] flex items-center justify-center text-[var(--color-cool-cyan)] font-mono font-bold text-3xl shadow-[0_0_20px_rgba(43,108,255,0.4)] flex-shrink-0">
              JM
            </div>
          )}

          <div className="flex-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full cyber-tag text-xs font-mono mb-2">
              <span className="status-dot-pulsar" />
              <span>{profile.availability || "Open for Security Research"}</span>
            </div>
            <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-[var(--color-text-primary)]">
              {profile.displayName}
            </h1>
            <p className="text-base sm:text-lg font-medium text-[var(--color-cool-cyan)] mt-1 font-mono">
              {profile.professionalTitle}
            </p>
            {profile.location && (
              <p className="text-xs text-[var(--color-text-muted)] mt-1 font-mono">
                📍 {profile.location}
              </p>
            )}
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-[var(--color-border-subtle)] flex flex-wrap gap-4">
          <Link
            href="/resume"
            className="btn-magnetic px-5 py-2.5 rounded-xl text-xs font-mono font-medium text-white bg-[var(--color-electric-blue)] hover:bg-[var(--color-primary-hover)] transition-all shadow-[0_0_15px_rgba(43,108,255,0.3)]"
          >
            Download Dossier (PDF)
          </Link>
          <Link
            href="/contact"
            className="btn-magnetic px-5 py-2.5 rounded-xl text-xs font-mono font-medium glass-card text-[var(--color-text-primary)] hover:border-[var(--color-border-glow)] transition-all"
          >
            Open Transmission Channel
          </Link>
        </div>
      </div>

      {/* Narrative Section */}
      <section className="mb-14">
        <h2 className="font-heading text-2xl font-bold text-[var(--color-text-primary)] mb-6 flex items-center gap-2">
          <span className="text-[var(--color-cool-cyan)] font-mono text-lg">01.</span>
          <span>Security Philosophy & Operational Focus</span>
        </h2>
        <div className="prose prose-invert max-w-none text-[var(--color-text-secondary)] leading-relaxed text-base">
          {profile.longBio ? (
            <Markdown content={profile.longBio} />
          ) : (
            <p>{profile.shortBio}</p>
          )}
        </div>
      </section>

      {/* Core Operational Pillars */}
      <section className="mb-14">
        <h2 className="font-heading text-2xl font-bold text-[var(--color-text-primary)] mb-6 flex items-center gap-2">
          <span className="text-[var(--color-electric-blue)] font-mono text-lg">02.</span>
          <span>Core Competencies & Research Direction</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="glass-card p-6 rounded-2xl border border-[var(--color-border)]">
            <div className="font-mono text-xs text-[var(--color-cool-cyan)] mb-2">DOMAIN 01</div>
            <h3 className="font-heading font-bold text-lg text-[var(--color-text-primary)] mb-2">Offensive Security & VAPT</h3>
            <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
              Ethical penetration testing of web architectures, API vulnerability discovery, CORS analysis, and automated proof-of-concept verification.
            </p>
          </div>
          <div className="glass-card p-6 rounded-2xl border border-[var(--color-border)]">
            <div className="font-mono text-xs text-[var(--color-electric-blue)] mb-2">DOMAIN 02</div>
            <h3 className="font-heading font-bold text-lg text-[var(--color-text-primary)] mb-2">Active Directory & Systems</h3>
            <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
              Domain attack surface auditing, Kerberoasting simulation, privilege escalation pathways, and Event Log correlation for enterprise defense.
            </p>
          </div>
          <div className="glass-card p-6 rounded-2xl border border-[var(--color-border)]">
            <div className="font-mono text-xs text-emerald-400 mb-2">DOMAIN 03</div>
            <h3 className="font-heading font-bold text-lg text-[var(--color-text-primary)] mb-2">Offensive Automation</h3>
            <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
              High-throughput asynchronous reconnaissance tools, network traffic dissecting utilities, and modular penetration testing harnesses in Python.
            </p>
          </div>
        </div>
      </section>

      {/* Education & Academic Credentials */}
      {education.length > 0 && (
        <section id="education" className="mb-14">
          <h2 className="font-heading text-2xl font-bold text-[var(--color-text-primary)] mb-6 flex items-center gap-2">
            <span className="text-[var(--color-cool-cyan)] font-mono text-lg">03.</span>
            <span>Academic Rigor & Systems Engineering</span>
          </h2>
          <div className="space-y-6">
            {education.map((ed) => (
              <div key={ed.id} className="glass-card p-6 sm:p-8 rounded-2xl border border-[var(--color-border)]">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-3">
                  <div>
                    <span className="font-mono text-xs text-[var(--color-cool-cyan)]">B.E. DEGREE PROGRAM</span>
                    <h3 className="font-heading text-xl font-bold text-[var(--color-text-primary)]">
                      {ed.institution}
                    </h3>
                    <div className="text-sm font-medium text-[var(--color-electric-blue)] mt-0.5">
                      {ed.degree} {ed.field ? `— ${ed.field}` : ""}
                    </div>
                  </div>
                  <div className="font-mono text-xs text-[var(--color-text-muted)] sm:text-right">
                    {new Date(ed.startDate).getFullYear()} — {ed.endDate ? new Date(ed.endDate).getFullYear() : "Present"}
                    {ed.location && <div>{ed.location}</div>}
                  </div>
                </div>

                {ed.description && (
                  <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed mb-4">
                    {ed.description}
                  </p>
                )}

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
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
