"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/permissions";
import { runAction, type ActionResult } from "@/lib/action-result";
import { writeAuditLog } from "@/lib/audit";
import { revalidatePath } from "next/cache";

const ProfileSchema = z.object({
  platform: z.string().min(1, "Platform name is required"),
  profileUrl: z.preprocess((val) => {
    if (typeof val !== "string") return val;
    const str = val.trim();
    if (!str) return str;
    if (!str.startsWith("http://") && !str.startsWith("https://")) {
      return "https://" + str;
    }
    return str;
  }, z.string().url("Please enter a valid URL")),
  researcherName: z.preprocess((val) => (val === "" || val === undefined ? null : val), z.string().nullable().optional()),
  description: z.preprocess((val) => (val === "" || val === undefined ? null : val), z.string().nullable().optional()),
});

export async function createBugBountyProfile(
  input: z.infer<typeof ProfileSchema>
): Promise<ActionResult<{
  id: string;
  platform: string;
  profileUrl: string;
  researcherName: string | null;
  description: string | null;
  visible: boolean;
  order: number;
}>> {
  return runAction(async () => {
    await requirePermission("content.create");
    const data = ProfileSchema.parse(input);
    const count = await prisma.bugBountyProfile.count();
    const profile = await prisma.bugBountyProfile.create({
      data: {
        platform: data.platform,
        profileUrl: data.profileUrl,
        researcherName: data.researcherName ?? null,
        description: data.description ?? null,
        visible: true,
        order: count,
      },
    });
    await writeAuditLog("CREATE", "BugBountyProfile", profile.id, data);
    revalidatePath("/bug-bounty");
    revalidatePath("/admin/bug-bounty");
    revalidatePath("/", "layout");
    return profile;
  });
}

export async function deleteBugBountyProfile(id: string): Promise<ActionResult<void>> {
  return runAction(async () => {
    await requirePermission("content.edit_all");
    await prisma.bugBountyProfile.delete({ where: { id } }); // findings cascade per schema
    await writeAuditLog("DELETE", "BugBountyProfile", id);
    revalidatePath("/bug-bounty");
    revalidatePath("/admin/bug-bounty");
    revalidatePath("/", "layout");
  });
}

export async function setBugBountyProfileVisible(id: string, visible: boolean): Promise<ActionResult<void>> {
  return runAction(async () => {
    await requirePermission("content.edit_all");
    await prisma.bugBountyProfile.update({ where: { id }, data: { visible } });
    await writeAuditLog(visible ? "PUBLISH" : "UNPUBLISH", "BugBountyProfile", id);
    revalidatePath("/bug-bounty");
    revalidatePath("/admin/bug-bounty");
    revalidatePath("/", "layout");
  });
}

const FindingSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.preprocess((val) => (val === "" || val === undefined ? null : val), z.string().nullable().optional()),
  url: z.preprocess((val) => {
    if (typeof val !== "string") return null;
    const str = val.trim();
    if (!str) return null;
    if (!str.startsWith("http://") && !str.startsWith("https://")) {
      return "https://" + str;
    }
    return str;
  }, z.string().url().nullable().optional()),
  date: z.preprocess((val) => (val === "" || val === undefined ? null : val), z.coerce.date().nullable().optional()),
  severity: z.preprocess((val) => (val === "" || val === undefined ? null : val), z.string().nullable().optional()),
  isHallOfFame: z.boolean().optional(),
  isAcknowledgement: z.boolean().optional(),
});

export async function createBugBountyFinding(
  profileId: string,
  input: z.infer<typeof FindingSchema>
): Promise<ActionResult<{ id: string; title: string; visible: boolean }>> {
  return runAction(async () => {
    await requirePermission("content.create");
    const data = FindingSchema.parse(input);
    const finding = await prisma.bugBountyFinding.create({
      data: {
        title: data.title,
        description: data.description ?? null,
        url: data.url ?? null,
        date: data.date ?? null,
        severity: data.severity ?? null,
        isHallOfFame: data.isHallOfFame ?? false,
        isAcknowledgement: data.isAcknowledgement ?? false,
        visible: true,
        bugBountyProfileId: profileId,
      },
    });
    await writeAuditLog("CREATE", "BugBountyFinding", finding.id, data);
    revalidatePath("/bug-bounty");
    revalidatePath("/admin/bug-bounty");
    revalidatePath("/", "layout");
    return { id: finding.id, title: finding.title, visible: finding.visible };
  });
}

export async function deleteBugBountyFinding(id: string): Promise<ActionResult<void>> {
  return runAction(async () => {
    await requirePermission("content.edit_all");
    await prisma.bugBountyFinding.delete({ where: { id } });
    await writeAuditLog("DELETE", "BugBountyFinding", id);
    revalidatePath("/bug-bounty");
    revalidatePath("/admin/bug-bounty");
    revalidatePath("/", "layout");
  });
}

export async function setBugBountyFindingVisible(id: string, visible: boolean): Promise<ActionResult<void>> {
  return runAction(async () => {
    await requirePermission("content.edit_all");
    await prisma.bugBountyFinding.update({ where: { id }, data: { visible } });
    await writeAuditLog(visible ? "PUBLISH" : "UNPUBLISH", "BugBountyFinding", id);
    revalidatePath("/bug-bounty");
    revalidatePath("/admin/bug-bounty");
    revalidatePath("/", "layout");
  });
}
