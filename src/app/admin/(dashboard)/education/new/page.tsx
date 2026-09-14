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
  return (
    <div className="space-y-6 max-w-2xl">
      <div className="pb-4 border-b border-white/[0.08]">
        <span className="text-[11px] font-mono tracking-widest text-red-500 uppercase font-semibold">
          ACADEMIA // ENTRY PROVISIONING
        </span>
        <h1 className="text-2xl font-bold text-white tracking-tight mt-0.5">
          New Education Entry
        </h1>
      </div>
      <GenericForm fields={[...FIELDS]} backHref="/admin/education" onCreate={createEducation} />
    </div>
  );
}
