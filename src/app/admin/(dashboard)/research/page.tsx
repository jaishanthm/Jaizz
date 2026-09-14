import { prisma } from "@/lib/prisma";
import ResearchListClient from "./ResearchListClient";

export default async function AdminResearchPage() {
  const research = await prisma.research.findMany({ orderBy: { date: "desc" } });
  return <ResearchListClient research={research} />;
}
