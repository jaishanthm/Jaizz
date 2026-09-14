"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createResearch, updateResearch } from "@/lib/actions/research";

type ResearchData = {
  id?: string; title: string; slug: string; summary: string; content: string;
  researchType?: string | null; date: string; impact?: string | null; remediation?: string | null;
  targetContext?: string | null; methodology?: string | null; technicalDetails?: string | null;
  seoTitle?: string | null; seoDescription?: string | null;
};

export default function ResearchForm({ initial }: { initial?: ResearchData }) {
  const router = useRouter();
  const [form, setForm] = useState<ResearchData>(
    initial ?? { 
      title: "", slug: "", summary: "", content: "", researchType: "", 
      date: new Date().toISOString().slice(0, 10), impact: "", remediation: "",
      targetContext: "", methodology: "", technicalDetails: "", seoTitle: "", seoDescription: ""
    }
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function slugify(s: string) { return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""); }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    const payload = {
      title: form.title,
      slug: form.slug,
      summary: form.summary,
      content: form.content,
      researchType: form.researchType || undefined,
      date: new Date(form.date),
      impact: form.impact || undefined,
      remediation: form.remediation || undefined,
      targetContext: form.targetContext || undefined,
      methodology: form.methodology || undefined,
      technicalDetails: form.technicalDetails || undefined,
      seoTitle: form.seoTitle || undefined,
      seoDescription: form.seoDescription || undefined,
    };
    const res = initial?.id ? await updateResearch(initial.id, payload) : await createResearch(payload);
    setSaving(false);
    if (!res.success) { setError(res.error); return; }
    router.push("/admin/research");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="admin-card p-6 sm:p-8 space-y-6 max-w-3xl">
      {/* 01: Core Advisory Metadata */}
      <div className="space-y-4">
        <div className="text-xs font-mono text-zinc-400 uppercase tracking-wider pb-2 border-b border-white/[0.06] font-semibold">
          01 // Advisory Title & Target Context
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-mono text-zinc-300 uppercase tracking-wider">
              Advisory Title <span className="text-red-500">*</span>
            </label>
            <input
              required
              placeholder="e.g. Remote Code Execution via Deserialization"
              value={form.title}
              onChange={(e) =>
                setForm({
                  ...form,
                  title: e.target.value,
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
              placeholder="e.g. rce-deserialization"
              value={form.slug}
              onChange={(e) => setForm({ ...form, slug: e.target.value })}
              className="admin-input font-mono text-xs"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="space-y-1.5">
            <label className="block text-[11px] font-mono text-zinc-400 uppercase">Research Type</label>
            <input
              placeholder="e.g. Web Security, Active Directory"
              value={form.researchType ?? ""}
              onChange={(e) => setForm({ ...form, researchType: e.target.value })}
              className="admin-input text-xs"
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-[11px] font-mono text-zinc-400 uppercase">Target Context</label>
            <input
              placeholder="e.g. Enterprise CRM, Linux Kernel"
              value={form.targetContext ?? ""}
              onChange={(e) => setForm({ ...form, targetContext: e.target.value })}
              className="admin-input text-xs"
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-[11px] font-mono text-zinc-400 uppercase">Discovery Date *</label>
            <input
              required
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              className="admin-input text-xs font-mono"
            />
          </div>
        </div>
      </div>

      {/* 02: Abstract & Markdown Body */}
      <div className="space-y-4 pt-2">
        <div className="text-xs font-mono text-zinc-400 uppercase tracking-wider pb-2 border-b border-white/[0.06] font-semibold">
          02 // Summary & Technical Writeup
        </div>
        <div className="space-y-1.5">
          <label className="block text-xs font-mono text-zinc-300 uppercase tracking-wider">
            Executive Summary <span className="text-red-500">*</span>
          </label>
          <textarea
            required
            maxLength={500}
            rows={3}
            placeholder="High-level vulnerability overview, risk profile, and scope..."
            value={form.summary}
            onChange={(e) => setForm({ ...form, summary: e.target.value })}
            className="admin-input text-sm leading-relaxed"
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-mono text-zinc-300 uppercase tracking-wider">
            Full Vulnerability Analysis (Markdown) <span className="text-red-500">*</span>
          </label>
          <textarea
            required
            rows={12}
            placeholder="Write complete vulnerability breakdown, attack graph, proof-of-concept, and telemetry in Markdown..."
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
            className="admin-input font-mono text-xs leading-relaxed"
          />
        </div>
      </div>

      {/* 03: Attack Methodology & Exploit Mechanics */}
      <div className="space-y-4 pt-2">
        <div className="text-xs font-mono text-zinc-400 uppercase tracking-wider pb-2 border-b border-white/[0.06] font-semibold">
          03 // Methodology & Technical Breakdown
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-mono text-zinc-300 uppercase tracking-wider">Methodology</label>
            <textarea
              rows={4}
              placeholder="Testing vectors, tools employed, fuzzing scripts..."
              value={form.methodology ?? ""}
              onChange={(e) => setForm({ ...form, methodology: e.target.value })}
              className="admin-input text-xs"
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-xs font-mono text-zinc-300 uppercase tracking-wider">Technical Details</label>
            <textarea
              rows={4}
              placeholder="Underlying flaw, vulnerable functions, stack traces..."
              value={form.technicalDetails ?? ""}
              onChange={(e) => setForm({ ...form, technicalDetails: e.target.value })}
              className="admin-input font-mono text-xs"
            />
          </div>
        </div>
      </div>

      {/* 04: Impact & Remediation (Required for Coordinated Disclosure) */}
      <div className="space-y-4 pt-2">
        <div className="text-xs font-mono text-zinc-400 uppercase tracking-wider pb-2 border-b border-white/[0.06] font-semibold">
          04 // Impact Analysis & Defensive Remediation
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-mono text-zinc-300 uppercase tracking-wider">
              Business & System Impact
            </label>
            <textarea
              rows={3}
              placeholder="Confidentiality/Integrity/Availability impact (CIA triad)..."
              value={form.impact ?? ""}
              onChange={(e) => setForm({ ...form, impact: e.target.value })}
              className="admin-input text-xs"
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-xs font-mono text-zinc-300 uppercase tracking-wider">
              Recommended Remediation Patch
            </label>
            <textarea
              rows={3}
              placeholder="Vendor mitigation, patch instructions, configuration fix..."
              value={form.remediation ?? ""}
              onChange={(e) => setForm({ ...form, remediation: e.target.value })}
              className="admin-input text-xs"
            />
          </div>
        </div>
      </div>

      {/* 05: SEO Directives */}
      <div className="space-y-4 pt-2">
        <div className="text-xs font-mono text-zinc-400 uppercase tracking-wider pb-2 border-b border-white/[0.06] font-semibold">
          05 // Search Engine Directives
        </div>
        <div className="space-y-3">
          <div className="space-y-1.5">
            <label className="block text-xs font-mono text-zinc-300 uppercase tracking-wider">SEO Title (Max 60 chars)</label>
            <input
              maxLength={60}
              placeholder="Defaults to Advisory Title if omitted"
              value={form.seoTitle ?? ""}
              onChange={(e) => setForm({ ...form, seoTitle: e.target.value })}
              className="admin-input text-xs"
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-xs font-mono text-zinc-300 uppercase tracking-wider">SEO Description (Max 160 chars)</label>
            <textarea
              maxLength={160}
              rows={2}
              placeholder="Defaults to Executive Summary if omitted"
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
              <span>SAVING ADVISORY...</span>
            </>
          ) : initial ? (
            "COMMIT RESEARCH CHANGES"
          ) : (
            "STAGE AS DRAFT ADVISORY"
          )}
        </button>

        <button
          type="button"
          onClick={() => router.push("/admin/research")}
          className="admin-btn-secondary !py-3 !px-6 text-xs"
        >
          CANCEL
        </button>
      </div>

      <p className="text-[11px] font-mono text-zinc-500">
        Note: New research entries start as Draft. Advance through Research → Ready → Published from the list view.
      </p>
    </form>
  );
}
