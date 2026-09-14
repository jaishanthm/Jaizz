import { prisma } from "@/lib/prisma";

// Implements the evaluation logic specified in Phase 5 §3, verbatim in intent.

export async function getEnabledFeatureFlags() {
  return prisma.featureFlag.findMany({ where: { enabled: true } });
}

export async function getNavFlags() {
  const flags = await prisma.featureFlag.findMany({
    where: { enabled: true, navVisible: true },
    orderBy: { sortOrder: "asc" },
  });
  return flags;
}

export async function getHomepageFlags() {
  const flags = await prisma.featureFlag.findMany({
    where: { enabled: true, homepageVisible: true },
    include: { homepageSection: true },
  });
  return flags.sort(
    (a, b) => (a.homepageSection?.order ?? 0) - (b.homepageSection?.order ?? 0)
  );
}

export async function isFeatureEnabled(key: string) {
  const flag = await prisma.featureFlag.findUnique({ where: { key } });
  return flag?.enabled ?? false;
}

// Route guard usage, e.g. in src/app/research/[slug]/page.tsx:
//   if (!(await isFeatureEnabled("research"))) notFound();
