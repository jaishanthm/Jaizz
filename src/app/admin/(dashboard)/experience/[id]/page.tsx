import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import GenericForm from "@/components/admin/GenericForm";
import { updateExperience } from "@/lib/actions/experience";

const FIELDS = [
  { key: "role", label: "Role", type: "text", required: true },
  { key: "organization", label: "Organization", type: "text", required: true },
  { key: "description", label: "Description", type: "textarea" },
  { key: "startDate", label: "Start date", type: "date", required: true },
  { key: "current", label: "Current role?", type: "select", required: true, options: ["No", "Yes"] },
  { key: "endDate", label: "End date (leave blank if current)", type: "date" },
  { key: "location", label: "Location", type: "text" },
  { key: "organizationUrl", label: "Organization URL", type: "url" },
] as const;

export default async function EditExperiencePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const e = await prisma.experience.findUnique({ where: { id } });
  if (!e) notFound();
  const initial = {
    role: e.role, organization: e.organization, description: e.description ?? "",
    startDate: e.startDate.toISOString().slice(0, 10), current: e.current ? "Yes" : "No",
    endDate: e.endDate?.toISOString().slice(0, 10) ?? "", location: e.location ?? "", organizationUrl: e.organizationUrl ?? "",
  };
  return (<><h1 className="text-2xl mb-6">Edit Experience</h1><GenericForm fields={[...FIELDS]} initial={initial} backHref="/admin/experience" onUpdate={updateExperience} id={id} /></>);
}
