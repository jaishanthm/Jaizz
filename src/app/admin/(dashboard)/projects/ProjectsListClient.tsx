"use client";

import Link from "next/link";
import AdminList from "@/components/admin/AdminList";
import { deleteProject, setProjectVisible, setProjectFeatured, moveProject } from "@/lib/actions/projects";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/admin/ToastProvider";

type Row = { id: string; name: string; slug: string; visible: boolean; featured: boolean; updatedAt: Date };

export default function ProjectsListClient({ projects }: { projects: Row[] }) {
  const { toast } = useToast();
  const router = useRouter();

  async function wrap(fn: () => Promise<{ success: boolean; error?: string }>) {
    const res = await fn();
    if (!res.success) toast(res.error, "error");
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 mb-1">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="uppercase tracking-widest text-red-400 font-semibold">// REPOSITORY LEDGER</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">Security Projects</h1>
          <p className="text-xs text-zinc-400 font-mono mt-1">
            Offensive tooling, reconnaissance automation frameworks, and active directory penetration scripts.
          </p>
        </div>
        <Link href="/admin/projects/new" className="admin-btn-primary whitespace-nowrap">
          + New Project
        </Link>
      </div>

      <AdminList
        editHrefBase="/admin/projects"
        items={projects.map((p) => ({
          id: p.id,
          title: p.name,
          subtitle: `/${p.slug}`,
          visible: p.visible,
          featured: p.featured,
          updatedAt: p.updatedAt,
        }))}
        onToggleVisible={(id, next) => wrap(() => setProjectVisible(id, next))}
        onToggleFeatured={(id, next) => wrap(() => setProjectFeatured(id, next))}
        onDelete={(id) => wrap(() => deleteProject(id))}
        onMove={(id, dir) => wrap(() => moveProject(id, dir))}
      />
    </div>
  );
}
