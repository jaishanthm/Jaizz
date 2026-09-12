"use client";

import { useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import SignalLattice from "./SignalLattice";

// Phase 11 §2 — desktop gets mouse-parallax camera tilt (±8° max, eased),
// tablet gets ambient rotation only (no pointer response — Phase 7 §6:
// touch-drag on a 3D scene fights page-scroll gestures). LITE mode renders
// the core only, no instanced field — cheapest real render available.

// Phase 11 §2 — desktop gets mouse-parallax camera tilt (±8° max, eased),
// tablet gets ambient rotation only (no pointer response — Phase 7 §6:
// touch-drag on a 3D scene fights page-scroll gestures). LITE mode renders
// the core only, no instanced field — cheapest real render available.

function ParallaxCamera({ interactive }: { interactive: boolean }) {
  const { camera, mouse } = useThree();

  // Real rotational tilt, not a position offset dressed up with lookAt() —
  // an earlier version moved camera.position and let lookAt() imply a
  // rotation, which produces a similar-looking effect but isn't actually
  // bounded to ±8° of rotation (it was bounded to ±8° worth of *position*
  // units at some arbitrary distance, a different quantity entirely).
  // Fixed to set camera.rotation directly, eased toward a target each
  // frame — genuinely bounded to ±8°, no snapping.
  useFrame(() => {
    if (!interactive) return;
    const maxTiltRad = (8 * Math.PI) / 180;
    const targetRotY = -mouse.x * maxTiltRad;
    const targetRotX = mouse.y * maxTiltRad;
    camera.rotation.y += (targetRotY - camera.rotation.y) * 0.05;
    camera.rotation.x += (targetRotX - camera.rotation.x) * 0.05;
  });
  return null;
}

function ContextLossHandler({ onContextLost }: { onContextLost: () => void }) {
  const { gl } = useThree();
  useEffect(() => {
    const canvas = gl.domElement;
    const handler = (e: Event) => {
      e.preventDefault();
      onContextLost();
    };
    canvas.addEventListener("webglcontextlost", handler);
    return () => canvas.removeEventListener("webglcontextlost", handler);
  }, [gl, onContextLost]);
  return null;
}

export default function Scene({
  interactive,
  lite,
  onContextLost,
}: {
  interactive: boolean;
  lite: boolean;
  onContextLost: () => void;
}) {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 45 }}
      dpr={lite ? 1 : [1, 2]}
      gl={{ antialias: !lite, alpha: true }}
    >
      <ParallaxCamera interactive={interactive} />
      <ContextLossHandler onContextLost={onContextLost} />
      {lite ? (
        <>
          {/* LITE: core only, via a stripped instance of the same group —
              reusing SignalLattice would also mount the field/lines, so
              LITE renders just the core mesh directly here. */}
          <mesh>
            <icosahedronGeometry args={[1.4, 0]} />
            <meshStandardMaterial color="#2B6CFF" emissive="#14B8A6" emissiveIntensity={0.15} roughness={0.3} />
          </mesh>
          <ambientLight intensity={0.5} />
          <pointLight position={[3, 3, 3]} color="#2B6CFF" intensity={30} />
        </>
      ) : (
        <SignalLattice />
      )}
    </Canvas>
  );
}
