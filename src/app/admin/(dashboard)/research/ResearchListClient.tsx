"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { advanceResearchStatus, deleteResearch } from "@/lib/actions/research";
import ConfirmButton from "@/components/admin/ConfirmButton";
import { useToast } from "@/components/admin/ToastProvider";

type Row = { id: string; title: string; slug: string; disclosureStatus: string; updatedAt: Date };

const NEXT_STATUS: Record<string, string | null> = {
  DRAFT: "RESEARCH", RESEARCH: "READY", READY: "PUBLISHED", PUBLISHED: null, ARCHIVED: null,
};

// Not using the generic AdminList here — the status-advance stepper is
// specific enough to this entity's state machine (Phase 4 §6) that forcing
// it through AdminList's generic visible/featured toggles would hide the
// actual rule rather than surface it.
export default function ResearchListClient({ research }: { research: Row[] }) {
  const { toast } = useToast();
  const router = useRouter();

  async function advance(id: string, status: string) {
    const res = await advanceResearchStatus(id, status as Parameters<typeof advanceResearchStatus>[1]);
    if (!res.success) toast(res.error, "error");
    router.refresh();
  }
  async function remove(id: string) {
    const res = await deleteResearch(id);
    if (!res.success) toast(res.error, "error");
    router.refresh();
  }

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl">Security Research</h1>
        <Link href="/admin/research/new" className="px-4 py-2 rounded-full text-sm" style={{ background: "var(--color-primary)", color: "white" }}>
          + New Research
        </Link>
      </div>
      <div className="glass-card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr style={{ borderBottom: "1px solid var(--color-border)" }}>
              <th className="text-left p-3">Title</th>
              <th className="text-left p-3">Status</th>
              <th className="text-right p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {research.map((r) => (
              <tr key={r.id} style={{ borderBottom: "1px solid var(--color-border)" }}>
                <td className="p-3"><Link href={`/admin/research/${r.id}`}>{r.title}</Link></td>
                <td className="p-3">
                  <span style={{ color: r.disclosureStatus === "PUBLISHED" ? "var(--color-signal)" : "var(--color-text-muted)" }}>
                    {r.disclosureStatus}
                  </span>
                </td>
                <td className="p-3 text-right space-x-2">
                  {NEXT_STATUS[r.disclosureStatus] && (
                    <button onClick={() => advance(r.id, NEXT_STATUS[r.disclosureStatus]!)} className="text-xs" style={{ color: "var(--color-primary)" }}>
                      Advance → {NEXT_STATUS[r.disclosureStatus]}
                    </button>
                  )}
                  <Link href={`/admin/research/${r.id}`} className="text-xs" style={{ color: "var(--color-primary)" }}>Edit</Link>
                  <ConfirmButton itemLabel={r.title} onConfirm={() => remove(r.id)} />
                </td>
              </tr>
            ))}
            {research.length === 0 && (
              <tr><td colSpan={3} className="p-6 text-center" style={{ color: "var(--color-text-muted)" }}>Nothing here yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
