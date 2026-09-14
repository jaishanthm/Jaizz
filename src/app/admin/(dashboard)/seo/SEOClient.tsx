"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateSEOSettings, upsertPageSEO } from "@/lib/actions/seo";
import { useToast } from "@/components/admin/ToastProvider";

type Global = {
  siteTitle: string;
  siteDescription: string;
  siteName: string;
  authorName: string;
  canonicalBaseUrl: string;
  googleVerification?: string | null;
  bingVerification?: string | null;
};

type PageRow = {
  path: string;
  seoTitle?: string | null;
  seoDescription?: string | null;
  noindex: boolean;
};

const STATIC_ROUTES = [
  "/about",
  "/experience",
  "/skills",
  "/certifications",
  "/achievements",
  "/contact",
  "/resume",
  "/links",
];

export default function SEOClient({
  initial,
  pages,
}: {
  initial: Global;
  pages: PageRow[];
}) {
  const { toast } = useToast();
  const router = useRouter();
  const [global, setGlobal] = useState(initial);
  const [pageMap, setPageMap] = useState<Record<string, PageRow>>(
    Object.fromEntries(
      STATIC_ROUTES.map((p) => [
        p,
        pages.find((x) => x.path === p) ?? {
          path: p,
          seoTitle: "",
          seoDescription: "",
          noindex: false,
        },
      ])
    )
  );
  const [savingGlobal, setSavingGlobal] = useState(false);
  const [savingPage, setSavingPage] = useState<string | null>(null);

  const checklist = [
    { label: "Site Title", done: !!global.siteTitle },
    { label: "Site Description", done: !!global.siteDescription },
    { label: "Canonical URL", done: !!global.canonicalBaseUrl },
    { label: "Author Attribution", done: !!global.authorName },
    { label: "Google Verification", done: !!global.googleVerification },
    { label: "Bing Verification", done: !!global.bingVerification },
  ];

  const completedCount = checklist.filter((c) => c.done).length;
  const scorePercent = Math.round((completedCount / checklist.length) * 100);

  async function saveGlobal() {
    setSavingGlobal(true);
    const res = await updateSEOSettings({
      ...global,
      googleVerification: global.googleVerification ?? undefined,
      bingVerification: global.bingVerification ?? undefined,
    });
    setSavingGlobal(false);
    if (!res.success) {
      toast(res.error || "Failed to update global SEO", "error");
    } else {
      toast("Global SEO metadata updated", "success");
    }
    router.refresh();
  }

  async function savePage(path: string) {
    setSavingPage(path);
    const row = pageMap[path];
    const res = await upsertPageSEO(path, {
      seoTitle: row.seoTitle ?? undefined,
      seoDescription: row.seoDescription ?? undefined,
      noindex: row.noindex,
    });
    setSavingPage(null);
    if (!res.success) {
      toast(res.error || `Failed to update ${path} SEO`, "error");
    } else {
      toast(`SEO saved for route: ${path}`, "success");
    }
    router.refresh();
  }

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/[0.08]">
        <div>
          <span className="text-[11px] font-mono tracking-widest text-red-500 uppercase font-semibold">
            INDEXING // SEARCH ENGINE OPTIMIZATION & CRAWLER DIRECTIVES
          </span>
          <h1 className="text-2xl font-bold text-white tracking-tight mt-0.5">
            SEO & Metadata Controls
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-xs font-mono text-zinc-400 bg-white/[0.04] px-3 py-1.5 rounded-lg border border-white/[0.08]">
            INDEX READINESS:{" "}
            <span className={scorePercent >= 80 ? "text-emerald-400 font-bold" : "text-amber-400 font-bold"}>
              {scorePercent}%
            </span>
          </div>
        </div>
      </div>

      {/* Index Health Telemetry Card */}
      <div className="admin-card p-5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-mono text-zinc-300 uppercase tracking-wider font-semibold">
            SEARCH HEALTH CHECKLIST
          </span>
          <span className="text-xs font-mono text-zinc-400">
            {completedCount} OF {checklist.length} DIRECTIVES SATISFIED
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden mb-4">
          <div
            className={`h-full transition-all duration-500 ${
              scorePercent >= 80 ? "bg-emerald-500" : "bg-red-500"
            }`}
            style={{ width: `${scorePercent}%` }}
          />
        </div>

        {/* Checklist Chips */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
          {checklist.map((item) => (
            <div
              key={item.label}
              className={`p-2 rounded-lg border text-center font-mono text-[11px] ${
                item.done
                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                  : "bg-white/[0.02] border-white/[0.08] text-zinc-500"
              }`}
            >
              {item.done ? "✓" : "○"} {item.label}
            </div>
          ))}
        </div>
      </div>

      {/* Global SEO Settings */}
      <div className="admin-card p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
          <span className="text-xs font-mono text-zinc-300 font-semibold uppercase tracking-wider">
            GLOBAL METADATA SPECIFICATION
          </span>
          <button
            type="button"
            onClick={saveGlobal}
            disabled={savingGlobal}
            className="admin-btn-primary text-xs py-1.5 px-4"
          >
            {savingGlobal ? "SAVING..." : "SAVE GLOBAL SEO"}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-mono font-medium text-zinc-300 uppercase tracking-wider">
              Site Title
            </label>
            <input
              placeholder="e.g. Jaishanth M | Offensive Security & Vulnerability Researcher"
              value={global.siteTitle}
              onChange={(e) => setGlobal({ ...global, siteTitle: e.target.value })}
              className="admin-input text-xs"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-mono font-medium text-zinc-300 uppercase tracking-wider">
              Site Name
            </label>
            <input
              placeholder="e.g. Jaishanth Portfolio"
              value={global.siteName}
              onChange={(e) => setGlobal({ ...global, siteName: e.target.value })}
              className="admin-input text-xs"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-mono font-medium text-zinc-300 uppercase tracking-wider">
              Author Name
            </label>
            <input
              placeholder="e.g. Jaishanth M"
              value={global.authorName}
              onChange={(e) => setGlobal({ ...global, authorName: e.target.value })}
              className="admin-input text-xs"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-mono font-medium text-zinc-300 uppercase tracking-wider">
              Canonical Base URL
            </label>
            <input
              placeholder="https://jaiz.vercel.app or your domain"
              value={global.canonicalBaseUrl}
              onChange={(e) => setGlobal({ ...global, canonicalBaseUrl: e.target.value })}
              className="admin-input text-xs font-mono"
            />
          </div>

          <div className="space-y-1.5 md:col-span-2">
            <label className="block text-xs font-mono font-medium text-zinc-300 uppercase tracking-wider">
              Default Site Description (Crawler Snippet)
            </label>
            <textarea
              rows={2}
              placeholder="Cybersecurity researcher, penetration tester, and exploit analyst..."
              value={global.siteDescription}
              onChange={(e) => setGlobal({ ...global, siteDescription: e.target.value })}
              className="admin-input text-xs leading-relaxed"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-mono font-medium text-zinc-300 uppercase tracking-wider">
              Google Search Console Token
            </label>
            <input
              placeholder="google-site-verification token"
              value={global.googleVerification ?? ""}
              onChange={(e) => setGlobal({ ...global, googleVerification: e.target.value })}
              className="admin-input text-xs font-mono"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-mono font-medium text-zinc-300 uppercase tracking-wider">
              Bing Webmaster Token
            </label>
            <input
              placeholder="msvalidate.01 token"
              value={global.bingVerification ?? ""}
              onChange={(e) => setGlobal({ ...global, bingVerification: e.target.value })}
              className="admin-input text-xs font-mono"
            />
          </div>
        </div>
      </div>

      {/* Per-Page Overrides */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono text-zinc-300 font-semibold uppercase tracking-wider">
            ROUTE-SPECIFIC METADATA OVERRIDES
          </span>
          <span className="text-[11px] font-mono text-zinc-500">
            LEAVE BLANK TO INHERIT GLOBAL METADATA
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {STATIC_ROUTES.map((path) => {
            const row = pageMap[path];
            const isSavingThis = savingPage === path;
            return (
              <div key={path} className="admin-card p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-500/80" />
                    <span className="text-xs font-mono font-bold text-white">{path}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => savePage(path)}
                    disabled={isSavingThis}
                    className="text-xs font-mono text-red-400 hover:text-red-300 border border-red-500/30 hover:border-red-500/60 bg-red-500/10 px-2.5 py-1 rounded transition-colors"
                  >
                    {isSavingThis ? "SAVING..." : "SAVE ROUTE"}
                  </button>
                </div>

                <input
                  placeholder="Custom Page Title Override"
                  value={row.seoTitle ?? ""}
                  onChange={(e) =>
                    setPageMap({
                      ...pageMap,
                      [path]: { ...pageMap[path], seoTitle: e.target.value },
                    })
                  }
                  className="admin-input text-xs"
                />

                <textarea
                  rows={2}
                  placeholder="Custom Meta Description Override"
                  value={row.seoDescription ?? ""}
                  onChange={(e) =>
                    setPageMap({
                      ...pageMap,
                      [path]: { ...pageMap[path], seoDescription: e.target.value },
                    })
                  }
                  className="admin-input text-xs"
                />

                <label className="text-[11px] font-mono text-zinc-400 flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={row.noindex}
                    onChange={(e) =>
                      setPageMap({
                        ...pageMap,
                        [path]: { ...pageMap[path], noindex: e.target.checked },
                      })
                    }
                    className="w-3.5 h-3.5 rounded border-zinc-700 bg-zinc-900 text-red-600 focus:ring-red-500 focus:ring-offset-black accent-red-600"
                  />
                  <span>Block Crawlers (Add noindex meta tag)</span>
                </label>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
