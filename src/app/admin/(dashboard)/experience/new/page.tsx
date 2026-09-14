import GenericForm from "@/components/admin/GenericForm";
import { createExperience } from "@/lib/actions/experience";

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

export default function NewExperiencePage() {
  return (
    <div className="space-y-6 max-w-2xl">
      <div className="pb-4 border-b border-white/[0.08]">
        <span className="text-[11px] font-mono tracking-widest text-red-500 uppercase font-semibold">
          DEPLOYMENTS // RECORD PROVISIONING
        </span>
        <h1 className="text-2xl font-bold text-white tracking-tight mt-0.5">
          New Experience Entry
        </h1>
      </div>
      <GenericForm fields={[...FIELDS]} backHref="/admin/experience" onCreate={createExperience} />
    </div>
  );
}
