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
    <form onSubmit={handleSubmit} className="admin-card p-6 sm:p-8 space-y-6 max-w-3xl">
      {/* 01: Core Metadata */}
      <div className="space-y-4">
        <div className="text-xs font-mono text-zinc-400 uppercase tracking-wider pb-2 border-b border-white/[0.06] font-semibold">
          01 // Project Title & URL Slug
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-mono text-zinc-300 uppercase tracking-wider">
              Project Name <span className="text-red-500">*</span>
            </label>
            <input
              required
              placeholder="e.g. Horizon Attack Surface Engine"
              value={form.name}
              onChange={(e) =>
                setForm({
                  ...form,
                  name: e.target.value,
                  slug: initial ? form.slug : slugify(e.target.value),
                })
              }
              className="admin-input font-medium"
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-xs font-mono text-zinc-300 uppercase tracking-wider">
              Slug (URL Identifier) <span className="text-red-500">*</span>
            </label>
            <input
              required
              placeholder="e.g. horizon"
              value={form.slug}
              onChange={(e) => setForm({ ...form, slug: e.target.value })}
              className="admin-input font-mono text-xs"
            />
          </div>
        </div>
      </div>

      {/* 02: Descriptions */}
      <div className="space-y-4 pt-2">
        <div className="text-xs font-mono text-zinc-400 uppercase tracking-wider pb-2 border-b border-white/[0.06] font-semibold">
          02 // Project Descriptions
        </div>
        <div className="space-y-1.5">
          <label className="block text-xs font-mono text-zinc-300 uppercase tracking-wider">
            Short Description (Card Abstract) <span className="text-red-500">*</span>
          </label>
          <textarea
            required
            maxLength={300}
            rows={2}
            placeholder="High-level summary displayed on homepage and project cards..."
            value={form.shortDescription}
            onChange={(e) => setForm({ ...form, shortDescription: e.target.value })}
            className="admin-input text-sm leading-relaxed"
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-mono text-zinc-300 uppercase tracking-wider">
            Full Description (Markdown Specification)
          </label>
          <textarea
            placeholder="Write full technical documentation, architecture, exploit flow, and setup guide in Markdown..."
            rows={10}
            value={form.fullDescription ?? ""}
            onChange={(e) => setForm({ ...form, fullDescription: e.target.value })}
            className="admin-input font-mono text-xs leading-relaxed"
          />
        </div>
      </div>

      {/* 03: Status, Category & Dates */}
      <div className="space-y-4 pt-2">
        <div className="text-xs font-mono text-zinc-400 uppercase tracking-wider pb-2 border-b border-white/[0.06] font-semibold">
          03 // Lifecycle Status & Category
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-mono text-zinc-300 uppercase tracking-wider">Project Status</label>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value as ProjectData["status"] })}
              className="admin-input font-mono text-xs bg-[#111116]"
            >
              <option value="IN_PROGRESS">IN_PROGRESS</option>
              <option value="COMPLETED">COMPLETED</option>
              <option value="MAINTAINED">MAINTAINED</option>
              <option value="ARCHIVED">ARCHIVED</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="block text-xs font-mono text-zinc-300 uppercase tracking-wider">Category Tag</label>
            <input
              placeholder="e.g. Red Team Automation, Network Security"
              value={form.category ?? ""}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="admin-input text-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-mono text-zinc-300 uppercase tracking-wider">Start Date</label>
            <input
              type="date"
              value={form.startDate ? new Date(form.startDate).toISOString().slice(0, 10) : ""}
              onChange={(e) =>
                setForm({ ...form, startDate: e.target.value ? new Date(e.target.value) : null })
              }
              className="admin-input text-xs font-mono"
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-xs font-mono text-zinc-300 uppercase tracking-wider">End Date</label>
            <input
              type="date"
              value={form.endDate ? new Date(form.endDate).toISOString().slice(0, 10) : ""}
              onChange={(e) =>
                setForm({ ...form, endDate: e.target.value ? new Date(e.target.value) : null })
              }
              className="admin-input text-xs font-mono"
            />
          </div>
        </div>
      </div>

      {/* 04: External Links */}
      <div className="space-y-4 pt-2">
        <div className="text-xs font-mono text-zinc-400 uppercase tracking-wider pb-2 border-b border-white/[0.06] font-semibold">
          04 // External Repositories & Deployments
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="space-y-1.5">
            <label className="block text-[11px] font-mono text-zinc-400 uppercase">GitHub Repository</label>
            <input
              type="url"
              placeholder="https://github.com/..."
              value={form.githubUrl ?? ""}
              onChange={(e) => setForm({ ...form, githubUrl: e.target.value })}
              className="admin-input text-xs font-mono"
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-[11px] font-mono text-zinc-400 uppercase">Live Deployment</label>
            <input
              type="url"
              placeholder="https://..."
              value={form.liveUrl ?? ""}
              onChange={(e) => setForm({ ...form, liveUrl: e.target.value })}
              className="admin-input text-xs font-mono"
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-[11px] font-mono text-zinc-400 uppercase">Documentation URL</label>
            <input
              type="url"
              placeholder="https://docs..."
              value={form.docsUrl ?? ""}
              onChange={(e) => setForm({ ...form, docsUrl: e.target.value })}
              className="admin-input text-xs font-mono"
            />
          </div>
        </div>
      </div>

      {/* 05: SEO Overrides */}
      <div className="space-y-4 pt-2">
        <div className="text-xs font-mono text-zinc-400 uppercase tracking-wider pb-2 border-b border-white/[0.06] font-semibold">
          05 // Search Engine Metadata
        </div>
        <div className="space-y-3">
          <div className="space-y-1.5">
            <label className="block text-xs font-mono text-zinc-300 uppercase tracking-wider">
              Custom SEO Title (Max 60 chars)
            </label>
            <input
              maxLength={60}
              placeholder="Defaults to Project Name if omitted"
              value={form.seoTitle ?? ""}
              onChange={(e) => setForm({ ...form, seoTitle: e.target.value })}
              className="admin-input text-xs"
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-xs font-mono text-zinc-300 uppercase tracking-wider">
              Custom Meta Description (Max 160 chars)
            </label>
            <textarea
              maxLength={160}
              rows={2}
              placeholder="Defaults to Short Description if omitted"
              value={form.seoDescription ?? ""}
              onChange={(e) => setForm({ ...form, seoDescription: e.target.value })}
              className="admin-input text-xs"
            />
          </div>
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
              <span>SAVING PROJECT...</span>
            </>
          ) : initial ? (
            "COMMIT PROJECT CHANGES"
          ) : (
            "CREATE PROJECT ENTRY"
          )}
        </button>

        <button
          type="button"
          onClick={() => router.push("/admin/projects")}
          className="admin-btn-secondary !py-3 !px-6 text-xs"
        >
          CANCEL
        </button>
      </div>
    </form>
  );
}
