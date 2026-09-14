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
  const [saving, setSaving] = useState(false);

  async function wrap(fn: () => Promise<{ success: boolean; error?: string }>) {
    const res = await fn();
    if (!res.success) {
      toast(res.error || "Operation failed", "error");
    } else {
      toast("Navigation updated", "success");
    }
    router.refresh();
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!form.label || !form.url) return;
    setSaving(true);
    const res = await createNavItem(form);
    setSaving(false);
    if (!res.success) {
      toast(res.error || "Failed to create link", "error");
      return;
    }
    toast("Link added to navigation menu", "success");
    setForm({ label: "", url: "", openInNewTab: false });
    router.refresh();
  }

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/[0.08]">
        <div>
          <span className="text-[11px] font-mono tracking-widest text-red-500 uppercase font-semibold">
            ROUTING // HEADER NAVIGATION MATRIX
          </span>
          <h1 className="text-2xl font-bold text-white tracking-tight mt-0.5">
            Navigation Links
          </h1>
        </div>
        <div className="text-xs font-mono text-zinc-400 bg-white/[0.04] px-3 py-1.5 rounded-lg border border-white/[0.08] w-fit">
          TOTAL CUSTOM NODES: <span className="text-white font-bold">{items.length}</span>
        </div>
      </div>

      {/* Info Notice */}
      <div className="p-4 rounded-xl bg-[#0e0e13] border border-white/[0.08] text-xs font-mono text-zinc-400 leading-relaxed flex items-start gap-3">
        <span className="text-red-500 text-sm mt-0.5">ℹ</span>
        <div>
          <p className="text-zinc-300 font-medium mb-1">ROUTING SPECIFICATION:</p>
          Custom links added here appear in the header navigation menu following the core sections (About, Research, Projects, Blog, Contact). Core section links are dynamically gated by their respective Feature Flags.
        </div>
      </div>

      {/* Add Form */}
      <form
        onSubmit={handleAdd}
        className="admin-card p-5"
      >
        <span className="text-[11px] font-mono tracking-wider text-zinc-400 uppercase font-semibold block mb-3">
          + REGISTER NEW NAVIGATION ROUTE
        </span>
        <div className="flex flex-col sm:flex-row gap-3 items-end">
          <div className="w-full sm:w-1/3 space-y-1">
            <label className="block text-[11px] font-mono text-zinc-400 uppercase">
              Route Label <span className="text-red-500">*</span>
            </label>
            <input
              required
              placeholder="e.g. GitHub, CVEs, Writeups"
              value={form.label}
              onChange={(e) => setForm({ ...form, label: e.target.value })}
              className="admin-input text-xs"
            />
          </div>
          <div className="w-full sm:flex-1 space-y-1">
            <label className="block text-[11px] font-mono text-zinc-400 uppercase">
              Target URL <span className="text-red-500">*</span>
            </label>
            <input
              required
              placeholder="https://... or /custom-path"
              value={form.url}
              onChange={(e) => setForm({ ...form, url: e.target.value })}
              className="admin-input text-xs font-mono"
            />
          </div>
          <div className="flex items-center gap-4 h-10 px-2">
            <label className="text-xs font-mono text-zinc-300 flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={form.openInNewTab}
                onChange={(e) => setForm({ ...form, openInNewTab: e.target.checked })}
                className="w-4 h-4 rounded border-zinc-700 bg-zinc-900 text-red-600 focus:ring-red-500 focus:ring-offset-black accent-red-600"
              />
              <span>New Tab</span>
            </label>

            <button
              type="submit"
              disabled={saving}
              className="admin-btn-primary text-xs py-2 px-4 whitespace-nowrap"
            >
              {saving ? "ADDING..." : "ADD LINK"}
            </button>
          </div>
        </div>
      </form>

      {/* Nav Items Table */}
      <div className="admin-card overflow-hidden">
        <div className="p-4 border-b border-white/[0.08] flex items-center justify-between">
          <span className="text-xs font-mono text-zinc-300 font-semibold uppercase tracking-wider">
            CONFIGURED NAVIGATION ROUTES
          </span>
          <span className="text-[11px] font-mono text-zinc-500">
            ORDER DETERMINES RENDER SEQUENCE
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="bg-white/[0.02] border-b border-white/[0.08] text-zinc-400 uppercase tracking-wider">
                <th className="py-3 px-4 w-12 text-center">#</th>
                <th className="py-3 px-4">Label</th>
                <th className="py-3 px-4">URL</th>
                <th className="py-3 px-4 text-center">Target</th>
                <th className="py-3 px-4 text-right">Reorder & Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {items.map((item, i) => (
                <tr key={item.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3 px-4 text-center text-zinc-500">{i + 1}</td>
                  <td className="py-3 px-4 font-semibold text-white">{item.label}</td>
                  <td className="py-3 px-4 text-zinc-400 truncate max-w-xs">{item.url}</td>
                  <td className="py-3 px-4 text-center">
                    {item.openInNewTab ? (
                      <span className="px-2 py-0.5 rounded bg-zinc-800/80 text-[10px] text-zinc-300 border border-white/[0.08]">
                        _blank
                      </span>
                    ) : (
                      <span className="text-zinc-600 text-[10px]">_self</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => wrap(() => moveNavItem(item.id, "up"))}
                        disabled={i === 0}
                        title="Move Up"
                        className="w-7 h-7 flex items-center justify-center rounded bg-white/[0.04] border border-white/[0.08] text-zinc-400 hover:text-white hover:border-red-500/40 disabled:opacity-30 disabled:hover:border-white/[0.08] transition-colors"
                      >
                        ↑
                      </button>
                      <button
                        onClick={() => wrap(() => moveNavItem(item.id, "down"))}
                        disabled={i === items.length - 1}
                        title="Move Down"
                        className="w-7 h-7 flex items-center justify-center rounded bg-white/[0.04] border border-white/[0.08] text-zinc-400 hover:text-white hover:border-red-500/40 disabled:opacity-30 disabled:hover:border-white/[0.08] transition-colors"
                      >
                        ↓
                      </button>
                      <ConfirmButton
                        itemLabel={item.label}
                        onConfirm={() => wrap(() => deleteNavItem(item.id))}
                      />
                    </div>
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-zinc-500">
                    No custom navigation links created yet. Use the form above to add external routes.
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
