import Link from "next/link";
import { getNavFlags } from "@/lib/feature-flags";
import { prisma } from "@/lib/prisma";
import MobileNav from "@/components/MobileNav";

const ROUTE_BY_KEY: Record<string, { label: string; href: string }> = {
  about: { label: "About", href: "/about" },
  research: { label: "Research", href: "/research" },
  projects: { label: "Projects", href: "/projects" },
  skills: { label: "Skills", href: "/skills" },
  experience: { label: "Experience", href: "/experience" },
  certifications: { label: "Certifications", href: "/certifications" },
  achievements: { label: "Achievements", href: "/achievements" },
  bug_bounty: { label: "Bug Bounty", href: "/bug-bounty" },
  blog: { label: "Blog", href: "/blog" },
  contact: { label: "Contact", href: "/contact" },
  resume: { label: "Resume", href: "/resume" },
  links: { label: "Links", href: "/links" },
};

export default async function Nav() {
  const [flags, customItems, profile] = await Promise.all([
    getNavFlags(),
    prisma.navigationItem.findMany({ where: { visible: true, parentId: null }, orderBy: { order: "asc" } }),
    prisma.profile.findFirst(),
  ]);

  const coreItems = flags
    .map((f) => ROUTE_BY_KEY[f.key])
    .filter((item): item is { label: string; href: string; openInNewTab?: boolean } => Boolean(item));

  const items = [
    ...coreItems,
    ...customItems.map((c) => ({ label: c.label, href: c.url, openInNewTab: c.openInNewTab })),
  ];

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-[rgba(5,8,22,0.8)] border-b border-[var(--color-border)] transition-all">
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        {/* Brand / Call Sign */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-[rgba(43,108,255,0.15)] border border-[var(--color-electric-blue)] flex items-center justify-center text-[var(--color-cool-cyan)] font-mono font-bold text-sm group-hover:shadow-[0_0_15px_rgba(43,108,255,0.5)] transition-all">
            JM
          </div>
          <div className="flex flex-col">
            <span className="font-heading font-bold text-base tracking-tight text-[var(--color-text-primary)] group-hover:text-[var(--color-cool-cyan)] transition-colors">
              {profile?.displayName ?? "Jaishanth M"}
            </span>
            <span className="font-mono text-[9px] text-[var(--color-cool-cyan)] tracking-widest uppercase -mt-0.5">
              SEC_RESEARCHER
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <ul className="hidden lg:flex items-center gap-6">
          {items.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="text-xs font-mono text-[var(--color-text-secondary)] hover:text-white transition-colors relative py-1 hover:text-[var(--color-cool-cyan)]"
                target={item.openInNewTab ? "_blank" : undefined}
                rel={item.openInNewTab ? "noopener noreferrer" : undefined}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Action Button & Mobile Trigger */}
        <div className="flex items-center gap-3">
          <Link
            href="/contact"
            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-mono font-medium text-white bg-[var(--color-electric-blue)] hover:bg-[var(--color-primary-hover)] shadow-[0_0_15px_rgba(43,108,255,0.3)] transition-all border border-[rgba(255,255,255,0.15)]"
          >
            <span className="status-dot-pulsar" />
            <span>CONNECT</span>
          </Link>

          <MobileNav items={items} />
        </div>
      </nav>
    </header>
  );
}
