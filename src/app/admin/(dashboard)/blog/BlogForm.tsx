"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createBlogPost, updateBlogPost } from "@/lib/actions/blog";

type PostData = { id?: string; title: string; slug: string; excerpt?: string | null; content: string };

export default function BlogForm({ initial }: { initial?: PostData }) {
  const router = useRouter();
  const [form, setForm] = useState<PostData>(initial ?? { title: "", slug: "", excerpt: "", content: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function slugify(s: string) { return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""); }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true); setError("");
    const payload = { title: form.title, slug: form.slug, excerpt: form.excerpt || undefined, content: form.content };
    const res = initial?.id ? await updateBlogPost(initial.id, payload) : await createBlogPost(payload);
    setSaving(false);
    if (!res.success) { setError(res.error); return; }
    router.push("/admin/blog");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-4">
      <input required placeholder="Title" value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value, slug: initial ? form.slug : slugify(e.target.value) })}
        className="w-full px-4 py-3 rounded-md bg-transparent" style={{ border: "1px solid var(--color-border)" }} />
      <input required placeholder="slug" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })}
        className="w-full px-4 py-3 rounded-md bg-transparent" style={{ border: "1px solid var(--color-border)" }} />
      <textarea maxLength={300} placeholder="Excerpt" value={form.excerpt ?? ""} onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
        className="w-full px-4 py-3 rounded-md bg-transparent" style={{ border: "1px solid var(--color-border)" }} />
      <textarea required rows={14} placeholder="Content (markdown)" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })}
        className="w-full px-4 py-3 rounded-md bg-transparent font-mono text-sm" style={{ border: "1px solid var(--color-border)" }} />
      {error && <p style={{ color: "#f87171" }}>{error}</p>}
      <button type="submit" disabled={saving} className="px-6 py-3 rounded-full" style={{ background: "var(--color-primary)", color: "white" }}>
        {saving ? "Saving…" : initial ? "Save changes" : "Create (as Draft)"}
      </button>
      <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>Publish from the list view. Reading time is calculated automatically.</p>
    </form>
  );
}
