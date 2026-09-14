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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 mb-1">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="uppercase tracking-widest text-red-400 font-semibold">// VULNERABILITY ADVISORIES & PAPERS</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">Security Research</h1>
          <p className="text-xs text-zinc-400 font-mono mt-1">
            Multi-stage coordinated disclosure pipeline: DRAFT → RESEARCH → READY → PUBLISHED.
          </p>
        </div>
        <Link href="/admin/research/new" className="admin-btn-primary whitespace-nowrap">
          + New Research
        </Link>
      </div>

      <div className="admin-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm font-sans border-collapse">
            <thead>
              <tr className="border-b border-white/[0.08] bg-black/40 text-[11px] font-mono text-zinc-400 uppercase tracking-wider">
                <th className="py-3 px-4 font-semibold">Advisory / Research Paper</th>
                <th className="py-3 px-4 font-semibold">Disclosure Status</th>
                <th className="py-3 px-4 font-semibold text-right">Operations</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.05]">
              {research.map((r) => {
                const next = NEXT_STATUS[r.disclosureStatus];
                return (
                  <tr key={r.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="py-3.5 px-4">
                      <Link
                        href={`/admin/research/${r.id}`}
                        className="font-medium text-zinc-200 group-hover:text-white group-hover:underline decoration-red-500/50 underline-offset-4 transition-colors block"
                      >
                        {r.title}
                      </Link>
                      <p className="text-xs text-zinc-500 font-mono mt-0.5">/{r.slug}</p>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono font-medium ${
                          r.disclosureStatus === "PUBLISHED"
                            ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400"
                            : r.disclosureStatus === "READY"
                            ? "bg-amber-500/10 border border-amber-500/30 text-amber-400"
                            : r.disclosureStatus === "RESEARCH"
                            ? "bg-sky-500/10 border border-sky-500/30 text-sky-400"
                            : "bg-zinc-800 border border-white/10 text-zinc-500"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            r.disclosureStatus === "PUBLISHED"
                              ? "bg-emerald-400 animate-pulse"
                              : r.disclosureStatus === "READY"
                              ? "bg-amber-400"
                              : "bg-zinc-500"
                          }`}
                        />
                        <span>{r.disclosureStatus}</span>
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right whitespace-nowrap space-x-2">
                      {next && (
                        <button
                          onClick={() => advance(r.id, next)}
                          className="admin-btn-secondary !py-1 !px-2.5 text-[11px] !border-red-500/30 !text-red-400 hover:!bg-red-500/10"
                        >
                          Advance → {next}
                        </button>
                      )}
                      <Link
                        href={`/admin/research/${r.id}`}
                        className="admin-btn-secondary !py-1 !px-2.5 text-[11px]"
                      >
                        Edit
                      </Link>
                      <ConfirmButton itemLabel={r.title} onConfirm={() => remove(r.id)} />
                    </td>
                  </tr>
                );
              })}

              {research.length === 0 && (
                <tr>
                  <td colSpan={3} className="py-12 px-4 text-center font-mono text-xs text-zinc-500">
                    // NO SECURITY RESEARCH ENTRIES RECORDED.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
