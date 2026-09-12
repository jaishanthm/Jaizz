"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ConfirmButton from "@/components/admin/ConfirmButton";
import { createNavItem, deleteNavItem, moveNavItem } from "@/lib/actions/navigation";
import { useToast } from "@/components/admin/ToastProvider";

type Item = { id: string; label: string; url: string; openInNewTab: boolean };

export default function NavigationClient({ items }: { items: Item[] }) {
  const { toast } = useToast();
  const router = useRouter();
  const [form, setForm] = useState({ label: "", url: "", openInNewTab: false });

  async function wrap(fn: () => Promise<{ success: boolean; error?: string }>) {
    const res = await fn();
    if (!res.success) toast(res.error, "error");
    router.refresh();
  }

  return (
    <>
      <h1 className="text-2xl mb-2">Navigation</h1>
      <p className="text-xs mb-6" style={{ color: "var(--color-text-muted)", maxWidth: "42rem" }}>
        Links added here appear in the header <em>after</em> the core sections (About, Research,
        Projects, Blog, Contact) — those stay controlled by Feature Flags. Custom and flag-driven
        items aren&apos;t interleaved into one order; core items always come first.
      </p>

      <form
        onSubmit={(e) => { e.preventDefault(); wrap(() => createNavItem(form)).then(() => setForm({ label: "", url: "", openInNewTab: false })); }}
        className="flex gap-2 mb-8 items-center"
      >
        <input required placeholder="Label" value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })}
          className="px-3 py-2 rounded-md bg-transparent text-sm" style={{ border: "1px solid var(--color-border)" }} />
        <input required placeholder="URL" value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })}
          className="flex-1 px-3 py-2 rounded-md bg-transparent text-sm" style={{ border: "1px solid var(--color-border)" }} />
        <label className="text-xs flex items-center gap-1">
          <input type="checkbox" checked={form.openInNewTab} onChange={(e) => setForm({ ...form, openInNewTab: e.target.checked })} />
          New tab
        </label>
        <button type="submit" className="px-4 py-2 rounded-full text-sm" style={{ background: "var(--color-primary)", color: "white" }}>Add</button>
      </form>

      <div className="glass-card overflow-hidden">
        <table className="w-full text-sm">
          <tbody>
            {items.map((item, i) => (
              <tr key={item.id} style={{ borderBottom: "1px solid var(--color-border)" }}>
                <td className="p-3">{item.label}</td>
                <td className="p-3" style={{ color: "var(--color-text-muted)" }}>{item.url}</td>
                <td className="p-3 text-right space-x-2">
                  <button onClick={() => wrap(() => moveNavItem(item.id, "up"))} disabled={i === 0}>↑</button>
                  <button onClick={() => wrap(() => moveNavItem(item.id, "down"))} disabled={i === items.length - 1}>↓</button>
                  <ConfirmButton itemLabel={item.label} onConfirm={() => wrap(() => deleteNavItem(item.id))} />
                </td>
              </tr>
            ))}
            {items.length === 0 && <tr><td colSpan={3} className="p-6 text-center" style={{ color: "var(--color-text-muted)" }}>No custom nav items yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </>
  );
}
