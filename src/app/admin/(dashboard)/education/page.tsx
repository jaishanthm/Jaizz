import { prisma } from "@/lib/prisma";
import EducationListClient from "./EducationListClient";

export default async function AdminEducationPage() {
  const items = await prisma.education.findMany({ orderBy: { sortOrder: "asc" } });
  return <EducationListClient items={items} />;
}
