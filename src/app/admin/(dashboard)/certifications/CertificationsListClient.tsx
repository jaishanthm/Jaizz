"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import AdminList from "@/components/admin/AdminList";
import { deleteCertification, setCertificationVisible, setCertificationFeatured, moveCertification } from "@/lib/actions/certifications";
import { useToast } from "@/components/admin/ToastProvider";

type Row = { id: string; name: string; issuer: string; visible: boolean; featured: boolean; updatedAt?: Date };

export default function CertificationsListClient({ items }: { items: Row[] }) {
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
        <h1 className="text-2xl">Certifications</h1>
        <Link href="/admin/certifications/new" className="px-4 py-2 rounded-full text-sm" style={{ background: "var(--color-primary)", color: "white" }}>+ New</Link>
      </div>
      <AdminList
        editHrefBase="/admin/certifications"
        items={items.map((c) => ({ id: c.id, title: c.name, subtitle: c.issuer, visible: c.visible, featured: c.featured }))}
        onToggleVisible={(id, next) => wrap(() => setCertificationVisible(id, next))}
        onToggleFeatured={(id, next) => wrap(() => setCertificationFeatured(id, next))}
        onDelete={(id) => wrap(() => deleteCertification(id))}
        onMove={(id, dir) => wrap(() => moveCertification(id, dir))}
      />
    </>
  );
}
