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
    <>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl">Projects</h1>
        <Link href="/admin/projects/new" className="px-4 py-2 rounded-full text-sm" style={{ background: "var(--color-primary)", color: "white" }}>
          + New Project
        </Link>
      </div>
      <AdminList
        editHrefBase="/admin/projects"
        items={projects.map((p) => ({ id: p.id, title: p.name, subtitle: `/${p.slug}`, visible: p.visible, featured: p.featured, updatedAt: p.updatedAt }))}
        onToggleVisible={(id, next) => wrap(() => setProjectVisible(id, next))}
        onToggleFeatured={(id, next) => wrap(() => setProjectFeatured(id, next))}
        onDelete={(id) => wrap(() => deleteProject(id))}
        onMove={(id, dir) => wrap(() => moveProject(id, dir))}
      />
    </>
  );
}
