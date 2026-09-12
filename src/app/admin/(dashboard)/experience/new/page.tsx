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
  return (<><h1 className="text-2xl mb-6">New Experience</h1><GenericForm fields={[...FIELDS]} backHref="/admin/experience" onCreate={createExperience} /></>);
}
