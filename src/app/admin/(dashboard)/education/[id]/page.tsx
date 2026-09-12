import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import GenericForm from "@/components/admin/GenericForm";
import { updateEducation } from "@/lib/actions/education";

const FIELDS = [
  { key: "institution", label: "Institution", type: "text", required: true },
  { key: "degree", label: "Degree", type: "text", required: true },
  { key: "field", label: "Field of study", type: "text" },
  { key: "startDate", label: "Start date", type: "date", required: true },
  { key: "endDate", label: "End date", type: "date" },
  { key: "location", label: "Location", type: "text" },
  { key: "websiteUrl", label: "Website URL", type: "url" },
  { key: "description", label: "Description", type: "textarea" },
] as const;

export default async function EditEducationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const e = await prisma.education.findUnique({ where: { id } });
  if (!e) notFound();
  const initial = {
    institution: e.institution, degree: e.degree, field: e.field ?? "",
    startDate: e.startDate.toISOString().slice(0, 10), endDate: e.endDate?.toISOString().slice(0, 10) ?? "",
    location: e.location ?? "", websiteUrl: e.websiteUrl ?? "", description: e.description ?? "",
  };
  return (<><h1 className="text-2xl mb-6">Edit Education</h1><GenericForm fields={[...FIELDS]} initial={initial} backHref="/admin/education" onUpdate={updateEducation} id={id} /></>);
}
