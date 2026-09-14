import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { $Enums } from "@prisma/client";

// Phase 1 §11 — every admin mutation writes an audit log row. Called at the
// end of a successful server action, not a middleware/interceptor, so it
// only fires on actual success.

export async function writeAuditLog(
  action: $Enums.AuditAction,
  entityType: string,
  entityId?: string,
  snapshot?: unknown
) {
  const session = await getServerSession(authOptions);
  const user = session?.user?.email
    ? await prisma.adminUser.findUnique({ where: { email: session.user.email } })
    : null;

  await prisma.auditLog.create({
    data: {
      userId: user?.id,
      action,
      entityType,
      entityId,
      snapshot: snapshot ? JSON.parse(JSON.stringify(snapshot)) : undefined,
    },
  });
}
