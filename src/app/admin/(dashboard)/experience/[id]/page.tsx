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
    role: e.role,
    organization: e.organization,
    description: e.description ?? "",
    startDate: e.startDate.toISOString().slice(0, 10),
    current: e.current ? "Yes" : "No",
    endDate: e.endDate?.toISOString().slice(0, 10) ?? "",
    location: e.location ?? "",
    organizationUrl: e.organizationUrl ?? "",
  };
  return (
    <div className="space-y-6 max-w-2xl">
      <div className="pb-4 border-b border-white/[0.08]">
        <span className="text-[11px] font-mono tracking-widest text-red-500 uppercase font-semibold">
          DEPLOYMENTS // RECORD MODIFICATION
        </span>
        <h1 className="text-2xl font-bold text-white tracking-tight mt-0.5">
          Edit Experience: {e.role} @ {e.organization}
        </h1>
      </div>
      <GenericForm fields={[...FIELDS]} initial={initial} backHref="/admin/experience" onUpdate={updateExperience} id={id} />
    </div>
  );
}
