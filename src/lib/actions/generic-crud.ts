import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/permissions";
import { runAction, type ActionResult } from "@/lib/action-result";
import { writeAuditLog } from "@/lib/audit";
import { revalidatePath } from "next/cache";

// Factory for the entities that are genuinely plain CRUD with no special
// business rules (Certifications, Achievements, Education, Experience) —
// Projects and Research each got their own real files because they have
// real rules (Phase 4 §5, §6); these four don't, so one shared
// implementation is honest engineering, not laziness. Uses `any` for the
// Prisma delegate because Prisma's per-model types don't unify cleanly
// across models with a single generic — acceptable here since each config
// object below is still fully typed at its call site via the Zod schema.
//
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Delegate = any;

export function makeCrudActions<T extends z.ZodTypeAny>(config: {
  model: Delegate;
  schema: T;
  entityType: string;
  permission: { create: string; edit: string };
  publicPath?: string;
  hasSortOrder?: boolean;
}) {
  async function create(input: z.infer<T>): Promise<ActionResult<{ id: string }>> {
    return runAction(async () => {
      await requirePermission(config.permission.create);
      const data = config.schema.parse(input);
      const extra = config.hasSortOrder ? { sortOrder: await config.model.count() } : {};
      const record = await config.model.create({ data: { ...data, ...extra, visible: false } });
      await writeAuditLog("CREATE", config.entityType, record.id, data);
      if (config.publicPath) revalidatePath(config.publicPath);
      return { id: record.id };
    });
  }

  async function update(id: string, input: z.infer<T>): Promise<ActionResult<{ id: string }>> {
    return runAction(async () => {
      await requirePermission(config.permission.edit);
      const data = config.schema.parse(input);
      await config.model.update({ where: { id }, data });
      await writeAuditLog("UPDATE", config.entityType, id, data);
      if (config.publicPath) revalidatePath(config.publicPath);
      return { id };
    });
  }

  async function remove(id: string): Promise<ActionResult<void>> {
    return runAction(async () => {
      await requirePermission(config.permission.edit);
      await config.model.delete({ where: { id } });
      await writeAuditLog("DELETE", config.entityType, id);
      if (config.publicPath) revalidatePath(config.publicPath);
    });
  }

  async function setVisible(id: string, visible: boolean): Promise<ActionResult<void>> {
    return runAction(async () => {
      await requirePermission(config.permission.edit);
      await config.model.update({ where: { id }, data: { visible } });
      await writeAuditLog(visible ? "PUBLISH" : "UNPUBLISH", config.entityType, id);
      if (config.publicPath) revalidatePath(config.publicPath);
    });
  }

  // Gap found in QA: Certification and Achievement both have a `featured`
  // column (per schema.prisma) but the factory never generated a toggle for
  // it, so it silently had no admin UI at all despite existing in the DB —
  // exactly the "field exists in schema but nowhere to edit it" failure
  // mode called out explicitly in the QA pass.
  async function setFeatured(id: string, featured: boolean): Promise<ActionResult<void>> {
    return runAction(async () => {
      await requirePermission(config.permission.edit);
      await config.model.update({ where: { id }, data: { featured } });
      await writeAuditLog("UPDATE", config.entityType, id, { featured });
      if (config.publicPath) revalidatePath(config.publicPath);
    });
  }

  async function move(id: string, direction: "up" | "down"): Promise<ActionResult<void>> {
    return runAction(async () => {
      if (!config.hasSortOrder) return;
      await requirePermission(config.permission.edit);
      const all = await config.model.findMany({ orderBy: { sortOrder: "asc" } });
      const idx = all.findIndex((r: { id: string }) => r.id === id);
      const swapIdx = direction === "up" ? idx - 1 : idx + 1;
      if (idx === -1 || swapIdx < 0 || swapIdx >= all.length) return;
      await prisma.$transaction([
        config.model.update({ where: { id: all[idx].id }, data: { sortOrder: all[swapIdx].sortOrder } }),
        config.model.update({ where: { id: all[swapIdx].id }, data: { sortOrder: all[idx].sortOrder } }),
      ]);
      await writeAuditLog("UPDATE", config.entityType, id, { reordered: direction });
      if (config.publicPath) revalidatePath(config.publicPath);
    });
  }

  return { create, update, remove, setVisible, setFeatured, move };
}
