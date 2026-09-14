"use client";

import { useState, useRef } from "react";
import { useToast } from "@/components/admin/ToastProvider";

export type MediaOption = {
  id: string;
  url: string;
  altText?: string | null;
  mimeType?: string;
};

interface MediaUploadFieldProps {
  label: string;
  value: string | null;
  onChange: (mediaId: string | null, mediaUrl?: string) => void;
  accept?: string;
  type?: "image" | "document" | "any";
  existingMedia?: MediaOption[];
  initialMedia?: MediaOption | null;
  helperText?: string;
  required?: boolean;
}

export default function MediaUploadField({
  label,
  value,
  onChange,
  accept = "image/*",
  type = "image",
  existingMedia = [],
  initialMedia = null,
  helperText,
  required = false,
}: MediaUploadFieldProps) {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [showVault, setShowVault] = useState(false);
  const [recentUploads, setRecentUploads] = useState<MediaOption[]>([]);

  const allMedia = [
    ...recentUploads,
    ...(initialMedia && !recentUploads.some((r) => r.id === initialMedia.id) ? [initialMedia] : []),
    ...existingMedia.filter(
      (m) =>
        !recentUploads.some((r) => r.id === m.id) &&
        (!initialMedia || m.id !== initialMedia.id)
    ),
  ];
  const selectedMedia = allMedia.find((m) => m.id === value);

  async function handleFileSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/admin/media", {
        method: "POST",
        body: formData,
      });
      const json = await res.json();
      setUploading(false);

      if (!json.success || !json.data) {
        toast(json.error || "Upload failed", "error");
        return;
      }

      const newMedia: MediaOption = {
        id: json.data.id,
        url: json.data.url,
        altText: json.data.altText,
        mimeType: json.data.mimeType,
      };

      setRecentUploads((prev) => [newMedia, ...prev]);
      onChange(newMedia.id, newMedia.url);
      toast(`File "${file.name}" uploaded and attached`, "success");
    } catch (err: any) {
      setUploading(false);
      toast(err.message || "Network error uploading file", "error");
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  const isDocument = type === "document" || (selectedMedia?.mimeType?.includes("pdf") ?? false);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-mono font-medium text-zinc-300 uppercase tracking-wider">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        {helperText && (
          <span className="text-[11px] font-mono text-zinc-500">{helperText}</span>
        )}
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileSelected}
        disabled={uploading}
        className="hidden"
      />

      {/* When media is currently attached */}
      {selectedMedia ? (
        <div className="p-3.5 rounded-xl bg-[#0d0d12] border border-white/[0.1] flex flex-col gap-3">
          <div className="flex items-center gap-3 min-w-0">
            {/* Thumbnail or Doc Icon */}
            <div className="w-12 h-12 rounded-lg bg-black/60 border border-white/[0.08] overflow-hidden flex-shrink-0 flex items-center justify-center">
              {isDocument ? (
                <div className="flex flex-col items-center justify-center text-red-400 font-mono">
                  <span className="text-xs font-bold">PDF</span>
                  <span className="text-[8px] uppercase text-zinc-500">DOC</span>
                </div>
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={selectedMedia.url}
                  alt={selectedMedia.altText || "Preview"}
                  className="w-full h-full object-cover"
                />
              )}
            </div>

            {/* Media Metadata */}
            <div className="min-w-0 flex-1">
              <div className="text-xs font-semibold text-white truncate">
                {selectedMedia.altText || selectedMedia.url.split("/").pop()}
              </div>
              <div className="text-[11px] font-mono text-zinc-400 truncate mt-0.5">
                {selectedMedia.url}
              </div>
              <div className="flex items-center gap-2 mt-1 text-[10px] font-mono">
                <span className="text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  ATTACHED
                </span>
                <span className="text-zinc-600">•</span>
                <a
                  href={selectedMedia.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-zinc-400 hover:text-red-400 transition-colors underline decoration-white/20"
                >
                  VIEW ASSET ↗
                </a>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/[0.05]">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="px-2.5 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.08] hover:border-white/20 text-xs font-mono text-zinc-300 hover:text-white transition-colors flex items-center gap-1.5"
            >
              {uploading ? (
                <>
                  <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>UPLOADING...</span>
                </>
              ) : (
                <span>UPLOAD NEW</span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setShowVault(!showVault)}
              className="px-2.5 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.08] hover:border-white/20 text-xs font-mono text-zinc-400 hover:text-white transition-colors"
            >
              VAULT 📁
            </button>

            <button
              type="button"
              onClick={() => onChange(null)}
              className="px-2.5 py-1.5 rounded-lg bg-red-950/20 border border-red-500/30 text-xs font-mono text-red-400 hover:bg-red-950/40 transition-colors"
              title="Detach media"
            >
              ✕
            </button>
          </div>
        </div>
      ) : (
        /* Empty State: Upload Dropzone */
        <div className="border border-dashed border-white/[0.12] hover:border-red-500/40 rounded-xl p-4 sm:p-5 bg-black/30 transition-all text-center">
          <div className="flex flex-col items-center justify-center gap-2">
            <div className="w-10 h-10 rounded-full bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-zinc-400">
              {type === "document" ? "📄" : "🖼"}
            </div>

            <div>
              <p className="text-xs text-zinc-300 font-medium">
                {type === "document"
                  ? "Upload verification document (PDF, max 10MB)"
                  : "Upload photo or badge (JPEG, PNG, WebP, max 10MB)"}
              </p>
              <p className="text-[11px] font-mono text-zinc-500 mt-0.5">
                Automatically stored in the local security vault &amp; linked immediately
              </p>
            </div>

            <div className="flex items-center gap-2 mt-1">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="admin-btn-primary text-xs py-1.5 px-4 flex items-center gap-1.5"
              >
                {uploading ? (
                  <>
                    <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>UPLOADING...</span>
                  </>
                ) : (
                  <>
                    <span>+ UPLOAD {type === "document" ? "DOCUMENT" : "PHOTO"}</span>
                  </>
                )}
              </button>

              {allMedia.length > 0 && (
                <button
                  type="button"
                  onClick={() => setShowVault(!showVault)}
                  className="px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.08] hover:border-white/20 text-xs font-mono text-zinc-400 hover:text-white transition-colors"
                >
                  CHOOSE FROM VAULT ({allMedia.length})
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Vault Picker Modal/Dropdown */}
      {showVault && (
        <div className="p-4 rounded-xl bg-[#0b0b0f] border border-white/[0.12] space-y-3 mt-2 shadow-2xl">
          <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
            <span className="text-xs font-mono text-zinc-300 uppercase tracking-wider font-semibold">
              SELECT FROM VAULT REPOSITORY
            </span>
            <button
              type="button"
              onClick={() => setShowVault(false)}
              className="text-xs font-mono text-zinc-400 hover:text-white"
            >
              CLOSE ×
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 max-h-56 overflow-y-auto pr-1">
            {allMedia
              .filter((m) => {
                const isPdf = (m.mimeType?.includes("pdf") ?? false) || m.url.toLowerCase().endsWith(".pdf");
                if (type === "document") return isPdf;
                if (type === "image") return !isPdf;
                return true;
              })
              .map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => {
                    onChange(m.id, m.url);
                    setShowVault(false);
                    toast("Asset attached from vault", "success");
                  }}
                  className={`p-2 rounded-lg border text-left transition-all group flex flex-col items-center gap-1.5 ${
                    value === m.id
                      ? "border-red-500 bg-red-500/10 text-white shadow-[0_0_8px_rgba(239,68,68,0.3)]"
                      : "border-white/[0.06] bg-black/40 hover:border-white/20 text-zinc-400"
                  }`}
                >
                  <div className="w-full h-16 rounded bg-black/60 overflow-hidden flex items-center justify-center">
                    {m.mimeType?.includes("pdf") ? (
                      <span className="text-xs font-mono text-red-400 font-bold">PDF</span>
                    ) : (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={m.url}
                        alt={m.altText || ""}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    )}
                  </div>
                  <span className="text-[10px] font-mono truncate w-full text-center">
                    {m.altText || m.url.split("/").pop()}
                  </span>
                </button>
              ))}

            {allMedia.length === 0 && (
              <div className="col-span-full py-4 text-center text-xs font-mono text-zinc-500">
                No existing assets found in vault. Use the upload button above.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
