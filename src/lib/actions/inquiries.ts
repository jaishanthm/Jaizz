"use server";

import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/permissions";
import { runAction, type ActionResult } from "@/lib/action-result";
import { writeAuditLog } from "@/lib/audit";
import { revalidatePath } from "next/cache";

export async function toggleInquiryRead(id: string, read: boolean): Promise<ActionResult<void>> {
  return runAction(async () => {
    await requirePermission("settings.edit");
    await prisma.contactMessage.update({
      where: { id },
      data: { read },
    });
    await writeAuditLog("UPDATE", "ContactMessage", id, { read });
    revalidatePath("/admin");
    revalidatePath("/admin/inquiries");
  });
}

export async function deleteInquiry(id: string): Promise<ActionResult<void>> {
  return runAction(async () => {
    await requirePermission("settings.edit");
    await prisma.contactMessage.delete({ where: { id } });
    await writeAuditLog("DELETE", "ContactMessage", id);
    revalidatePath("/admin");
    revalidatePath("/admin/inquiries");
  });
}
