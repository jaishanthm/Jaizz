"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/permissions";
import { runAction, type ActionResult } from "@/lib/action-result";
import { writeAuditLog } from "@/lib/audit";
import { revalidatePath } from "next/cache";

const SocialLinkSchema = z.object({
  platform: z.string().min(1).max(50),
  url: z.string().url().max(300),
  iconKey: z.string().max(50).optional(),
  customLabel: z.string().max(100).optional(),
});

export async function createSocialLink(input: z.infer<typeof SocialLinkSchema>): Promise<ActionResult<{ id: string }>> {
  return runAction(async () => {
    await requirePermission("settings.edit");
    const data = SocialLinkSchema.parse(input);
    const count = await prisma.socialLink.count();

    const link = await prisma.socialLink.create({
      data: {
        ...data,
        order: count,
        visible: true,
      },
    });

    await writeAuditLog("CREATE", "SocialLink", link.id, data);
    revalidatePath("/");
    revalidatePath("/contact");
    revalidatePath("/links");
    return { id: link.id };
  });
}

export async function updateSocialLink(id: string, input: z.infer<typeof SocialLinkSchema>): Promise<ActionResult<{ id: string }>> {
  return runAction(async () => {
    await requirePermission("settings.edit");
    const data = SocialLinkSchema.parse(input);

    await prisma.socialLink.update({
      where: { id },
      data,
    });

    await writeAuditLog("UPDATE", "SocialLink", id, data);
    revalidatePath("/");
    revalidatePath("/contact");
    revalidatePath("/links");
    return { id };
  });
}

export async function deleteSocialLink(id: string): Promise<ActionResult<void>> {
  return runAction(async () => {
    await requirePermission("settings.edit");
    await prisma.socialLink.delete({ where: { id } });
    await writeAuditLog("DELETE", "SocialLink", id);
    revalidatePath("/");
    revalidatePath("/contact");
    revalidatePath("/links");
  });
}

export async function setSocialLinkVisible(id: string, visible: boolean): Promise<ActionResult<void>> {
  return runAction(async () => {
    await requirePermission("settings.edit");
    await prisma.socialLink.update({ where: { id }, data: { visible } });
    await writeAuditLog("UPDATE", "SocialLink", id, { visible });
    revalidatePath("/");
    revalidatePath("/contact");
    revalidatePath("/links");
  });
}

export async function moveSocialLink(id: string, direction: "up" | "down"): Promise<ActionResult<void>> {
  return runAction(async () => {
    await requirePermission("settings.edit");
    const current = await prisma.socialLink.findUniqueOrThrow({ where: { id } });
    const adjacent = await prisma.socialLink.findFirst({
      where: direction === "up" ? { order: { lt: current.order } } : { order: { gt: current.order } },
      orderBy: { order: direction === "up" ? "desc" : "asc" },
    });
    if (!adjacent) return;

    await prisma.$transaction([
      prisma.socialLink.update({ where: { id: current.id }, data: { order: adjacent.order } }),
      prisma.socialLink.update({ where: { id: adjacent.id }, data: { order: current.order } }),
    ]);

    await writeAuditLog("UPDATE", "SocialLink", id, { direction });
    revalidatePath("/");
    revalidatePath("/contact");
    revalidatePath("/links");
  });
}
