"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/permissions";
import { runAction, type ActionResult } from "@/lib/action-result";
import { writeAuditLog } from "@/lib/audit";
import { revalidatePath } from "next/cache";

export async function createSkillCategory(name: string): Promise<ActionResult<{ id: string }>> {
  return runAction(async () => {
    await requirePermission("content.create");
    const count = await prisma.skillCategory.count();
    const cat = await prisma.skillCategory.create({ data: { name: z.string().min(1).parse(name), order: count } });
    await writeAuditLog("CREATE", "SkillCategory", cat.id, { name });
    revalidatePath("/skills");
    return { id: cat.id };
  });
}

export async function deleteSkillCategory(id: string): Promise<ActionResult<void>> {
  return runAction(async () => {
    await requirePermission("content.edit_all");
    // Phase 4 §4 — delete blocked if it still has skills.
    const count = await prisma.skill.count({ where: { categoryId: id } });
    if (count > 0) throw new Error(`Cannot delete — this category still has ${count} skill(s). Remove or reassign them first.`);
    await prisma.skillCategory.delete({ where: { id } });
    await writeAuditLog("DELETE", "SkillCategory", id);
    revalidatePath("/skills");
  });
}

export async function createSkill(categoryId: string, name: string): Promise<ActionResult<{ id: string }>> {
  return runAction(async () => {
    await requirePermission("content.create");
    const count = await prisma.skill.count({ where: { categoryId } });
    const skill = await prisma.skill.create({ data: { categoryId, name: z.string().min(1).parse(name), order: count } });
    await writeAuditLog("CREATE", "Skill", skill.id, { name, categoryId });
    revalidatePath("/skills");
    return { id: skill.id };
  });
}

export async function deleteSkill(id: string): Promise<ActionResult<void>> {
  return runAction(async () => {
    await requirePermission("content.edit_all");
    await prisma.skill.delete({ where: { id } });
    await writeAuditLog("DELETE", "Skill", id);
    revalidatePath("/skills");
  });
}

export async function setSkillCategoryVisible(id: string, visible: boolean): Promise<ActionResult<void>> {
  return runAction(async () => {
    await requirePermission("content.edit_all");
    await prisma.skillCategory.update({ where: { id }, data: { visible } });
    await writeAuditLog(visible ? "PUBLISH" : "UNPUBLISH", "SkillCategory", id);
    revalidatePath("/skills");
  });
}

export async function setSkillVisible(id: string, visible: boolean): Promise<ActionResult<void>> {
  return runAction(async () => {
    await requirePermission("content.edit_all");
    await prisma.skill.update({ where: { id }, data: { visible } });
    await writeAuditLog(visible ? "PUBLISH" : "UNPUBLISH", "Skill", id);
    revalidatePath("/skills");
  });
}
