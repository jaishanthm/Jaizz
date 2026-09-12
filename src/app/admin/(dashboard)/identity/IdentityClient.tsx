"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateProfile } from "@/lib/actions/profile";

type Profile = {
  displayName: string; professionalTitle: string; shortBio: string;
  longBio?: string | null; location?: string | null; contactEmail?: string | null; availability?: string | null;
  profileImageId?: string | null; resumeMediaId?: string | null;
};

type MediaItem = { id: string; altText: string | null; url: string; };

export default function IdentityClient({ initial, mediaItems }: { initial: Profile, mediaItems: MediaItem[] }) {
  const router = useRouter();
  const [form, setForm] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    const res = await updateProfile({
      displayName: form.displayName, professionalTitle: form.professionalTitle, shortBio: form.shortBio,
      longBio: form.longBio ?? undefined, location: form.location ?? undefined,
      contactEmail: form.contactEmail ?? "", availability: form.availability ?? undefined,
      profileImageId: form.profileImageId ?? undefined, resumeMediaId: form.resumeMediaId ?? undefined,
    });
    setSaving(false);
    if (!res.success) { setError(res.error); return; }
    router.refresh();
  }

  return (
    <>
      <h1 className="text-2xl mb-2">Identity</h1>
      <p className="text-xs mb-6" style={{ color: "var(--color-text-muted)" }}>
        This drives both the homepage hero and the About page — they read the same fields, so there&apos;s one screen instead of three.
      </p>
      <form onSubmit={handleSubmit} className="max-w-2xl space-y-4">
        <input required maxLength={80} placeholder="Display name" value={form.displayName} onChange={(e) => setForm({ ...form, displayName: e.target.value })}
          className="w-full px-4 py-3 rounded-md bg-transparent" style={{ border: "1px solid var(--color-border)" }} />
        <input required maxLength={100} placeholder="Professional title" value={form.professionalTitle} onChange={(e) => setForm({ ...form, professionalTitle: e.target.value })}
          className="w-full px-4 py-3 rounded-md bg-transparent" style={{ border: "1px solid var(--color-border)" }} />
        <textarea required maxLength={200} placeholder="Short bio (hero + about intro)" value={form.shortBio} onChange={(e) => setForm({ ...form, shortBio: e.target.value })}
          className="w-full px-4 py-3 rounded-md bg-transparent" style={{ border: "1px solid var(--color-border)" }} />
        <textarea rows={8} placeholder="Long bio (markdown, About page body)" value={form.longBio ?? ""} onChange={(e) => setForm({ ...form, longBio: e.target.value })}
          className="w-full px-4 py-3 rounded-md bg-transparent font-mono text-sm" style={{ border: "1px solid var(--color-border)" }} />
        <div className="grid grid-cols-2 gap-3">
          <input placeholder="Location" value={form.location ?? ""} onChange={(e) => setForm({ ...form, location: e.target.value })}
            className="px-3 py-2 rounded-md bg-transparent text-sm" style={{ border: "1px solid var(--color-border)" }} />
          <input type="email" placeholder="Contact email" value={form.contactEmail ?? ""} onChange={(e) => setForm({ ...form, contactEmail: e.target.value })}
            className="px-3 py-2 rounded-md bg-transparent text-sm" style={{ border: "1px solid var(--color-border)" }} />
        </div>
        <input placeholder="Availability (e.g. 'Open to internships')" value={form.availability ?? ""} onChange={(e) => setForm({ ...form, availability: e.target.value })}
          className="w-full px-4 py-3 rounded-md bg-transparent" style={{ border: "1px solid var(--color-border)" }} />

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-gray-500 block mb-1">Profile Photo</label>
            <select value={form.profileImageId ?? ""} onChange={(e) => setForm({ ...form, profileImageId: e.target.value || null })}
              className="w-full px-3 py-2 rounded-md bg-transparent text-sm" style={{ border: "1px solid var(--color-border)" }}>
              <option value="">None</option>
              {mediaItems.map(m => (
                <option key={m.id} value={m.id}>{m.altText || m.url.split('/').pop()}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs text-gray-500 block mb-1">Resume File</label>
            <select value={form.resumeMediaId ?? ""} onChange={(e) => setForm({ ...form, resumeMediaId: e.target.value || null })}
              className="w-full px-3 py-2 rounded-md bg-transparent text-sm" style={{ border: "1px solid var(--color-border)" }}>
              <option value="">None</option>
              {mediaItems.map(m => (
                <option key={m.id} value={m.id}>{m.altText || m.url.split('/').pop()}</option>
              ))}
            </select>
          </div>
        </div>

        {error && <p style={{ color: "#f87171" }}>{error}</p>}
        <button type="submit" disabled={saving} className="px-6 py-3 rounded-full" style={{ background: "var(--color-primary)", color: "white" }}>
          {saving ? "Saving…" : "Save"}
        </button>
      </form>
    </>
  );
}
