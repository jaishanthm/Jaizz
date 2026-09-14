import { prisma } from "@/lib/prisma";

export default async function AdminAuditLogPage({
  searchParams,
}: {
  searchParams: Promise<{ entityType?: string; userId?: string }>;
}) {
  const { entityType, userId } = await searchParams;

  const logs = await prisma.auditLog.findMany({
    where: {
      ...(entityType ? { entityType } : {}),
      ...(userId ? { userId } : {}),
    },
    orderBy: { createdAt: "desc" },
    take: 100,
    include: { user: true },
  });

  const entityTypes = await prisma.auditLog.findMany({
    distinct: ["entityType"],
    select: { entityType: true },
  });

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/[0.08]">
        <div>
          <span className="text-[11px] font-mono tracking-widest text-red-500 uppercase font-semibold">
            SIEM // OPERATIONAL AUDIT &amp; TELEMETRY STREAM
          </span>
          <h1 className="text-2xl font-bold text-white tracking-tight mt-0.5">
            Audit Trail &amp; Access Log
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-mono text-zinc-400 bg-white/[0.04] px-3 py-1.5 rounded-lg border border-white/[0.08]">
            STREAMING EVENTS: <span className="text-white font-bold">{logs.length}</span> / 100
          </span>
        </div>
      </div>

      {/* Filter Controls */}
      <form method="get" className="admin-card p-4 flex flex-wrap items-center gap-3">
        <span className="text-xs font-mono text-zinc-400 uppercase font-semibold">
          FILTER STREAM:
        </span>
        <select
          name="entityType"
          defaultValue={entityType ?? ""}
          className="admin-input text-xs font-mono max-w-xs bg-[#111116]"
        >
          <option value="">ALL ENTITY SCHEMAS</option>
          {entityTypes.map((e) => (
            <option key={e.entityType} value={e.entityType} className="bg-[#111116] text-white">
              {e.entityType}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="admin-btn-primary text-xs py-2 px-4"
        >
          APPLY FILTER
        </button>
        {entityType && (
          <a
            href="/admin/audit-log"
            className="text-xs font-mono text-zinc-400 hover:text-white px-2 py-1"
          >
            CLEAR FILTER ×
          </a>
        )}
      </form>

      {/* Audit Log Table */}
      <div className="admin-card overflow-hidden">
        <div className="p-4 border-b border-white/[0.08] flex items-center justify-between">
          <span className="text-xs font-mono text-zinc-300 font-semibold uppercase tracking-wider">
            RAW AUDIT STREAM
          </span>
          <span className="text-[11px] font-mono text-zinc-500">
            CHRONOLOGICAL ORDER (NEWEST FIRST)
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="bg-white/[0.02] border-b border-white/[0.08] text-zinc-400 uppercase tracking-wider">
                <th className="py-3 px-4 w-48">Timestamp (UTC)</th>
                <th className="py-3 px-4">Operator</th>
                <th className="py-3 px-4 text-center">Action</th>
                <th className="py-3 px-4">Entity Type</th>
                <th className="py-3 px-4 text-right">Target ID</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {logs.map((log) => {
                const actionClass =
                  log.action === "CREATE"
                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                    : log.action === "DELETE"
                    ? "bg-red-500/10 text-red-400 border-red-500/30"
                    : log.action === "PUBLISH"
                    ? "bg-blue-500/10 text-blue-400 border-blue-500/30"
                    : "bg-amber-500/10 text-amber-400 border-amber-500/30";

                return (
                  <tr key={log.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 px-4 text-zinc-400 whitespace-nowrap">
                      {new Date(log.createdAt).toISOString().replace("T", " ").slice(0, 19)}
                    </td>
                    <td className="py-3 px-4 font-semibold text-white">
                      {log.user?.name ?? "C2_SYSTEM_DAEMON"}
                      {log.user?.email && (
                        <span className="block text-[10px] text-zinc-500 font-normal">
                          {log.user.email}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold border tracking-wider ${actionClass}`}
                      >
                        {log.action}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-zinc-300 font-semibold">
                      {log.entityType}
                    </td>
                    <td className="py-3 px-4 text-right text-zinc-500">
                      {log.entityId ? (
                        <span className="px-2 py-0.5 rounded bg-black/50 border border-white/[0.06] text-[10px]">
                          {log.entityId.slice(0, 8)}…
                        </span>
                      ) : (
                        "—"
                      )}
                    </td>
                  </tr>
                );
              })}
              {logs.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-zinc-500">
                    No matching audit records found in telemetric history.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
