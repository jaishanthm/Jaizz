import { prisma } from "@/lib/prisma";
import ExperienceListClient from "./ExperienceListClient";

export default async function AdminExperiencePage() {
  const items = await prisma.experience.findMany({ orderBy: { sortOrder: "asc" } });
  return <ExperienceListClient items={items} />;
}
