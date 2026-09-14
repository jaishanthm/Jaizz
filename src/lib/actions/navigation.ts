"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/permissions";
import { runAction, type ActionResult } from "@/lib/action-result";
import { writeAuditLog } from "@/lib/audit";
import { revalidatePath } from "next/cache";

const NavItemSchema = z.object({
  label: z.string().min(1).max(30),
  url: z.string().min(1),
  openInNewTab: z.boolean().default(false),
});

export async function createNavItem(input: z.infer<typeof NavItemSchema>): Promise<ActionResult<{ id: string }>> {
  return runAction(async () => {
    await requirePermission("settings.edit");
    const data = NavItemSchema.parse(input);
    const count = await prisma.navigationItem.count();
    const item = await prisma.navigationItem.create({ data: { ...data, order: count } });
    // QA fix: navigation mutations had zero audit logging previously.
    await writeAuditLog("CREATE", "NavigationItem", item.id, data);
    revalidatePath("/", "layout");
    return { id: item.id };
  });
}

export async function deleteNavItem(id: string): Promise<ActionResult<void>> {
  return runAction(async () => {
    await requirePermission("settings.edit");
    await prisma.navigationItem.delete({ where: { id } });
    await writeAuditLog("DELETE", "NavigationItem", id);
    revalidatePath("/", "layout");
  });
}

export async function moveNavItem(id: string, direction: "up" | "down"): Promise<ActionResult<void>> {
  return runAction(async () => {
    await requirePermission("settings.edit");
    const all = await prisma.navigationItem.findMany({ orderBy: { order: "asc" } });
    const idx = all.findIndex((n) => n.id === id);
    const swapIdx = direction === "up" ? idx - 1 : idx + 1;
    if (idx === -1 || swapIdx < 0 || swapIdx >= all.length) return;
    await prisma.$transaction([
      prisma.navigationItem.update({ where: { id: all[idx].id }, data: { order: all[swapIdx].order } }),
      prisma.navigationItem.update({ where: { id: all[swapIdx].id }, data: { order: all[idx].order } }),
    ]);
    await writeAuditLog("UPDATE", "NavigationItem", id, { reordered: direction });
    revalidatePath("/", "layout");
  });
}
