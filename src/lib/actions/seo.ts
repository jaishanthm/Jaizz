"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/permissions";
import { runAction, type ActionResult } from "@/lib/action-result";
import { writeAuditLog } from "@/lib/audit";
import { revalidatePath } from "next/cache";

const SEOSettingsSchema = z.object({
  siteTitle: z.string().min(1),
  siteDescription: z.string().min(1),
  siteName: z.string().min(1),
  authorName: z.string().min(1),
  canonicalBaseUrl: z.string().url(),
  googleVerification: z.string().optional(),
  bingVerification: z.string().optional(),
});

export async function updateSEOSettings(input: z.infer<typeof SEOSettingsSchema>): Promise<ActionResult<void>> {
  return runAction(async () => {
    await requirePermission("seo.edit");
    const data = SEOSettingsSchema.parse(input);
    await prisma.sEOSettings.update({ where: { id: "singleton" }, data });
    // QA fix: global SEO settings changes (including verification codes —
    // sensitive-adjacent, worth tracking who changed them and when) had no
    // audit trail at all.
    await writeAuditLog("UPDATE", "SEOSettings", "singleton", data);
    revalidatePath("/", "layout");
  });
}

const PageSEOSchema = z.object({
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  noindex: z.boolean().default(false),
});

export async function upsertPageSEO(path: string, input: z.infer<typeof PageSEOSchema>): Promise<ActionResult<void>> {
  return runAction(async () => {
    await requirePermission("seo.edit");
    const data = PageSEOSchema.parse(input);
    await prisma.pageSEO.upsert({ where: { path }, update: data, create: { path, ...data } });
    await writeAuditLog("UPDATE", "PageSEO", path, data);
    revalidatePath(path);
  });
}
