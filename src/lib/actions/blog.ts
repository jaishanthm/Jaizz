"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/permissions";
import { runAction, type ActionResult } from "@/lib/action-result";
import { writeAuditLog } from "@/lib/audit";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// Phase 4 §9 — publishedAt auto-set on first transition to PUBLISHED, not
// editable afterward (except implicitly by an ADMIN re-running publish,
// which this simple version doesn't special-case further — a real EDITOR-
// role restriction on that would need the role check added here once
// EDITOR is actually in use). readingTimeMins auto-calculated from word
// count, never admin-entered.

const BlogPostSchema = z.object({
  title: z.string().min(2).max(200),
  slug: z.string().min(2).max(200).regex(/^[a-z0-9-]+$/),
  excerpt: z.string().max(300).optional(),
  content: z.string().min(1),
});

function estimateReadingTime(content: string): number {
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200)); // 200 wpm, standard estimate
}

export async function createBlogPost(input: z.infer<typeof BlogPostSchema>): Promise<ActionResult<{ id: string }>> {
  return runAction(async () => {
    await requirePermission("content.create");
    const data = BlogPostSchema.parse(input);
    const existing = await prisma.blogPost.findUnique({ where: { slug: data.slug } });
    if (existing) throw new Error(`Slug "${data.slug}" is already in use.`);

    const session = await getServerSession(authOptions);
    const author = await prisma.adminUser.findUniqueOrThrow({ where: { email: session!.user!.email! } });

    const post = await prisma.blogPost.create({
      data: { ...data, status: "DRAFT", authorId: author.id, readingTimeMins: estimateReadingTime(data.content) },
    });
    await writeAuditLog("CREATE", "BlogPost", post.id, data);
    return { id: post.id };
  });
}

export async function updateBlogPost(id: string, input: z.infer<typeof BlogPostSchema>): Promise<ActionResult<{ id: string }>> {
  return runAction(async () => {
    // Support ownership-based editing: content.edit_all can edit any post,
    // content.edit_own can edit only posts authored by the current user.
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) throw new Error("Not authenticated.");

    const user = await prisma.adminUser.findUniqueOrThrow({
      where: { email: session.user.email },
      include: { role: { include: { permissions: { include: { permission: true } } } } },
    });
    const permKeys = new Set(user.role.permissions.map((rp) => rp.permission.key));

    if (!permKeys.has("content.edit_all")) {
      if (!permKeys.has("content.edit_own")) {
        throw new Error("Forbidden: missing permission \"content.edit_own\" or \"content.edit_all\".");
      }
      // Verify ownership
      const post = await prisma.blogPost.findUniqueOrThrow({ where: { id } });
      if (post.authorId !== user.id) {
        throw new Error("Forbidden: you can only edit your own blog posts.");
      }
    }

    const data = BlogPostSchema.parse(input);
    const existing = await prisma.blogPost.findFirst({ where: { slug: data.slug, NOT: { id } } });
    if (existing) throw new Error(`Slug "${data.slug}" is already in use.`);

    await prisma.blogPost.update({
      where: { id },
      data: { ...data, readingTimeMins: estimateReadingTime(data.content) },
    });
    await writeAuditLog("UPDATE", "BlogPost", id, data);
    revalidatePath("/blog");
    revalidatePath(`/blog/${data.slug}`);
    return { id };
  });
}

export async function deleteBlogPost(id: string): Promise<ActionResult<void>> {
  return runAction(async () => {
    await requirePermission("content.edit_all");
    await prisma.blogPost.delete({ where: { id } });
    await writeAuditLog("DELETE", "BlogPost", id);
    revalidatePath("/blog");
  });
}

export async function publishBlogPost(id: string): Promise<ActionResult<void>> {
  return runAction(async () => {
    await requirePermission("content.publish");
    const post = await prisma.blogPost.findUniqueOrThrow({ where: { id } });
    await prisma.blogPost.update({
      where: { id },
      data: { status: "PUBLISHED", publishedAt: post.publishedAt ?? new Date() }, // set once, never overwritten on republish
    });
    await writeAuditLog("PUBLISH", "BlogPost", id);
    revalidatePath("/blog");
    revalidatePath(`/blog/${post.slug}`);
  });
}

export async function unpublishBlogPost(id: string): Promise<ActionResult<void>> {
  return runAction(async () => {
    await requirePermission("content.publish");
    await prisma.blogPost.update({ where: { id }, data: { status: "DRAFT" } });
    await writeAuditLog("UNPUBLISH", "BlogPost", id);
    revalidatePath("/blog");
  });
}
