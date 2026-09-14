"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/permissions";
import { runAction, type ActionResult } from "@/lib/action-result";
import { writeAuditLog } from "@/lib/audit";
import { revalidatePath } from "next/cache";

// Phase 4 §5 rules implemented: slug uniqueness, visible=true blocked
// without shortDescription (screenshot check deferred — needs Stage 5
// media integration to check the relation meaningfully).

const ProjectSchema = z.object({
  name: z.string().min(2).max(100),
  slug: z.string().min(2).max(100).regex(/^[a-z0-9-]+$/, "lowercase letters, numbers, hyphens only"),
  shortDescription: z.string().min(1).max(300),
  fullDescription: z.string().optional(),
  githubUrl: z.string().url().optional().or(z.literal("")),
  liveUrl: z.string().url().optional().or(z.literal("")),
  docsUrl: z.string().url().optional().or(z.literal("")),
  status: z.enum(["IN_PROGRESS", "COMPLETED", "ARCHIVED", "MAINTAINED"]),
  category: z.string().optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  seoTitle: z.string().max(60).optional(),
  seoDescription: z.string().max(160).optional(),
});

export async function createProject(input: z.infer<typeof ProjectSchema>): Promise<ActionResult<{ id: string }>> {
  return runAction(async () => {
    await requirePermission("content.create");
    const data = ProjectSchema.parse(input);

    const existing = await prisma.project.findUnique({ where: { slug: data.slug } });
    if (existing) throw new Error(`Slug "${data.slug}" is already in use.`);

    const count = await prisma.project.count();
    const project = await prisma.project.create({
      data: { ...data, sortOrder: count, visible: false }, // never live by default — visibility is a deliberate follow-up action
    });
    await writeAuditLog("CREATE", "Project", project.id, data);
    revalidatePath("/projects");
    return { id: project.id };
  });
}

export async function updateProject(id: string, input: z.infer<typeof ProjectSchema>): Promise<ActionResult<{ id: string }>> {
  return runAction(async () => {
    await requirePermission("content.edit_all");
    const data = ProjectSchema.parse(input);

    const existing = await prisma.project.findFirst({ where: { slug: data.slug, NOT: { id } } });
    if (existing) throw new Error(`Slug "${data.slug}" is already in use by another project.`);

    await prisma.project.update({ where: { id }, data });
    await writeAuditLog("UPDATE", "Project", id, data);
    revalidatePath("/projects");
    revalidatePath(`/projects/${data.slug}`);
    return { id };
  });
}

export async function deleteProject(id: string): Promise<ActionResult<void>> {
  return runAction(async () => {
    await requirePermission("content.edit_all");
    await prisma.project.delete({ where: { id } });
    await writeAuditLog("DELETE", "Project", id);
    revalidatePath("/projects");
  });
}

export async function setProjectVisible(id: string, visible: boolean): Promise<ActionResult<void>> {
  return runAction(async () => {
    await requirePermission("content.publish");
    if (visible) {
      const project = await prisma.project.findUniqueOrThrow({ where: { id } });
      if (!project.shortDescription) {
        throw new Error("Cannot make visible: short description is required first.");
      }
    }
    await prisma.project.update({ where: { id }, data: { visible } });
    await writeAuditLog(visible ? "PUBLISH" : "UNPUBLISH", "Project", id);
    revalidatePath("/projects");
  });
}

export async function setProjectFeatured(id: string, featured: boolean): Promise<ActionResult<void>> {
  return runAction(async () => {
    await requirePermission("content.edit_all");
    await prisma.project.update({ where: { id }, data: { featured } });
    await writeAuditLog("UPDATE", "Project", id, { featured });
    revalidatePath("/projects");
  });
}

export async function moveProject(id: string, direction: "up" | "down"): Promise<ActionResult<void>> {
  return runAction(async () => {
    await requirePermission("content.edit_all");
    const all = await prisma.project.findMany({ orderBy: { sortOrder: "asc" } });
    const idx = all.findIndex((p) => p.id === id);
    const swapIdx = direction === "up" ? idx - 1 : idx + 1;
    if (idx === -1 || swapIdx < 0 || swapIdx >= all.length) return;

    const a = all[idx];
    const b = all[swapIdx];
    await prisma.$transaction([
      prisma.project.update({ where: { id: a.id }, data: { sortOrder: b.sortOrder } }),
      prisma.project.update({ where: { id: b.id }, data: { sortOrder: a.sortOrder } }),
    ]);
    await writeAuditLog("UPDATE", "Project", id, { reordered: direction });
    revalidatePath("/projects");
  });
}
