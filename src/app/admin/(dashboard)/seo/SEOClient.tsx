"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateSEOSettings, upsertPageSEO } from "@/lib/actions/seo";
import { useToast } from "@/components/admin/ToastProvider";

type Global = { siteTitle: string; siteDescription: string; siteName: string; authorName: string; canonicalBaseUrl: string; googleVerification?: string | null; bingVerification?: string | null };
type PageRow = { path: string; seoTitle?: string | null; seoDescription?: string | null; noindex: boolean };

const STATIC_ROUTES = ["/about", "/experience", "/skills", "/certifications", "/achievements", "/contact", "/resume", "/links"];

export default function SEOClient({ initial, pages }: { initial: Global; pages: PageRow[] }) {
  const { toast } = useToast();
  const router = useRouter();
  const [global, setGlobal] = useState(initial);
  const [pageMap, setPageMap] = useState<Record<string, PageRow>>(
    Object.fromEntries(STATIC_ROUTES.map((p) => [p, pages.find((x) => x.path === p) ?? { path: p, seoTitle: "", seoDescription: "", noindex: false }]))
  );
  const [saving, setSaving] = useState(false);

  const checklist = [
    { label: "Site title", done: !!global.siteTitle },
    { label: "Site description", done: !!global.siteDescription },
    { label: "Google verification", done: !!global.googleVerification },
    { label: "Bing verification", done: !!global.bingVerification },
  ];

  async function saveGlobal() {
    setSaving(true);
    const res = await updateSEOSettings({
      ...global,
      googleVerification: global.googleVerification ?? undefined,
      bingVerification: global.bingVerification ?? undefined,
    });
    setSaving(false);
    if (!res.success) toast(res.error, "error");
    router.refresh();
  }

  async function savePage(path: string) {
    const row = pageMap[path];
    const res = await upsertPageSEO(path, { seoTitle: row.seoTitle ?? undefined, seoDescription: row.seoDescription ?? undefined, noindex: row.noindex });
    if (!res.success) toast(res.error, "error");
    router.refresh();
  }

  return (
    <>
      <h1 className="text-2xl mb-6">SEO</h1>

      <div className="glass-card p-5 mb-4 max-w-md">
        <p className="text-sm mb-2" style={{ color: "var(--color-text-muted)" }}>Completeness: {checklist.filter((c) => c.done).length}/{checklist.length}</p>
      </div>

      <div className="max-w-xl space-y-3 mb-10">
        <h2 className="text-lg">Global settings</h2>
        <input placeholder="Site title" value={global.siteTitle} onChange={(e) => setGlobal({ ...global, siteTitle: e.target.value })} className="w-full px-3 py-2 rounded-md bg-transparent text-sm" style={{ border: "1px solid var(--color-border)" }} />
        <textarea placeholder="Site description" value={global.siteDescription} onChange={(e) => setGlobal({ ...global, siteDescription: e.target.value })} className="w-full px-3 py-2 rounded-md bg-transparent text-sm" style={{ border: "1px solid var(--color-border)" }} />
        <input placeholder="Canonical base URL" value={global.canonicalBaseUrl} onChange={(e) => setGlobal({ ...global, canonicalBaseUrl: e.target.value })} className="w-full px-3 py-2 rounded-md bg-transparent text-sm" style={{ border: "1px solid var(--color-border)" }} />
        <input placeholder="Google verification code" value={global.googleVerification ?? ""} onChange={(e) => setGlobal({ ...global, googleVerification: e.target.value })} className="w-full px-3 py-2 rounded-md bg-transparent text-sm" style={{ border: "1px solid var(--color-border)" }} />
        <input placeholder="Bing verification code" value={global.bingVerification ?? ""} onChange={(e) => setGlobal({ ...global, bingVerification: e.target.value })} className="w-full px-3 py-2 rounded-md bg-transparent text-sm" style={{ border: "1px solid var(--color-border)" }} />
        <button onClick={saveGlobal} disabled={saving} className="px-6 py-3 rounded-full" style={{ background: "var(--color-primary)", color: "white" }}>
          {saving ? "Saving…" : "Save global SEO"}
        </button>
      </div>

      <h2 className="text-lg mb-3">Per-page overrides</h2>
      <div className="space-y-4 max-w-xl">
        {STATIC_ROUTES.map((path) => (
          <div key={path} className="glass-card p-4">
            <p className="text-sm mb-2" style={{ color: "var(--color-primary)" }}>{path}</p>
            <input placeholder="SEO title (falls back to global if blank)" value={pageMap[path].seoTitle ?? ""} onChange={(e) => setPageMap({ ...pageMap, [path]: { ...pageMap[path], seoTitle: e.target.value } })} className="w-full mb-2 px-3 py-2 rounded-md bg-transparent text-sm" style={{ border: "1px solid var(--color-border)" }} />
            <textarea placeholder="SEO description (falls back to global if blank)" value={pageMap[path].seoDescription ?? ""} onChange={(e) => setPageMap({ ...pageMap, [path]: { ...pageMap[path], seoDescription: e.target.value } })} className="w-full mb-2 px-3 py-2 rounded-md bg-transparent text-sm" style={{ border: "1px solid var(--color-border)" }} />
            <label className="text-xs flex items-center gap-1 mb-2">
              <input type="checkbox" checked={pageMap[path].noindex} onChange={(e) => setPageMap({ ...pageMap, [path]: { ...pageMap[path], noindex: e.target.checked } })} /> No-index this page
            </label>
            <button onClick={() => savePage(path)} className="text-xs" style={{ color: "var(--color-primary)" }}>Save</button>
          </div>
        ))}
      </div>
    </>
  );
}
