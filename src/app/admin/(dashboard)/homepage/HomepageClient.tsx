"use client";

import { useRouter } from "next/navigation";
import { moveHomepageSection } from "@/lib/actions/homepage";
import { useToast } from "@/components/admin/ToastProvider";

type Section = {
  featureFlagId: string;
  order: number;
  featureFlag: { key: string; label: string };
};

export default function HomepageClient({ sections }: { sections: Section[] }) {
  const { toast } = useToast();
  const router = useRouter();

  async function move(id: string, dir: "up" | "down") {
    const res = await moveHomepageSection(id, dir);
    if (!res.success) {
      toast(res.error || "Failed to reorder section", "error");
    } else {
      toast("Homepage order updated", "success");
    }
    router.refresh();
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/[0.08]">
        <div>
          <span className="text-[11px] font-mono tracking-widest text-red-500 uppercase font-semibold">
            COMPOSITION // HOMEPAGE PIPELINE
          </span>
          <h1 className="text-2xl font-bold text-white tracking-tight mt-0.5">
            Homepage Section Order
          </h1>
        </div>
        <div className="text-xs font-mono text-zinc-400 bg-white/[0.04] px-3 py-1.5 rounded-lg border border-white/[0.08] w-fit">
          ACTIVE SECTIONS: <span className="text-white font-bold">{sections.length}</span>
        </div>
      </div>

      {/* Info Notice */}
      <div className="p-4 rounded-xl bg-[#0e0e13] border border-white/[0.08] text-xs font-mono text-zinc-400 leading-relaxed flex items-start gap-3">
        <span className="text-red-500 text-sm mt-0.5">ℹ</span>
        <div>
          <p className="text-zinc-300 font-medium mb-1">EXECUTION SEQUENCE PROTOCOL:</p>
          Only sections currently marked as &quot;Homepage Visible&quot; in the Feature Flags switchboard appear in this sequence. The Hero section permanently anchors the initial viewport, and the Contact terminal anchors the bottom.
        </div>
      </div>

      {/* Reorder Table */}
      <div className="admin-card overflow-hidden">
        <div className="p-4 border-b border-white/[0.08] flex items-center justify-between">
          <span className="text-xs font-mono text-zinc-300 font-semibold uppercase tracking-wider">
            VIEWPORT SCROLL ORDER
          </span>
          <span className="text-[11px] font-mono text-zinc-500">
            TOP TO BOTTOM FLOW
          </span>
        </div>

        <div className="divide-y divide-white/[0.04]">
          {/* Static Hero Indicator */}
          <div className="p-4 flex items-center justify-between bg-white/[0.01] text-xs font-mono opacity-80">
            <div className="flex items-center gap-3">
              <span className="w-6 h-6 rounded bg-red-950/40 border border-red-500/30 text-red-400 flex items-center justify-center font-bold text-[10px]">
                00
              </span>
              <span className="font-semibold text-zinc-300">Hero Section (Fixed Viewport Top)</span>
            </div>
            <span className="text-[10px] text-zinc-500 uppercase tracking-wider">Permanent Anchor</span>
          </div>

          {sections.map((s, i) => (
            <div
              key={s.featureFlagId}
              className="p-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 rounded bg-white/[0.06] border border-white/[0.08] text-zinc-300 flex items-center justify-center font-mono font-bold text-[10px]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="font-semibold text-white text-sm">{s.featureFlag.label}</span>
                <span className="text-xs font-mono text-zinc-500">({s.featureFlag.key})</span>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => move(s.featureFlagId, "up")}
                  disabled={i === 0}
                  title="Move Section Earlier"
                  className="w-8 h-8 flex items-center justify-center rounded bg-white/[0.04] border border-white/[0.08] text-zinc-400 hover:text-white hover:border-red-500/40 disabled:opacity-20 disabled:hover:border-white/[0.08] transition-colors"
                >
                  ↑
                </button>
                <button
                  onClick={() => move(s.featureFlagId, "down")}
                  disabled={i === sections.length - 1}
                  title="Move Section Later"
                  className="w-8 h-8 flex items-center justify-center rounded bg-white/[0.04] border border-white/[0.08] text-zinc-400 hover:text-white hover:border-red-500/40 disabled:opacity-20 disabled:hover:border-white/[0.08] transition-colors"
                >
                  ↓
                </button>
              </div>
            </div>
          ))}

          {/* Static Contact Indicator */}
          <div className="p-4 flex items-center justify-between bg-white/[0.01] text-xs font-mono opacity-80">
            <div className="flex items-center gap-3">
              <span className="w-6 h-6 rounded bg-red-950/40 border border-red-500/30 text-red-400 flex items-center justify-center font-bold text-[10px]">
                {String(sections.length + 1).padStart(2, "0")}
              </span>
              <span className="font-semibold text-zinc-300">Contact Terminal (Fixed Footer Anchor)</span>
            </div>
            <span className="text-[10px] text-zinc-500 uppercase tracking-wider">Permanent Anchor</span>
          </div>

          {sections.length === 0 && (
            <div className="p-8 text-center text-xs font-mono text-zinc-500">
              No sections are currently marked as &quot;Homepage Visible&quot; in the Feature Flags switchboard.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
