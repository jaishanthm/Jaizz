import Link from "next/link";
import DeferredThreeDScene from "./three/DeferredThreeDScene";

type Profile = {
  displayName: string;
  professionalTitle: string;
  shortBio: string;
  location?: string | null;
  availability?: string | null;
  resumeMedia: { url: string } | null;
};

export default function HeroSection({
  profile,
  threeDEnabled,
  threeDMode,
  enabledFlags,
}: {
  profile: Profile;
  threeDEnabled: boolean;
  threeDMode: "FULL" | "LITE" | "OFF";
  enabledFlags?: Set<string>;
}) {
  const flags = enabledFlags ?? new Set<string>();

  return (
    <section className="relative min-h-[92vh] flex items-center justify-center pt-24 pb-16 px-6 overflow-hidden">
      {/* Ambient background glow accents */}
      <div
        className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full pointer-events-none opacity-20 blur-[120px]"
        style={{ background: "var(--color-electric-blue)" }}
        aria-hidden="true"
      />
      <div
        className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[450px] h-[450px] rounded-full pointer-events-none opacity-15 blur-[120px]"
        style={{ background: "var(--color-cool-cyan)" }}
        aria-hidden="true"
      />

      <div className="relative max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
        {/* Left Column: Technical Positioning & Directives (7 cols) */}
        <div className="lg:col-span-7 flex flex-col items-start text-left z-10">
          {/* Status Pulsar Tag */}
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full cyber-tag mb-6 text-xs font-mono tracking-wider uppercase border border-[var(--color-border-glow)]">
            <span className="status-dot-pulsar" />
            <span className="text-[var(--color-text-primary)] font-medium">
              {profile.availability || "Open for Security Research & Internship Collaborations"}
            </span>
          </div>

          {/* Space Grotesk Headline */}
          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] mb-4">
            <span className="block text-[var(--color-text-secondary)] text-lg sm:text-xl font-mono font-normal tracking-widest uppercase mb-2">
              Identity: {profile.displayName}
            </span>
            <span className="gradient-text drop-shadow-[0_0_24px_rgba(43,108,255,0.4)]">
              Defending Frontiers
            </span>
            <br />
            <span className="text-[var(--color-text-primary)]">
              Through Offensive Precision.
            </span>
          </h1>

          {/* Subtitle & Role Positioning */}
          <p className="text-lg sm:text-xl font-medium mb-4 text-[var(--color-cool-cyan)] flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-sm bg-[var(--color-cool-cyan)]" />
            {profile.professionalTitle}
          </p>

          {/* Detailed verified bio */}
          <p className="text-base sm:text-lg text-[var(--color-text-secondary)] leading-relaxed mb-6 max-w-2xl font-sans">
            {profile.shortBio}
          </p>

          {/* Interactive Shell / Terminal Pill */}
          <div className="w-full max-w-2xl glass-card rounded-xl p-3.5 mb-8 font-mono text-xs border border-[var(--color-border)] shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
            <div className="flex items-center justify-between pb-2 border-b border-[var(--color-border-subtle)] text-[var(--color-text-muted)] text-[10px]">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/80 inline-block" />
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80 inline-block" />
                <span className="w-2.5 h-2.5 rounded-full bg-green-500/80 inline-block" />
                <span className="ml-2">jaishanth@sec-terminal:~</span>
              </div>
              <span className="text-[var(--color-cool-cyan)] font-mono">LAB_STATUS: ARMED</span>
            </div>
            <div className="pt-2.5 space-y-1">
              <div className="text-[var(--color-electric-blue)] flex items-center gap-2">
                <span className="text-[var(--color-cool-cyan)] font-bold">$</span>
                <span>whoami --focus --institution</span>
              </div>
              <p className="text-[var(--color-text-muted)] pl-4">
                &gt; B.E. Cybersecurity (MCET Pollachi) | Bugcrowd Researcher | Top 1% TryHackMe
              </p>
              <div className="text-[var(--color-electric-blue)] flex items-center gap-2 pt-1">
                <span className="text-[var(--color-cool-cyan)] font-bold">$</span>
                <span>cat core_capabilities.sig</span>
              </div>
              <div className="flex flex-wrap gap-2 pl-4 pt-1">
                <span className="px-2 py-0.5 rounded bg-[rgba(43,108,255,0.15)] text-[var(--color-electric-blue)] border border-[rgba(43,108,255,0.3)]">
                  Web VAPT
                </span>
                <span className="px-2 py-0.5 rounded bg-[rgba(0,229,255,0.12)] text-[var(--color-cool-cyan)] border border-[rgba(0,229,255,0.3)]">
                  Threat Recon & OSINT
                </span>
                <span className="px-2 py-0.5 rounded bg-[rgba(16,185,129,0.12)] text-emerald-400 border border-emerald-500/30">
                  Active Directory Auditing
                </span>
                <span className="px-2 py-0.5 rounded bg-[rgba(245,158,11,0.12)] text-amber-400 border border-amber-500/30">
                  Python Exploit Automation
                </span>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-4">
            {(flags.size === 0 || flags.has("research")) && (
              <Link
                href="/research"
                className="btn-magnetic px-6 py-3 rounded-xl font-medium text-sm flex items-center gap-2 text-white bg-[var(--color-electric-blue)] hover:bg-[var(--color-primary-hover)] shadow-[0_0_20px_rgba(43,108,255,0.4)] border border-[rgba(255,255,255,0.15)] transition-all"
              >
                <span>Explore Research</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            )}

            {(flags.size === 0 || flags.has("projects")) && (
              <Link
                href="/projects"
                className="btn-magnetic px-6 py-3 rounded-xl font-medium text-sm flex items-center gap-2 text-[var(--color-text-primary)] glass-card hover:border-[var(--color-border-glow)] transition-all"
              >
                <span>View Projects</span>
              </Link>
            )}

            {profile.resumeMedia && (flags.size === 0 || flags.has("resume")) && (
              <Link
                href="/resume"
                className="btn-magnetic px-5 py-3 rounded-xl font-medium text-sm flex items-center gap-2 text-[var(--color-cool-cyan)] glass-card border border-[rgba(0,229,255,0.2)] hover:border-[var(--color-cool-cyan)] transition-all"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>Security Dossier</span>
              </Link>
            )}

            {(flags.size === 0 || flags.has("contact")) && (
              <Link
                href="/contact"
                className="px-4 py-3 text-sm font-medium text-[var(--color-text-secondary)] hover:text-white transition-colors"
              >
                Secure Channel →
              </Link>
            )}
          </div>
        </div>

        {/* Right Column: 3D Signal Lattice Viewport with Cyber HUD Frame (5 cols) */}
        <div className="lg:col-span-5 relative w-full flex items-center justify-center">
          <div className="relative w-full aspect-square max-w-[480px] lg:max-w-none lg:h-[540px] rounded-2xl glass-card glow-border overflow-hidden p-1 shadow-[0_8px_32px_rgba(0,0,0,0.6)]">
            {/* Viewport Interior with HUD Telemetry Overlay */}
            <div className="relative w-full h-full rounded-xl overflow-hidden bg-[var(--color-bg-surface)]">
              {/* 3D Scene / Fallback */}
              <div className="absolute inset-0 z-0">
                {threeDEnabled ? (
                  <DeferredThreeDScene mode={threeDMode} fallbackSrc="/hero-fallback.svg" />
                ) : (
                  <div
                    className="w-full h-full flex items-center justify-center"
                    style={{ background: "radial-gradient(circle at 50% 50%, #121A2E, #050814)" }}
                  >
                    <img src="/hero-fallback.svg" alt="Signal Lattice" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              {/* HUD Frame Elements */}
              <div className="absolute inset-0 pointer-events-none p-4 flex flex-col justify-between z-10 font-mono text-[10px] text-[var(--color-text-muted)]">
                {/* Top Bar HUD */}
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-[var(--color-cool-cyan)]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-cool-cyan)] animate-pulse" />
                    NODE: [SEC-3D-CORE]
                  </span>
                  <span className="px-2 py-0.5 rounded bg-[rgba(11,17,32,0.8)] border border-[var(--color-border)]">
                    TARGET: SURFACE_MAP
                  </span>
                </div>

                {/* Crosshairs & Center Grids */}
                <div className="relative flex items-center justify-center">
                  <div className="w-32 h-32 border border-[rgba(43,108,255,0.2)] rounded-full border-dashed pointer-events-none" />
                </div>

                {/* Bottom Bar HUD */}
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded bg-[rgba(11,17,32,0.8)] border border-[var(--color-border)]">
                    LATENCY: 8ms | TLS 1.3
                  </span>
                  <span className="text-[var(--color-electric-blue)] font-bold">
                    SIGNAL_LATTICE: OK
                  </span>
                </div>
              </div>

              {/* Floating Verified Achievement Chips */}
              <div className="absolute bottom-5 left-5 z-20 pointer-events-auto">
                <div className="glass-panel px-3.5 py-2 rounded-xl flex items-center gap-2.5 border border-[var(--color-border-glow)] shadow-lg backdrop-blur-md">
                  <div className="w-7 h-7 rounded-lg bg-[rgba(43,108,255,0.2)] border border-[var(--color-electric-blue)] flex items-center justify-center text-[var(--color-cool-cyan)] font-bold text-xs">
                    THM
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-[var(--color-text-primary)]">TryHackMe Top 1%</div>
                    <div className="text-[10px] text-[var(--color-cool-cyan)] font-mono">Defensive & Offensive Mastery</div>
                  </div>
                </div>
              </div>

              <div className="absolute top-5 right-5 z-20 pointer-events-auto">
                <div className="glass-panel px-3.5 py-2 rounded-xl flex items-center gap-2.5 border border-[var(--color-border-glow)] shadow-lg backdrop-blur-md">
                  <div className="w-7 h-7 rounded-lg bg-[rgba(20,184,166,0.2)] border border-[var(--color-cool-cyan)] flex items-center justify-center text-emerald-400 font-bold text-xs">
                    BC
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-[var(--color-text-primary)]">Bugcrowd Researcher</div>
                    <div className="text-[10px] text-[var(--color-text-muted)] font-mono">Responsible Disclosure</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
