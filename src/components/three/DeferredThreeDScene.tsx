"use client";

import React, { useState, useEffect, useRef, Suspense, Component, type ErrorInfo, type ReactNode } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";

// Error boundary to protect the page from WebGL / driver crashes or unsupported features
class ThreeDErrorBoundary extends Component<{ fallback: ReactNode; children: ReactNode }, { hasError: boolean }> {
  state = { hasError: false };

  static getDerivedStateFromError(_: Error) {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.warn("ThreeDErrorBoundary caught WebGL/R3F error:", error);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

// Phase 11 §2/§3 — device-tier + reduced-motion + flag-off resolution
// happens here, BEFORE the Three.js bundle is ever imported. The dynamic
// import below only fires once this component decides a real WebGL scene
// should render — "OFF" mode or mobile never fetches the Three.js chunk at
// all, not just hides it after loading.

const Scene = dynamic(() => import("./Scene"), { ssr: false });

type ThreeDMode = "FULL" | "LITE" | "OFF";

function useDeviceTier() {
  const [tier, setTier] = useState<"desktop" | "tablet" | "mobile" | null>(null);
  useEffect(() => {
    const width = window.innerWidth;
    if (width < 768) setTier("mobile");
    else if (width < 1024) setTier("tablet");
    else setTier("desktop");
  }, []);
  return tier;
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const handler = () => setReduced(mq.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return reduced;
}

export default function DeferredThreeDScene({ mode, fallbackSrc }: { mode: ThreeDMode; fallbackSrc: string }) {
  const tier = useDeviceTier();
  const reducedMotion = usePrefersReducedMotion();
  const [shouldMount, setShouldMount] = useState(false);
  const [contextLost, setContextLost] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Mount after hydration, deferred by one idle callback — never competes
  // with LCP-critical content on the main thread. Phase 11 §3.
  useEffect(() => {
    const hasIdle = typeof window !== "undefined" && "requestIdleCallback" in window;
    const id = hasIdle
      ? (window as any).requestIdleCallback(() => setShouldMount(true))
      : setTimeout(() => setShouldMount(true), 1);
    return () => {
      if (hasIdle) (window as any).cancelIdleCallback(id);
      else clearTimeout(id);
    };
  }, []);

  const showStaticFallback =
    mode === "OFF" || reducedMotion || tier === "mobile" || tier === null || contextLost || !shouldMount;

  if (showStaticFallback) {
    return (
      <div ref={containerRef} className="w-full h-full">
        <Image src={fallbackSrc} alt="" fill className="object-cover" priority aria-hidden />
      </div>
    );
  }

  return (
    <div ref={containerRef} className="w-full h-full" aria-hidden="true" role="presentation">
      <ThreeDErrorBoundary fallback={<Image src={fallbackSrc} alt="" fill className="object-cover" priority aria-hidden />}>
        <Suspense fallback={<Image src={fallbackSrc} alt="" fill className="object-cover" aria-hidden />}>
          <Scene
            interactive={tier === "desktop"}
            lite={mode === "LITE"}
            onContextLost={() => setContextLost(true)}
          />
        </Suspense>
      </ThreeDErrorBoundary>
    </div>
  );
}
