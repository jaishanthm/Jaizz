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
    <form onSubmit={handleSubmit} className="max-w-xl space-y-4">
      {fields.map((f) => (
        <div key={f.key}>
          {f.type === "textarea" ? (
            <textarea
              required={f.required}
              placeholder={f.label}
              value={values[f.key] ?? ""}
              onChange={(e) => setValues({ ...values, [f.key]: e.target.value })}
              className="w-full px-4 py-3 rounded-md bg-transparent"
              style={{ border: "1px solid var(--color-border)" }}
            />
          ) : f.type === "select" ? (
            <select
              required={f.required}
              value={values[f.key] ?? ""}
              onChange={(e) => setValues({ ...values, [f.key]: e.target.value })}
              className="w-full px-4 py-3 rounded-md bg-transparent"
              style={{ border: "1px solid var(--color-border)" }}
            >
              <option value="" disabled>{f.label}</option>
              {f.options?.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          ) : (
            <input
              type={f.type === "date" ? "date" : f.type === "url" ? "url" : "text"}
              required={f.required}
              placeholder={f.label}
              value={values[f.key] ?? ""}
              onChange={(e) => setValues({ ...values, [f.key]: e.target.value })}
              className="w-full px-4 py-3 rounded-md bg-transparent"
              style={{ border: "1px solid var(--color-border)" }}
            />
          )}
        </div>
      ))}
      {error && <p style={{ color: "#f87171" }}>{error}</p>}
      <button type="submit" disabled={saving} className="px-6 py-3 rounded-full" style={{ background: "var(--color-primary)", color: "white" }}>
        {saving ? "Saving…" : id ? "Save changes" : "Create"}
      </button>
    </form>
  );
}
