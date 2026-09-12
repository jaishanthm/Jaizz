"use client";

import { useRouter } from "next/navigation";
import { updateFeatureFlag } from "@/lib/actions/feature-flags";
import { useToast } from "@/components/admin/ToastProvider";

type Flag = { id: string; key: string; label: string; enabled: boolean; homepageVisible: boolean; navVisible: boolean; sitemapEligible: boolean };

const LOCKED = ["hero", "contact"];

export default function FeatureFlagsClient({ flags }: { flags: Flag[] }) {
  const { toast } = useToast();
  const router = useRouter();

  async function toggle(key: string, field: string, value: boolean) {
    const res = await updateFeatureFlag(key, { [field]: value });
    if (!res.success) toast(res.error, "error");
    router.refresh();
  }

  return (
    <>
      <h1 className="text-2xl mb-2">Feature Flags</h1>
      <p className="text-xs mb-6" style={{ color: "var(--color-text-muted)" }}>
        Turning a flag off cascades — homepage, nav, and sitemap visibility all switch off together, not independently.
      </p>
      <div className="glass-card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr style={{ borderBottom: "1px solid var(--color-border)" }}>
              <th className="text-left p-3">Section</th>
              <th className="text-center p-3">Enabled</th>
              <th className="text-center p-3">Homepage</th>
              <th className="text-center p-3">Nav</th>
              <th className="text-center p-3">Sitemap</th>
            </tr>
          </thead>
          <tbody>
            {flags.map((f) => {
              const locked = LOCKED.includes(f.key);
              return (
                <tr key={f.id} style={{ borderBottom: "1px solid var(--color-border)" }}>
                  <td className="p-3">
                    {f.label} {locked && <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>(always on)</span>}
                  </td>
                  <td className="p-3 text-center">
                    <input type="checkbox" checked={f.enabled} disabled={locked}
                      onChange={(e) => toggle(f.key, "enabled", e.target.checked)} />
                  </td>
                  <td className="p-3 text-center">
                    <input type="checkbox" checked={f.homepageVisible} disabled={!f.enabled || f.key === "hero"}
                      onChange={(e) => toggle(f.key, "homepageVisible", e.target.checked)} />
                  </td>
                  <td className="p-3 text-center">
                    <input type="checkbox" checked={f.navVisible} disabled={!f.enabled || locked}
                      onChange={(e) => toggle(f.key, "navVisible", e.target.checked)} />
                  </td>
                  <td className="p-3 text-center">
                    <input type="checkbox" checked={f.sitemapEligible} disabled={!f.enabled || f.key === "hero"}
                      onChange={(e) => toggle(f.key, "sitemapEligible", e.target.checked)} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}
