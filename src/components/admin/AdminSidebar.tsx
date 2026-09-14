import { getCurrentUserPermissions } from "@/lib/permissions";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import AdminSidebarNav, { NavGroup } from "./AdminSidebarNav";

const BASE_GROUPS: { label: string; items: { label: string; href: string; permission?: string; badgeKey?: "messages" | "research" }[] }[] = [
  {
    label: "Content",
    items: [
      { label: "Identity", href: "/admin/identity", permission: "settings.edit" },
      { label: "Education", href: "/admin/education" },
      { label: "Experience", href: "/admin/experience" },
      { label: "Skills", href: "/admin/skills" },
      { label: "Projects", href: "/admin/projects" },
      { label: "Security Research", href: "/admin/research", badgeKey: "research" },
      { label: "Bug Bounty", href: "/admin/bug-bounty" },
      { label: "Certifications", href: "/admin/certifications" },
      { label: "Achievements", href: "/admin/achievements" },
      { label: "Blog", href: "/admin/blog" },
      { label: "Social Links", href: "/admin/social-links", permission: "settings.edit" },
      { label: "Inquiries", href: "/admin/inquiries", badgeKey: "messages" },
    ],
  },
  {
    label: "Site Operations",
    items: [
      { label: "Navigation", href: "/admin/navigation", permission: "settings.edit" },
      { label: "Homepage Order", href: "/admin/homepage", permission: "settings.edit" },
      { label: "Feature Flags", href: "/admin/feature-flags", permission: "settings.edit" },
      { label: "Theme & Styling", href: "/admin/theme", permission: "settings.edit" },
    ],
  },
  {
    label: "System & Core",
    items: [
      { label: "SEO & Crawlers", href: "/admin/seo", permission: "seo.edit" },
      { label: "Media Library", href: "/admin/media", permission: "media.upload" },
      { label: "Admin Users", href: "/admin/users", permission: "users.manage" },
      { label: "Audit Telemetry", href: "/admin/audit-log", permission: "audit.view" },
      { label: "Global Settings", href: "/admin/settings", permission: "settings.edit" },
    ],
  },
];

export default async function AdminSidebar() {
  const [perms, session, unreadMessages, readyResearch] = await Promise.all([
    getCurrentUserPermissions(),
    getServerSession(authOptions),
    prisma.contactMessage.count({ where: { read: false } }).catch(() => 0),
    prisma.research.count({ where: { disclosureStatus: "READY" } }).catch(() => 0),
  ]);

  const groups: NavGroup[] = BASE_GROUPS.map((group) => ({
    label: group.label,
    items: group.items
      .filter((i) => !i.permission || perms.has(i.permission))
      .map((i) => {
        let badge: string | number | undefined;
        let badgeColor: "red" | "emerald" | "amber" | undefined;

        if (i.badgeKey === "messages" && unreadMessages > 0) {
          badge = unreadMessages;
          badgeColor = "red";
        } else if (i.badgeKey === "research" && readyResearch > 0) {
          badge = readyResearch;
          badgeColor = "amber";
        }

        return {
          label: i.label,
          href: i.href,
          badge,
          badgeColor,
        };
      }),
  }));

  const userRole = (session?.user as { roleKey?: string } | undefined)?.roleKey;

  return (
    <AdminSidebarNav
      groups={groups}
      userName={session?.user?.name ?? undefined}
      roleKey={userRole}
    />
  );
}
