"use client";

import React from "react";
import Image from "next/image";

export interface HeroTerminalProps {
  displayName?: string;
  professionalTitle?: string;
  profileImageUrl?: string;
  skills?: string[];
  projects?: { name: string; shortDescription?: string | null }[];
}

export default function HeroTerminal({
  displayName = "Jaishanth M.",
  professionalTitle = "Offensive Security Student",
  profileImageUrl = "/profile.jpg",
  skills = [
    "Web Application Penetration Testing",
    "Active Directory Security & Kerberos",
    "Attack Surface Reconnaissance & OSINT",
    "Security Scripting & Exploit Tooling",
  ],
  projects = [
    { name: "Horizon", shortDescription: "Attack Surface & Reconnaissance Engine" },
    { name: "CyberFlow", shortDescription: "Network Traffic Anomaly & Packet Analyzer" },
  ],
}: HeroTerminalProps) {
  return (
    <div className="relative w-full max-w-xl mx-auto lg:mx-0">
      {/* Outer Terminal Container */}
      <div className="rounded-xl border border-white/[0.09] bg-[#0a0a0d]/95 backdrop-blur-xl shadow-2xl shadow-black/90 overflow-hidden font-mono text-xs sm:text-[13px] leading-relaxed">
        {/* Terminal Title Bar */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.07] bg-white/[0.02]">
          {/* Window Traffic Lights */}
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f]/80" />
          </div>

          {/* Session Title */}
          <div className="text-[11px] sm:text-xs text-zinc-400 font-medium tracking-wide">
            jaishanth@security-lab:~
          </div>

          {/* Environment Tag */}
          <div className="flex items-center gap-1.5 text-[10px] text-zinc-500 uppercase tracking-widest font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400/80" />
            <span>zsh</span>
          </div>
        </div>

        {/* Terminal Body */}
        <div className="p-5 sm:p-6 space-y-4 text-zinc-300">
          {/* Command 1: whoami */}
          <div>
            <div className="flex items-center gap-2 text-zinc-400">
              <span className="text-[var(--color-signal-red)] font-bold">$</span>
              <span className="text-zinc-200">whoami</span>
            </div>
            <p className="text-zinc-400 pl-4 mt-1 font-sans text-xs sm:text-sm font-medium">
              {displayName.toLowerCase().replace(/\s+/g, "")}
            </p>
          </div>

          {/* Command 2: focus */}
          <div>
            <div className="flex items-center gap-2 text-zinc-400">
              <span className="text-[var(--color-signal-red)] font-bold">$</span>
              <span className="text-zinc-200">focus</span>
            </div>
            <p className="text-zinc-300 pl-4 mt-1">
              Offensive Security <span className="text-zinc-600">·</span> Red Team Tooling <span className="text-zinc-600">·</span> Vulnerability Analysis
            </p>
          </div>

          {/* Command 3: capabilities */}
          <div>
            <div className="flex items-center gap-2 text-zinc-400">
              <span className="text-[var(--color-signal-red)] font-bold">$</span>
              <span className="text-zinc-200">capabilities</span>
            </div>
            <div className="pl-4 mt-1.5 space-y-1 text-zinc-400">
              {skills.slice(0, 4).map((skill, idx) => (
                <div key={idx} className="flex items-baseline gap-2">
                  <span className="text-zinc-600">›</span>
                  <span className="text-zinc-300">{skill}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Command 4: projects */}
          <div>
            <div className="flex items-center gap-2 text-zinc-400">
              <span className="text-[var(--color-signal-red)] font-bold">$</span>
              <span className="text-zinc-200">projects --featured</span>
            </div>
            <div className="pl-4 mt-1.5 space-y-1.5">
              {projects.slice(0, 2).map((proj, idx) => (
                <div key={idx} className="flex items-baseline gap-2 text-zinc-300">
                  <span className="text-[var(--color-signal-red)] text-[11px]">[*]</span>
                  <span className="text-white font-medium">{proj.name.split("—")[0].trim()}</span>
                  {proj.shortDescription && (
                    <span className="text-zinc-500 text-[11px] hidden sm:inline truncate max-w-[260px]">
                      — {proj.shortDescription.split(".")[0]}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Command 5: status */}
          <div>
            <div className="flex items-center gap-2 text-zinc-400">
              <span className="text-[var(--color-signal-red)] font-bold">$</span>
              <span className="text-zinc-200">status</span>
            </div>
            <div className="pl-4 mt-1 flex items-center gap-2 text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Building toward Red Team [Research Active]</span>
            </div>
          </div>

          {/* Active prompt with blinking cursor */}
          <div className="flex items-center gap-2 text-zinc-400 pt-1">
            <span className="text-[var(--color-signal-red)] font-bold">$</span>
            <span className="w-2 h-4 bg-zinc-200/90 animate-pulse" />
          </div>
        </div>
      </div>

      {/* Subtle Profile Identity Chip Overlapping Lower Edge */}
      <div className="absolute -bottom-4 left-6 sm:left-8 inline-flex items-center gap-3 px-3.5 py-2 rounded-xl bg-zinc-950/95 border border-white/10 shadow-xl backdrop-blur-md z-20">
        <div className="relative w-8 h-8 rounded-full overflow-hidden border border-white/20 bg-zinc-900 shrink-0">
          <Image
            src={profileImageUrl}
            alt={displayName}
            fill
            sizes="32px"
            className="object-cover object-top"
          />
        </div>
        <div className="text-left">
          <div className="font-heading text-xs font-semibold text-white leading-tight">
            {displayName}
          </div>
          <div className="font-mono text-[10px] text-zinc-400 leading-tight">
            {professionalTitle}
          </div>
        </div>
      </div>
    </div>
  );
}
