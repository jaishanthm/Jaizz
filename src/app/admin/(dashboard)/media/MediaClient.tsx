"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { updateMediaAltText, deleteMedia } from "@/lib/actions/media";
import ConfirmButton from "@/components/admin/ConfirmButton";
import { useToast } from "@/components/admin/ToastProvider";

type MediaItem = {
  id: string;
  url: string;
  altText: string | null;
  mimeType: string;
  usage: string[];
};

export default function MediaClient({ items }: { items: MediaItem[] }) {
  const { toast } = useToast();
  const router = useRouter();
  const fileInput = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [altDrafts, setAltDrafts] = useState<Record<string, string>>(
    Object.fromEntries(items.map((i) => [i.id, i.altText ?? ""]))
  );
  const [copiedId, setCopiedId] = useState<string | null>(null);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("/api/admin/media", { method: "POST", body: formData });
      const json = await res.json();
      setUploading(false);
      if (!json.success) {
        toast(json.error || "Upload failed", "error");
      } else {
        toast("Asset uploaded successfully to vault", "success");
      }
    } catch {
      setUploading(false);
      toast("Asset upload encountered network fault", "error");
    }
    if (fileInput.current) fileInput.current.value = "";
    router.refresh();
  }

  async function saveAlt(id: string) {
    const res = await updateMediaAltText(id, altDrafts[id]);
    if (!res.success) {
      toast(res.error || "Failed to update alt text", "error");
    } else {
      toast("Alt metadata indexed", "success");
    }
    router.refresh();
  }

  async function remove(id: string) {
    const res = await deleteMedia(id);
    if (!res.success) {
      toast(res.error || "Cannot delete asset (still in active use)", "error");
    } else {
      toast("Asset purged from vault", "success");
    }
    router.refresh();
  }

  function copyUrl(id: string, url: string) {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    toast("Asset URL copied to clipboard", "success");
    setTimeout(() => setCopiedId(null), 2500);
  }

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/[0.08]">
        <div>
          <span className="text-[11px] font-mono tracking-widest text-red-500 uppercase font-semibold">
            VAULT // STATIC ASSET & MEDIA REPOSITORY
          </span>
          <h1 className="text-2xl font-bold text-white tracking-tight mt-0.5">
            Media & Document Vault
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <label className="admin-btn-primary cursor-pointer flex items-center gap-2">
            {uploading ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>INJECTING FILE...</span>
              </>
            ) : (
              <>
                <span>+ UPLOAD ASSET</span>
              </>
            )}
            <input
              ref={fileInput}
              type="file"
              accept="image/*,application/pdf"
              onChange={handleUpload}
              disabled={uploading}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Vault Telemetry */}
      <div className="p-4 rounded-xl bg-[#0e0e13] border border-white/[0.08] flex items-center justify-between text-xs font-mono text-zinc-400">
        <div className="flex items-center gap-3">
          <span className="text-red-500 font-bold">● REPOSITORY:</span>
          <span>LOCAL VAULT (PUBLIC / UPLOADS)</span>
        </div>
        <div>
          TOTAL ASSETS: <span className="text-white font-bold">{items.length}</span>
        </div>
      </div>

      {/* Media Grid */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {items.map((item) => (
          <div key={item.id} className="admin-card p-3 space-y-3 flex flex-col justify-between">
            <div>
              {/* Asset Preview Frame */}
              <div className="relative w-full h-36 rounded-lg bg-black/60 border border-white/[0.06] overflow-hidden flex items-center justify-center group">
                {item.mimeType.startsWith("image/") ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.url}
                    alt={item.altText ?? ""}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-2 text-zinc-400">
                    <span className="text-2xl font-mono text-red-500 font-bold">PDF</span>
                    <span className="text-[10px] font-mono uppercase">Document Asset</span>
                  </div>
                )}

                {/* Quick copy overlay */}
                <button
                  type="button"
                  onClick={() => copyUrl(item.id, item.url)}
                  title="Copy URL"
                  className="absolute top-2 right-2 p-1.5 rounded-md bg-black/80 border border-white/20 text-zinc-300 hover:text-white hover:border-red-500 opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-mono"
                >
                  {copiedId === item.id ? "COPIED ✓" : "URL 📋"}
                </button>
              </div>

              {/* Alt Text Input */}
              <div className="mt-3 space-y-1">
                <label className="block text-[10px] font-mono text-zinc-400 uppercase">
                  Alt / Description
                </label>
                <input
                  placeholder="Required for SEO & a11y..."
                  value={altDrafts[item.id]}
                  onChange={(e) =>
                    setAltDrafts({ ...altDrafts, [item.id]: e.target.value })
                  }
                  onBlur={() => saveAlt(item.id)}
                  className="admin-input text-xs"
                />
              </div>

              {/* Usage references */}
              {item.usage.length > 0 ? (
                <div className="mt-2 text-[10px] font-mono text-emerald-400 flex items-start gap-1">
                  <span>●</span>
                  <span className="truncate">Used in: {item.usage.join(", ")}</span>
                </div>
              ) : (
                <div className="mt-2 text-[10px] font-mono text-zinc-500">
                  ○ Unreferenced in active content
                </div>
              )}
            </div>

            {/* Actions footer */}
            <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between">
              <span className="text-[10px] font-mono text-zinc-500 truncate max-w-[120px]">
                {item.mimeType.split("/")[1]?.toUpperCase() || "FILE"}
              </span>
              <ConfirmButton
                itemLabel={item.altText || "this asset"}
                onConfirm={() => remove(item.id)}
              />
            </div>
          </div>
        ))}

        {items.length === 0 && (
          <div className="col-span-full admin-card p-12 text-center text-xs font-mono text-zinc-500">
            No media assets uploaded yet. Use the upload button above to add images or PDFs.
          </div>
        )}
      </div>
    </div>
  );
}
