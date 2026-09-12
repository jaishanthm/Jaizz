"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { updateMediaAltText, deleteMedia } from "@/lib/actions/media";
import ConfirmButton from "@/components/admin/ConfirmButton";
import { useToast } from "@/components/admin/ToastProvider";

type MediaItem = { id: string; url: string; altText: string | null; mimeType: string; usage: string[] };

export default function MediaClient({ items }: { items: MediaItem[] }) {
  const { toast } = useToast();
  const router = useRouter();
  const fileInput = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [altDrafts, setAltDrafts] = useState<Record<string, string>>(
    Object.fromEntries(items.map((i) => [i.id, i.altText ?? ""]))
  );

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/admin/media", { method: "POST", body: formData });
    const json = await res.json();
    setUploading(false);
    if (!json.success) toast(json.error, "error");
    if (fileInput.current) fileInput.current.value = "";
    router.refresh();
  }

  async function saveAlt(id: string) {
    const res = await updateMediaAltText(id, altDrafts[id]);
    if (!res.success) toast(res.error, "error");
    router.refresh();
  }

  async function remove(id: string) {
    const res = await deleteMedia(id);
    if (!res.success) toast(res.error, "error"); // shows the "still in use: ..." list from Phase 4 §11
    router.refresh();
  }

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl">Media</h1>
        <label className="px-4 py-2 rounded-full text-sm cursor-pointer" style={{ background: "var(--color-primary)", color: "white" }}>
          {uploading ? "Uploading…" : "Upload file"}
          <input ref={fileInput} type="file" accept="image/*,application/pdf" onChange={handleUpload} disabled={uploading} className="hidden" />
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {items.map((item) => (
          <div key={item.id} className="glass-card p-3">
            {item.mimeType.startsWith("image/") ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={item.url} alt={item.altText ?? ""} className="w-full h-32 object-cover rounded-md mb-2" />
            ) : (
              <div className="w-full h-32 flex items-center justify-center rounded-md mb-2 text-xs" style={{ background: "var(--color-bg-card)" }}>PDF</div>
            )}
            <input
              placeholder="Alt text (required before use)"
              value={altDrafts[item.id]}
              onChange={(e) => setAltDrafts({ ...altDrafts, [item.id]: e.target.value })}
              onBlur={() => saveAlt(item.id)}
              className="w-full px-2 py-1 rounded text-xs bg-transparent mb-2"
              style={{ border: "1px solid var(--color-border)" }}
            />
            {item.usage.length > 0 && (
              <p className="text-xs mb-2" style={{ color: "var(--color-signal)" }}>Used in: {item.usage.join(", ")}</p>
            )}
            <ConfirmButton itemLabel={item.altText || "this file"} onConfirm={() => remove(item.id)} />
          </div>
        ))}
        {items.length === 0 && <p style={{ color: "var(--color-text-muted)" }}>No media uploaded yet.</p>}
      </div>
    </>
  );
}
