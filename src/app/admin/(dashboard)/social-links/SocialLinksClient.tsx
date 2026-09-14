"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  createSocialLink,
  updateSocialLink,
  deleteSocialLink,
  setSocialLinkVisible,
  moveSocialLink,
} from "@/lib/actions/social-links";
import { useToast } from "@/components/admin/ToastProvider";
import ConfirmButton from "@/components/admin/ConfirmButton";

type SocialLink = {
  id: string;
  platform: string;
  url: string;
  iconKey: string | null;
  customLabel: string | null;
  order: number;
  visible: boolean;
};

const COMMON_PLATFORMS = [
  "GitHub",
  "LinkedIn",
  "TryHackMe",
  "Bugcrowd",
  "HackerOne",
  "Twitter / X",
  "Discord",
  "Email",
  "YouTube",
  "GitLab",
  "Medium",
  "Other",
];

export default function SocialLinksClient({ links }: { links: SocialLink[] }) {
  const { toast } = useToast();
  const router = useRouter();
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [form, setForm] = useState({
    platform: "GitHub",
    url: "",
    customLabel: "",
    iconKey: "github",
  });

  const [editForm, setEditForm] = useState({
    platform: "",
    url: "",
    customLabel: "",
    iconKey: "",
  });

  async function wrap(fn: () => Promise<{ success: boolean; error?: string }>) {
    const res = await fn();
    if (!res.success) {
      toast(res.error || "Operation failed", "error");
    } else {
      toast("Social link updated", "success");
    }
    router.refresh();
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!form.url) return;
    setAdding(true);
    const res = await createSocialLink({
      platform: form.platform,
      url: form.url,
      customLabel: form.customLabel || undefined,
      iconKey: form.iconKey || form.platform.toLowerCase().replace(/[^a-z0-9]/g, ""),
    });
    setAdding(false);
    if (!res.success) {
      toast(res.error || "Failed to create social link", "error");
      return;
    }
    toast("Social channel registered successfully", "success");
    setForm({ platform: "GitHub", url: "", customLabel: "", iconKey: "github" });
    router.refresh();
  }

  function startEdit(link: SocialLink) {
    setEditingId(link.id);
    setEditForm({
      platform: link.platform,
      url: link.url,
      customLabel: link.customLabel || "",
      iconKey: link.iconKey || "",
    });
  }

  async function handleSaveEdit(id: string) {
    const res = await updateSocialLink(id, {
      platform: editForm.platform,
      url: editForm.url,
      customLabel: editForm.customLabel || undefined,
      iconKey: editForm.iconKey || undefined,
    });
    if (!res.success) {
      toast(res.error || "Failed to save link updates", "error");
      return;
    }
    setEditingId(null);
    toast("Social link details updated", "success");
    router.refresh();
  }

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/[0.08]">
        <div>
          <span className="text-[11px] font-mono tracking-widest text-red-500 uppercase font-semibold">
            COMMS // EXTERNAL NETWORKS &amp; SOCIAL CHANNELS
          </span>
          <h1 className="text-2xl font-bold text-white tracking-tight mt-0.5">
            Social Links &amp; Profiles
          </h1>
        </div>
        <div className="text-xs font-mono text-zinc-400 bg-white/[0.04] px-3 py-1.5 rounded-lg border border-white/[0.08] w-fit">
          ACTIVE CHANNELS: <span className="text-white font-bold">{links.filter((l) => l.visible).length}</span> /{" "}
          <span className="text-zinc-400">{links.length}</span>
        </div>
      </div>

      {/* Info Banner */}
      <div className="p-4 rounded-xl bg-[#0e0e13] border border-white/[0.08] text-xs font-mono text-zinc-400 leading-relaxed flex items-start gap-3">
        <span className="text-red-500 text-sm mt-0.5">⚡</span>
        <div>
          <p className="text-zinc-300 font-medium mb-1">NETWORK CHANNELS &amp; SEO ATTRIBUTION:</p>
          Configured profiles are rendered dynamically in the top navigation bar, mobile menu drawer, footer, contact page, and are automatically compiled into Schema.org JSON-LD structured data for Google Search identity graphs.
        </div>
      </div>

      {/* Create New Link Card */}
      <form onSubmit={handleCreate} className="admin-card p-5 space-y-4">
        <span className="text-[11px] font-mono tracking-wider text-zinc-400 uppercase font-semibold block">
          + REGISTER SOCIAL OR SECURITY PROFILE
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 items-end">
          <div className="space-y-1">
            <label className="block text-[11px] font-mono text-zinc-400 uppercase">
              Platform <span className="text-red-500">*</span>
            </label>
            <select
              value={form.platform}
              onChange={(e) => {
                const plat = e.target.value;
                setForm({
                  ...form,
                  platform: plat,
                  iconKey: plat.toLowerCase().replace(/[^a-z0-9]/g, ""),
                });
              }}
              className="admin-input text-xs font-mono bg-[#111116]"
            >
              {COMMON_PLATFORMS.map((p) => (
                <option key={p} value={p} className="bg-[#111116] text-white">
                  {p}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1 md:col-span-2">
            <label className="block text-[11px] font-mono text-zinc-400 uppercase">
              Target Profile URL <span className="text-red-500">*</span>
            </label>
            <input
              required
              type="url"
              placeholder="https://..."
              value={form.url}
              onChange={(e) => setForm({ ...form, url: e.target.value })}
              className="admin-input text-xs font-mono"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-[11px] font-mono text-zinc-400 uppercase">
              Custom Badge / Label
            </label>
            <input
              placeholder="e.g. Top 5% Hacker"
              value={form.customLabel}
              onChange={(e) => setForm({ ...form, customLabel: e.target.value })}
              className="admin-input text-xs"
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={adding}
            className="admin-btn-primary text-xs py-2 px-5"
          >
            {adding ? "REGISTERING..." : "REGISTER CHANNEL"}
          </button>
        </div>
      </form>

      {/* Links List */}
      <div className="admin-card overflow-hidden">
        <div className="p-4 border-b border-white/[0.08] flex items-center justify-between">
          <span className="text-xs font-mono text-zinc-300 font-semibold uppercase tracking-wider">
            CONFIGURED SOCIAL CHANNELS
          </span>
          <span className="text-[11px] font-mono text-zinc-500">
            DRAG OR ARROW BUTTONS CONTROL SEQUENCE
          </span>
        </div>

        <div className="divide-y divide-white/[0.04]">
          {links.map((link, i) => (
            <div
              key={link.id}
              className="p-4 hover:bg-white/[0.02] transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              {editingId === link.id ? (
                /* Inline Edit Mode */
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input
                    value={editForm.platform}
                    onChange={(e) => setEditForm({ ...editForm, platform: e.target.value })}
                    className="admin-input text-xs"
                    placeholder="Platform"
                  />
                  <input
                    value={editForm.url}
                    onChange={(e) => setEditForm({ ...editForm, url: e.target.value })}
                    className="admin-input text-xs font-mono"
                    placeholder="Profile URL"
                  />
                  <input
                    value={editForm.customLabel}
                    onChange={(e) => setEditForm({ ...editForm, customLabel: e.target.value })}
                    className="admin-input text-xs"
                    placeholder="Custom Label"
                  />
                </div>
              ) : (
                /* Standard Display */
                <div className="flex items-center gap-4 min-w-0">
                  <span className="w-6 h-6 rounded bg-white/[0.04] border border-white/[0.08] text-zinc-400 flex items-center justify-center font-mono text-[10px]">
                    {i + 1}
                  </span>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-white text-sm">{link.platform}</span>
                      {link.customLabel && (
                        <span className="px-2 py-0.5 rounded bg-white/[0.06] border border-white/[0.08] text-[10px] font-mono text-zinc-300">
                          {link.customLabel}
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => wrap(() => setSocialLinkVisible(link.id, !link.visible))}
                        className={`text-[10px] font-mono px-2 py-0.5 rounded border transition-colors ${
                          link.visible
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                            : "bg-zinc-800 text-zinc-500 border-zinc-700"
                        }`}
                      >
                        {link.visible ? "● ACTIVE" : "○ HIDDEN"}
                      </button>
                    </div>

                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-mono text-zinc-400 hover:text-red-400 truncate max-w-md block mt-0.5 transition-colors"
                    >
                      {link.url} ↗
                    </a>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center gap-2 self-end md:self-auto">
                {editingId === link.id ? (
                  <>
                    <button
                      type="button"
                      onClick={() => handleSaveEdit(link.id)}
                      className="admin-btn-primary text-xs py-1.5 px-3"
                    >
                      SAVE
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingId(null)}
                      className="admin-btn-secondary text-xs py-1.5 px-3"
                    >
                      CANCEL
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => startEdit(link)}
                      className="px-2.5 py-1.5 rounded bg-white/[0.04] border border-white/[0.08] text-xs font-mono text-zinc-300 hover:text-white hover:border-red-500/40 transition-colors"
                    >
                      EDIT
                    </button>

                    <button
                      onClick={() => wrap(() => moveSocialLink(link.id, "up"))}
                      disabled={i === 0}
                      title="Move Up"
                      className="w-7 h-7 flex items-center justify-center rounded bg-white/[0.04] border border-white/[0.08] text-zinc-400 hover:text-white hover:border-red-500/40 disabled:opacity-20 disabled:hover:border-white/[0.08] transition-colors"
                    >
                      ↑
                    </button>
                    <button
                      onClick={() => wrap(() => moveSocialLink(link.id, "down"))}
                      disabled={i === links.length - 1}
                      title="Move Down"
                      className="w-7 h-7 flex items-center justify-center rounded bg-white/[0.04] border border-white/[0.08] text-zinc-400 hover:text-white hover:border-red-500/40 disabled:opacity-20 disabled:hover:border-white/[0.08] transition-colors"
                    >
                      ↓
                    </button>

                    <ConfirmButton
                      itemLabel={link.platform}
                      onConfirm={() => wrap(() => deleteSocialLink(link.id))}
                    />
                  </>
                )}
              </div>
            </div>
          ))}

          {links.length === 0 && (
            <div className="p-12 text-center text-xs font-mono text-zinc-500">
              No social channels configured yet. Use the registration form above to link GitHub, LinkedIn, etc.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
