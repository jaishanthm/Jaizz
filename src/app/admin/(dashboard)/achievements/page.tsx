import { prisma } from "@/lib/prisma";
import AchievementsListClient from "./AchievementsListClient";

export default async function AdminAchievementsPage() {
  const items = await prisma.achievement.findMany({ orderBy: { sortOrder: "asc" } });
  return <AchievementsListClient items={items} />;
}
