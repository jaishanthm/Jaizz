"use client";

import { useRouter } from "next/navigation";
import { updateFeatureFlag } from "@/lib/actions/feature-flags";
import { useToast } from "@/components/admin/ToastProvider";

type Flag = {
  id: string;
  key: string;
  label: string;
  enabled: boolean;
  homepageVisible: boolean;
  navVisible: boolean;
  sitemapEligible: boolean;
};

const LOCKED = ["hero", "contact"];

export default function FeatureFlagsClient({ flags }: { flags: Flag[] }) {
  const { toast } = useToast();
  const router = useRouter();

  async function toggle(key: string, field: string, value: boolean) {
    const res = await updateFeatureFlag(key, { [field]: value });
    if (!res.success) {
      toast(res.error || "Failed to update feature flag", "error");
    } else {
      toast(`Updated flag: ${key}`, "success");
    }
    router.refresh();
  }

  const enabledCount = flags.filter((f) => f.enabled).length;

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/[0.08]">
        <div>
          <span className="text-[11px] font-mono tracking-widest text-red-500 uppercase font-semibold">
            ARCHITECTURE // SYSTEM SWITCHBOARD
          </span>
          <h1 className="text-2xl font-bold text-white tracking-tight mt-0.5">
            Feature Flags & Routing Matrix
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-xs font-mono text-zinc-400 bg-white/[0.04] px-3 py-1.5 rounded-lg border border-white/[0.08]">
            ACTIVE MODULES:{" "}
            <span className="text-emerald-400 font-bold">{enabledCount}</span> /{" "}
            <span className="text-zinc-300">{flags.length}</span>
          </div>
        </div>
      </div>

      {/* Info Notice */}
      <div className="p-4 rounded-xl bg-[#0e0e13] border border-white/[0.08] text-xs font-mono text-zinc-400 leading-relaxed flex items-start gap-3">
        <span className="text-red-500 text-sm mt-0.5">⚡</span>
        <div>
          <p className="text-zinc-300 font-medium mb-1">CASCADING VISIBILITY PROTOCOL:</p>
          Disabling any section globally cascades immediately — shutting down its homepage inclusion, header navigation visibility, and search crawler sitemap eligibility in a single atomic operation.
        </div>
      </div>

      {/* Table */}
      <div className="admin-card overflow-hidden">
        <div className="p-4 border-b border-white/[0.08] flex items-center justify-between">
          <span className="text-xs font-mono text-zinc-300 font-semibold uppercase tracking-wider">
            SECTION CONTROL CHANNELS
          </span>
          <span className="text-[11px] font-mono text-zinc-500">
            HERO & CONTACT ARE FIXED ANCHORS
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="bg-white/[0.02] border-b border-white/[0.08] text-zinc-400 uppercase tracking-wider">
                <th className="py-3 px-4">Section Module</th>
                <th className="py-3 px-4 text-center">Global Status</th>
                <th className="py-3 px-4 text-center">Homepage</th>
                <th className="py-3 px-4 text-center">Navigation</th>
                <th className="py-3 px-4 text-center">Sitemap / SEO</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {flags.map((f) => {
                const locked = LOCKED.includes(f.key);
                return (
                  <tr key={f.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span className={`w-1.5 h-1.5 rounded-full ${f.enabled ? "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]" : "bg-zinc-600"}`} />
                        <span className="font-semibold text-white text-sm">{f.label}</span>
                        {locked && (
                          <span className="px-2 py-0.5 rounded text-[10px] bg-red-950/40 text-red-400 border border-red-500/20 font-mono">
                            ANCHOR LOCKED
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Global Enabled */}
                    <td className="py-3.5 px-4 text-center">
                      <label className="inline-flex items-center cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={f.enabled}
                          disabled={locked}
                          onChange={(e) => toggle(f.key, "enabled", e.target.checked)}
                          className="w-4 h-4 rounded border-zinc-700 bg-zinc-900 text-red-600 focus:ring-red-500 focus:ring-offset-black accent-red-600 disabled:opacity-40"
                        />
                      </label>
                    </td>

                    {/* Homepage Visible */}
                    <td className="py-3.5 px-4 text-center">
                      <label className="inline-flex items-center cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={f.homepageVisible}
                          disabled={!f.enabled || f.key === "hero"}
                          onChange={(e) => toggle(f.key, "homepageVisible", e.target.checked)}
                          className="w-4 h-4 rounded border-zinc-700 bg-zinc-900 text-red-600 focus:ring-red-500 focus:ring-offset-black accent-red-600 disabled:opacity-30"
                        />
                      </label>
                    </td>

                    {/* Nav Visible */}
                    <td className="py-3.5 px-4 text-center">
                      <label className="inline-flex items-center cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={f.navVisible}
                          disabled={!f.enabled || locked}
                          onChange={(e) => toggle(f.key, "navVisible", e.target.checked)}
                          className="w-4 h-4 rounded border-zinc-700 bg-zinc-900 text-red-600 focus:ring-red-500 focus:ring-offset-black accent-red-600 disabled:opacity-30"
                        />
                      </label>
                    </td>

                    {/* Sitemap Eligible */}
                    <td className="py-3.5 px-4 text-center">
                      <label className="inline-flex items-center cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={f.sitemapEligible}
                          disabled={!f.enabled || f.key === "hero"}
                          onChange={(e) => toggle(f.key, "sitemapEligible", e.target.checked)}
                          className="w-4 h-4 rounded border-zinc-700 bg-zinc-900 text-red-600 focus:ring-red-500 focus:ring-offset-black accent-red-600 disabled:opacity-30"
                        />
                      </label>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
