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

export function getFeaturedProjects(limit = 3) {
  return prisma.project.findMany({
    where: { visible: true, featured: true },
    orderBy: { sortOrder: "asc" },
    take: limit,
  });
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
