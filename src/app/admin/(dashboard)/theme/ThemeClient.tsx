"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { updateSiteSettings } from "@/lib/actions/site-settings";
import { useToast } from "@/components/admin/ToastProvider";
import { applyThemeToDom } from "@/lib/theme-utils";

type Settings = {
  accentColor: string;
  glassIntensity: number;
  animationIntensity: number;
  threeDMode: "FULL" | "LITE" | "OFF";
};

const COLOR_PRESETS = [
  { name: "Offensive Red", hex: "#EF4444", desc: "Red Team Signal" },
  { name: "Deep Crimson", hex: "#E11D48", desc: "Ambient Rose" },
  { name: "Cyber Amber", hex: "#F59E0B", desc: "Hazard Telemetry" },
  { name: "Emerald Matrix", hex: "#10B981", desc: "Terminal Green" },
  { name: "Cobalt Recon", hex: "#3B82F6", desc: "Deep Spec Blue" },
  { name: "Tactical Violet", hex: "#8B5CF6", desc: "Spectrum Purple" },
];

export default function ThemeClient({ initial }: { initial: Settings }) {
  const { toast } = useToast();
  const router = useRouter();
  const [form, setForm] = useState(initial);
  const [saving, setSaving] = useState(false);

  // Sync state when server props update
  useEffect(() => {
    setForm(initial);
  }, [initial.accentColor, initial.glassIntensity, initial.animationIntensity, initial.threeDMode]);

  async function handleSave() {
    setSaving(true);
    const res = await updateSiteSettings(form);
    setSaving(false);
    if (!res.success) {
      toast(res.error || "Failed to save theme settings", "error");
    } else {
      if (res.data) {
        setForm(res.data);
        applyThemeToDom(res.data);
      } else {
        applyThemeToDom(form);
      }
      toast("Theme & rendering pipeline deployed successfully!", "success");
      router.refresh();
    }
  }

  const previewGlassBg = `rgba(13, 13, 18, ${0.4 + (form.glassIntensity / 100) * 0.5})`;
  const previewBlur = `${(form.glassIntensity / 100) * 24}px`;

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/[0.08]">
        <div>
          <span className="text-[11px] font-mono tracking-widest text-red-500 uppercase font-semibold">
            ENGINE // VISUAL TELEMETRY & 3D CONFIGURATION
          </span>
          <h1 className="text-2xl font-bold text-white tracking-tight mt-0.5">
            Theme & Rendering Pipeline
          </h1>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="admin-btn-primary self-start sm:self-auto flex items-center gap-2 transition-all hover:scale-[1.02]"
          style={{
            borderColor: form.accentColor,
            boxShadow: `0 0 16px ${form.accentColor}33`,
          }}
        >
          {saving ? (
            <>
              <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>DEPLOYING SHADERS...</span>
            </>
          ) : (
            <>
              <span>⚡</span>
              <span>DEPLOY THEME CHANGES</span>
            </>
          )}
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Controls Column */}
        <div className="admin-card p-6 space-y-6">
          <h3 className="text-xs font-mono text-zinc-300 font-semibold uppercase tracking-wider pb-3 border-b border-white/[0.08]">
            ENGINE PARAMETERS
          </h3>

          {/* Accent Color */}
          <div className="space-y-3">
            <label className="block text-xs font-mono font-medium text-zinc-300 uppercase tracking-wider">
              Primary Signal Accent Color
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={form.accentColor}
                onChange={(e) => setForm({ ...form, accentColor: e.target.value })}
                className="w-12 h-10 rounded-lg bg-black border border-white/[0.1] cursor-pointer p-1"
              />
              <input
                type="text"
                value={form.accentColor.toUpperCase()}
                onChange={(e) => setForm({ ...form, accentColor: e.target.value })}
                className="admin-input font-mono text-xs max-w-[140px] uppercase"
              />
              <span className="text-xs font-mono text-zinc-500">
                Recommended: #EF4444 (Offensive Red)
              </span>
            </div>

            {/* Quick Color Preset Pills */}
            <div className="space-y-1.5 pt-1">
              <div className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">
                TACTICAL COLOR PRESETS:
              </div>
              <div className="grid grid-cols-3 gap-2">
                {COLOR_PRESETS.map((p) => {
                  const isSelected = form.accentColor.toLowerCase() === p.hex.toLowerCase();
                  return (
                    <button
                      key={p.hex}
                      type="button"
                      onClick={() => setForm({ ...form, accentColor: p.hex })}
                      className={`p-2 rounded-lg border text-left font-mono transition-all flex items-center gap-2 ${
                        isSelected
                          ? "bg-white/[0.08] border-white/40 text-white shadow-sm"
                          : "bg-[#111116] border-white/[0.06] text-zinc-400 hover:border-white/20"
                      }`}
                    >
                      <span
                        className="w-3 h-3 rounded-full shrink-0 border border-white/20"
                        style={{ background: p.hex }}
                      />
                      <div className="min-w-0">
                        <div className="text-[11px] font-semibold truncate leading-tight">{p.name}</div>
                        <div className="text-[9px] text-zinc-400 font-mono">{p.hex}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Glass Intensity */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="block text-xs font-mono font-medium text-zinc-300 uppercase tracking-wider">
                Glassmorphism / Backdrop Opacity
              </label>
              <span className="text-xs font-mono text-red-400 font-bold">
                {form.glassIntensity}%
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={form.glassIntensity}
              onChange={(e) => setForm({ ...form, glassIntensity: Number(e.target.value) })}
              className="w-full accent-red-500 h-1.5 bg-zinc-800 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-zinc-600">
              <span>0% (Opaque)</span>
              <span>50% (Balanced)</span>
              <span>100% (High Blur Frosted)</span>
            </div>
          </div>

          {/* Animation Intensity */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="block text-xs font-mono font-medium text-zinc-300 uppercase tracking-wider">
                Animation & Transition Velocity
              </label>
              <span className="text-xs font-mono text-red-400 font-bold">
                {form.animationIntensity}%
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={form.animationIntensity}
              onChange={(e) => setForm({ ...form, animationIntensity: Number(e.target.value) })}
              className="w-full accent-red-500 h-1.5 bg-zinc-800 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-zinc-600">
              <span>0% (Reduced Motion)</span>
              <span>100% (Full Fluidity)</span>
            </div>
          </div>

          {/* 3D Background Mode */}
          <div className="space-y-2">
            <label className="block text-xs font-mono font-medium text-zinc-300 uppercase tracking-wider">
              Three.js 3D Background Engine
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: "FULL", label: "FULL 3D", desc: "Live Torus + Particles" },
                { id: "LITE", label: "LITE", desc: "Low GPU Wireframe" },
                { id: "OFF", label: "DISABLED", desc: "Zero WebGL Usage" },
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setForm({ ...form, threeDMode: m.id as Settings["threeDMode"] })}
                  className={`p-3 rounded-lg border text-left font-mono transition-all ${
                    form.threeDMode === m.id
                      ? "bg-white/[0.08] border-white/40 text-white shadow-sm"
                      : "bg-[#111116] border-white/[0.08] text-zinc-400 hover:border-white/[0.2]"
                  }`}
                  style={
                    form.threeDMode === m.id
                      ? {
                          borderColor: form.accentColor,
                          backgroundColor: `${form.accentColor}18`,
                          boxShadow: `0 0 12px ${form.accentColor}33`,
                        }
                      : {}
                  }
                >
                  <div className="text-xs font-bold">{m.label}</div>
                  <div className="text-[10px] text-zinc-500 mt-0.5">{m.desc}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Live Preview Column */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider">
              REAL-TIME COMPOSITING PREVIEW
            </span>
            <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              LIVE SHADER ACTIVE
            </span>
          </div>

          {/* Simulated Portfolio Surface */}
          <div className="p-8 rounded-2xl bg-[#09090b] border border-white/[0.08] relative overflow-hidden flex flex-col justify-center min-h-[360px]">
            {/* Background grid simulation */}
            <div
              className="absolute inset-0 opacity-15 pointer-events-none"
              style={{
                backgroundImage: `radial-gradient(${form.accentColor} 1px, transparent 1px)`,
                backgroundSize: "24px 24px",
              }}
            />

            {/* Glowing orb */}
            <div
              className="absolute -top-12 -right-12 w-48 h-48 rounded-full blur-3xl pointer-events-none opacity-40"
              style={{ background: form.accentColor }}
            />

            {/* Preview Tactical Card */}
            <div
              className="relative p-6 rounded-xl border transition-all duration-300"
              style={{
                background: previewGlassBg,
                borderColor: "rgba(255, 255, 255, 0.12)",
                backdropFilter: `blur(${previewBlur})`,
                boxShadow: `0 8px 32px 0 rgba(0, 0, 0, 0.37)`,
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ background: form.accentColor }}
                  />
                  <span className="text-xs font-mono tracking-wider font-semibold text-white">
                    NODE // SECURITY RECON
                  </span>
                </div>
                <span className="text-[10px] font-mono text-zinc-400 bg-white/[0.06] px-2 py-0.5 rounded border border-white/[0.08]">
                  PORT 443
                </span>
              </div>

              <p className="text-sm text-zinc-300 font-sans mb-5 leading-relaxed">
                Demonstrating dynamic surface refraction, glass blur coefficient, and signal accent mapping under active rendering parameters.
              </p>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  className="px-4 py-2 rounded-lg text-xs font-mono font-semibold text-white shadow-lg transition-transform hover:scale-105"
                  style={{
                    background: form.accentColor,
                    boxShadow: `0 0 16px ${form.accentColor}55`,
                  }}
                >
                  TRIGGER EXPLOIT ↗
                </button>
                <span className="text-xs font-mono text-zinc-400">
                  3D: <span className="text-white">{form.threeDMode}</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
