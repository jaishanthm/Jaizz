import { prisma } from "@/lib/prisma";

// Public-surface accessors — always filtered to visible content.
// Admin screens use a separate, unfiltered accessor (see admin data layer,
// not yet written — stubbed here for the pattern only).

export function getVisibleProjects() {
  return prisma.project.findMany({
    where: { visible: true },
    orderBy: { sortOrder: "asc" },
    include: {
      screenshots: { orderBy: { order: "asc" } },
      technologies: { include: { skill: true } },
    },
  });
}

export async function getFeaturedProjects(limit = 3) {
  const featured = await prisma.project.findMany({
    where: { visible: true, featured: true },
    orderBy: { sortOrder: "asc" },
    include: {
      screenshots: { orderBy: { order: "asc" } },
      technologies: { include: { skill: true } },
    },
    take: limit,
  });

  if (featured.length < limit) {
    const additional = await prisma.project.findMany({
      where: {
        visible: true,
        id: { notIn: featured.map((p) => p.id) },
      },
      orderBy: { sortOrder: "asc" },
      include: {
        screenshots: { orderBy: { order: "asc" } },
        technologies: { include: { skill: true } },
      },
      take: limit - featured.length,
    });
    return [...featured, ...additional];
  }

  return featured;
}

export function getProjectBySlug(slug: string) {
  return prisma.project.findFirst({
    where: { slug, visible: true },
    include: {
      screenshots: { orderBy: { order: "asc" } },
      technologies: { include: { skill: true } },
      relatedResearch: { where: { visible: true } },
    },
  });
}

// Admin-only — no visibility filter, intentionally.
export function getAllProjectsForAdmin() {
  return prisma.project.findMany({
    orderBy: { sortOrder: "asc" },
  });
}
