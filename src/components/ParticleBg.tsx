'use client';

import { useEffect, useRef } from 'react';

/**
 * 3D Particle & Matrix Grid Background
 * Extracted from portfolio-main and converted to the red offensive-security UI theme:
 * - Simulated 3D depth field (z-axis movement, size scaling, depth layers)
 * - Tactical red matrix perspective grid with dynamic sine sway
 * - Multi-tiered signal red (#ef4444), crimson (#e11d48), vermilion (#f43f5e) & zinc (#d4d4d8) palette
 * - Foreground crosshairs (+), midground tactical squares, and soft background nodes
 * - Interactive cursor wave repulsion and red spotlight glow
 * - Dynamic constellation attack path vectors between nearby particles
 * - Obsidian trailing motion blur (#09090b)
 * - Retina / high-DPI scaling & prefers-reduced-motion support
 */

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  twinkleSpeed: number;
  twinkleOffset: number;
  z: number; // simulated depth
}

import { hexToRgb } from '@/lib/theme-utils';

function getThemePalette(accentColor: string): string[] {
  const [r, g, b] = hexToRgb(accentColor);
  return [
    `rgba(${r}, ${g}, ${b},`, // Primary accent
    `rgba(${Math.max(0, r - 14)}, ${Math.max(0, g - 10)}, ${Math.min(255, b + 24)},`, // Ambient tint
    `rgba(${Math.min(255, r + 15)}, ${Math.min(255, g + 15)}, ${Math.max(0, b - 10)},`, // Energy highlight
    'rgba(212, 212, 216,', // Tactical Zinc / Silver
  ];
}

function pickColor(palette: string[]): string {
  const r = Math.random();
  if (r < 0.45) return palette[0];
  if (r < 0.75) return palette[1];
  if (r < 0.90) return palette[2];
  return palette[3];
}

function initParticles(count: number, w: number, h: number, palette: string[]): Particle[] {
  return Array.from({ length: count }, () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    vx: (Math.random() - 0.5) * 0.35,
    vy: (Math.random() - 0.5) * 0.35,
    size: Math.random() < 0.7 ? 1.5 : Math.random() < 0.85 ? 2.5 : 3.5,
    color: pickColor(palette),
    alpha: 0.15 + Math.random() * 0.65,
    twinkleSpeed: 0.3 + Math.random() * 0.9,
    twinkleOffset: Math.random() * Math.PI * 2,
    z: Math.random() * 2,
  }));
}

interface ParticleBgProps {
  mode?: "FULL" | "LITE" | "OFF";
  accentColor?: string;
  speedFactor?: number;
}

export default function ParticleBg({
  mode = "FULL",
  accentColor = "#ef4444",
  speedFactor = 1,
}: ParticleBgProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (mode === "OFF") return;

    const [r, g, b] = hexToRgb(accentColor);
    const palette = getThemePalette(accentColor);

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let w = window.innerWidth;
    let h = window.innerHeight;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let particles: Particle[] = [];
    let raf = 0;
    let t = 0;
    let hidden = false;

    // Mouse interaction
    let mouseX = -1000;
    let mouseY = -1000;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const onMouseLeave = () => {
      mouseX = -1000;
      mouseY = -1000;
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    document.addEventListener('mouseleave', onMouseLeave);

    function resize() {
      w = window.innerWidth;
      h = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas!.width = Math.floor(w * dpr);
      canvas!.height = Math.floor(h * dpr);
      ctx!.setTransform(1, 0, 0, 1, 0, 0);
      ctx!.scale(dpr, dpr);

      const count = mode === "LITE"
        ? Math.min(35, Math.max(15, Math.floor((w * h) / 32000)))
        : Math.min(160, Math.max(45, Math.floor((w * h) / 8500)));
      particles = initParticles(count, w, h, palette);
    }

    // Dynamic tactical matrix perspective grid with subtle sinusoidal sway
    function drawMatrixGrid(ctx: CanvasRenderingContext2D, w: number, h: number, t: number) {
      const gridSize = mode === "LITE" ? 96 : 64;
      const perspectiveOffset = Math.sin(t * 0.2) * (mode === "LITE" ? 6 : 12);

      ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, 0.032)`;
      ctx.lineWidth = 1;
      ctx.beginPath();

      // Vertical lines with perspective sway
      for (let x = (t * 8) % gridSize; x < w; x += gridSize) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x + perspectiveOffset, h);
      }

      // Horizontal lines
      for (let y = (t * 4) % gridSize; y < h; y += gridSize) {
        ctx.moveTo(0, y);
        ctx.lineTo(w, y + perspectiveOffset * 0.5);
      }
      ctx.stroke();
    }

    function draw() {
      if (hidden) {
        raf = requestAnimationFrame(draw);
        return;
      }

      // Cyber trailing effect with exact obsidian (#09090b) clear
      ctx!.fillStyle = 'rgba(9, 9, 11, 0.26)';
      ctx!.fillRect(0, 0, w, h);

      t += 0.016 * Math.max(0.2, speedFactor);

      drawMatrixGrid(ctx!, w, h, t);

      for (const p of particles) {
        if (!prefersReducedMotion && speedFactor > 0) {
          // 3D Depth-based movement: closer particles (higher z) move noticeably faster
          const speedMult = (1 + p.z * 0.55) * speedFactor;
          p.x += p.vx * speedMult;
          p.y += p.vy * speedMult;

          // Wrap around viewport boundaries
          if (p.x < 0) p.x = w;
          if (p.x > w) p.x = 0;
          if (p.y < 0) p.y = h;
          if (p.y > h) p.y = 0;
        }

        // Mouse repulsion & interaction glow
        const dx = mouseX - p.x;
        const dy = mouseY - p.y;
        const distSq = dx * dx + dy * dy;
        const interactionRadius = 160;
        let interactionGlow = 0;

        if (distSq < interactionRadius * interactionRadius && distSq > 0) {
          const dist = Math.sqrt(distSq);
          const force = (interactionRadius - dist) / interactionRadius;
          if (!prefersReducedMotion && speedFactor > 0) {
            p.x -= (dx / dist) * force * 1.6;
            p.y -= (dy / dist) * force * 1.6;
          }
          interactionGlow = force * 0.85; // Extra brightness on hover
        }

        const twinkle = 0.5 + 0.5 * Math.sin(t * p.twinkleSpeed + p.twinkleOffset);
        let alpha = p.alpha * (0.35 + 0.65 * twinkle) + interactionGlow;
        alpha = Math.min(1, Math.max(0, alpha));

        const displaySize = p.size * (1 + p.z * 0.3) + interactionGlow * 2.2;

        ctx!.fillStyle = `${p.color}${alpha.toFixed(2)})`;

        // Draw tactical depth shapes based on simulated z-distance
        if (p.z > 1.5) {
          // Foremost plane: Precision crosshairs (+)
          ctx!.fillRect(p.x - displaySize / 2, p.y - 0.5, displaySize, 1);
          ctx!.fillRect(p.x - 0.5, p.y - displaySize / 2, 1, displaySize);
        } else if (p.z > 0.85) {
          // Midground plane: Sharp tactical squares
          ctx!.fillRect(p.x - displaySize / 2, p.y - displaySize / 2, displaySize, displaySize);
        } else {
          // Background depth: Soft rounded nodes
          ctx!.beginPath();
          ctx!.arc(p.x, p.y, displaySize / 2, 0, Math.PI * 2);
          ctx!.fill();
        }

        // Tactical attack path / constellation vectors between nearby foreground particles (FULL mode only)
        if (mode === "FULL" && p.z > 0.95) {
          for (const other of particles) {
            if (p === other || other.z <= 0.95) continue;
            const odx = p.x - other.x;
            const ody = p.y - other.y;
            const odistSq = odx * odx + ody * ody;
            if (odistSq < 8500) {
              const lineAlpha = (1 - Math.sqrt(odistSq) / Math.sqrt(8500)) * 0.16;
              ctx!.strokeStyle = `${p.color}${lineAlpha.toFixed(2)})`;
              ctx!.lineWidth = 0.6;
              ctx!.beginPath();
              ctx!.moveTo(p.x, p.y);
              ctx!.lineTo(other.x, other.y);
              ctx!.stroke();
            }
          }
        }
      }

      // Dynamic spotlight tracking cursor
      if (mouseX > 0 && mouseY > 0) {
        const gradient = ctx!.createRadialGradient(mouseX, mouseY, 0, mouseX, mouseY, 320);
        gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0.07)`);
        gradient.addColorStop(0.45, `rgba(${r}, ${g}, ${b}, 0.025)`);
        gradient.addColorStop(1, 'rgba(9, 9, 11, 0)');
        ctx!.fillStyle = gradient;
        ctx!.fillRect(0, 0, w, h);
      }

      if (!prefersReducedMotion && speedFactor > 0) {
        raf = requestAnimationFrame(draw);
      }
    }

    const onVis = () => {
      hidden = document.hidden;
    };
    document.addEventListener('visibilitychange', onVis);
    window.addEventListener('resize', resize, { passive: true });

    resize();
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener('visibilitychange', onVis);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
    };
  }, [mode, accentColor, speedFactor]);

  if (mode === "OFF") {
    return null;
  }

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  );
}
