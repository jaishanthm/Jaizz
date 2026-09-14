import Link from "next/link";
import { getVisibleSocialLinks } from "@/lib/data/profile";
import { getEnabledFeatureFlags } from "@/lib/feature-flags";
import { prisma } from "@/lib/prisma";
import SocialIcon from "@/components/SocialIcon";

const FOOTER_LINKS: { key: string; label: string; href: string }[] = [
  { key: "about", label: "About & Philosophy", href: "/about" },
  { key: "projects", label: "Offensive Tools & Code", href: "/projects" },
  { key: "research", label: "Security Research", href: "/research" },
  { key: "experience", label: "Experience & Engagements", href: "/experience" },
  { key: "skills", label: "Capability Matrix", href: "/skills" },
  { key: "certifications", label: "Certifications Archive", href: "/certifications" },
  { key: "achievements", label: "Milestones & Rankings", href: "/achievements" },
  { key: "bug_bounty", label: "Bug Bounty Ledger", href: "/bug-bounty" },
  { key: "blog", label: "Technical Writing", href: "/blog" },
  { key: "resume", label: "Curriculum Vitae (PDF)", href: "/resume" },
  { key: "contact", label: "Direct Inquiries", href: "/contact" },
  { key: "links", label: "Identity Hub", href: "/links" },
];

export default async function Footer() {
  const [socialLinks, enabledFlags, profile] = await Promise.all([
    getVisibleSocialLinks(),
    getEnabledFeatureFlags(),
    prisma.profile.findFirst(),
  ]);
  const enabled = new Set(enabledFlags.map((f) => f.key));

  const explore = FOOTER_LINKS.filter(
    (l) => ["projects", "research", "blog", "bug_bounty"].includes(l.key) && enabled.has(l.key)
  );
  const credentials = FOOTER_LINKS.filter(
    (l) => ["about", "experience", "skills", "certifications", "achievements", "resume"].includes(l.key) && enabled.has(l.key)
  );
  const contactLinks = FOOTER_LINKS.filter(
    (l) => ["contact", "links"].includes(l.key) && enabled.has(l.key)
  );

  return (
    <footer className="border-t border-[var(--color-border)] mt-28 bg-[#0b0b0e] relative">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-12 border-b border-white/[0.05]">
          {/* Brand & Editorial Positioning (5 cols) */}
          <div className="md:col-span-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-sm bg-zinc-900 border border-[var(--color-border)] flex items-center justify-center font-mono font-bold text-xs text-white">
                  JM
                </div>
                <div>
                  <div className="font-heading font-extrabold text-base tracking-tight text-white">
                    {profile?.displayName ?? "Jaishanth M."}
                  </div>
                  <div className="font-mono text-[10px] text-[var(--color-signal-red)] tracking-wider uppercase">
                    OFFENSIVE SECURITY STUDENT
                  </div>
                </div>
              </div>

              <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed max-w-sm font-sans mb-6">
                Studying systems failure modes, building offensive tooling, and investigating modern attack surfaces from an adversarial perspective.
              </p>
            </div>

            <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-sm bg-zinc-900/60 border border-[var(--color-border)] font-mono text-[11px] text-[var(--color-text-muted)] w-fit">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-signal-red)]" />
              <span>BUILDING TOWARD RED TEAM</span>
            </div>
          </div>

          {/* Explore Links (2 cols) */}
          {explore.length > 0 && (
            <div className="md:col-span-2">
              <h3 className="font-mono text-xs uppercase tracking-wider text-zinc-300 font-semibold mb-4">
                Work & Research
              </h3>
              <ul className="space-y-2.5 text-sm">
                {explore.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="text-[var(--color-text-secondary)] hover:text-white transition-colors"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Credentials Links (2 cols) */}
          {credentials.length > 0 && (
            <div className="md:col-span-2">
              <h3 className="font-mono text-xs uppercase tracking-wider text-zinc-300 font-semibold mb-4">
                Dossier
              </h3>
              <ul className="space-y-2.5 text-sm">
                {credentials.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="text-[var(--color-text-secondary)] hover:text-white transition-colors"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Social Presence & Connect (3 cols) */}
          <div className="md:col-span-3">
            <h3 className="font-mono text-xs uppercase tracking-wider text-zinc-300 font-semibold mb-4">
              Verified Networks
            </h3>
            <div className="flex flex-wrap gap-2 mb-6">
              {socialLinks.map((link) => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="me noopener noreferrer"
                  aria-label={`Visit ${link.platform}`}
                  className="w-9 h-9 rounded-sm border border-[var(--color-border)] hover:border-[var(--color-signal-red)] bg-white/[0.02] hover:bg-white/[0.06] flex items-center justify-center text-[var(--color-text-muted)] hover:text-white transition-all"
                >
                  <SocialIcon platform={link.platform} iconKey={link.iconKey} className="w-4 h-4" />
                </a>
              ))}
            </div>

            <ul className="space-y-2 text-sm">
              {contactLinks.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-[var(--color-text-secondary)] hover:text-white transition-colors flex items-center gap-1.5 group"
                  >
                    <span className="text-[var(--color-signal-red)] font-mono text-xs group-hover:translate-x-0.5 transition-transform">
                      &gt;
                    </span>
                    <span>{l.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Sub-Footer */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs text-[var(--color-text-muted)]">
          <p>
            © {new Date().getFullYear()} {profile?.displayName ?? "Jaishanth M."} All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/sitemap.xml" className="hover:text-white transition-colors">
              Sitemap
            </Link>
            <span>·</span>
            <Link href="/contact" className="hover:text-white transition-colors">
              PGP & Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
