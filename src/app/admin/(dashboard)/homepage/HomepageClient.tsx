"use client";

import { useRouter } from "next/navigation";
import { moveHomepageSection } from "@/lib/actions/homepage";
import { useToast } from "@/components/admin/ToastProvider";

type Section = { featureFlagId: string; order: number; featureFlag: { key: string; label: string } };

export default function HomepageClient({ sections }: { sections: Section[] }) {
  const { toast } = useToast();
  const router = useRouter();
  async function move(id: string, dir: "up" | "down") {
    const res = await moveHomepageSection(id, dir);
    if (!res.success) toast(res.error, "error");
    router.refresh();
  }

  return (
    <>
      <h1 className="text-2xl mb-2">Homepage Section Order</h1>
      <p className="text-xs mb-6" style={{ color: "var(--color-text-muted)" }}>
        Only sections with Homepage visibility on (Feature Flags page) appear here. Hero and Contact aren&apos;t reorderable — Hero is always first, Contact anchors the bottom by convention.
      </p>
      <div className="glass-card overflow-hidden">
        <table className="w-full text-sm">
          <tbody>
            {sections.map((s, i) => (
              <tr key={s.featureFlagId} style={{ borderBottom: "1px solid var(--color-border)" }}>
                <td className="p-3">{i + 1}. {s.featureFlag.label}</td>
                <td className="p-3 text-right space-x-2">
                  <button onClick={() => move(s.featureFlagId, "up")} disabled={i === 0}>↑</button>
                  <button onClick={() => move(s.featureFlagId, "down")} disabled={i === sections.length - 1}>↓</button>
                </td>
              </tr>
            ))}
            {sections.length === 0 && <tr><td colSpan={2} className="p-6 text-center" style={{ color: "var(--color-text-muted)" }}>No sections are homepage-visible right now.</td></tr>}
          </tbody>
        </table>
      </div>
    </>
  );
}
