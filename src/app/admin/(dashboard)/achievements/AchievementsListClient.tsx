"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AdminList from "@/components/admin/AdminList";
import { deleteAchievement, setAchievementVisible, setAchievementFeatured, moveAchievement } from "@/lib/actions/achievements";
import { useToast } from "@/components/admin/ToastProvider";

type Row = { id: string; title: string; category: string; visible: boolean; featured: boolean };

export default function AchievementsListClient({ items }: { items: Row[] }) {
  const { toast } = useToast();
  const router = useRouter();
  async function wrap(fn: () => Promise<{ success: boolean; error?: string }>) {
    const res = await fn(); if (!res.success) toast(res.error, "error"); router.refresh();
  }
  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl">Achievements</h1>
        <Link href="/admin/achievements/new" className="px-4 py-2 rounded-full text-sm" style={{ background: "var(--color-primary)", color: "white" }}>+ New</Link>
      </div>
      <AdminList
        editHrefBase="/admin/achievements"
        items={items.map((a) => ({ id: a.id, title: a.title, subtitle: a.category, visible: a.visible, featured: a.featured }))}
        onToggleVisible={(id, next) => wrap(() => setAchievementVisible(id, next))}
        onToggleFeatured={(id, next) => wrap(() => setAchievementFeatured(id, next))}
        onDelete={(id) => wrap(() => deleteAchievement(id))}
        onMove={(id, dir) => wrap(() => moveAchievement(id, dir))}
      />
    </>
  );
}
