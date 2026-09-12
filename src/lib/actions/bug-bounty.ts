"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/permissions";
import { runAction, type ActionResult } from "@/lib/action-result";
import { writeAuditLog } from "@/lib/audit";
import { revalidatePath } from "next/cache";

const ProfileSchema = z.object({
  platform: z.string().min(1),
  profileUrl: z.string().url(),
  researcherName: z.string().optional(),
  description: z.string().optional(),
});

export async function createBugBountyProfile(input: z.infer<typeof ProfileSchema>): Promise<ActionResult<{ id: string }>> {
  return runAction(async () => {
    await requirePermission("content.create");
    const data = ProfileSchema.parse(input);
    const count = await prisma.bugBountyProfile.count();
    const profile = await prisma.bugBountyProfile.create({ data: { ...data, order: count } });
    await writeAuditLog("CREATE", "BugBountyProfile", profile.id, data);
    revalidatePath("/bug-bounty");
    return { id: profile.id };
  });
}

export async function deleteBugBountyProfile(id: string): Promise<ActionResult<void>> {
  return runAction(async () => {
    await requirePermission("content.edit_all");
    await prisma.bugBountyProfile.delete({ where: { id } }); // findings cascade per schema
    await writeAuditLog("DELETE", "BugBountyProfile", id);
    revalidatePath("/bug-bounty");
  });
}

export async function setBugBountyProfileVisible(id: string, visible: boolean): Promise<ActionResult<void>> {
  return runAction(async () => {
    await requirePermission("content.edit_all");
    await prisma.bugBountyProfile.update({ where: { id }, data: { visible } });
    await writeAuditLog(visible ? "PUBLISH" : "UNPUBLISH", "BugBountyProfile", id);
    revalidatePath("/bug-bounty");
  });
}

const FindingSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  url: z.string().url().optional().or(z.literal("")),
  date: z.coerce.date().optional(),
  severity: z.string().optional(),
  isHallOfFame: z.boolean().optional(),
  isAcknowledgement: z.boolean().optional(),
});

export async function createBugBountyFinding(profileId: string, input: z.infer<typeof FindingSchema>): Promise<ActionResult<{ id: string }>> {
  return runAction(async () => {
    await requirePermission("content.create");
    const data = FindingSchema.parse(input);
    // Reminder per Phase 4 §7 — severity/disclosure is only shown publicly
    // if the platform itself made it public; this doesn't (and can't)
    // verify that automatically, so it's surfaced as guidance, not a gate.
    const finding = await prisma.bugBountyFinding.create({ data: { ...data, bugBountyProfileId: profileId } });
    await writeAuditLog("CREATE", "BugBountyFinding", finding.id, data);
    revalidatePath("/bug-bounty");
    return { id: finding.id };
  });
}

export async function deleteBugBountyFinding(id: string): Promise<ActionResult<void>> {
  return runAction(async () => {
    await requirePermission("content.edit_all");
    await prisma.bugBountyFinding.delete({ where: { id } });
    await writeAuditLog("DELETE", "BugBountyFinding", id);
    revalidatePath("/bug-bounty");
  });
}

export async function setBugBountyFindingVisible(id: string, visible: boolean): Promise<ActionResult<void>> {
  return runAction(async () => {
    await requirePermission("content.edit_all");
    await prisma.bugBountyFinding.update({ where: { id }, data: { visible } });
    await writeAuditLog(visible ? "PUBLISH" : "UNPUBLISH", "BugBountyFinding", id);
    revalidatePath("/bug-bounty");
  });
}
