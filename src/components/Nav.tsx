import Link from "next/link";
import { getNavFlags } from "@/lib/feature-flags";
import { prisma } from "@/lib/prisma";
import MobileNav from "@/components/MobileNav";
import { getVisibleSocialLinks } from "@/lib/data/profile";

const ROUTE_BY_KEY: Record<string, { label: string; href: string }> = {
  about: { label: "About", href: "/about" },
  projects: { label: "Projects", href: "/projects" },
  research: { label: "Research", href: "/research" },
  experience: { label: "Experience", href: "/experience" },
  skills: { label: "Skills", href: "/skills" },
  certifications: { label: "Certifications", href: "/certifications" },
  achievements: { label: "Achievements", href: "/achievements" },
  bug_bounty: { label: "Bug Bounty", href: "/bug-bounty" },
  blog: { label: "Blog", href: "/blog" },
  contact: { label: "Contact", href: "/contact" },
  resume: { label: "Resume", href: "/resume" },
  links: { label: "Links", href: "/links" },
};

export default async function Nav() {
  const [flags, customItems, profile, socialLinks] = await Promise.all([
    getNavFlags(),
    prisma.navigationItem.findMany({ where: { visible: true, parentId: null }, orderBy: { order: "asc" } }),
    prisma.profile.findFirst(),
    getVisibleSocialLinks(),
  ]);

  const coreItems = flags
    .map((f) => ROUTE_BY_KEY[f.key])
    .filter((item): item is { label: string; href: string; openInNewTab?: boolean } => Boolean(item));

  const items = [
    ...coreItems,
    ...customItems.map((c) => ({ label: c.label, href: c.url, openInNewTab: c.openInNewTab })),
  ];

  // Expose portfolio routes in standard progression
  const navigationOrder = [
    "/about",
    "/skills",
    "/projects",
    "/research",
    "/bug-bounty",
    "/experience",
    "/certifications",
    "/blog",
    "/contact",
  ];

  // Sort items to follow the editorial progression
  const desktopRoutes = [...items].sort((a, b) => {
    const idxA = navigationOrder.indexOf(a.href);
    const idxB = navigationOrder.indexOf(b.href);
    if (idxA !== -1 && idxB !== -1) return idxA - idxB;
    if (idxA !== -1) return -1;
    if (idxB !== -1) return 1;
    return 0;
  });

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-[#09090b]/85 border-b border-[var(--color-border)] transition-all">
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        {/* Editorial Brand Masthead */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-8 h-8 rounded-sm bg-zinc-900 border border-[var(--color-border)] flex items-center justify-center font-mono font-bold text-xs text-white group-hover:border-[var(--color-signal-red)] transition-colors">
            JM
          </div>
          <div className="flex flex-col">
            <span className="font-heading font-extrabold text-sm sm:text-base tracking-tight text-white group-hover:text-[var(--color-signal-red)] transition-colors">
              {profile?.displayName ?? "Jaishanth M."}
            </span>
            <span className="font-mono text-[9px] text-[var(--color-text-muted)] tracking-widest uppercase -mt-0.5">
              OFFENSIVE SECURITY
            </span>
          </div>
        </Link>

        {/* Desktop Primary Editorial Links (Matching jaiz.vercel.app breadth) */}
        <ul className="hidden lg:flex items-center gap-5 xl:gap-6">
          {desktopRoutes.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="text-xs font-mono text-[var(--color-text-secondary)] hover:text-white transition-colors relative py-1 hover:border-b hover:border-[var(--color-signal-red)]"
                target={item.openInNewTab ? "_blank" : undefined}
                rel={item.openInNewTab ? "noopener noreferrer" : undefined}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Right Actions: Connect CTA + Mobile Menu Trigger (matching jaiz.vercel.app) */}
        <div className="flex items-center gap-3">
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs font-mono font-medium text-white bg-[var(--color-signal-red)] hover:bg-[var(--color-signal-red-hover)] shadow-[0_0_15px_var(--glass-border-glow)] transition-all border border-white/15 hover:border-white/30 hover:scale-[1.02] active:scale-[0.98]"
          >
            <span className="status-dot-pulsar" />
            <span className="tracking-wider uppercase font-semibold">CONNECT</span>
          </Link>

          <div className="lg:hidden">
            <MobileNav items={items} socialLinks={socialLinks} />
          </div>
        </div>
      </nav>
    </header>
  );
}
