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
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-4">
      <input required placeholder="Title" value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value, slug: initial ? form.slug : slugify(e.target.value) })}
        className="w-full px-4 py-3 rounded-md bg-transparent" style={{ border: "1px solid var(--color-border)" }} />
      <input required placeholder="slug" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })}
        className="w-full px-4 py-3 rounded-md bg-transparent" style={{ border: "1px solid var(--color-border)" }} />
      
      <div className="grid grid-cols-2 gap-3">
        <input placeholder="Research type" value={form.researchType ?? ""} onChange={(e) => setForm({ ...form, researchType: e.target.value })}
          className="px-3 py-2 rounded-md bg-transparent text-sm" style={{ border: "1px solid var(--color-border)" }} />
        <input required type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })}
          className="px-3 py-2 rounded-md bg-transparent text-sm" style={{ border: "1px solid var(--color-border)" }} />
      </div>

      <input placeholder="Target Context" value={form.targetContext ?? ""} onChange={(e) => setForm({ ...form, targetContext: e.target.value })}
        className="w-full px-4 py-3 rounded-md bg-transparent" style={{ border: "1px solid var(--color-border)" }} />

      <textarea required maxLength={500} placeholder="Summary" value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })}
        className="w-full px-4 py-3 rounded-md bg-transparent" style={{ border: "1px solid var(--color-border)" }} />
      <textarea required rows={10} placeholder="Content (markdown)" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })}
        className="w-full px-4 py-3 rounded-md bg-transparent font-mono text-sm" style={{ border: "1px solid var(--color-border)" }} />
      
      <textarea placeholder="Methodology" rows={4} value={form.methodology ?? ""} onChange={(e) => setForm({ ...form, methodology: e.target.value })}
        className="w-full px-4 py-3 rounded-md bg-transparent" style={{ border: "1px solid var(--color-border)" }} />
      <textarea placeholder="Technical Details" rows={4} value={form.technicalDetails ?? ""} onChange={(e) => setForm({ ...form, technicalDetails: e.target.value })}
        className="w-full px-4 py-3 rounded-md bg-transparent font-mono text-sm" style={{ border: "1px solid var(--color-border)" }} />
      
      <textarea placeholder="Impact" value={form.impact ?? ""} onChange={(e) => setForm({ ...form, impact: e.target.value })}
        className="w-full px-4 py-3 rounded-md bg-transparent" style={{ border: "1px solid var(--color-border)" }} />
      <textarea placeholder="Remediation" value={form.remediation ?? ""} onChange={(e) => setForm({ ...form, remediation: e.target.value })}
        className="w-full px-4 py-3 rounded-md bg-transparent" style={{ border: "1px solid var(--color-border)" }} />

      <div className="pt-4 border-t" style={{ borderColor: "var(--color-border)" }}>
        <h3 className="text-sm font-semibold mb-2">SEO</h3>
        <div className="space-y-3">
          <input maxLength={60} placeholder="SEO Title (max 60 chars)" value={form.seoTitle ?? ""} onChange={(e) => setForm({ ...form, seoTitle: e.target.value })} className="w-full px-3 py-2 rounded-md bg-transparent text-sm" style={{ border: "1px solid var(--color-border)" }} />
          <textarea maxLength={160} rows={2} placeholder="SEO Description (max 160 chars)" value={form.seoDescription ?? ""} onChange={(e) => setForm({ ...form, seoDescription: e.target.value })} className="w-full px-3 py-2 rounded-md bg-transparent text-sm" style={{ border: "1px solid var(--color-border)" }} />
        </div>
      </div>

      {error && <p style={{ color: "#f87171" }}>{error}</p>}
      <button type="submit" disabled={saving} className="px-6 py-3 rounded-full" style={{ background: "var(--color-primary)", color: "white" }}>
        {saving ? "Saving…" : initial ? "Save changes" : "Create (as Draft)"}
      </button>
      <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
        New entries start as Draft. Advance through Research → Ready → Published from the list view — publishing requires Impact or Remediation to be filled in.
      </p>
    </form>
  );
}
