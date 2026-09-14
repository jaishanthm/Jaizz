"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import AdminList from "@/components/admin/AdminList";
import {
  deleteEducation,
  setEducationVisible,
  moveEducation,
} from "@/lib/actions/education";
import { useToast } from "@/components/admin/ToastProvider";

type Row = {
  id: string;
  institution: string;
  degree: string;
  visible: boolean;
};

export default function EducationListClient({ items }: { items: Row[] }) {
  const { toast } = useToast();
  const router = useRouter();

  async function wrap(fn: () => Promise<{ success: boolean; error?: string }>) {
    const res = await fn();
    if (!res.success) {
      toast(res.error || "Operation failed", "error");
    } else {
      toast("Academic record updated", "success");
    }
    router.refresh();
  }

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/[0.08]">
        <div>
          <span className="text-[11px] font-mono tracking-widest text-red-500 uppercase font-semibold">
            ACADEMIA // DEGREE &amp; INSTITUTIONAL CREDENTIALS
          </span>
          <h1 className="text-2xl font-bold text-white tracking-tight mt-0.5">
            Education History
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-xs font-mono text-zinc-400 bg-white/[0.04] px-3 py-1.5 rounded-lg border border-white/[0.08]">
            RECORDS: <span className="text-white font-bold">{items.length}</span>
          </div>
          <Link
            href="/admin/education/new"
            className="admin-btn-primary text-xs py-2 px-4"
          >
            + NEW EDUCATION ENTRY
          </Link>
        </div>
      </div>

      <AdminList
        editHrefBase="/admin/education"
        items={items.map((e) => ({
          id: e.id,
          title: e.institution,
          subtitle: e.degree,
          visible: e.visible,
        }))}
        onToggleVisible={(id, next) => wrap(() => setEducationVisible(id, next))}
        onDelete={(id) => wrap(() => deleteEducation(id))}
        onMove={(id, dir) => wrap(() => moveEducation(id, dir))}
      />
    </div>
  );
}
