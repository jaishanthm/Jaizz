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
  return (<><h1 className="text-2xl mb-6">New Achievement</h1><GenericForm fields={[...FIELDS]} backHref="/admin/achievements" onCreate={createAchievement} /></>);
}
