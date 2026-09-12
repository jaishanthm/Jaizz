import { notFound } from "next/navigation";
import Link from "next/link";
import { isFeatureEnabled } from "@/lib/feature-flags";
import { getProfile, getVisibleSocialLinks } from "@/lib/data/profile";
import { resolvePageSEO } from "@/lib/seo";

export const revalidate = 3600;

export async function generateMetadata() {
  return resolvePageSEO(
    "/links",
    "Verified Links & Identity Hub — Jaishanth M",
    "Direct links to Jaishanth M's verified profiles across Bugcrowd, GitHub, LinkedIn, TryHackMe, and Discord."
  );
}

export default async function LinksPage() {
  if (!(await isFeatureEnabled("links"))) notFound();
  const [profile, links] = await Promise.all([getProfile(), getVisibleSocialLinks()]);
  if (!profile) notFound();

  return (
    <main className="max-w-lg mx-auto px-6 py-16 text-center">
      {/* Header breadcrumb & cyber tag */}
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full cyber-tag mb-6 text-xs font-mono tracking-wider uppercase border border-[var(--color-border-glow)]">
        <span className="status-dot-pulsar" />
        <span>IDENTITY CONSOLIDATION HUB</span>
      </div>

      <div className="w-20 h-20 rounded-2xl bg-[rgba(43,108,255,0.2)] border-2 border-[var(--color-electric-blue)] flex items-center justify-center text-[var(--color-cool-cyan)] font-mono font-bold text-2xl mx-auto mb-4 shadow-[0_0_20px_rgba(43,108,255,0.4)]">
        JM
      </div>

      <h1 className="font-heading text-3xl font-extrabold text-[var(--color-text-primary)] mb-2">
        {profile.displayName}
      </h1>
      <p className="text-sm text-[var(--color-cool-cyan)] font-mono mb-2">
        {profile.professionalTitle}
      </p>
      <p className="text-xs text-[var(--color-text-muted)] font-mono mb-8">
        MCET Pollachi · Cybersecurity Researcher
      </p>

      <div className="space-y-3.5">
        {links.map((link) => (
          <a
            key={link.id}
            href={link.url}
            target="_blank"
            rel="me noopener noreferrer"
            className="glass-card p-4 rounded-xl border border-[var(--color-border)] hover:border-[var(--color-cool-cyan)] flex items-center justify-between group transition-all"
          >
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-[var(--color-cool-cyan)] group-hover:scale-125 transition-transform" />
              <span className="font-heading font-semibold text-sm text-[var(--color-text-primary)] group-hover:text-[var(--color-cool-cyan)] transition-colors">
                {link.customLabel ?? link.platform}
              </span>
            </div>
            <span className="font-mono text-xs text-[var(--color-text-muted)] group-hover:text-white transition-colors">
              Visit Profile ↗
            </span>
          </a>
        ))}

        <Link
          href="/resume"
          className="glass-card p-4 rounded-xl border border-[var(--color-electric-blue)] bg-[rgba(43,108,255,0.1)] flex items-center justify-between group transition-all"
        >
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-[var(--color-electric-blue)]" />
            <span className="font-heading font-semibold text-sm text-white">
              Official Security Dossier (PDF)
            </span>
          </div>
          <span className="font-mono text-xs text-[var(--color-cool-cyan)]">
            Download ↗
          </span>
        </Link>

        <Link
          href="/contact"
          className="glass-card p-4 rounded-xl border border-[var(--color-border)] hover:border-[var(--color-border-glow)] flex items-center justify-between group transition-all"
        >
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="font-heading font-semibold text-sm text-[var(--color-text-primary)]">
              Open Secure Channel
            </span>
          </div>
          <span className="font-mono text-xs text-[var(--color-text-muted)]">
            Transmit →
          </span>
        </Link>
      </div>
    </main>
  );
}
