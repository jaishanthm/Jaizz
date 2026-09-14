import { prisma } from "@/lib/prisma";

export function getPublishedResearch() {
  return prisma.research.findMany({
    where: { visible: true, disclosureStatus: "PUBLISHED" },
    orderBy: { date: "desc" },
    include: { tags: true },
  });
}

export function getResearchBySlug(slug: string) {
  return prisma.research.findFirst({
    where: { slug, visible: true, disclosureStatus: "PUBLISHED" },
    include: { tags: true, references: true, screenshots: true, relatedProject: true },
  });
}
