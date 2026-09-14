import { notFound } from "next/navigation";
import Link from "next/link";
import { isFeatureEnabled } from "@/lib/feature-flags";
import { getProfile, getVisibleSocialLinks } from "@/lib/data/profile";
import { resolvePageSEO } from "@/lib/seo";
import SocialIcon from "@/components/SocialIcon";

export const revalidate = 3600;

export async function generateMetadata() {
  return resolvePageSEO(
    "/links",
    "Verified Links & Identity Hub — Jaishanth M.",
    "Direct links to Jaishanth M.'s verified profiles across Bugcrowd, GitHub, LinkedIn, TryHackMe, and Discord."
  );
}

export default async function LinksPage() {
  if (!(await isFeatureEnabled("links"))) notFound();
  const [profile, links] = await Promise.all([getProfile(), getVisibleSocialLinks()]);
  if (!profile) notFound();

  return (
    <main className="max-w-md mx-auto px-6 py-20 text-center">
      {/* Indicator Pill */}
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-zinc-900 border border-[var(--color-border)] mb-8 text-xs font-mono tracking-wider uppercase text-zinc-300">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        <span>VERIFIED CHANNELS</span>
      </div>

      <div className="w-20 h-20 rounded-md bg-zinc-900 border border-[var(--color-border)] flex items-center justify-center font-mono font-bold text-2xl text-white mx-auto mb-5 shadow-2xl">
        JM
      </div>

      <h1 className="font-editorial text-3xl font-black text-white mb-1">
        {profile.displayName}
      </h1>
      <p className="text-sm text-zinc-300 font-heading mb-1">
        Offensive Security Student
      </p>
      <p className="text-xs text-zinc-500 font-mono mb-8">
        Building toward Red Team
      </p>

      <div className="space-y-3">
        {links.map((link) => (
          <a
            key={link.id}
            href={link.url}
            target="_blank"
            rel="me noopener noreferrer"
            className="p-4 rounded-lg border border-[var(--color-border)] bg-[#101014] hover:border-white/25 flex items-center justify-between group transition-all"
          >
            <div className="flex items-center gap-3">
              <span className="text-zinc-400 group-hover:text-white transition-colors">
                <SocialIcon platform={link.platform} iconKey={link.iconKey} className="w-4 h-4" />
              </span>
              <span className="font-heading font-semibold text-sm text-white group-hover:text-[var(--color-signal-red)] transition-colors">
                {link.customLabel ?? link.platform}
              </span>
            </div>
            <span className="font-mono text-xs text-zinc-500 group-hover:text-white transition-colors">
              Visit ↗
            </span>
          </a>
        ))}

        <Link
          href="/resume"
          className="p-4 rounded-lg border border-[var(--color-border)] bg-zinc-900/90 flex items-center justify-between group transition-all hover:border-[var(--color-signal-red)]"
        >
          <div className="flex items-center gap-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-signal-red)]" />
            <span className="font-heading font-semibold text-sm text-white">
              Curriculum Vitae (PDF)
            </span>
          </div>
          <span className="font-mono text-xs text-zinc-400">
            Dossier ↗
          </span>
        </Link>

        <Link
          href="/contact"
          className="p-4 rounded-lg border border-[var(--color-border)] bg-[#101014] hover:border-white/25 flex items-center justify-between group transition-all"
        >
          <div className="flex items-center gap-3">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span className="font-heading font-semibold text-sm text-white">
              Direct Transmission
            </span>
          </div>
          <span className="font-mono text-xs text-zinc-500 group-hover:text-white">
            Connect →
          </span>
        </Link>
      </div>
    </main>
  );
}
