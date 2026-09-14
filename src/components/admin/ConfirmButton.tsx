"use client";

import { useState } from "react";

// Phase 7 §7 — destructive actions require a confirm naming the specific
// item, not a generic "Are you sure?".
export default function ConfirmButton({
  itemLabel,
  onConfirm,
}: {
  itemLabel: string;
  onConfirm: () => void | Promise<void>;
}) {
  const [confirming, setConfirming] = useState(false);

  if (confirming) {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-mono bg-red-950/40 border border-red-500/40 px-2 py-1 rounded-md">
        <span className="text-red-300 text-[11px]">Delete &quot;{itemLabel.slice(0, 20)}&quot;?</span>
        <button
          onClick={() => onConfirm()}
          className="px-2 py-0.5 rounded bg-red-600 hover:bg-red-500 text-white font-bold text-[10px] tracking-wider uppercase transition-colors"
        >
          CONFIRM
        </button>
        <button
          onClick={() => setConfirming(false)}
          className="px-1.5 py-0.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[10px] uppercase transition-colors"
        >
          ESC
        </button>
      </span>
    );
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="text-xs font-mono text-zinc-500 hover:text-red-400 hover:bg-red-500/10 px-2 py-1 rounded transition-all"
      title={`Delete ${itemLabel}`}
    >
      Delete
    </button>
  );
}
