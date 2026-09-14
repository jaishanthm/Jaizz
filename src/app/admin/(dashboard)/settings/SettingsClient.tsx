"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { setMaintenanceMode } from "@/lib/actions/site-settings";
import { useToast } from "@/components/admin/ToastProvider";

export default function SettingsClient({
  initialMaintenanceMode,
}: {
  initialMaintenanceMode: boolean;
}) {
  const { toast } = useToast();
  const router = useRouter();
  const [maintenanceMode, setMode] = useState(initialMaintenanceMode);
  const [updating, setUpdating] = useState(false);

  async function toggle(next: boolean) {
    setUpdating(true);
    setMode(next);
    const res = await setMaintenanceMode(next);
    setUpdating(false);
    if (!res.success) {
      toast(res.error || "Failed to update maintenance mode", "error");
      setMode(!next);
      return;
    }
    toast(
      next
        ? "Maintenance protocol armed (public traffic gated)"
        : "Production live node restored",
      "success"
    );
    router.refresh();
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/[0.08]">
        <div>
          <span className="text-[11px] font-mono tracking-widest text-red-500 uppercase font-semibold">
            INFRASTRUCTURE // SYSTEM TELEMETRY & OPERATIONS
          </span>
          <h1 className="text-2xl font-bold text-white tracking-tight mt-0.5">
            System Settings & Security Controls
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-mono text-emerald-400 uppercase">
            DAEMON NODE SYNCHRONIZED
          </span>
        </div>
      </div>

      {/* Maintenance Mode Card */}
      <div className="admin-card p-6 space-y-4">
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-white/[0.08]">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-red-500 uppercase font-semibold">
                LOCKDOWN PROTOCOL
              </span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                maintenanceMode
                  ? "bg-red-500/20 text-red-400 border border-red-500/30"
                  : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
              }`}>
                {maintenanceMode ? "● ARMED" : "○ DISARMED (NORMAL OPS)"}
              </span>
            </div>
            <h3 className="text-base font-bold text-white">Emergency Maintenance Mode</h3>
            <p className="text-xs text-zinc-400 font-sans leading-relaxed max-w-xl">
              When armed, all incoming public client routes display an operational maintenance advisory banner while preserving authorized admin console access for remediation.
            </p>
          </div>

          <label className="relative inline-flex items-center cursor-pointer select-none mt-1">
            <input
              type="checkbox"
              checked={maintenanceMode}
              disabled={updating}
              onChange={(e) => toggle(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600" />
          </label>
        </div>

        <div className="p-3 rounded-lg bg-black/40 border border-white/[0.06] text-[11px] font-mono text-zinc-400 flex items-center justify-between">
          <span>Persisted Status: {maintenanceMode ? "TRUE (MAINTENANCE)" : "FALSE (LIVE)"}</span>
          <span className="text-zinc-600">STATE CONTROL: SITE_SETTINGS_SINGLETON</span>
        </div>
      </div>

      {/* Runtime Telemetry Specifications */}
      <div className="admin-card p-6 space-y-4">
        <h3 className="text-xs font-mono text-zinc-300 font-semibold uppercase tracking-wider pb-3 border-b border-white/[0.08]">
          HOST OPERATIONAL TELEMETRY
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          <div className="p-3 rounded-lg bg-black/40 border border-white/[0.06]">
            <div className="text-[10px] font-mono text-zinc-500 uppercase">SERVER RUNTIME</div>
            <div className="text-xs font-mono font-bold text-zinc-200 mt-1">Next.js 16.1.6 App Router</div>
          </div>
          <div className="p-3 rounded-lg bg-black/40 border border-white/[0.06]">
            <div className="text-[10px] font-mono text-zinc-500 uppercase">DATABASE ADAPTER</div>
            <div className="text-xs font-mono font-bold text-zinc-200 mt-1">PostgreSQL // Prisma ORM</div>
          </div>
          <div className="p-3 rounded-lg bg-black/40 border border-white/[0.06]">
            <div className="text-[10px] font-mono text-zinc-500 uppercase">SECURITY CONTEXT</div>
            <div className="text-xs font-mono font-bold text-emerald-400 mt-1">Argon2id + NextAuth v4</div>
          </div>
          <div className="p-3 rounded-lg bg-black/40 border border-white/[0.06]">
            <div className="text-[10px] font-mono text-zinc-500 uppercase">TELEMETRY ENGINE</div>
            <div className="text-xs font-mono font-bold text-zinc-200 mt-1">Three.js WebGL 3D Matrix</div>
          </div>
          <div className="p-3 rounded-lg bg-black/40 border border-white/[0.06]">
            <div className="text-[10px] font-mono text-zinc-500 uppercase">CRAWLER PROTOCOL</div>
            <div className="text-xs font-mono font-bold text-zinc-200 mt-1">Robots.txt + Dual XML Sitemaps</div>
          </div>
          <div className="p-3 rounded-lg bg-black/40 border border-white/[0.06]">
            <div className="text-[10px] font-mono text-zinc-500 uppercase">THREAT LEVEL</div>
            <div className="text-xs font-mono font-bold text-emerald-400 mt-1">DEFCON 5 // SECURE</div>
          </div>
        </div>
      </div>
    </div>
  );
}
