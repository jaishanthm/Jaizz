"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  baseAlpha: number;
  color: string;
  zDepth: number;
}

interface Star {
  x: number;
  y: number;
  radius: number;
  baseAlpha: number;
  twinkleSpeed: number;
  twinklePhase: number;
  zDepth: number;
}

export default function BackgroundEngine() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const spotlightRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Check reduced motion preference
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    const mouse = {
      x: width / 2,
      y: height / 2,
      targetX: width / 2,
      targetY: height / 2,
      inside: true,
    };

    const isMobile = width < 768;
    const particleCount = prefersReducedMotion ? 0 : isMobile ? 35 : 75;
    const starCount = prefersReducedMotion ? 0 : isMobile ? 40 : 90;
    const colors = ["#00E5FF", "#2B6CFF", "#5B8FFF", "#36C8FF"];

    const particles: Particle[] = [];
    const stars: Star[] = [];

    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
      const zDepth = Math.random() * 1.5 + 0.5;
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35 * zDepth,
        vy: (Math.random() - 0.5) * 0.35 * zDepth,
        radius: (Math.random() * 1.5 + 1) * Math.sqrt(zDepth),
        baseAlpha: Math.random() * 0.35 + 0.25,
        color: colors[Math.floor(Math.random() * colors.length)],
        zDepth,
      });
    }

    // Initialize stars
    for (let i = 0; i < starCount; i++) {
      const zDepth = Math.random() * 0.8 + 0.2;
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 0.75 + 0.35,
        baseAlpha: Math.random() * 0.3 + 0.15,
        twinkleSpeed: Math.random() * 0.003 + 0.001,
        twinklePhase: Math.random() * Math.PI * 2,
        zDepth,
      });
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
      mouse.inside = true;

      // Update global CSS mouse variables for background spotlight
      if (spotlightRef.current) {
        spotlightRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      }
    };

    const handleMouseLeave = () => {
      mouse.inside = false;
    };

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("resize", handleResize);

    // Interactive card 3D tilt delegation
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

    let animationFrameId: number;

    const render = (timestamp: number) => {
      ctx.clearRect(0, 0, width, height);

      // Smooth mouse interpolation
      mouse.x += (mouse.targetX - mouse.x) * 0.08;
      mouse.y += (mouse.targetY - mouse.y) * 0.08;

      if (!prefersReducedMotion) {
        // Draw twinkling background stars
        for (let i = 0; i < stars.length; i++) {
          const s = stars[i];
          const twinkleAlpha = s.baseAlpha + Math.sin(timestamp * s.twinkleSpeed + s.twinklePhase) * 0.2;
          const alpha = Math.max(0.05, Math.min(0.75, twinkleAlpha));

          ctx.beginPath();
          ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
          ctx.fillStyle = "#ffffff";
          ctx.globalAlpha = alpha;
          ctx.fill();
        }

        // Draw floating interconnected particles
        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          p.x += p.vx;
          p.y += p.vy;

          if (p.x < -10) p.x = width + 10;
          if (p.x > width + 10) p.x = -10;
          if (p.y < -10) p.y = height + 10;
          if (p.y > height + 10) p.y = -10;

          // Mouse repulsion & interaction
          if (mouse.inside) {
            const dx = p.x - mouse.x;
            const dy = p.y - mouse.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const maxDist = 160;

            if (dist < maxDist && dist > 0) {
              const force = (1 - dist / maxDist) * 0.06;
              p.x += (dx / dist) * force * 10 * p.zDepth;
              p.y += (dy / dist) * force * 10 * p.zDepth;

              // Line to cursor
              ctx.beginPath();
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(mouse.x, mouse.y);
              ctx.strokeStyle = "#00E5FF";
              ctx.globalAlpha = (1 - dist / maxDist) * 0.3 * p.zDepth;
              ctx.lineWidth = 0.8;
              ctx.stroke();
            }
          }

          // Render particle dot
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.baseAlpha;
          ctx.fill();

          // Nearest neighbor connections
          for (let j = i + 1; j < particles.length; j++) {
            const p2 = particles[j];
            const dx = p.x - p2.x;
            const dy = p.y - p2.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const lineDist = 120;

            if (dist < lineDist) {
              ctx.beginPath();
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.strokeStyle = p.color;
              ctx.globalAlpha = (1 - dist / lineDist) * 0.18 * Math.min(p.zDepth, p2.zDepth);
              ctx.lineWidth = 0.7;
              ctx.stroke();
            }
          }
        }
        ctx.globalAlpha = 1;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleCardTilt);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
      {/* Deep Navy Atmosphere Gradients */}
      <div 
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(43, 108, 255, 0.18), transparent 70%), radial-gradient(ellipse 60% 50% at 90% 80%, rgba(0, 229, 255, 0.08), transparent 60%), #050816",
        }}
      />

      {/* Cyber Perspective Grid */}
      <div className="absolute inset-0 perspective-grid opacity-25" />

      {/* Volumetric Atmosphere Glow Blobs */}
      <div 
        className="absolute top-1/4 -left-48 w-[600px] h-[600px] rounded-full blur-[140px] opacity-20 pointer-events-none"
        style={{ background: "radial-gradient(circle, #2B6CFF 0%, transparent 70%)" }}
      />
      <div 
        className="absolute top-2/3 -right-48 w-[700px] h-[700px] rounded-full blur-[160px] opacity-15 pointer-events-none"
        style={{ background: "radial-gradient(circle, #00E5FF 0%, transparent 70%)" }}
      />

      {/* Full-screen Constellation & Particle Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />

      {/* Cursor Radial Spotlight */}
      <div
        ref={spotlightRef}
        className="absolute -top-48 -left-48 w-96 h-96 rounded-full pointer-events-none transition-transform duration-75 ease-out opacity-25 blur-[90px]"
        style={{
          background: "radial-gradient(circle, rgba(54, 200, 255, 0.5) 0%, transparent 70%)",
        }}
      />
    </div>
  );
}
