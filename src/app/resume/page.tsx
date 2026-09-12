import { notFound } from "next/navigation";
import Link from "next/link";
import { isFeatureEnabled } from "@/lib/feature-flags";
import { getProfile } from "@/lib/data/profile";
import { resolvePageSEO } from "@/lib/seo";

export const revalidate = 3600;

export async function generateMetadata() {
  return resolvePageSEO(
    "/resume",
    "Security Resume & Dossier — Jaishanth M",
    "Verified professional cybersecurity resume and research dossier of Jaishanth M."
  );
}

export default async function ResumePage() {
  if (!(await isFeatureEnabled("resume"))) notFound();
  const profile = await getProfile();
  if (!profile?.resumeMedia) notFound();

  return (
    <main className="max-w-4xl mx-auto px-6 py-16">
      {/* Header breadcrumb & cyber tag */}
      <div className="flex items-center gap-3 mb-6">
        <span className="text-xs font-mono text-[var(--color-cool-cyan)] tracking-widest uppercase">
          // DOSSIER // VERIFIED CURRICULUM VITAE
        </span>
        <div className="h-[1px] flex-1 bg-gradient-to-r from-[var(--color-border-glow)] to-transparent" />
      </div>

      <div className="glass-panel-elevated p-8 sm:p-10 rounded-2xl border border-[var(--color-border-glow)] mb-12">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full cyber-tag text-xs font-mono mb-2">
              <span className="status-dot-pulsar" />
              <span>OFFICIAL SECURITY DOSSIER</span>
            </div>
            <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-[var(--color-text-primary)]">
              {profile.displayName} — Dossier
            </h1>
            <p className="text-base text-[var(--color-cool-cyan)] font-mono mt-1">
              {profile.professionalTitle} · MCET Pollachi
            </p>
          </div>

          <a
            href={profile.resumeMedia.url}
            target="_blank"
            rel="noopener noreferrer"
            download
            className="btn-magnetic px-6 py-3.5 rounded-xl font-mono text-xs font-semibold text-white bg-[var(--color-electric-blue)] hover:bg-[var(--color-primary-hover)] flex items-center gap-2 shadow-[0_0_20px_rgba(43,108,255,0.4)] transition-all w-fit border border-[rgba(255,255,255,0.15)]"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span>DOWNLOAD PDF DOSSIER</span>
          </a>
        </div>

        <div className="mt-8 pt-6 border-t border-[var(--color-border-subtle)] grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs text-[var(--color-text-muted)]">
          <div>
            <span className="block text-[var(--color-text-secondary)]">FILE FORMAT:</span>
            <span>Portable Document Format (.pdf)</span>
          </div>
          <div>
            <span className="block text-[var(--color-text-secondary)]">INTEGRITY:</span>
            <span className="text-emerald-400">VERIFIED AUTHENTIC</span>
          </div>
          <div>
            <span className="block text-[var(--color-text-secondary)]">CONTACT:</span>
            <span className="text-[var(--color-cool-cyan)]">{profile.contactEmail || "jaishanthcys@gmail.com"}</span>
          </div>
        </div>
      </div>

      {/* Embedded Document Viewport / Frame */}
      <div className="glass-card rounded-2xl border border-[var(--color-border)] p-2 overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.6)]">
        <div className="flex items-center justify-between p-3 font-mono text-xs text-[var(--color-text-muted)] border-b border-[var(--color-border-subtle)] bg-[rgba(11,17,32,0.5)] rounded-t-xl">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500/80 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-green-500/80 inline-block" />
            <span className="ml-2 font-mono">jaishanth_resume.pdf</span>
          </div>
          <a
            href={profile.resumeMedia.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--color-cool-cyan)] hover:underline"
          >
            Open in New Window ↗
          </a>
        </div>
        <div className="w-full h-[750px] bg-white rounded-b-xl overflow-hidden">
          <iframe
            src={`${profile.resumeMedia.url}#toolbar=0`}
            title="Jaishanth M Resume PDF"
            className="w-full h-full border-none"
          />
        </div>
      </div>
    </main>
  );
}
