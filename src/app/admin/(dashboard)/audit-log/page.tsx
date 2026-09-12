import { prisma } from "@/lib/prisma";

// Phase 4 §13 — read-only, ADMIN-only (enforced in middleware.ts's
// adminOnlyPaths list already). Filterable via query params, no client
// component/state needed since this is just a server-rendered filtered
// query — simpler than the interactive CRUD screens because it has to be
// read-only by design.

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
    <>
      <h1 className="text-2xl mb-6">Audit Log</h1>
      <form className="flex gap-2 mb-4" method="get">
        <select name="entityType" defaultValue={entityType ?? ""} className="px-3 py-2 rounded-md bg-transparent text-sm" style={{ border: "1px solid var(--color-border)" }}>
          <option value="">All entity types</option>
          {entityTypes.map((e) => <option key={e.entityType} value={e.entityType}>{e.entityType}</option>)}
        </select>
        <button type="submit" className="px-4 py-2 rounded-full text-sm" style={{ border: "1px solid var(--color-primary)", color: "var(--color-primary)" }}>Filter</button>
      </form>
      <div className="glass-card overflow-hidden">
        <table className="w-full text-sm">
          <thead><tr style={{ borderBottom: "1px solid var(--color-border)" }}><th className="text-left p-3">When</th><th className="text-left p-3">User</th><th className="text-left p-3">Action</th><th className="text-left p-3">Entity</th></tr></thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id} style={{ borderBottom: "1px solid var(--color-border)" }}>
                <td className="p-3" style={{ color: "var(--color-text-muted)" }}>{log.createdAt.toLocaleString()}</td>
                <td className="p-3">{log.user?.name ?? "System"}</td>
                <td className="p-3">{log.action}</td>
                <td className="p-3">{log.entityType} {log.entityId && <span style={{ color: "var(--color-text-muted)" }}>({log.entityId.slice(0, 8)})</span>}</td>
              </tr>
            ))}
            {logs.length === 0 && <tr><td colSpan={4} className="p-6 text-center" style={{ color: "var(--color-text-muted)" }}>No activity recorded yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </>
  );
}
