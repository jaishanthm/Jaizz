"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/permissions";
import { runAction, type ActionResult } from "@/lib/action-result";
import { writeAuditLog } from "@/lib/audit";
import { revalidatePath } from "next/cache";

const ThemeSchema = z.object({
  accentColor: z.string().regex(/^#[0-9a-fA-F]{6}$/),
  glassIntensity: z.number().min(0).max(100),
  animationIntensity: z.number().min(0).max(100),
  threeDMode: z.enum(["FULL", "LITE", "OFF"]),
});

export async function updateSiteSettings(input: z.infer<typeof ThemeSchema>): Promise<ActionResult<void>> {
  return runAction(async () => {
    await requirePermission("settings.edit");
    const data = ThemeSchema.parse(input);
    await prisma.siteSettings.update({ where: { id: "singleton" }, data });
    // QA fix: theme changes had no audit trail.
    await writeAuditLog("UPDATE", "SiteSettings", "singleton", data);
    revalidatePath("/", "layout");
  });
}

// maintenanceMode was the one SiteSettings field with no admin UI anywhere
// — not on the Theme page (which only covers visual tokens), not
// elsewhere. QA-fix screen: /admin/settings.
export async function setMaintenanceMode(enabled: boolean): Promise<ActionResult<void>> {
  return runAction(async () => {
    await requirePermission("settings.edit");
    await prisma.siteSettings.update({ where: { id: "singleton" }, data: { maintenanceMode: enabled } });
    await writeAuditLog("UPDATE", "SiteSettings", "singleton", { maintenanceMode: enabled });
    revalidatePath("/", "layout");
  });
}
