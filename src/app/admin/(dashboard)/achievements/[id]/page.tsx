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
    title: a.title,
    category: a.category,
    description: a.description ?? "",
    date: a.date?.toISOString().slice(0, 10) ?? "",
    url: a.url ?? "",
  };
  return (
    <div className="space-y-6 max-w-2xl">
      <div className="pb-4 border-b border-white/[0.08]">
        <span className="text-[11px] font-mono tracking-widest text-red-500 uppercase font-semibold">
          ACCOLADES // RECORD MODIFICATION
        </span>
        <h1 className="text-2xl font-bold text-white tracking-tight mt-0.5">
          Edit Achievement: {a.title}
        </h1>
      </div>
      <GenericForm fields={[...FIELDS]} initial={initial} backHref="/admin/achievements" onUpdate={updateAchievement} id={id} />
    </div>
  );
}
