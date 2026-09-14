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
  return resolvePageSEO(
    "/about",
    "About Jaishanth M. — Offensive Security Student & Researcher",
    "Background, offensive security philosophy, research methodology, and systems engineering focus of Jaishanth M."
  );
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

  // Sanitize location outside education section
  const publicLocation = profile.location
    ? profile.location.replace(/^MCET,\s*/i, "")
    : "Tamil Nadu, India";

  return (
    <main className="max-w-4xl mx-auto px-6 py-16">
      {/* Editorial Breadcrumb */}
      <div className="flex items-center gap-2 text-xs font-mono text-zinc-500 mb-8">
        <Link href="/" className="hover:text-white transition-colors">HOME</Link>
        <span>/</span>
        <span className="text-[var(--color-signal-red)]">ABOUT & DOSSIER</span>
      </div>

      {/* Hero Profile Card */}
      <div className="p-8 sm:p-12 rounded-lg border border-[var(--color-border)] bg-[#101014] mb-16">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-8">
          {profile.profileImage ? (
            <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-md overflow-hidden border border-white/10 flex-shrink-0 bg-zinc-950">
              <Image
                src={profile.profileImage.url}
                alt={profile.profileImage.altText || `${profile.displayName} - Offensive Security Student`}
                fill
                className="object-cover grayscale contrast-125 hover:grayscale-0 transition-all duration-500"
                priority
              />
            </div>
          ) : (
            <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-md bg-zinc-900 border border-white/10 flex items-center justify-center font-mono font-bold text-3xl text-zinc-300 flex-shrink-0">
              JM
            </div>
          )}

          <div className="flex-1">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-xs bg-zinc-900 border border-white/[0.08] text-xs font-mono mb-3 text-zinc-300">
              <span className="status-pulsar" />
              <span>{profile.availability || "Available for Security Research"}</span>
            </div>
            <h1 className="font-editorial text-3xl sm:text-5xl font-black text-white uppercase tracking-tight">
              {profile.displayName}
            </h1>
            <p className="text-base sm:text-lg font-medium text-zinc-300 mt-2 font-heading">
              Offensive Security Student <span className="text-[var(--color-signal-red)]">/</span> Building toward Red Team
            </p>
            {publicLocation && (
              <p className="text-xs text-zinc-500 mt-1 font-mono">
                {publicLocation}
              </p>
            )}
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-white/[0.06] flex flex-wrap gap-4 font-mono text-xs">
          <Link
            href="/resume"
            className="btn-editorial-primary px-5 py-2.5 uppercase tracking-wider"
          >
            Curriculum Vitae (PDF)
          </Link>
          <Link
            href="/contact"
            className="btn-editorial-secondary px-5 py-2.5 uppercase tracking-wider"
          >
            Direct Transmission
          </Link>
        </div>
      </div>

      {/* Narrative Section */}
      <section className="mb-16">
        <div className="flex items-center gap-3 mb-6 pb-2 border-b border-white/[0.06]">
          <span className="font-mono text-xs text-[var(--color-signal-red)] font-bold">01 //</span>
          <h2 className="font-editorial text-2xl font-bold text-white">
            Security Philosophy & Adversarial Modeling
          </h2>
        </div>
        <div className="prose prose-invert max-w-none text-[var(--color-text-secondary)] leading-relaxed text-base">
          {profile.longBio ? (
            <Markdown content={profile.longBio.replace(/\(MCET Pollachi\)/g, "").replace(/at Dr\. Mahalingam College of Engineering and Technology/g, "in Cybersecurity")} />
          ) : (
            <p>{profile.shortBio}</p>
          )}
        </div>
      </section>

      {/* Core Operational Pillars */}
      <section className="mb-16">
        <div className="flex items-center gap-3 mb-6 pb-2 border-b border-white/[0.06]">
          <span className="font-mono text-xs text-[var(--color-signal-red)] font-bold">02 //</span>
          <h2 className="font-editorial text-2xl font-bold text-white">
            Primary Domains of Investigation
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="p-6 rounded-lg border border-[var(--color-border)] bg-[#101014]">
            <div className="font-mono text-xs text-[var(--color-signal-red)] mb-2 font-semibold">PILLAR 01</div>
            <h3 className="font-editorial font-bold text-lg text-white mb-2">Web Application VAPT</h3>
            <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
              Ethical vulnerability research on web perimeters, access control flaws, CORS exploitation, and proof-of-concept verification.
            </p>
          </div>
          <div className="p-6 rounded-lg border border-[var(--color-border)] bg-[#101014]">
            <div className="font-mono text-xs text-[var(--color-signal-red)] mb-2 font-semibold">PILLAR 02</div>
            <h3 className="font-editorial font-bold text-lg text-white mb-2">Active Directory</h3>
            <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
              Domain attack surface auditing, Kerberoasting simulation, privilege escalation chains, and defensive telemetry analysis.
            </p>
          </div>
          <div className="p-6 rounded-lg border border-[var(--color-border)] bg-[#101014]">
            <div className="font-mono text-xs text-[var(--color-signal-red)] mb-2 font-semibold">PILLAR 03</div>
            <h3 className="font-editorial font-bold text-lg text-white mb-2">Offensive Tooling</h3>
            <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
              High-throughput asynchronous reconnaissance tools, network traffic inspection pipelines, and modular testing harnesses.
            </p>
          </div>
        </div>
      </section>

      {/* Education & Academic Rigor (The ONLY place where institution name is shown) */}
      {education.length > 0 && (
        <section id="education" className="mb-16">
          <div className="flex items-center gap-3 mb-6 pb-2 border-b border-white/[0.06]">
            <span className="font-mono text-xs text-[var(--color-signal-red)] font-bold">03 //</span>
            <h2 className="font-editorial text-2xl font-bold text-white">
              Academic Foundations & Systems Rigor
            </h2>
          </div>
          <div className="space-y-6">
            {education.map((ed) => (
              <div key={ed.id} className="p-8 rounded-lg border border-[var(--color-border)] bg-[#101014]">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-3">
                  <div>
                    <span className="font-mono text-xs text-[var(--color-signal-red)]">DEGREE CANDIDATE</span>
                    <h3 className="font-editorial text-2xl font-bold text-white mt-1">
                      {ed.institution}
                    </h3>
                    <div className="text-sm font-medium text-zinc-300 mt-0.5">
                      {ed.degree} {ed.field ? `— ${ed.field}` : ""}
                    </div>
                  </div>
                  <div className="font-mono text-xs text-zinc-500 sm:text-right">
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
                    className="inline-flex items-center gap-1.5 text-xs font-mono text-zinc-400 hover:text-white"
                  >
                    <span>Institution Portal: {ed.websiteUrl} ↗</span>
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
