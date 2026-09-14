import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ProjectForm from "../ProjectForm";

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = await prisma.project.findUnique({ where: { id } });
  if (!project) notFound();

  return (
    <>
      <h1 className="text-2xl mb-6">Edit Project</h1>
      <ProjectForm
        initial={{
          id: project.id, name: project.name, slug: project.slug,
          shortDescription: project.shortDescription, fullDescription: project.fullDescription,
          githubUrl: project.githubUrl, liveUrl: project.liveUrl, docsUrl: project.docsUrl,
          status: project.status,
        }}
      />
    </>
  );
}
