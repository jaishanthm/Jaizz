"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/permissions";
import { runAction, type ActionResult } from "@/lib/action-result";
import { writeAuditLog } from "@/lib/audit";
import { revalidatePath } from "next/cache";

export async function updateMediaAltText(id: string, altText: string): Promise<ActionResult<void>> {
  return runAction(async () => {
    await requirePermission("media.upload");
    const parsed = z.string().min(1).parse(altText);
    await prisma.media.update({ where: { id }, data: { altText: parsed } });
    await writeAuditLog("UPDATE", "Media", id, { altText: parsed });
  });
}

// Phase 4 §11 — deleting a Media row still referenced elsewhere is blocked,
// with a list of what's using it. Checks every relation that points at
// Media across the schema, not just the obvious ones.
async function findMediaUsage(id: string): Promise<string[]> {
  const usage: string[] = [];
  const [
    profileImage, profileResume, projectOg, projectShots, researchOg, researchShots,
    certs, achievements, blogCovers, blogOg, eduLogos, expLogos, seoDefault, seoFavicon, pageSeo,
  ] = await Promise.all([
    prisma.profile.count({ where: { profileImageId: id } }),
    prisma.profile.count({ where: { resumeMediaId: id } }),
    prisma.project.count({ where: { ogImageId: id } }),
    prisma.projectScreenshot.count({ where: { mediaId: id } }),
    prisma.research.count({ where: { ogImageId: id } }),
    prisma.researchScreenshot.count({ where: { mediaId: id } }),
    prisma.certification.count({ where: { imageMediaId: id } }),
    prisma.achievement.count({ where: { mediaId: id } }),
    prisma.blogPost.count({ where: { coverImageId: id } }),
    prisma.blogPost.count({ where: { ogImageId: id } }),
    prisma.education.count({ where: { logoMediaId: id } }),
    prisma.experience.count({ where: { logoMediaId: id } }),
    prisma.sEOSettings.count({ where: { defaultOgImageId: id } }),
    prisma.sEOSettings.count({ where: { faviconMediaId: id } }),
    prisma.pageSEO.count({ where: { ogImageId: id } }),
  ]);

  if (profileImage) usage.push("Profile photo");
  if (profileResume) usage.push("Profile resume");
  if (projectOg) usage.push(`${projectOg} project OG image(s)`);
  if (projectShots) usage.push(`${projectShots} project screenshot(s)`);
  if (researchOg) usage.push(`${researchOg} research OG image(s)`);
  if (researchShots) usage.push(`${researchShots} research screenshot(s)`);
  if (certs) usage.push(`${certs} certification image(s)`);
  if (achievements) usage.push(`${achievements} achievement image(s)`);
  if (blogCovers) usage.push(`${blogCovers} blog cover image(s)`);
  if (blogOg) usage.push(`${blogOg} blog OG image(s)`);
  if (eduLogos) usage.push(`${eduLogos} education logo(s)`);
  if (expLogos) usage.push(`${expLogos} experience logo(s)`);
  if (seoDefault) usage.push("Default OG image (SEO settings)");
  if (seoFavicon) usage.push("Favicon (SEO settings)");
  if (pageSeo) usage.push(`${pageSeo} page SEO override(s)`);

  return usage;
}

// Exported separately from deleteMedia so the admin UI can show usage
// before someone attempts a delete (Phase 4 §11). QA caught this exported
// with no permission check of its own — any exported function in a
// "use server" file is potentially network-callable regardless of which
// component currently imports it, so it needs its own check, not a
// borrowed one from a sibling function.
export async function getMediaUsage(id: string): Promise<string[]> {
  await requirePermission("media.upload");
  return findMediaUsage(id);
}

export async function deleteMedia(id: string): Promise<ActionResult<void>> {
  return runAction(async () => {
    await requirePermission("media.delete"); // media.delete is a separate permission — EDITOR can upload but only ADMIN can delete
    const usage = await findMediaUsage(id);
    if (usage.length > 0) {
      throw new Error(`Cannot delete — still in use: ${usage.join(", ")}`);
    }
    await prisma.media.delete({ where: { id } });
    await writeAuditLog("DELETE", "Media", id);
    revalidatePath("/admin/media");
  });
}
