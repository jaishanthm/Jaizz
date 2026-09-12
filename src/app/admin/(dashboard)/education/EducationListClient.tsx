"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AdminList from "@/components/admin/AdminList";
import { deleteEducation, setEducationVisible, moveEducation } from "@/lib/actions/education";
import { useToast } from "@/components/admin/ToastProvider";

type Row = { id: string; institution: string; degree: string; visible: boolean };

export default function EducationListClient({ items }: { items: Row[] }) {
  const { toast } = useToast();
  const router = useRouter();
  async function wrap(fn: () => Promise<{ success: boolean; error?: string }>) {
    const res = await fn(); if (!res.success) toast(res.error, "error"); router.refresh();
  }
  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl">Education</h1>
        <Link href="/admin/education/new" className="px-4 py-2 rounded-full text-sm" style={{ background: "var(--color-primary)", color: "white" }}>+ New</Link>
      </div>
      <AdminList
        editHrefBase="/admin/education"
        items={items.map((e) => ({ id: e.id, title: e.institution, subtitle: e.degree, visible: e.visible }))}
        onToggleVisible={(id, next) => wrap(() => setEducationVisible(id, next))}
        onDelete={(id) => wrap(() => deleteEducation(id))}
        onMove={(id, dir) => wrap(() => moveEducation(id, dir))}
      />
    </>
  );
}
