"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/permissions";
import { runAction, type ActionResult } from "@/lib/action-result";
import { writeAuditLog } from "@/lib/audit";
import { revalidatePath } from "next/cache";

// Phase 5 §2/§4 — instant-apply, no separate save step (unlike content
// forms). The two non-disableable flags (hero, contact — Phase 5 §1) are
// enforced here too, not just hidden in the UI, since a UI-only guard is
// not a real guard.
const LOCKED_FLAGS = ["hero", "contact"];

const UpdateSchema = z.object({
  enabled: z.boolean().optional(),
  homepageVisible: z.boolean().optional(),
  navVisible: z.boolean().optional(),
  sitemapEligible: z.boolean().optional(),
});

export async function updateFeatureFlag(key: string, patch: z.infer<typeof UpdateSchema>): Promise<ActionResult<void>> {
  return runAction(async () => {
    await requirePermission("settings.edit");
    const data = UpdateSchema.parse(patch);

    if (LOCKED_FLAGS.includes(key) && data.enabled === false) {
      throw new Error(`"${key}" cannot be disabled — the site needs it to function.`);
    }

    // Phase 5 §2 dependency rule: enabled=false cascades to the other three.
    const finalData = data.enabled === false
      ? { ...data, homepageVisible: false, navVisible: false, sitemapEligible: false }
      : data;

    await prisma.featureFlag.update({ where: { key }, data: finalData });
    // QA fix: this file had zero audit logging despite feature-flag
    // changes being exactly the kind of site-wide mutation Phase 1 §11
    // says should be tracked — a flag flip can take a whole section
    // offline, which is at least as consequential as editing one project.
    await writeAuditLog("UPDATE", "FeatureFlag", key, finalData);
    revalidatePath("/", "layout"); // nav/homepage/sitemap all derive from flags — revalidate broadly
  });
}
