import { notFound } from "next/navigation";
import Link from "next/link";
import { isFeatureEnabled } from "@/lib/feature-flags";
import { getProfile } from "@/lib/data/profile";
import { resolvePageSEO } from "@/lib/seo";

export const revalidate = 3600;

export async function generateMetadata() {
  return resolvePageSEO(
    "/resume",
    "Curriculum Vitae & Security Dossier — Jaishanth M.",
    "Official cybersecurity resume, technical proficiencies, and research dossier of Jaishanth M."
  );
}

export default async function ResumePage() {
  if (!(await isFeatureEnabled("resume"))) notFound();
  const profile = await getProfile();
  if (!profile?.resumeMedia) notFound();

  return (
    <main className="max-w-4xl mx-auto px-6 py-16">
      {/* Editorial Breadcrumb */}
      <div className="flex items-center gap-2 text-xs font-mono text-zinc-500 mb-8">
        <Link href="/" className="hover:text-white transition-colors">HOME</Link>
        <span>/</span>
        <span className="text-[var(--color-signal-red)]">CURRICULUM VITAE</span>
      </div>

      <div className="p-8 sm:p-12 rounded-lg border border-[var(--color-border)] bg-[#101014] mb-12">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-xs bg-zinc-900 border border-white/[0.08] text-xs font-mono mb-3 text-zinc-300">
              <span className="status-pulsar" />
              <span>OFFICIAL SECURITY DOSSIER</span>
            </div>
            <h1 className="font-editorial text-3xl sm:text-5xl font-black text-white">
              {profile.displayName}
            </h1>
            <p className="text-base text-zinc-300 font-heading font-semibold mt-2">
              Offensive Security Student <span className="text-[var(--color-signal-red)]">/</span> Building toward Red Team
            </p>
          </div>

          <a
            href={profile.resumeMedia.url}
            target="_blank"
            rel="noopener noreferrer"
            download
            className="btn-editorial-primary px-6 py-3.5 text-xs font-mono uppercase tracking-wider flex items-center gap-2 w-fit"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span>Download PDF Dossier</span>
          </a>
        </div>

        <div className="mt-8 pt-6 border-t border-white/[0.06] grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs text-zinc-400">
          <div>
            <span className="block text-zinc-500 mb-0.5">FORMAT</span>
            <span>Portable Document Format (.pdf)</span>
          </div>
          <div>
            <span className="block text-zinc-500 mb-0.5">STATUS</span>
            <span className="text-emerald-400">VERIFIED AUTHENTIC</span>
          </div>
          <div>
            <span className="block text-zinc-500 mb-0.5">CONTACT</span>
            <span className="text-zinc-200">{profile.contactEmail || "jaishanthcys@gmail.com"}</span>
          </div>
        </div>
      </div>

      {/* Embedded Document Viewport */}
      <div className="rounded-lg border border-[var(--color-border)] bg-[#101014] overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between p-4 font-mono text-xs text-zinc-400 border-b border-white/[0.06] bg-zinc-950/60">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[var(--color-signal-red)]" />
            <span className="font-mono">jaishanth_resume.pdf</span>
          </div>
          <a
            href={profile.resumeMedia.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-300 hover:text-white transition-colors flex items-center gap-1"
          >
            <span>Open Standalone Window</span>
            <span>↗</span>
          </a>
        </div>
        <div className="w-full h-[800px] bg-white overflow-hidden">
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
