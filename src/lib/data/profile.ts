import { prisma } from "@/lib/prisma";

export function getProfile() {
  return prisma.profile.findUnique({
    where: { id: "singleton" },
    include: { profileImage: true, resumeMedia: true },
  });
}

export function getVisibleSocialLinks() {
  return prisma.socialLink.findMany({
    where: { visible: true },
    orderBy: { order: "asc" },
  });
}

export function getSEOSettings() {
  return prisma.sEOSettings.findUnique({ where: { id: "singleton" } });
}
