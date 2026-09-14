"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import AdminList from "@/components/admin/AdminList";
import {
  deleteCertification,
  setCertificationVisible,
  setCertificationFeatured,
  moveCertification,
} from "@/lib/actions/certifications";
import { useToast } from "@/components/admin/ToastProvider";

type Row = {
  id: string;
  name: string;
  issuer: string;
  visible: boolean;
  featured: boolean;
  imageMedia?: { url: string; altText?: string | null } | null;
  updatedAt?: Date;
};

export default function CertificationsListClient({ items }: { items: Row[] }) {
  const { toast } = useToast();
  const router = useRouter();

  async function wrap(fn: () => Promise<{ success: boolean; error?: string }>) {
    const res = await fn();
    if (!res.success) {
      toast(res.error || "Operation failed", "error");
    } else {
      toast("Certification updated", "success");
    }
    router.refresh();
  }

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/[0.08]">
        <div>
          <span className="text-[11px] font-mono tracking-widest text-red-500 uppercase font-semibold">
            VALIDATION // INDUSTRY CERTIFICATIONS &amp; CREDENTIALS
          </span>
          <h1 className="text-2xl font-bold text-white tracking-tight mt-0.5">
            Certifications
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-xs font-mono text-zinc-400 bg-white/[0.04] px-3 py-1.5 rounded-lg border border-white/[0.08]">
            TOTAL CREDENTIALS: <span className="text-white font-bold">{items.length}</span>
          </div>
          <Link
            href="/admin/certifications/new"
            className="admin-btn-primary text-xs py-2 px-4"
          >
            + NEW CERTIFICATION
          </Link>
        </div>
      </div>

      <AdminList
        editHrefBase="/admin/certifications"
        items={items.map((c) => ({
          id: c.id,
          title: c.name,
          subtitle: c.issuer,
          thumbnailUrl: c.imageMedia?.url,
          visible: c.visible,
          featured: c.featured,
        }))}
        onToggleVisible={(id, next) => wrap(() => setCertificationVisible(id, next))}
        onToggleFeatured={(id, next) => wrap(() => setCertificationFeatured(id, next))}
        onDelete={(id) => wrap(() => deleteCertification(id))}
        onMove={(id, dir) => wrap(() => moveCertification(id, dir))}
      />
    </div>
  );
}
