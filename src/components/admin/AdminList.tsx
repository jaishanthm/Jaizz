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
    <div className="glass-card overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr style={{ borderBottom: "1px solid var(--color-border)" }}>
            <th className="text-left p-3">Title</th>
            <th className="text-left p-3">Status</th>
            <th className="text-left p-3">Updated</th>
            <th className="text-right p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, i) => (
            <tr key={item.id} style={{ borderBottom: "1px solid var(--color-border)" }}>
              <td className="p-3">
                <Link href={`${editHrefBase}/${item.id}`}>{item.title}</Link>
                {item.subtitle && (
                  <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>{item.subtitle}</p>
                )}
              </td>
              <td className="p-3">
                {onToggleVisible && (
                  <button
                    onClick={() => onToggleVisible(item.id, !item.visible)}
                    className="text-xs mr-2"
                    style={{ color: item.visible ? "var(--color-signal)" : "var(--color-text-muted)" }}
                  >
                    {item.visible ? "Visible" : "Hidden"}
                  </button>
                )}
                {onToggleFeatured && (
                  <button
                    onClick={() => onToggleFeatured(item.id, !item.featured)}
                    className="text-xs"
                    style={{ color: item.featured ? "var(--color-primary)" : "var(--color-text-muted)" }}
                  >
                    {item.featured ? "★ Featured" : "☆"}
                  </button>
                )}
              </td>
              <td className="p-3 text-xs" style={{ color: "var(--color-text-muted)" }}>
                {item.updatedAt ? new Date(item.updatedAt).toLocaleDateString() : "—"}
              </td>
              <td className="p-3 text-right space-x-2">
                {showReorder && onMove && (
                  <>
                    <button onClick={() => onMove(item.id, "up")} disabled={i === 0}>↑</button>
                    <button onClick={() => onMove(item.id, "down")} disabled={i === items.length - 1}>↓</button>
                  </>
                )}
                <Link href={`${editHrefBase}/${item.id}`} className="text-xs" style={{ color: "var(--color-primary)" }}>
                  Edit
                </Link>
                <ConfirmButton itemLabel={item.title} onConfirm={() => onDelete(item.id)} />
              </td>
            </tr>
          ))}
          {items.length === 0 && (
            <tr>
              <td colSpan={4} className="p-6 text-center" style={{ color: "var(--color-text-muted)" }}>
                Nothing here yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
