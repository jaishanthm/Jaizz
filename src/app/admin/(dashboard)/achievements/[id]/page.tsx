import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import GenericForm from "@/components/admin/GenericForm";
import { updateAchievement } from "@/lib/actions/achievements";

const FIELDS = [
  { key: "title", label: "Title", type: "text", required: true },
  { key: "category", label: "Category", type: "select", required: true, options: ["RANKING", "COMPETITION", "AWARD", "ACKNOWLEDGEMENT", "PUBLICATION", "MILESTONE", "OTHER"] },
  { key: "description", label: "Description", type: "textarea" },
  { key: "date", label: "Date", type: "date" },
  { key: "url", label: "URL", type: "url" },
] as const;

export default async function EditAchievementPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const a = await prisma.achievement.findUnique({ where: { id } });
  if (!a) notFound();
  const initial = {
    title: a.title, category: a.category, description: a.description ?? "",
    date: a.date?.toISOString().slice(0, 10) ?? "", url: a.url ?? "",
  };
  return (<><h1 className="text-2xl mb-6">Edit Achievement</h1><GenericForm fields={[...FIELDS]} initial={initial} backHref="/admin/achievements" onUpdate={updateAchievement} id={id} /></>);
}
