import Link from "next/link";
import { getCurrentUserPermissions } from "@/lib/permissions";

// Phase 9 §1 grouping, exactly. Phase 9 §6 — permission-aware: items requiring
// a permission the current user lacks are omitted from the array entirely,
// not rendered-disabled.

type NavGroup = { label: string; items: { label: string; href: string; permission?: string }[] };

const GROUPS: NavGroup[] = [
  {
    label: "Content",
    items: [
      { label: "Identity", href: "/admin/identity", permission: "settings.edit" },
      { label: "Education", href: "/admin/education" },
      { label: "Experience", href: "/admin/experience" },
      { label: "Skills", href: "/admin/skills" },
      { label: "Projects", href: "/admin/projects" },
      { label: "Research", href: "/admin/research" },
      { label: "Bug Bounty", href: "/admin/bug-bounty" },
      { label: "Certifications", href: "/admin/certifications" },
      { label: "Achievements", href: "/admin/achievements" },
      { label: "Blog", href: "/admin/blog" },
    ],
  },
  {
    label: "Site",
    items: [
      { label: "Navigation", href: "/admin/navigation", permission: "settings.edit" },
      { label: "Homepage", href: "/admin/homepage", permission: "settings.edit" },
      { label: "Feature Flags", href: "/admin/feature-flags", permission: "settings.edit" },
      { label: "Theme", href: "/admin/theme", permission: "settings.edit" },
    ],
  },
  {
    label: "System",
    items: [
      { label: "SEO", href: "/admin/seo", permission: "seo.edit" },
      { label: "Media", href: "/admin/media", permission: "media.upload" },
      { label: "Users", href: "/admin/users", permission: "users.manage" },
      { label: "Audit Log", href: "/admin/audit-log", permission: "audit.view" },
      { label: "Settings", href: "/admin/settings", permission: "settings.edit" },
    ],
  },
];

export default async function AdminSidebar() {
  const perms = await getCurrentUserPermissions();

  return (
    <aside
      className="w-56 shrink-0 h-screen sticky top-0 overflow-y-auto px-4 py-6"
      style={{ background: "var(--color-bg-secondary)", borderRight: "1px solid var(--color-border)" }}
    >
      <Link href="/admin" className="block mb-8 font-[var(--font-heading)]">
        Jaishanth M — Admin
      </Link>
      {GROUPS.map((group) => {
        const visibleItems = group.items.filter((i) => !i.permission || perms.has(i.permission));
        if (visibleItems.length === 0) return null;
        return (
          <div key={group.label} className="mb-6">
            <p className="text-xs uppercase mb-2" style={{ color: "var(--color-text-muted)" }}>
              {group.label}
            </p>
            <ul className="space-y-1">
              {visibleItems.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="block px-2 py-1.5 rounded text-sm">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </aside>
  );
}
