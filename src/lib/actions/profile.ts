"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/permissions";
import { runAction, type ActionResult } from "@/lib/action-result";
import { writeAuditLog } from "@/lib/audit";
import { revalidatePath } from "next/cache";

// QA fix — the admin sidebar linked to /admin/identity, /admin/hero, and
// /admin/about, none of which existed. Rather than build three screens
// that would all edit an overlapping subset of the same Profile fields
// (HeroSection.tsx and the About page both already read displayName /
// professionalTitle / shortBio / longBio from the same singleton row),
// this is ONE real screen covering the actual field set — see the sidebar
// change alongside this file.

const ProfileSchema = z.object({
  displayName: z.string().min(1).max(80),
  professionalTitle: z.string().min(1).max(100),
  shortBio: z.string().min(1).max(200),
  longBio: z.string().optional(),
  location: z.string().optional(),
  contactEmail: z.string().email().optional().or(z.literal("")),
  availability: z.string().optional(),
  profileImageId: z.string().optional(),
  resumeMediaId: z.string().optional(),
});

export async function updateProfile(input: z.infer<typeof ProfileSchema>): Promise<ActionResult<void>> {
  return runAction(async () => {
    await requirePermission("settings.edit");
    const data = ProfileSchema.parse(input);
    await prisma.profile.update({ where: { id: "singleton" }, data });
    await writeAuditLog("UPDATE", "Profile", "singleton", data);
    revalidatePath("/", "layout"); // hero + about both read this
  });
}
