"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AdminList from "@/components/admin/AdminList";
import { deleteExperience, setExperienceVisible, moveExperience } from "@/lib/actions/experience";
import { useToast } from "@/components/admin/ToastProvider";

type Row = { id: string; role: string; organization: string; visible: boolean };

export default function ExperienceListClient({ items }: { items: Row[] }) {
  const { toast } = useToast();
  const router = useRouter();
  async function wrap(fn: () => Promise<{ success: boolean; error?: string }>) {
    const res = await fn(); if (!res.success) toast(res.error, "error"); router.refresh();
  }
  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl">Experience</h1>
        <Link href="/admin/experience/new" className="px-4 py-2 rounded-full text-sm" style={{ background: "var(--color-primary)", color: "white" }}>+ New</Link>
      </div>
      <AdminList
        editHrefBase="/admin/experience"
        items={items.map((e) => ({ id: e.id, title: e.role, subtitle: e.organization, visible: e.visible }))}
        onToggleVisible={(id, next) => wrap(() => setExperienceVisible(id, next))}
        onDelete={(id) => wrap(() => deleteExperience(id))}
        onMove={(id, dir) => wrap(() => moveExperience(id, dir))}
      />
    </>
  );
}
