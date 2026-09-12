import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Phase 1 §5 RBAC resolution: role's permissions, then apply any per-user
// GRANT/REVOKE overrides on top. Used by every server action before a
// mutation, and by admin pages deciding what UI to render (Phase 9 §6 —
// hide, don't just disable).

export async function getCurrentUserPermissions(): Promise<Set<string>> {
  const session = await getServerSession(authOptions);
  if (!session?.user) return new Set();

  const user = await prisma.adminUser.findUnique({
    where: { email: session.user.email! },
    include: {
      role: { include: { permissions: { include: { permission: true } } } },
      permissionOverrides: { include: { permission: true } },
    },
  });
  if (!user || !user.active) return new Set();

  const perms = new Set(user.role.permissions.map((rp) => rp.permission.key));
  for (const override of user.permissionOverrides) {
    if (override.effect === "GRANT") perms.add(override.permission.key);
    if (override.effect === "REVOKE") perms.delete(override.permission.key);
  }
  return perms;
}

export async function requirePermission(key: string) {
  const perms = await getCurrentUserPermissions();
  if (!perms.has(key)) {
    throw new Error(`Forbidden: missing permission "${key}"`);
  }
}
