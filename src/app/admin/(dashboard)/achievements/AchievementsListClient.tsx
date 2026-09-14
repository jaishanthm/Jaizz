"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import AdminList from "@/components/admin/AdminList";
import {
  deleteAchievement,
  setAchievementVisible,
  setAchievementFeatured,
  moveAchievement,
} from "@/lib/actions/achievements";
import { useToast } from "@/components/admin/ToastProvider";

type Row = {
  id: string;
  title: string;
  category: string;
  visible: boolean;
  featured: boolean;
};

export default function AchievementsListClient({ items }: { items: Row[] }) {
  const { toast } = useToast();
  const router = useRouter();

  async function wrap(fn: () => Promise<{ success: boolean; error?: string }>) {
    const res = await fn();
    if (!res.success) {
      toast(res.error || "Operation failed", "error");
    } else {
      toast("Achievement entry updated", "success");
    }
    router.refresh();
  }

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/[0.08]">
        <div>
          <span className="text-[11px] font-mono tracking-widest text-red-500 uppercase font-semibold">
            ACCOLADES // COMPETITIONS, CTF HONORS &amp; RECOGNITION
          </span>
          <h1 className="text-2xl font-bold text-white tracking-tight mt-0.5">
            Achievements &amp; Honors
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-xs font-mono text-zinc-400 bg-white/[0.04] px-3 py-1.5 rounded-lg border border-white/[0.08]">
            TOTAL HONORS: <span className="text-white font-bold">{items.length}</span>
          </div>
          <Link
            href="/admin/achievements/new"
            className="admin-btn-primary text-xs py-2 px-4"
          >
            + NEW ACHIEVEMENT
          </Link>
        </div>
      </div>

      <AdminList
        editHrefBase="/admin/achievements"
        items={items.map((a) => ({
          id: a.id,
          title: a.title,
          subtitle: a.category,
          visible: a.visible,
          featured: a.featured,
        }))}
        onToggleVisible={(id, next) => wrap(() => setAchievementVisible(id, next))}
        onToggleFeatured={(id, next) => wrap(() => setAchievementFeatured(id, next))}
        onDelete={(id) => wrap(() => deleteAchievement(id))}
        onMove={(id, dir) => wrap(() => moveAchievement(id, dir))}
      />
    </div>
  );
}
