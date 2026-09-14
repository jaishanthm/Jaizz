"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createBlogPost, updateBlogPost } from "@/lib/actions/blog";
import { useToast } from "@/components/admin/ToastProvider";

type PostData = {
  id?: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  content: string;
};

export default function BlogForm({ initial }: { initial?: PostData }) {
  const router = useRouter();
  const { toast } = useToast();
  const [form, setForm] = useState<PostData>(
    initial ?? { title: "", slug: "", excerpt: "", content: "" }
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<"write" | "preview">("write");

  function slugify(s: string) {
    return s
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }

  const wordCount = form.content.trim() ? form.content.trim().split(/\s+/).length : 0;
  const readingTime = Math.max(1, Math.round(wordCount / 200));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const payload = {
      title: form.title,
      slug: form.slug,
      excerpt: form.excerpt || undefined,
      content: form.content,
    };

    const res = initial?.id
      ? await updateBlogPost(initial.id, payload)
      : await createBlogPost(payload);

    setSaving(false);
    if (!res.success) {
      setError(res.error || "Failed to save blog post");
      toast(res.error || "Operation failed", "error");
      return;
    }

    toast(initial?.id ? "Article updated successfully" : "Article drafted successfully", "success");
    router.push("/admin/blog");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="admin-card p-6 max-w-4xl space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
        <div>
          <span className="text-[11px] font-mono tracking-widest text-red-500 uppercase font-semibold">
            {initial?.id ? "LOG // EDIT DISCLOSURE / ARTICLE" : "LOG // NEW PUBLICATION DRAFT"}
          </span>
          <h2 className="text-xl font-bold text-white tracking-tight mt-0.5">
            {initial?.id ? form.title || "Edit Article" : "Compose Security Briefing"}
          </h2>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-zinc-400 bg-white/[0.04] px-2.5 py-1 rounded border border-white/[0.08]">
            {wordCount} WORDS &bull; ~{readingTime} MIN READ
          </span>
        </div>
      </div>

      <div className="space-y-4">
        {/* Title */}
        <div className="space-y-1.5">
          <label className="block text-xs font-mono font-medium text-zinc-300 uppercase tracking-wider">
            Article Title <span className="text-red-500 ml-1">*</span>
          </label>
          <input
            required
            placeholder="e.g. Reverse Engineering Firmware on Embedded IoT..."
            value={form.title}
            onChange={(e) =>
              setForm({
                ...form,
                title: e.target.value,
                slug: initial?.id ? form.slug : slugify(e.target.value),
              })
            }
            className="admin-input text-base font-medium"
          />
        </div>

        {/* Slug */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center">
            <label className="block text-xs font-mono font-medium text-zinc-300 uppercase tracking-wider">
              URL Slug <span className="text-red-500 ml-1">*</span>
            </label>
            <span className="text-[11px] font-mono text-zinc-500">
              Target URL: /blog/<span className="text-zinc-300">{form.slug || "your-slug"}</span>
            </span>
          </div>
          <input
            required
            placeholder="reverse-engineering-firmware-embedded-iot"
            value={form.slug}
            onChange={(e) => setForm({ ...form, slug: slugify(e.target.value) })}
            className="admin-input font-mono text-xs text-red-400"
          />
        </div>

        {/* Excerpt */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center">
            <label className="block text-xs font-mono font-medium text-zinc-300 uppercase tracking-wider">
              Summary / Excerpt
            </label>
            <span className={`text-[11px] font-mono ${form.excerpt && form.excerpt.length > 280 ? "text-amber-400" : "text-zinc-500"}`}>
              {form.excerpt?.length || 0}/300
            </span>
          </div>
          <textarea
            maxLength={300}
            rows={2}
            placeholder="A tactical summary for the blog card and search index snippets..."
            value={form.excerpt ?? ""}
            onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
            className="admin-input text-sm leading-relaxed"
          />
        </div>

        {/* Markdown Content */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center">
            <label className="block text-xs font-mono font-medium text-zinc-300 uppercase tracking-wider">
              Article Content (Markdown) <span className="text-red-500 ml-1">*</span>
            </label>
            <div className="flex items-center gap-1 bg-[#121217] p-0.5 rounded-lg border border-white/[0.08]">
              <button
                type="button"
                onClick={() => setActiveTab("write")}
                className={`px-3 py-1 rounded text-xs font-mono transition-colors ${
                  activeTab === "write"
                    ? "bg-red-500/20 text-red-400 border border-red-500/30 font-semibold"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                EDITOR
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("preview")}
                className={`px-3 py-1 rounded text-xs font-mono transition-colors ${
                  activeTab === "preview"
                    ? "bg-red-500/20 text-red-400 border border-red-500/30 font-semibold"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                PREVIEW
              </button>
            </div>
          </div>

          {activeTab === "write" ? (
            <textarea
              required
              rows={16}
              placeholder="# Introduction&#10;&#10;Technical vulnerability analysis and write-up details..."
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              className="admin-input font-mono text-sm leading-relaxed text-zinc-200"
            />
          ) : (
            <div className="admin-input min-h-[384px] p-4 font-mono text-sm leading-relaxed overflow-y-auto whitespace-pre-wrap text-zinc-300 bg-[#0d0d12]/70">
              {form.content || <span className="text-zinc-600 italic">No content typed yet. Type in the editor tab to preview.</span>}
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-red-950/40 border border-red-500/30 text-xs font-mono text-red-300 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
          <span>{error}</span>
        </div>
      )}

      <div className="flex items-center justify-between pt-4 border-t border-white/[0.08]">
        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={saving}
            className="admin-btn-primary"
          >
            {saving ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>COMMITTING...</span>
              </>
            ) : initial?.id ? (
              "UPDATE ARTICLE"
            ) : (
              "SAVE AS DRAFT"
            )}
          </button>

          <Link
            href="/admin/blog"
            className="admin-btn-secondary"
          >
            CANCEL
          </Link>
        </div>

        <p className="text-[11px] font-mono text-zinc-500">
          * Publishing status is managed directly from the articles list.
        </p>
      </div>
    </form>
  );
}
