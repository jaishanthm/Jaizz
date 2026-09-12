import { prisma } from "@/lib/prisma";

export function getPublishedPosts() {
  return prisma.blogPost.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { publishedAt: "desc" },
    include: { tags: { include: { tag: true } } },
  });
}

export function getPostBySlug(slug: string) {
  return prisma.blogPost.findFirst({
    where: { slug, status: "PUBLISHED" },
    include: { tags: { include: { tag: true } }, author: true },
  });
}

export function getPostsByTag(tagSlug: string) {
  return prisma.blogPost.findMany({
    where: { status: "PUBLISHED", tags: { some: { tag: { slug: tagSlug } } } },
    orderBy: { publishedAt: "desc" },
  });
}
