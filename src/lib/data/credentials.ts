import { prisma } from "@/lib/prisma";

// Covers Education, Experience, Skills, Certifications, Achievements —
// grouped in one file since these are all simple visible+sortOrder reads,
// no need for five near-identical files (Phase 8 §5's rule is "avoid
// repeating the filter," not "one file per model" specifically).

export function getVisibleExperience() {
  return prisma.experience.findMany({
    where: { visible: true },
    orderBy: { sortOrder: "asc" },
    include: { achievements: { orderBy: { order: "asc" } }, technologies: { include: { skill: true } } },
  });
}

export function getVisibleSkillCategories() {
  return prisma.skillCategory.findMany({
    where: { visible: true },
    orderBy: { order: "asc" },
    include: { skills: { where: { visible: true }, orderBy: { order: "asc" } } },
  });
}

export function getVisibleCertifications() {
  return prisma.certification.findMany({
    where: { visible: true },
    orderBy: { sortOrder: "asc" },
    include: { imageMedia: true },
  });
}

export function getVisibleAchievements() {
  return prisma.achievement.findMany({
    where: { visible: true },
    orderBy: { sortOrder: "asc" },
  });
}

export function getVisibleBugBountyProfiles() {
  return prisma.bugBountyProfile.findMany({
    where: { visible: true },
    orderBy: { order: "asc" },
    include: { findings: { where: { visible: true } } },
  });
}
