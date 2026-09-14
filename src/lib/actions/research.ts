"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/permissions";
import { runAction, type ActionResult } from "@/lib/action-result";
import { writeAuditLog } from "@/lib/audit";
import { revalidatePath } from "next/cache";

const STATUS_ORDER = ["DRAFT", "RESEARCH", "READY", "PUBLISHED", "ARCHIVED"] as const;
type Status = (typeof STATUS_ORDER)[number];

const ResearchSchema = z.object({
  title: z.string().min(2).max(150),
  slug: z.string().min(2).max(150).regex(/^[a-z0-9-]+$/),
  summary: z.string().min(1).max(500),
  content: z.string().min(1),
  researchType: z.string().optional(),
  date: z.coerce.date(),
  impact: z.string().optional(),
  remediation: z.string().optional(),
  targetContext: z.string().optional(),
  methodology: z.string().optional(),
  technicalDetails: z.string().optional(),
  seoTitle: z.string().max(60).optional(),
  seoDescription: z.string().max(160).optional(),
});

export async function createResearch(input: z.infer<typeof ResearchSchema>): Promise<ActionResult<{ id: string }>> {
  return runAction(async () => {
    await requirePermission("content.create");
    const data = ResearchSchema.parse(input);
    const existing = await prisma.research.findUnique({ where: { slug: data.slug } });
    if (existing) throw new Error(`Slug "${data.slug}" is already in use.`);

    const research = await prisma.research.create({ data: { ...data, disclosureStatus: "DRAFT" } });
    await writeAuditLog("CREATE", "Research", research.id, data);
    return { id: research.id };
  });
}

export async function updateResearch(id: string, input: z.infer<typeof ResearchSchema>): Promise<ActionResult<{ id: string }>> {
  return runAction(async () => {
    await requirePermission("content.edit_all");
    const data = ResearchSchema.parse(input);
    const existing = await prisma.research.findFirst({ where: { slug: data.slug, NOT: { id } } });
    if (existing) throw new Error(`Slug "${data.slug}" is already in use.`);

    await prisma.research.update({ where: { id }, data });
    await writeAuditLog("UPDATE", "Research", id, data);
    revalidatePath("/research");
    revalidatePath(`/research/${data.slug}`);
    return { id };
  });
}

export async function deleteResearch(id: string): Promise<ActionResult<void>> {
  return runAction(async () => {
    await requirePermission("content.edit_all");
    await prisma.research.delete({ where: { id } });
    await writeAuditLog("DELETE", "Research", id);
    revalidatePath("/research");
  });
}

// Phase 4 §6 state machine — can only advance one step at a time, and
// PUBLISHED specifically requires date + at least one of impact/remediation.
// This is the one rule in the whole CRUD set that genuinely isn't "the
// same shape as Projects," so it gets its own explicit function rather than
// a generic setVisible().
export async function advanceResearchStatus(id: string, to: Status): Promise<ActionResult<void>> {
  return runAction(async () => {
    await requirePermission("content.publish");
    const research = await prisma.research.findUniqueOrThrow({ where: { id } });
    const currentIdx = STATUS_ORDER.indexOf(research.disclosureStatus as Status);
    const targetIdx = STATUS_ORDER.indexOf(to);

    if (to !== "ARCHIVED" && targetIdx !== currentIdx + 1) {
      throw new Error(`Cannot go from ${research.disclosureStatus} directly to ${to} — must advance one stage at a time.`);
    }
    if (to === "PUBLISHED") {
      if (!research.date) throw new Error("Cannot publish: date is required.");
      if (!research.impact && !research.remediation) {
        throw new Error("Cannot publish: at least one of Impact or Remediation must be filled in.");
      }
    }

    await prisma.research.update({ where: { id }, data: { disclosureStatus: to } });
    await writeAuditLog(to === "PUBLISHED" ? "PUBLISH" : "UPDATE", "Research", id, { disclosureStatus: to });
    revalidatePath("/research");
  });
}

export async function setResearchVisible(id: string, visible: boolean): Promise<ActionResult<void>> {
  return runAction(async () => {
    await requirePermission("content.edit_all");
    await prisma.research.update({ where: { id }, data: { visible } });
    await writeAuditLog(visible ? "PUBLISH" : "UNPUBLISH", "Research", id);
    revalidatePath("/research");
  });
}
