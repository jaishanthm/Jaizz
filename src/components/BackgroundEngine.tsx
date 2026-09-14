"use client";

import { useEffect, useRef } from "react";

import ParticleBg from "./ParticleBg";
import { hexToRgb } from "@/lib/theme-utils";

interface BackgroundEngineProps {
  threeDMode?: "FULL" | "LITE" | "OFF";
  accentColor?: string;
  animationIntensity?: number;
}

export default function BackgroundEngine({
  threeDMode = "FULL",
  accentColor = "#ef4444",
  animationIntensity = 50,
}: BackgroundEngineProps) {
  const spotlightRef = useRef<HTMLDivElement | null>(null);
  const [r, g, b] = hexToRgb(accentColor);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion || animationIntensity === 0) return;

    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let currentX = targetX;
    let currentY = targetY;
    let animId: number;

    const handleMouseMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    // Interactive card tilt delegation (supplying CSS variables to hovered interactive cards)
    const handleCardTilt = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest(".glass-card-interactive") as HTMLElement | null;
      if (!target) return;
      const rect = target.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      target.style.setProperty("--card-mouse-x", `${x}px`);
      target.style.setProperty("--card-mouse-y", `${y}px`);
    };
    window.addEventListener("mousemove", handleCardTilt, { passive: true });

    const animate = () => {
      currentX += (targetX - currentX) * 0.06;
      currentY += (targetY - currentY) * 0.06;

      if (spotlightRef.current) {
        spotlightRef.current.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
      }

      animId = requestAnimationFrame(animate);
    };

    animId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousemove", handleCardTilt);
    };
  }, [animationIntensity]);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
      {/* Obsidian Base Foundation */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          backgroundColor: "#09090b",
          backgroundImage: `
            radial-gradient(ellipse 90% 60% at 50% -15%, rgba(${r}, ${g}, ${b}, 0.05), transparent 75%),
            radial-gradient(ellipse 60% 40% at 85% 95%, rgba(${r}, ${g}, ${b}, 0.03), transparent 60%)
          `,
        }}
      />

      {/* 3D Particle & Matrix Grid Background (Dynamic Mode & Accent) */}
      <ParticleBg
        mode={threeDMode}
        accentColor={accentColor}
        speedFactor={animationIntensity / 50}
      />

      {/* Gentle Floating Atmospheric Dynamic Spotlight */}
      <div
        ref={spotlightRef}
        className="absolute -top-64 -left-64 w-[520px] h-[520px] rounded-full pointer-events-none opacity-20 blur-[130px] transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle, rgba(${r}, ${g}, ${b}, 0.35) 0%, rgba(${r}, ${g}, ${b}, 0.1) 45%, transparent 70%)`,
        }}
      />
    </div>
  );
}
