"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateSiteSettings } from "@/lib/actions/site-settings";
import { useToast } from "@/components/admin/ToastProvider";

type Settings = { accentColor: string; glassIntensity: number; animationIntensity: number; threeDMode: "FULL" | "LITE" | "OFF" };

// Phase 9 §5 — live preview panel rendering a sample glass card + button
// using the current (unsaved) form values, not just raw sliders.
export default function ThemeClient({ initial }: { initial: Settings }) {
  const { toast } = useToast();
  const router = useRouter();
  const [form, setForm] = useState(initial);
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    const res = await updateSiteSettings(form);
    setSaving(false);
    if (!res.success) toast(res.error, "error");
    router.refresh();
  }

  const previewGlassBg = `rgba(13,18,36,${0.3 + (form.glassIntensity / 100) * 0.5})`;
  const previewBlur = `${(form.glassIntensity / 100) * 24}px`;

  return (
    <>
      <h1 className="text-2xl mb-6">Theme</h1>
      <div className="grid gap-8 lg:grid-cols-2 max-w-4xl">
        <div className="space-y-5">
          <label className="block text-sm">
            Accent color
            <input type="color" value={form.accentColor} onChange={(e) => setForm({ ...form, accentColor: e.target.value })} className="block mt-1 w-16 h-10" />
          </label>
          <label className="block text-sm">
            Glass intensity: {form.glassIntensity}
            <input type="range" min={0} max={100} value={form.glassIntensity} onChange={(e) => setForm({ ...form, glassIntensity: Number(e.target.value) })} className="block w-full" />
          </label>
          <label className="block text-sm">
            Animation intensity: {form.animationIntensity}
            <input type="range" min={0} max={100} value={form.animationIntensity} onChange={(e) => setForm({ ...form, animationIntensity: Number(e.target.value) })} className="block w-full" />
          </label>
          <label className="block text-sm">
            3D mode
            <select value={form.threeDMode} onChange={(e) => setForm({ ...form, threeDMode: e.target.value as Settings["threeDMode"] })} className="block mt-1 px-3 py-2 rounded-md bg-transparent" style={{ border: "1px solid var(--color-border)" }}>
              <option value="FULL">Full</option>
              <option value="LITE">Lite</option>
              <option value="OFF">Off</option>
            </select>
          </label>
          <button onClick={handleSave} disabled={saving} className="px-6 py-3 rounded-full" style={{ background: "var(--color-primary)", color: "white" }}>
            {saving ? "Saving…" : "Save theme"}
          </button>
        </div>

        <div>
          <p className="text-xs mb-2" style={{ color: "var(--color-text-muted)" }}>Live preview</p>
          <div
            className="p-6 rounded-2xl"
            style={{ background: previewGlassBg, border: "1px solid rgba(255,255,255,0.07)", backdropFilter: `blur(${previewBlur})` }}
          >
            <p className="mb-4">Sample card content</p>
            <button className="px-5 py-2 rounded-full" style={{ background: form.accentColor, color: "white" }}>
              Sample button
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
