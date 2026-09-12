"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { setMaintenanceMode } from "@/lib/actions/site-settings";
import { useToast } from "@/components/admin/ToastProvider";

export default function SettingsClient({ initialMaintenanceMode }: { initialMaintenanceMode: boolean }) {
  const { toast } = useToast();
  const router = useRouter();
  const [maintenanceMode, setMode] = useState(initialMaintenanceMode);

  async function toggle(next: boolean) {
    setMode(next);
    const res = await setMaintenanceMode(next);
    if (!res.success) { toast(res.error, "error"); setMode(!next); return; }
    router.refresh();
  }

  return (
    <>
      <h1 className="text-2xl mb-6">Settings</h1>
      <div className="glass-card p-5 max-w-md">
        <label className="flex items-center justify-between">
          <span>Maintenance mode</span>
          <input type="checkbox" checked={maintenanceMode} onChange={(e) => toggle(e.target.checked)} />
        </label>
        <p className="text-xs mt-2" style={{ color: "var(--color-text-muted)" }}>
          Stores the flag on SiteSettings. Actually gating public pages behind it (a maintenance page/middleware check) isn&apos;t wired up yet — flagged, not silently assumed done.
        </p>
      </div>
    </>
  );
}
