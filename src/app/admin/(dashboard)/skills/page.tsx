import { prisma } from "@/lib/prisma";
import SkillsAdminClient from "./SkillsAdminClient";

export default async function AdminSkillsPage() {
  const categories = await prisma.skillCategory.findMany({
    orderBy: { order: "asc" },
    include: { skills: { orderBy: { order: "asc" } } },
  });
  return <SkillsAdminClient categories={categories} />;
}
