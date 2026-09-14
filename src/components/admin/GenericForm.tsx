"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export type FieldConfig = {
  key: string;
  label: string;
  type: "text" | "textarea" | "date" | "url" | "select";
  required?: boolean;
  options?: readonly string[] | string[];
};

// Shared by the four plain-CRUD entities (Certifications, Achievements,
// Education, Experience) — renders inputs from a field-config array instead
// of four near-identical hand-written forms. Fields needing something a
// generic text/date/url/textarea input can't express (Experience's
// `current` checkbox mutual-exclusivity with endDate, for instance) are
// layered on top per-entity rather than forced into this component —
// see ExperienceForm's wrapper usage.
export default function GenericForm({
  fields,
  initial,
  backHref,
  onCreate,
  onUpdate,
  id,
}: {
  fields: FieldConfig[];
  initial?: Record<string, string>;
  backHref: string;
  onCreate?: (data: any) => Promise<{ success: boolean; error?: string; data?: { id: string } }>;
  onUpdate?: (id: string, data: any) => Promise<{ success: boolean; error?: string }>;
  id?: string;
}) {
  const router = useRouter();
  const [values, setValues] = useState<Record<string, string>>(
    initial ?? Object.fromEntries(fields.map((f) => [f.key, ""]))
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    const res = id && onUpdate ? await onUpdate(id, values) : onCreate ? await onCreate(values) : null;
    setSaving(false);
    if (!res || !res.success) { setError(res?.error ?? "Something went wrong."); return; }
    router.push(backHref);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="admin-card p-6 max-w-2xl space-y-5">
      <div className="space-y-4">
        {fields.map((f) => (
          <div key={f.key} className="space-y-1.5">
            <label className="block text-xs font-mono font-medium text-zinc-300 uppercase tracking-wider">
              {f.label}
              {f.required && <span className="text-red-500 ml-1">*</span>}
            </label>

            {f.type === "textarea" ? (
              <textarea
                required={f.required}
                placeholder={`Enter ${f.label.toLowerCase()}...`}
                rows={4}
                value={values[f.key] ?? ""}
                onChange={(e) => setValues({ ...values, [f.key]: e.target.value })}
                className="admin-input font-mono text-sm leading-relaxed"
              />
            ) : f.type === "select" ? (
              <select
                required={f.required}
                value={values[f.key] ?? ""}
                onChange={(e) => setValues({ ...values, [f.key]: e.target.value })}
                className="admin-input font-mono text-sm bg-[#111116]"
              >
                <option value="" disabled>Select {f.label}...</option>
                {f.options?.map((opt) => (
                  <option key={opt} value={opt} className="bg-[#111116] text-white">
                    {opt}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type={f.type === "date" ? "date" : f.type === "url" ? "url" : "text"}
                required={f.required}
                placeholder={`Enter ${f.label.toLowerCase()}...`}
                value={values[f.key] ?? ""}
                onChange={(e) => setValues({ ...values, [f.key]: e.target.value })}
                className="admin-input text-sm"
              />
            )}
          </div>
        ))}
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-red-950/40 border border-red-500/30 text-xs font-mono text-red-300 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
          <span>{error}</span>
        </div>
      )}

      <div className="flex items-center gap-3 pt-3 border-t border-white/[0.08]">
        <button
          type="submit"
          disabled={saving}
          className="admin-btn-primary"
        >
          {saving ? (
            <>
              <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>SAVING...</span>
            </>
          ) : id ? (
            "SAVE CHANGES"
          ) : (
            "CREATE ENTRY"
          )}
        </button>

        <button
          type="button"
          onClick={() => router.push(backHref)}
          className="admin-btn-secondary"
        >
          CANCEL
        </button>
      </div>
    </form>
  );
}
