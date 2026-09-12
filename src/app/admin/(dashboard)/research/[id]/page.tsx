import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ResearchForm from "../ResearchForm";

export default async function EditResearchPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const research = await prisma.research.findUnique({ where: { id } });
  if (!research) notFound();

  return (
    <>
      <h1 className="text-2xl mb-6">Edit Research</h1>
      <ResearchForm initial={{
        id: research.id, title: research.title, slug: research.slug, summary: research.summary,
        content: research.content, researchType: research.researchType,
        date: research.date.toISOString().slice(0, 10), impact: research.impact, remediation: research.remediation,
      }} />
    </>
  );
}
