"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createCertification, updateCertification } from "@/lib/actions/certifications";
import MediaUploadField, { type MediaOption } from "@/components/admin/MediaUploadField";
import { useToast } from "@/components/admin/ToastProvider";

export type CertificationFormData = {
  id?: string;
  name: string;
  issuer: string;
  credentialId?: string | null;
  issueDate: string; // ISO date string (YYYY-MM-DD)
  expirationDate?: string | null; // ISO date string (YYYY-MM-DD)
  verificationUrl?: string | null;
  imageMediaId?: string | null;
  imageMedia?: MediaOption | null;
  description?: string | null;
};

interface CertificationFormProps {
  initial?: CertificationFormData;
  mediaItems?: MediaOption[];
}

export default function CertificationForm({
  initial,
  mediaItems = [],
}: CertificationFormProps) {
  const router = useRouter();
  const { toast } = useToast();

  const [form, setForm] = useState<CertificationFormData>(
    initial ?? {
      name: "",
      issuer: "",
      credentialId: "",
      issueDate: new Date().toISOString().slice(0, 10),
      expirationDate: "",
      verificationUrl: "",
      imageMediaId: null,
      imageMedia: null,
      description: "",
    }
  );

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const payload = {
      name: form.name.trim(),
      issuer: form.issuer.trim(),
      credentialId: form.credentialId?.trim() || null,
      issueDate: new Date(form.issueDate),
      expirationDate: form.expirationDate ? new Date(form.expirationDate) : null,
      verificationUrl: form.verificationUrl?.trim() || null,
      imageMediaId: form.imageMediaId || null,
      description: form.description?.trim() || null,
    };

    const res = initial?.id
      ? await updateCertification(initial.id, payload)
      : await createCertification(payload);

    setSaving(false);

    if (!res.success) {
      setError(res.error);
      toast(res.error, "error");
      return;
    }

    toast(
      initial?.id ? "Certification record updated" : "Certification provisioned successfully",
      "success"
    );
    router.push("/admin/certifications");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="admin-card p-6 sm:p-8 space-y-6 max-w-3xl">
      {/* 01: Core Credential Details */}
      <div className="space-y-4">
        <div className="text-xs font-mono text-zinc-400 uppercase tracking-wider pb-2 border-b border-white/[0.06] font-semibold flex items-center justify-between">
          <span>01 // Core Credential Details</span>
          <span className="text-[11px] text-red-400 font-mono">* Required fields</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-mono text-zinc-300 uppercase tracking-wider">
              Certification Name <span className="text-red-500">*</span>
            </label>
            <input
              required
              placeholder="e.g. Certified Ethical Hacker (Practical)"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="admin-input font-medium"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-mono text-zinc-300 uppercase tracking-wider">
              Issuing Organization / Authority <span className="text-red-500">*</span>
            </label>
            <input
              required
              placeholder="e.g. OffSec, Cisco, CompTIA, EC-Council"
              value={form.issuer}
              onChange={(e) => setForm({ ...form, issuer: e.target.value })}
              className="admin-input font-medium"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-mono text-zinc-300 uppercase tracking-wider">
              Credential / License ID
            </label>
            <input
              placeholder="e.g. CS-984210 or ECC-78219"
              value={form.credentialId ?? ""}
              onChange={(e) => setForm({ ...form, credentialId: e.target.value })}
              className="admin-input font-mono text-sm"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-mono text-zinc-300 uppercase tracking-wider">
              Verification Anchor URL
            </label>
            <input
              type="url"
              placeholder="https://verify.issuer.com/cert/..."
              value={form.verificationUrl ?? ""}
              onChange={(e) => setForm({ ...form, verificationUrl: e.target.value })}
              className="admin-input font-mono text-sm"
            />
          </div>
        </div>
      </div>

      {/* 02: Photographic Badge / Proof Upload */}
      <div className="space-y-4 pt-2">
        <div className="text-xs font-mono text-zinc-400 uppercase tracking-wider pb-2 border-b border-white/[0.06] font-semibold">
          02 // Credential Badge &amp; Photographic Evidence (Photo Upload)
        </div>

        <MediaUploadField
          label="Official Certification Badge / Document Photo"
          value={form.imageMediaId ?? null}
          initialMedia={initial?.imageMedia}
          onChange={(mediaId) => setForm({ ...form, imageMediaId: mediaId })}
          accept="image/*"
          type="image"
          existingMedia={mediaItems}
          helperText="Upload official badge image or choose from existing security vault"
        />
      </div>

      {/* 03: Validity & Timestamps */}
      <div className="space-y-4 pt-2">
        <div className="text-xs font-mono text-zinc-400 uppercase tracking-wider pb-2 border-b border-white/[0.06] font-semibold">
          03 // Validity &amp; Timeline
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-mono text-zinc-300 uppercase tracking-wider">
              Issue Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              required
              value={form.issueDate}
              onChange={(e) => setForm({ ...form, issueDate: e.target.value })}
              className="admin-input font-mono text-sm"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-mono text-zinc-300 uppercase tracking-wider">
              Expiration Date (Optional / Never Expires)
            </label>
            <input
              type="date"
              value={form.expirationDate ?? ""}
              onChange={(e) => setForm({ ...form, expirationDate: e.target.value })}
              className="admin-input font-mono text-sm"
            />
          </div>
        </div>
      </div>

      {/* 04: Description / Scope */}
      <div className="space-y-4 pt-2">
        <div className="text-xs font-mono text-zinc-400 uppercase tracking-wider pb-2 border-b border-white/[0.06] font-semibold">
          04 // Scope &amp; Acquired Competencies
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-mono text-zinc-300 uppercase tracking-wider">
            Curriculum &amp; Technical Competencies Covered
          </label>
          <textarea
            rows={4}
            placeholder="Details on the hands-on lab assessment, exploit frameworks, or technical topics validated by this credential..."
            value={form.description ?? ""}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="admin-input text-sm leading-relaxed"
          />
        </div>
      </div>

      {/* Error display */}
      {error && (
        <div className="p-3 rounded-lg bg-red-950/40 border border-red-500/40 text-xs font-mono text-red-300 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
          <span>{error}</span>
        </div>
      )}

      {/* Actions */}
      <div className="pt-4 border-t border-white/[0.08] flex items-center gap-4">
        <button
          type="submit"
          disabled={saving}
          className="admin-btn-primary !py-3 !px-6 text-xs"
        >
          {saving ? (
            <>
              <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>SAVING CREDENTIAL...</span>
            </>
          ) : initial?.id ? (
            "COMMIT CREDENTIAL UPDATES"
          ) : (
            "PROVISION CREDENTIAL RECORD"
          )}
        </button>

        <Link
          href="/admin/certifications"
          className="px-4 py-3 rounded-lg border border-white/[0.08] hover:border-white/20 text-xs font-mono text-zinc-400 hover:text-white transition-colors"
        >
          DISCARD / RETURN
        </Link>
      </div>
    </form>
  );
}
