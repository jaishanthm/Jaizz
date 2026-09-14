"use client";

import Link from "next/link";
import ConfirmButton from "./ConfirmButton";

// Phase 9 §3 — one shared list component, configured per entity via props,
// rather than rebuilt per entity. Reorder uses simple move-up/down buttons
// rather than a drag library — no new dependency decided for this in any
// phase doc, and up/down covers the same functional need for admin-scale
// list lengths (tens of items, not hundreds).

export type AdminListItem = {
  id: string;
  title: string;
  subtitle?: string;
  thumbnailUrl?: string | null;
  visible?: boolean;
  featured?: boolean;
  updatedAt?: Date | string | null;
};

export default function AdminList({
  items,
  editHrefBase,
  showReorder = true,
  onToggleVisible,
  onToggleFeatured,
  onDelete,
  onMove,
}: {
  items: AdminListItem[];
  editHrefBase: string;
  showReorder?: boolean;
  onToggleVisible?: (id: string, next: boolean) => Promise<void>;
  onToggleFeatured?: (id: string, next: boolean) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onMove?: (id: string, direction: "up" | "down") => Promise<void>;
}) {
  return (
    <div className="admin-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm font-sans border-collapse">
          <thead>
            <tr className="border-b border-white/[0.08] bg-black/40 text-[11px] font-mono text-zinc-400 uppercase tracking-wider">
              <th className="py-3 px-4 font-semibold">Record / Title</th>
              <th className="py-3 px-4 font-semibold">Status &amp; Flags</th>
              <th className="py-3 px-4 font-semibold">Timestamp</th>
              <th className="py-3 px-4 font-semibold text-right">Operations</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.05]">
            {items.map((item, i) => (
              <tr
                key={item.id}
                className="hover:bg-white/[0.02] transition-colors group"
              >
                {/* Title and subtitle */}
                <td className="py-3.5 px-4 min-w-[200px]">
                  <div className="flex items-center gap-3">
                    {item.thumbnailUrl && (
                      <div className="w-9 h-9 rounded-lg bg-black/60 border border-white/10 overflow-hidden flex-shrink-0 flex items-center justify-center">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={item.thumbnailUrl}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="min-w-0">
                      <Link
                        href={`${editHrefBase}/${item.id}`}
                        className="font-medium text-zinc-200 group-hover:text-white group-hover:underline decoration-red-500/50 underline-offset-4 transition-colors block"
                      >
                        {item.title}
                      </Link>
                      {item.subtitle && (
                        <p className="text-xs text-zinc-500 font-mono mt-0.5">{item.subtitle}</p>
                      )}
                    </div>
                  </div>
                </td>

                {/* Status & Featured Toggles */}
                <td className="py-3.5 px-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    {onToggleVisible && (
                      <button
                        onClick={() => onToggleVisible(item.id, !item.visible)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono font-medium transition-all ${
                          item.visible
                            ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20"
                            : "bg-zinc-800/80 border border-white/10 text-zinc-500 hover:text-zinc-300"
                        }`}
                        title="Click to toggle visibility"
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${item.visible ? "bg-emerald-400 animate-pulse" : "bg-zinc-600"}`} />
                        <span>{item.visible ? "ACTIVE" : "HIDDEN"}</span>
                      </button>
                    )}
                    {onToggleFeatured && (
                      <button
                        onClick={() => onToggleFeatured(item.id, !item.featured)}
                        className={`px-2 py-0.5 rounded text-[11px] font-mono transition-all ${
                          item.featured
                            ? "bg-amber-500/10 border border-amber-500/30 text-amber-400 hover:bg-amber-500/20 font-bold"
                            : "text-zinc-600 hover:text-zinc-400"
                        }`}
                        title="Click to toggle featured flag"
                      >
                        {item.featured ? "★ FEATURED" : "☆"}
                      </button>
                    )}
                  </div>
                </td>

                {/* Updated At Timestamp */}
                <td className="py-3.5 px-4 text-xs font-mono text-zinc-500 whitespace-nowrap">
                  {item.updatedAt ? (
                    <span>{new Date(item.updatedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                  ) : (
                    "—"
                  )}
                </td>

                {/* Operations / Actions */}
                <td className="py-3.5 px-4 text-right whitespace-nowrap space-x-1.5">
                  {showReorder && onMove && (
                    <span className="inline-flex items-center gap-0.5 mr-2">
                      <button
                        onClick={() => onMove(item.id, "up")}
                        disabled={i === 0}
                        title="Move Up"
                        className="w-6 h-6 rounded bg-zinc-900 border border-white/10 hover:border-white/20 text-zinc-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed text-xs flex items-center justify-center transition-colors"
                      >
                        ↑
                      </button>
                      <button
                        onClick={() => onMove(item.id, "down")}
                        disabled={i === items.length - 1}
                        title="Move Down"
                        className="w-6 h-6 rounded bg-zinc-900 border border-white/10 hover:border-white/20 text-zinc-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed text-xs flex items-center justify-center transition-colors"
                      >
                        ↓
                      </button>
                    </span>
                  )}
                  <Link
                    href={`${editHrefBase}/${item.id}`}
                    className="admin-btn-secondary !py-1 !px-2.5 !text-[11px]"
                  >
                    Edit
                  </Link>
                  <ConfirmButton itemLabel={item.title} onConfirm={() => onDelete(item.id)} />
                </td>
              </tr>
            ))}

            {items.length === 0 && (
              <tr>
                <td colSpan={4} className="py-12 px-4 text-center">
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <span className="font-mono text-xs text-zinc-500">{"// NULL RECORDSET"}</span>
                    <p className="text-sm text-zinc-400">No entries recorded in this database collection.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
