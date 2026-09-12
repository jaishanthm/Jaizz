import Link from "next/link";
import { prisma } from "@/lib/prisma";

// Phase 9 §2 — cards, not a feed. Every number here is a real query, no
// placeholder/dummy data.

export const dynamic = "force-dynamic"; // always fresh, this is an internal dashboard, not cached public content

export default async function AdminDashboardPage() {
  const [flags, unreadCount, recentMessages, draftResearch, draftPosts, recentAudit, expiredCerts, seo] =
    await Promise.all([
      prisma.featureFlag.findMany({ orderBy: { sortOrder: "asc" } }),
      prisma.contactMessage.count({ where: { read: false } }),
      prisma.contactMessage.findMany({ where: { read: false }, orderBy: { createdAt: "desc" }, take: 3 }),
      prisma.research.count({ where: { disclosureStatus: "READY" } }),
      prisma.blogPost.count({ where: { status: "DRAFT" } }),
      prisma.auditLog.findMany({ orderBy: { createdAt: "desc" }, take: 5, include: { user: true } }),
      prisma.certification.count({ where: { expirationDate: { lt: new Date() }, visible: true } }),
      prisma.sEOSettings.findUnique({ where: { id: "singleton" } }),
    ]);

  const seoChecklist = [
    { label: "Site title", done: !!seo?.siteTitle },
    { label: "Site description", done: !!seo?.siteDescription },
    { label: "Default OG image", done: !!seo?.defaultOgImageId },
    { label: "Google verification", done: !!seo?.googleVerification },
    { label: "Bing verification", done: !!seo?.bingVerification },
  ];
  const seoScore = seoChecklist.filter((c) => c.done).length;

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <div className="glass-card p-5">
        <h2 className="text-sm mb-3" style={{ color: "var(--color-text-muted)" }}>Feature flags</h2>
        <ul className="space-y-1 text-sm">
          {flags.map((f) => (
            <li key={f.id} className="flex items-center gap-2">
              <span
                className="w-2 h-2 rounded-full"
                style={{ background: f.enabled ? "var(--color-signal)" : "var(--color-text-muted)" }}
              />
              {f.label}
            </li>
          ))}
        </ul>
        <Link href="/admin/feature-flags" className="text-xs mt-3 inline-block" style={{ color: "var(--color-primary)" }}>
          Manage →
        </Link>
      </div>

      <div className="glass-card p-5">
        <h2 className="text-sm mb-3" style={{ color: "var(--color-text-muted)" }}>
          Unread messages ({unreadCount})
        </h2>
        <ul className="space-y-2 text-sm">
          {recentMessages.map((m) => (
            <li key={m.id}>{m.name} — {m.subject}</li>
          ))}
          {recentMessages.length === 0 && <li style={{ color: "var(--color-text-muted)" }}>None.</li>}
        </ul>
      </div>

      <div className="glass-card p-5">
        <h2 className="text-sm mb-3" style={{ color: "var(--color-text-muted)" }}>Awaiting attention</h2>
        <p className="text-sm">{draftResearch} research READY for publish</p>
        <p className="text-sm">{draftPosts} blog drafts</p>
        {expiredCerts > 0 && (
          <p className="text-sm mt-2" style={{ color: "#f59e0b" }}>
            {expiredCerts} certification(s) expired
          </p>
        )}
      </div>

      <div className="glass-card p-5">
        <h2 className="text-sm mb-3" style={{ color: "var(--color-text-muted)" }}>SEO completeness</h2>
        <p className="text-2xl mb-2">{seoScore}/{seoChecklist.length}</p>
        <ul className="text-xs space-y-1">
          {seoChecklist.map((c) => (
            <li key={c.label} style={{ color: c.done ? "var(--color-signal)" : "var(--color-text-muted)" }}>
              {c.done ? "✓" : "○"} {c.label}
            </li>
          ))}
        </ul>
      </div>

      <div className="glass-card p-5 sm:col-span-2">
        <h2 className="text-sm mb-3" style={{ color: "var(--color-text-muted)" }}>Recent activity</h2>
        <ul className="text-sm space-y-1">
          {recentAudit.map((a) => (
            <li key={a.id}>
              {a.user?.name ?? "System"} — {a.action} {a.entityType}
              <span style={{ color: "var(--color-text-muted)" }}> · {a.createdAt.toLocaleString()}</span>
            </li>
          ))}
        </ul>
        <Link href="/admin/audit-log" className="text-xs mt-3 inline-block" style={{ color: "var(--color-primary)" }}>
          Full log →
        </Link>
      </div>
    </div>
  );
}
