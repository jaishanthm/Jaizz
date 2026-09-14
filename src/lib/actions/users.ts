"use server";

import { z } from "zod";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/permissions";
import { runAction, type ActionResult } from "@/lib/action-result";
import { writeAuditLog } from "@/lib/audit";
import { createInviteToken, consumeInviteToken } from "@/lib/invite-token";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const InviteSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  roleKey: z.enum(["ADMIN", "EDITOR", "VIEWER"]),
});

// Phase 4 §2 — password set via invite-link flow, never admin-typed. A
// random unusable password is set as a placeholder (the user can't log in
// with it — it's discarded, never shown) until they visit the invite link.
export async function inviteUser(input: z.infer<typeof InviteSchema>): Promise<ActionResult<{ inviteUrl: string }>> {
  return runAction(async () => {
    await requirePermission("users.manage");
    const data = InviteSchema.parse(input);
    const role = await prisma.role.findUniqueOrThrow({ where: { key: data.roleKey } });
    const placeholderHash = await bcrypt.hash(crypto.randomBytes(32).toString("hex"), 12);

    const user = await prisma.adminUser.create({
      data: { name: data.name, email: data.email, passwordHash: placeholderHash, roleId: role.id, active: true },
    });
    await writeAuditLog("CREATE", "AdminUser", user.id, { email: data.email, role: data.roleKey });

    const token = await createInviteToken(user.id);
    return { inviteUrl: `/admin/set-password/${token}` };
  });
}

export async function setPasswordFromInvite(token: string, newPassword: string): Promise<ActionResult<void>> {
  return runAction(async () => {
    if (newPassword.length < 12) throw new Error("Password must be at least 12 characters.");

    // consumeInviteToken atomically checks-and-marks-used — see
    // src/lib/invite-token.ts for why this had to be one atomic operation,
    // not a separate verify step followed by a separate "mark used" write.
    const verified = await consumeInviteToken(token);
    if (!verified) throw new Error("This invite link is invalid, expired, or has already been used.");

    const passwordHash = await bcrypt.hash(newPassword, 12);
    await prisma.adminUser.update({ where: { id: verified.userId }, data: { passwordHash } });
    // Audit that a password was set via invite — deliberately no payload
    // (no token, no password, not even a hash fragment) per the standing
    // rule against ever logging secrets, even in an audit trail meant to
    // be safe. The fact and the actor/timestamp are what matter here.
    await writeAuditLog("UPDATE", "AdminUser", verified.userId, { event: "password_set_via_invite" });
  });
}

export async function deactivateUser(id: string): Promise<ActionResult<void>> {
  return runAction(async () => {
    await requirePermission("users.manage");

    // Self-deactivation blocked — Phase 4 §2.
    const session = await getServerSession(authOptions);
    const actingUser = await prisma.adminUser.findUnique({ where: { email: session?.user?.email ?? "" } });
    if (actingUser?.id === id) {
      throw new Error("You can't deactivate your own account.");
    }

    await prisma.adminUser.update({ where: { id }, data: { active: false } });
    await writeAuditLog("UPDATE", "AdminUser", id, { active: false });
  });
}
