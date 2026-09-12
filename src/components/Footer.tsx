import Link from "next/link";
import { getVisibleSocialLinks } from "@/lib/data/profile";
import { getEnabledFeatureFlags } from "@/lib/feature-flags";
import { prisma } from "@/lib/prisma";

const FOOTER_LINKS: { key: string; label: string; href: string }[] = [
  { key: "about", label: "About Dossier", href: "/about" },
  { key: "research", label: "Security Research", href: "/research" },
  { key: "projects", label: "Offensive Tools", href: "/projects" },
  { key: "blog", label: "Technical Notes", href: "/blog" },
  { key: "bug_bounty", label: "Bug Bounty", href: "/bug-bounty" },
  { key: "education", label: "Education & Labs", href: "/about#education" },
  { key: "skills", label: "Capability Matrix", href: "/skills" },
  { key: "experience", label: "Experience", href: "/experience" },
  { key: "certifications", label: "Certifications", href: "/certifications" },
  { key: "achievements", label: "Achievements", href: "/achievements" },
  { key: "resume", label: "Security Resume", href: "/resume" },
  { key: "contact", label: "Secure Channel", href: "/contact" },
  { key: "links", label: "Verified Links", href: "/links" },
];

export default async function Footer() {
  const [socialLinks, enabledFlags, profile] = await Promise.all([
    getVisibleSocialLinks(),
    getEnabledFeatureFlags(),
    prisma.profile.findFirst(),
  ]);
  const enabled = new Set(enabledFlags.map((f) => f.key));

  const explore = FOOTER_LINKS.filter(
    (l) => ["about", "research", "projects", "blog", "bug_bounty"].includes(l.key) && enabled.has(l.key)
  );
  const credentials = FOOTER_LINKS.filter(
    (l) => ["education", "skills", "experience", "certifications", "achievements", "resume"].includes(l.key) && enabled.has(l.key)
  );
  const connect = FOOTER_LINKS.filter(
    (l) => ["contact", "links"].includes(l.key) && enabled.has(l.key)
  );

  return (
    <footer className="border-t border-[var(--color-border)] mt-24 bg-[var(--color-bg-secondary)] relative">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-12 border-b border-[var(--color-border-subtle)]">
          {/* Brand & Identity Column (5 cols) */}
          <div className="md:col-span-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-8 h-8 rounded-lg bg-[rgba(43,108,255,0.15)] border border-[var(--color-electric-blue)] flex items-center justify-center text-[var(--color-cool-cyan)] font-mono font-bold text-sm">
                  JM
                </div>
                <div>
                  <div className="font-heading font-bold text-lg text-[var(--color-text-primary)]">
                    {profile?.displayName ?? "Jaishanth M"}
                  </div>
                  <div className="font-mono text-[10px] text-[var(--color-cool-cyan)] tracking-wider">
                    CYBERSECURITY RESEARCHER
                  </div>
                </div>
              </div>

              <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed max-w-sm font-sans mb-6">
                Investigating system vulnerabilities, building offensive security tools, and analyzing adversary attack paths. Based in MCET Pollachi, India.
              </p>
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[rgba(11,17,32,0.8)] border border-[var(--color-border)] font-mono text-[11px] text-[var(--color-text-muted)] w-fit">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>SECURITY_OPERATIONAL // VERIFIED IDENTITY</span>
            </div>
          </div>

          {/* Explore Links (2 cols) */}
          {explore.length > 0 && (
            <div className="md:col-span-2">
              <h3 className="font-mono text-xs uppercase tracking-wider text-[var(--color-cool-cyan)] mb-4">
                Explore
              </h3>
              <ul className="space-y-2.5 text-sm">
                {explore.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="text-[var(--color-text-secondary)] hover:text-white hover:underline transition-colors"
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
              <h3 className="font-mono text-xs uppercase tracking-wider text-[var(--color-cool-cyan)] mb-4">
                Credentials
              </h3>
              <ul className="space-y-2.5 text-sm">
                {credentials.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="text-[var(--color-text-secondary)] hover:text-white hover:underline transition-colors"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Connect & Social Links (3 cols) */}
          <div className="md:col-span-3">
            <h3 className="font-mono text-xs uppercase tracking-wider text-[var(--color-cool-cyan)] mb-4">
              Verified Presence
            </h3>
            <ul className="space-y-2.5 text-sm">
              {socialLinks.map((link) => (
                <li key={link.id}>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="me noopener noreferrer"
                    className="text-[var(--color-text-secondary)] hover:text-white flex items-center gap-1.5 transition-colors group"
                  >
                    <span className="text-[var(--color-cool-cyan)] font-mono text-xs group-hover:translate-x-0.5 transition-transform">
                      &gt;
                    </span>
                    <span>{link.customLabel ?? link.platform}</span>
                  </a>
                </li>
              ))}
              {connect.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-[var(--color-text-secondary)] hover:text-white flex items-center gap-1.5 transition-colors group"
                  >
                    <span className="text-[var(--color-electric-blue)] font-mono text-xs group-hover:translate-x-0.5 transition-transform">
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
            © {new Date().getFullYear()} {profile?.displayName ?? "Jaishanth M"}. All verified rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="hover:text-white transition-colors">
              Privacy & Responsible Disclosure
            </Link>
            <span>·</span>
            <Link href="/sitemap.xml" className="hover:text-white transition-colors">
              Sitemap
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
