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
      <span className="inline-flex items-center gap-2 text-xs">
        Delete &quot;{itemLabel}&quot;?
        <button
          onClick={() => onConfirm()}
          className="px-2 py-1 rounded"
          style={{ background: "#ef4444", color: "white" }}
        >
          Confirm
        </button>
        <button onClick={() => setConfirming(false)} className="px-2 py-1 rounded" style={{ border: "1px solid var(--color-border)" }}>
          Cancel
        </button>
      </span>
    );
  }

  return (
    <button onClick={() => setConfirming(true)} className="text-xs" style={{ color: "#f87171" }}>
      Delete
    </button>
  );
}
