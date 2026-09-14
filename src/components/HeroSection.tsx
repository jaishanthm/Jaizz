import Link from "next/link";
import HeroTerminal from "./HeroTerminal";

type ProfileWithMedia = {
  displayName: string;
  professionalTitle: string;
  shortBio: string;
  location?: string | null;
  availability?: string | null;
  profileImage?: { url: string; altText?: string | null } | null;
  resumeMedia?: { url: string } | null;
};

export default function HeroSection({
  profile,
  threeDEnabled,
  threeDMode,
  enabledFlags,
  featuredSkills,
  featuredProjects,
  tryHackMeStats,
}: {
  profile: ProfileWithMedia;
  threeDEnabled: boolean;
  threeDMode: "FULL" | "LITE" | "OFF";
  enabledFlags?: Set<string>;
  featuredSkills?: string[];
  featuredProjects?: { name: string; shortDescription?: string | null }[];
  tryHackMeStats?: { percentile?: string; rank?: string; completedRooms?: number };
}) {
  const flags = enabledFlags ?? new Set<string>();

  return (
    <section className="relative min-h-[92vh] flex flex-col justify-between pt-24 pb-12 px-6 sm:px-10 overflow-hidden bg-transparent">
      {/* Subtle atmospheric crimson radial glow behind the terminal */}
      <div
        className="absolute top-1/3 right-1/4 w-[550px] h-[550px] rounded-full pointer-events-none opacity-25 blur-[150px]"
        style={{ background: "radial-gradient(circle, var(--color-signal-darkest, rgba(225, 29, 72, 0.45)) 0%, transparent 70%)" }}
        aria-hidden="true"
      />

      {/* Main Two-Column Hero Content Grid */}
      <div className="relative max-w-7xl mx-auto w-full my-auto z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center py-6">
        {/* Left Column: Personal Identity & Credentials (~50% width on desktop) */}
        <div className="lg:col-span-6 xl:col-span-6 flex flex-col justify-center">
          {/* Availability Status Indicator */}
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-zinc-900/90 border border-white/[0.08] backdrop-blur-md mb-6 text-xs font-mono tracking-wider uppercase w-fit">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-zinc-200 font-medium">
              {profile.availability || "Open for Security Research & Internships"}
            </span>
          </div>

          {/* Dominant Oversized Editorial Name */}
          <h1 className="font-editorial text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-none mb-5 uppercase text-white whitespace-nowrap">
            {profile.displayName ? (
              <>
                {profile.displayName.split(" ").slice(0, -1).join(" ")}{" "}
                <span className="text-zinc-400">{profile.displayName.split(" ").slice(-1)[0]}</span>
              </>
            ) : (
              <>
                JAISHANTH <span className="text-zinc-400">M.</span>
              </>
            )}
          </h1>

          {/* Clear Authentic Identity Line */}
          <div className="mb-4">
            <div className="text-xl sm:text-2xl font-heading font-semibold text-zinc-100">
              {profile.professionalTitle || "Offensive Security Student"}
            </div>
            <div className="text-sm font-mono text-zinc-400 mt-1 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-signal-red)]" />
              <span>Building toward Red Team</span>
            </div>
          </div>

          {/* Concise Personal Statement */}
          <p className="text-base text-zinc-400 leading-relaxed mb-6 max-w-lg font-sans">
            {profile.shortBio ||
              "Investigating system vulnerabilities, building offensive security tools, and analyzing adversary attack paths."}
          </p>

          {/* Restrained Capability Labels */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 font-mono text-xs text-zinc-400 mb-8">
            <span className="text-zinc-300">Web Security</span>
            <span className="text-zinc-700">·</span>
            <span className="text-zinc-300">Active Directory</span>
            <span className="text-zinc-700">·</span>
            <span className="text-zinc-300">Reconnaissance</span>
            <span className="text-zinc-700">·</span>
            <span className="text-zinc-300">Security Automation</span>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-4 mb-8">
            {(flags.size === 0 || flags.has("projects")) && (
              <Link
                href="/projects"
                className="btn-editorial-primary px-7 py-3.5 text-xs font-mono uppercase tracking-wider font-semibold"
              >
                <span>View Security Work</span>
                <span>→</span>
              </Link>
            )}

            {(flags.size === 0 || flags.has("contact")) && (
              <Link
                href="/contact"
                className="btn-editorial-secondary px-7 py-3.5 text-xs font-mono uppercase tracking-wider"
              >
                <span>Contact</span>
              </Link>
            )}

            {(flags.size === 0 || flags.has("resume")) && profile.resumeMedia && (
              <Link
                href="/resume"
                className="px-4 py-3 text-xs font-mono text-zinc-400 hover:text-white transition-colors flex items-center gap-1.5"
              >
                <span>CV (PDF)</span>
                <span>↓</span>
              </Link>
            )}
          </div>

          {/* Subtle Verified Metrics Chips */}
          <div className="flex items-center gap-5 pt-4 border-t border-white/[0.06] text-xs font-mono text-zinc-500">
            <div className="flex items-center gap-2">
              <span className="text-white font-semibold">
                {tryHackMeStats?.percentile || "Top 5%"}
              </span>
              <span>TryHackMe</span>
            </div>
            <span className="text-zinc-800">|</span>
            <div className="flex items-center gap-2">
              <span className="text-white font-semibold">Researcher</span>
              <span>Bugcrowd</span>
            </div>
          </div>
        </div>

        {/* Right Column: Large Terminal (~50% width) */}
        <div className="lg:col-span-6 xl:col-span-6 relative flex items-center justify-center min-h-[460px] sm:min-h-[520px]">
          {/* Foreground Large Developer Workstation Terminal */}
          <div className="relative z-10 w-full">
            <HeroTerminal
              displayName={profile.displayName}
              professionalTitle="Offensive Security Student"
              profileImageUrl={profile.profileImage?.url || "/profile.jpg"}
              skills={featuredSkills}
              projects={featuredProjects}
            />
          </div>
        </div>
      </div>

      {/* Minimalist Discipline Indicators (Clean editorial border, no fake ticker) */}
      <div className="max-w-7xl mx-auto w-full pt-8 border-t border-[var(--color-border)] mt-8 relative z-10">
        <div className="flex flex-wrap items-center justify-between gap-y-3 font-mono text-xs text-zinc-500 tracking-wider">
          <span className="text-zinc-400">WEB APPLICATION VAPT</span>
          <span className="text-zinc-700">/</span>
          <span className="text-zinc-400">ACTIVE DIRECTORY AUDITING</span>
          <span className="text-zinc-700">/</span>
          <span className="text-zinc-400">ATTACK SURFACE RECONNAISSANCE</span>
          <span className="text-zinc-700">/</span>
          <span className="text-zinc-400">SECURITY AUTOMATION & TOOLING</span>
        </div>
      </div>
    </section>
  );
}
