"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateProfile } from "@/lib/actions/profile";
import MediaUploadField, { type MediaOption } from "@/components/admin/MediaUploadField";
import { useToast } from "@/components/admin/ToastProvider";

type Profile = {
  displayName: string;
  professionalTitle: string;
  shortBio: string;
  longBio?: string | null;
  location?: string | null;
  contactEmail?: string | null;
  availability?: string | null;
  profileImageId?: string | null;
  resumeMediaId?: string | null;
  profileImage?: MediaOption | null;
  resumeMedia?: MediaOption | null;
};

export default function IdentityClient({ initial, mediaItems }: { initial: Profile; mediaItems: MediaOption[] }) {
  const router = useRouter();
  const { toast } = useToast();
  const [form, setForm] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    const res = await updateProfile({
      displayName: form.displayName,
      professionalTitle: form.professionalTitle,
      shortBio: form.shortBio,
      longBio: form.longBio || null,
      location: form.location || null,
      contactEmail: form.contactEmail || "",
      availability: form.availability || null,
      profileImageId: form.profileImageId || null,
      resumeMediaId: form.resumeMediaId || null,
    });
    setSaving(false);
    if (!res.success) {
      setError(res.error);
      toast(res.error, "error");
      return;
    }
    toast("Identity & media assets updated successfully", "success");
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 mb-1">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span className="uppercase tracking-widest text-red-400 font-semibold">// CORE IDENTITY CONFIGURATION</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">Identity & Persona</h1>
        <p className="text-xs text-zinc-400 font-mono mt-1">
          Controls the dominant hero identity, editorial titles, availability indicators, and about section bio.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="admin-card p-6 sm:p-8 space-y-6 max-w-4xl">
        {/* Section 1: Primary Identity */}
        <div className="space-y-4">
          <div className="text-xs font-mono text-zinc-400 uppercase tracking-wider pb-2 border-b border-white/[0.06] font-semibold">
            01 // Primary Identity & Headings
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-mono text-zinc-300 uppercase tracking-wider">
                Full Display Name <span className="text-red-500">*</span>
              </label>
              <input
                required
                maxLength={80}
                placeholder="e.g. Jaishanth M."
                value={form.displayName}
                onChange={(e) => setForm({ ...form, displayName: e.target.value })}
                className="admin-input font-medium"
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-xs font-mono text-zinc-300 uppercase tracking-wider">
                Professional Title <span className="text-red-500">*</span>
              </label>
              <input
                required
                maxLength={100}
                placeholder="e.g. Offensive Security Student"
                value={form.professionalTitle}
                onChange={(e) => setForm({ ...form, professionalTitle: e.target.value })}
                className="admin-input font-medium"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-mono text-zinc-300 uppercase tracking-wider">
              Availability Badge Status (Hero Pulsar Pill)
            </label>
            <input
              placeholder="e.g. Open for Security Research & Internships"
              value={form.availability ?? ""}
              onChange={(e) => setForm({ ...form, availability: e.target.value })}
              className="admin-input font-mono text-sm"
            />
          </div>
        </div>

        {/* Section 2: Personal Statements */}
        <div className="space-y-4 pt-2">
          <div className="text-xs font-mono text-zinc-400 uppercase tracking-wider pb-2 border-b border-white/[0.06] font-semibold">
            02 // Statements & Biographies
          </div>
          <div className="space-y-1.5">
            <label className="block text-xs font-mono text-zinc-300 uppercase tracking-wider">
              Short Bio (Hero Subtitle & About Introduction) <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              maxLength={250}
              rows={3}
              placeholder="Concise 1-2 sentence statement..."
              value={form.shortBio}
              onChange={(e) => setForm({ ...form, shortBio: e.target.value })}
              className="admin-input text-sm leading-relaxed"
            />
            <p className="text-[11px] font-mono text-zinc-500 text-right">
              {form.shortBio?.length || 0}/250 characters
            </p>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-mono text-zinc-300 uppercase tracking-wider">
              Comprehensive Bio (Markdown — Rendered on About Ledger)
            </label>
            <textarea
              rows={9}
              placeholder="Write comprehensive background, technical ethos, and offensive-security focus in Markdown..."
              value={form.longBio ?? ""}
              onChange={(e) => setForm({ ...form, longBio: e.target.value })}
              className="admin-input font-mono text-xs leading-relaxed"
            />
          </div>
        </div>

        {/* Section 3: Contact & Coordinates */}
        <div className="space-y-4 pt-2">
          <div className="text-xs font-mono text-zinc-400 uppercase tracking-wider pb-2 border-b border-white/[0.06] font-semibold">
            03 // Geographical & Direct Communications
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-mono text-zinc-300 uppercase tracking-wider">
                Geographical Base (Location)
              </label>
              <input
                placeholder="e.g. Tamil Nadu, India"
                value={form.location ?? ""}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                className="admin-input text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-xs font-mono text-zinc-300 uppercase tracking-wider">
                Inquiry Dispatch Email
              </label>
              <input
                type="email"
                placeholder="e.g. jaishanthcys@gmail.com"
                value={form.contactEmail ?? ""}
                onChange={(e) => setForm({ ...form, contactEmail: e.target.value })}
                className="admin-input text-sm font-mono"
              />
            </div>
          </div>
        </div>

        {/* Section 4: Attached Media Assets */}
        <div className="space-y-4 pt-2">
          <div className="text-xs font-mono text-zinc-400 uppercase tracking-wider pb-2 border-b border-white/[0.06] font-semibold">
            04 // Attached Media Assets (Photo &amp; Resume Upload)
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <MediaUploadField
              label="Profile Portrait Image"
              value={form.profileImageId ?? null}
              initialMedia={initial.profileImage}
              onChange={(id) => setForm({ ...form, profileImageId: id })}
              accept="image/*"
              type="image"
              existingMedia={mediaItems}
              helperText="Upload JPG/PNG/WEBP photo or choose from vault"
            />
            <MediaUploadField
              label="Verified Resume Document (PDF)"
              value={form.resumeMediaId ?? null}
              initialMedia={initial.resumeMedia}
              onChange={(id) => setForm({ ...form, resumeMediaId: id })}
              accept=".pdf,application/pdf"
              type="document"
              existingMedia={mediaItems}
              helperText="Upload official PDF resume or choose from vault"
            />
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-red-950/40 border border-red-500/40 text-xs font-mono text-red-300 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
            <span>{error}</span>
          </div>
        )}

        <div className="pt-4 border-t border-white/[0.08] flex items-center gap-4">
          <button
            type="submit"
            disabled={saving}
            className="admin-btn-primary !py-3 !px-6 text-xs"
          >
            {saving ? (
              <>
                <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>SAVING CHANGES...</span>
              </>
            ) : (
              "COMMIT IDENTITY UPDATES"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
