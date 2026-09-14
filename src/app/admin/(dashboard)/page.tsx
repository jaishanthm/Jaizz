import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getCachedTryHackMeStats } from "@/lib/tryhackme";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [
    flags,
    unreadCount,
    recentMessages,
    draftResearch,
    draftPosts,
    recentAudit,
    expiredCerts,
    seo,
    thmStats,
    projectCount,
    researchCount,
  ] = await Promise.all([
    prisma.featureFlag.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.contactMessage.count({ where: { read: false } }),
    prisma.contactMessage.findMany({ where: { read: false }, orderBy: { createdAt: "desc" }, take: 4 }),
    prisma.research.count({ where: { disclosureStatus: "READY" } }),
    prisma.blogPost.count({ where: { status: "DRAFT" } }),
    prisma.auditLog.findMany({ orderBy: { createdAt: "desc" }, take: 6, include: { user: true } }),
    prisma.certification.count({ where: { expirationDate: { lt: new Date() }, visible: true } }),
    prisma.sEOSettings.findUnique({ where: { id: "singleton" } }),
    getCachedTryHackMeStats().catch(() => null),
    prisma.project.count({ where: { visible: true } }),
    prisma.research.count({ where: { visible: true } }),
  ]);

  const seoChecklist = [
    { label: "Site title configured", done: !!seo?.siteTitle },
    { label: "Site meta description", done: !!seo?.siteDescription },
    { label: "Default OG image link", done: !!seo?.defaultOgImageId },
    { label: "Google verification code", done: !!seo?.googleVerification },
    { label: "Bing verification code", done: !!seo?.bingVerification },
  ];
  const seoScore = seoChecklist.filter((c) => c.done).length;
  const activeFlagsCount = flags.filter((f) => f.enabled).length;

  return (
    <div className="space-y-8">
      {/* Top Header / Status Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="uppercase tracking-widest text-emerald-400 font-semibold">C2 COMMAND CENTER // OPERATIONAL</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Portfolio Administration
          </h1>
          <p className="text-xs text-zinc-400 font-mono mt-1">
            Tactical command interface for content publishing, intelligence synchronization, and subsystem control.
          </p>
        </div>

        {/* Quick Actions Strip */}
        <div className="flex flex-wrap items-center gap-2">
          <Link href="/admin/projects/new" className="admin-btn-primary">
            + New Project
          </Link>
          <Link href="/admin/research/new" className="admin-btn-secondary">
            + New Research
          </Link>
          <Link href="/admin/blog/new" className="admin-btn-secondary">
            + New Post
          </Link>
          <Link href="/admin/bug-bounty" className="admin-btn-secondary">
            ⚡ Sync THM
          </Link>
        </div>
      </div>

      {/* Primary Telemetry Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Metric 1: THM Percentile */}
        <div className="admin-card p-4">
          <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">THM Percentile</div>
          <div className="text-xl font-bold text-emerald-400 font-mono mt-1">
            {thmStats?.percentile || "Top 1%"}
          </div>
          <div className="text-[10px] font-mono text-zinc-400 mt-1">
            Rank #{thmStats?.rank || "10,211"}
          </div>
        </div>

        {/* Metric 2: Live Projects */}
        <div className="admin-card p-4">
          <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Active Projects</div>
          <div className="text-xl font-bold text-white font-mono mt-1">{projectCount}</div>
          <Link href="/admin/projects" className="text-[10px] font-mono text-red-400 hover:underline mt-1 block">
            Manage repos →
          </Link>
        </div>

        {/* Metric 3: Published Research */}
        <div className="admin-card p-4">
          <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Research Papers</div>
          <div className="text-xl font-bold text-white font-mono mt-1">{researchCount}</div>
          <Link href="/admin/research" className="text-[10px] font-mono text-red-400 hover:underline mt-1 block">
            View papers →
          </Link>
        </div>

        {/* Metric 4: Unread Inquiries */}
        <div className="admin-card p-4">
          <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Inquiries</div>
          <div className={`text-xl font-bold font-mono mt-1 ${unreadCount > 0 ? "text-red-400" : "text-zinc-400"}`}>
            {unreadCount}
          </div>
          <div className="text-[10px] font-mono text-zinc-500 mt-1">
            {unreadCount > 0 ? "Requires review" : "Inbox cleared"}
          </div>
        </div>

        {/* Metric 5: Active Modules */}
        <div className="admin-card p-4">
          <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Active Modules</div>
          <div className="text-xl font-bold text-white font-mono mt-1">
            {activeFlagsCount}/{flags.length}
          </div>
          <Link href="/admin/feature-flags" className="text-[10px] font-mono text-red-400 hover:underline mt-1 block">
            Flags matrix →
          </Link>
        </div>

        {/* Metric 6: SEO Score */}
        <div className="admin-card p-4">
          <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">SEO Readiness</div>
          <div className="text-xl font-bold text-emerald-400 font-mono mt-1">
            {Math.round((seoScore / seoChecklist.length) * 100)}%
          </div>
          <Link href="/admin/seo" className="text-[10px] font-mono text-red-400 hover:underline mt-1 block">
            {seoScore}/{seoChecklist.length} directives →
          </Link>
        </div>
      </div>

      {/* Main Operations Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Card 1: Feature Flags Subsystem */}
        <div className="admin-card p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.06] mb-4">
              <h2 className="text-xs font-mono uppercase tracking-wider text-zinc-300 font-semibold flex items-center gap-2">
                <span>//</span>
                <span>Subsystem Feature Flags</span>
              </h2>
              <span className="text-[10px] font-mono text-zinc-500">{activeFlagsCount} ENABLED</span>
            </div>
            <ul className="space-y-2 text-xs font-mono">
              {flags.slice(0, 7).map((f) => (
                <li key={f.id} className="flex items-center justify-between text-zinc-300">
                  <span className="truncate pr-2">{f.label}</span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      f.enabled
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                        : "bg-zinc-800 text-zinc-500 border border-white/5"
                    }`}
                  >
                    {f.enabled ? "ACTIVE" : "OFF"}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div className="pt-4 border-t border-white/[0.06] mt-4">
            <Link
              href="/admin/feature-flags"
              className="text-xs font-mono text-red-400 hover:text-red-300 transition-colors flex items-center justify-between"
            >
              <span>Configure all flags</span>
              <span>→</span>
            </Link>
          </div>
        </div>

        {/* Card 2: Inquiries & Communications */}
        <div className="admin-card p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.06] mb-4">
              <h2 className="text-xs font-mono uppercase tracking-wider text-zinc-300 font-semibold flex items-center gap-2">
                <span>//</span>
                <span>Pending Inquiries</span>
              </h2>
              {unreadCount > 0 && (
                <span className="px-1.5 py-0.5 rounded bg-red-500/20 text-red-400 text-[10px] font-mono font-bold border border-red-500/30">
                  {unreadCount} NEW
                </span>
              )}
            </div>
            <ul className="space-y-2.5 text-xs">
              {recentMessages.map((m) => (
                <li key={m.id} className="p-2 rounded bg-black/40 border border-white/[0.04]">
                  <div className="flex items-center justify-between font-mono text-[11px] text-zinc-300">
                    <span className="font-semibold text-white truncate max-w-[140px]">{m.name}</span>
                    <span className="text-zinc-500 text-[10px]">{new Date(m.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="text-zinc-400 text-xs mt-1 truncate">{m.subject}</p>
                </li>
              ))}
              {recentMessages.length === 0 && (
                <li className="text-zinc-500 font-mono text-xs py-4 text-center">
                  All communications cleared.
                </li>
              )}
            </ul>
          </div>
          <div className="pt-4 border-t border-white/[0.06] mt-4">
            <span className="text-xs font-mono text-zinc-500">Contact form active & rate-limited</span>
          </div>
        </div>

        {/* Card 3: Attention Required & Staging */}
        <div className="admin-card p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.06] mb-4">
              <h2 className="text-xs font-mono uppercase tracking-wider text-zinc-300 font-semibold flex items-center gap-2">
                <span>//</span>
                <span>Staged & Queued Items</span>
              </h2>
              <span className="text-[10px] font-mono text-zinc-500">PIPELINE</span>
            </div>
            <div className="space-y-3 font-mono text-xs">
              <div className="p-2.5 rounded bg-black/40 border border-white/[0.05] flex items-center justify-between">
                <div>
                  <div className="text-zinc-300">Security Research</div>
                  <div className="text-[10px] text-zinc-500">READY for public disclosure</div>
                </div>
                <span className="text-amber-400 font-bold text-sm">{draftResearch}</span>
              </div>

              <div className="p-2.5 rounded bg-black/40 border border-white/[0.05] flex items-center justify-between">
                <div>
                  <div className="text-zinc-300">Blog Publications</div>
                  <div className="text-[10px] text-zinc-500">Draft writeups awaiting publish</div>
                </div>
                <span className="text-zinc-300 font-bold text-sm">{draftPosts}</span>
              </div>

              {expiredCerts > 0 && (
                <div className="p-2.5 rounded bg-amber-950/20 border border-amber-500/30 flex items-center justify-between">
                  <div>
                    <div className="text-amber-300 font-semibold">Certifications</div>
                    <div className="text-[10px] text-amber-400/80">Credentials require renewal</div>
                  </div>
                  <span className="text-amber-400 font-bold text-sm">{expiredCerts}</span>
                </div>
              )}
            </div>
          </div>
          <div className="pt-4 border-t border-white/[0.06] mt-4">
            <Link
              href="/admin/research"
              className="text-xs font-mono text-red-400 hover:text-red-300 transition-colors flex items-center justify-between"
            >
              <span>Advance research workflow</span>
              <span>→</span>
            </Link>
          </div>
        </div>

        {/* Card 4: SEO Health Checklist */}
        <div className="admin-card p-5">
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.06] mb-4">
            <h2 className="text-xs font-mono uppercase tracking-wider text-zinc-300 font-semibold flex items-center gap-2">
              <span>//</span>
              <span>Search Engine Directives</span>
            </h2>
            <span className="text-[10px] font-mono text-emerald-400 font-bold">
              {seoScore}/{seoChecklist.length} PASSED
            </span>
          </div>
          <ul className="space-y-2 text-xs font-mono">
            {seoChecklist.map((item) => (
              <li key={item.label} className="flex items-center justify-between">
                <span className="text-zinc-300">{item.label}</span>
                <span className={item.done ? "text-emerald-400 font-bold" : "text-zinc-600"}>
                  {item.done ? "✓ READY" : "○ MISSING"}
                </span>
              </li>
            ))}
          </ul>
          <div className="pt-4 border-t border-white/[0.06] mt-4">
            <Link
              href="/admin/seo"
              className="text-xs font-mono text-red-400 hover:text-red-300 transition-colors flex items-center justify-between"
            >
              <span>Manage SEO & verification codes</span>
              <span>→</span>
            </Link>
          </div>
        </div>

        {/* Card 5 & 6: System Audit Log Telemetry (2 cols) */}
        <div className="admin-card p-5 md:col-span-2">
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.06] mb-4">
            <h2 className="text-xs font-mono uppercase tracking-wider text-zinc-300 font-semibold flex items-center gap-2">
              <span>//</span>
              <span>Live Audit Telemetry</span>
            </h2>
            <Link href="/admin/audit-log" className="text-[11px] font-mono text-red-400 hover:underline">
              Full Telemetry Log →
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead>
                <tr className="text-zinc-500 border-b border-white/[0.06] text-[10px] uppercase">
                  <th className="pb-2">Operator</th>
                  <th className="pb-2">Operation</th>
                  <th className="pb-2">Entity Target</th>
                  <th className="pb-2 text-right">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {recentAudit.map((a) => (
                  <tr key={a.id} className="hover:bg-white/[0.02]">
                    <td className="py-2 text-zinc-300">{a.user?.name || "System Core"}</td>
                    <td className="py-2">
                      <span className="px-1.5 py-0.5 rounded bg-zinc-800 text-[10px] text-red-300 border border-white/5">
                        {a.action}
                      </span>
                    </td>
                    <td className="py-2 text-zinc-400">{a.entityType}</td>
                    <td className="py-2 text-zinc-500 text-right text-[11px]">
                      {new Date(a.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
