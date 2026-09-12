"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createProject, updateProject } from "@/lib/actions/projects";

type ProjectData = {
  id?: string;
  name: string;
  slug: string;
  shortDescription: string;
  fullDescription?: string | null;
  githubUrl?: string | null;
  liveUrl?: string | null;
  docsUrl?: string | null;
  status: "IN_PROGRESS" | "COMPLETED" | "ARCHIVED" | "MAINTAINED";
  category?: string | null;
  startDate?: Date | null;
  endDate?: Date | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
};

// Shared by /admin/projects/new and /admin/projects/[id] — Phase 9 §4's
// form pattern: title first, core content, then (not yet built —
// Stage 5 dependency) media/SEO/visibility sidebar.

export default function ProjectForm({ initial }: { initial?: ProjectData }) {
  const router = useRouter();
  const [form, setForm] = useState<ProjectData>(
    initial ?? {
      name: "", slug: "", shortDescription: "", fullDescription: "",
      githubUrl: "", liveUrl: "", docsUrl: "", status: "COMPLETED",
      category: "", startDate: null, endDate: null, seoTitle: "", seoDescription: ""
    }
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function slugify(name: string) {
    return name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    const payload = {
      name: form.name, slug: form.slug, shortDescription: form.shortDescription,
      fullDescription: form.fullDescription || undefined,
      githubUrl: form.githubUrl || "", liveUrl: form.liveUrl || "", docsUrl: form.docsUrl || "",
      status: form.status,
      category: form.category || undefined,
      startDate: form.startDate ? new Date(form.startDate) : undefined,
      endDate: form.endDate ? new Date(form.endDate) : undefined,
      seoTitle: form.seoTitle || undefined,
      seoDescription: form.seoDescription || undefined,
    };
    const res = initial?.id
      ? await updateProject(initial.id, payload)
      : await createProject(payload);
    setSaving(false);
    if (!res.success) { setError(res.error); return; }
    router.push("/admin/projects");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <input
          required placeholder="Project name" value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value, slug: initial ? form.slug : slugify(e.target.value) })}
          className="w-full px-4 py-3 rounded-md bg-transparent" style={{ border: "1px solid var(--color-border)" }}
        />
        <input
          required placeholder="slug" value={form.slug}
          onChange={(e) => setForm({ ...form, slug: e.target.value })}
          className="w-full px-4 py-3 rounded-md bg-transparent" style={{ border: "1px solid var(--color-border)" }}
        />
      </div>
      <textarea
        required maxLength={300} placeholder="Short description (shown on cards)" value={form.shortDescription}
        onChange={(e) => setForm({ ...form, shortDescription: e.target.value })}
        className="w-full px-4 py-3 rounded-md bg-transparent" style={{ border: "1px solid var(--color-border)" }}
      />
      <textarea
        placeholder="Full description (markdown)" rows={8} value={form.fullDescription ?? ""}
        onChange={(e) => setForm({ ...form, fullDescription: e.target.value })}
        className="w-full px-4 py-3 rounded-md bg-transparent font-mono text-sm" style={{ border: "1px solid var(--color-border)" }}
      />
      <div className="grid grid-cols-3 gap-3">
        <input placeholder="GitHub URL" value={form.githubUrl ?? ""} onChange={(e) => setForm({ ...form, githubUrl: e.target.value })} className="px-3 py-2 rounded-md bg-transparent text-sm" style={{ border: "1px solid var(--color-border)" }} />
        <input placeholder="Live URL" value={form.liveUrl ?? ""} onChange={(e) => setForm({ ...form, liveUrl: e.target.value })} className="px-3 py-2 rounded-md bg-transparent text-sm" style={{ border: "1px solid var(--color-border)" }} />
        <input placeholder="Docs URL" value={form.docsUrl ?? ""} onChange={(e) => setForm({ ...form, docsUrl: e.target.value })} className="px-3 py-2 rounded-md bg-transparent text-sm" style={{ border: "1px solid var(--color-border)" }} />
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as ProjectData["status"] })} className="px-3 py-2 rounded-md bg-transparent text-sm" style={{ border: "1px solid var(--color-border)" }}>
          <option value="IN_PROGRESS">In progress</option>
          <option value="COMPLETED">Completed</option>
          <option value="MAINTAINED">Maintained</option>
          <option value="ARCHIVED">Archived</option>
        </select>
        <input placeholder="Category" value={form.category ?? ""} onChange={(e) => setForm({ ...form, category: e.target.value })} className="px-3 py-2 rounded-md bg-transparent text-sm" style={{ border: "1px solid var(--color-border)" }} />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-gray-500 block mb-1">Start Date</label>
          <input type="date" value={form.startDate ? new Date(form.startDate).toISOString().slice(0, 10) : ""} onChange={(e) => setForm({ ...form, startDate: e.target.value ? new Date(e.target.value) : null })} className="w-full px-3 py-2 rounded-md bg-transparent text-sm" style={{ border: "1px solid var(--color-border)" }} />
        </div>
        <div>
          <label className="text-xs text-gray-500 block mb-1">End Date</label>
          <input type="date" value={form.endDate ? new Date(form.endDate).toISOString().slice(0, 10) : ""} onChange={(e) => setForm({ ...form, endDate: e.target.value ? new Date(e.target.value) : null })} className="w-full px-3 py-2 rounded-md bg-transparent text-sm" style={{ border: "1px solid var(--color-border)" }} />
        </div>
      </div>

      <div className="pt-4 border-t" style={{ borderColor: "var(--color-border)" }}>
        <h3 className="text-sm font-semibold mb-2">SEO</h3>
        <div className="space-y-3">
          <input maxLength={60} placeholder="SEO Title (max 60 chars)" value={form.seoTitle ?? ""} onChange={(e) => setForm({ ...form, seoTitle: e.target.value })} className="w-full px-3 py-2 rounded-md bg-transparent text-sm" style={{ border: "1px solid var(--color-border)" }} />
          <textarea maxLength={160} rows={2} placeholder="SEO Description (max 160 chars)" value={form.seoDescription ?? ""} onChange={(e) => setForm({ ...form, seoDescription: e.target.value })} className="w-full px-3 py-2 rounded-md bg-transparent text-sm" style={{ border: "1px solid var(--color-border)" }} />
        </div>
      </div>

      {error && <p style={{ color: "#f87171" }}>{error}</p>}
      <button type="submit" disabled={saving} className="px-6 py-3 rounded-full" style={{ background: "var(--color-primary)", color: "white" }}>
        {saving ? "Saving…" : initial ? "Save changes" : "Create project"}
      </button>
      <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
        New projects are created hidden — toggle visibility from the list once it&apos;s ready.
      </p>
    </form>
  );
}
