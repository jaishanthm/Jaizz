import GenericForm from "@/components/admin/GenericForm";
import { createAchievement } from "@/lib/actions/achievements";

const FIELDS = [
  { key: "title", label: "Title", type: "text", required: true },
  { key: "category", label: "Category", type: "select", required: true, options: ["RANKING", "COMPETITION", "AWARD", "ACKNOWLEDGEMENT", "PUBLICATION", "MILESTONE", "OTHER"] },
  { key: "description", label: "Description", type: "textarea" },
  { key: "date", label: "Date", type: "date" },
  { key: "url", label: "URL", type: "url" },
] as const;

export default function NewAchievementPage() {
  return (
    <div className="space-y-6 max-w-2xl">
      <div className="pb-4 border-b border-white/[0.08]">
        <span className="text-[11px] font-mono tracking-widest text-red-500 uppercase font-semibold">
          ACCOLADES // ENTRY CREATION
        </span>
        <h1 className="text-2xl font-bold text-white tracking-tight mt-0.5">
          New Achievement
        </h1>
      </div>
      <GenericForm fields={[...FIELDS]} backHref="/admin/achievements" onCreate={createAchievement} />
    </div>
  );
}
