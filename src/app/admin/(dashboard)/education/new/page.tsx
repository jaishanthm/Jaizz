import GenericForm from "@/components/admin/GenericForm";
import { createEducation } from "@/lib/actions/education";

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

export default function NewEducationPage() {
  return (<><h1 className="text-2xl mb-6">New Education</h1><GenericForm fields={[...FIELDS]} backHref="/admin/education" onCreate={createEducation} /></>);
}
