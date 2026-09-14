"use server";

import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/permissions";
import { runAction, type ActionResult } from "@/lib/action-result";
import { writeAuditLog } from "@/lib/audit";
import { revalidatePath } from "next/cache";

export async function moveHomepageSection(featureFlagId: string, direction: "up" | "down"): Promise<ActionResult<void>> {
  return runAction(async () => {
    await requirePermission("settings.edit");
    const sections = await prisma.homepageSection.findMany({ orderBy: { order: "asc" } });
    const idx = sections.findIndex((s) => s.featureFlagId === featureFlagId);
    const swapIdx = direction === "up" ? idx - 1 : idx + 1;
    if (idx === -1 || swapIdx < 0 || swapIdx >= sections.length) return;
    await prisma.$transaction([
      prisma.homepageSection.update({ where: { id: sections[idx].id }, data: { order: sections[swapIdx].order } }),
      prisma.homepageSection.update({ where: { id: sections[swapIdx].id }, data: { order: sections[idx].order } }),
    ]);
    // QA fix: no audit trail previously existed for homepage reordering.
    await writeAuditLog("UPDATE", "HomepageSection", featureFlagId, { reordered: direction });
    revalidatePath("/");
  });
}
