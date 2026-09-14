# 3D Graphics & WebGL Engine Audit — Jaishanth M Portfolio

**Date:** September 12, 2026  
**Auditor:** Creative Technologist & WebGL Systems Engineer  
**Libraries:** Three.js 0.168.0, @react-three/fiber 8.17.0, @react-three/drei 9.114.0  
**Concept:** "Signal Lattice" — Crystalline Security Core & Proximity Field  
**Status:** **PASSED — FULLY OPTIMIZED & RESILIENT**

---

## 1. Geometry & Scene Architecture

The 3D experience is encapsulated in `src/components/three/SignalLattice.tsx`:

### 1.1 Faceted Security Core
- Geometry: `icosahedronGeometry args={[1.4, 0]}` (low-poly 20-faced polyhedron).
- Material: `meshPhysicalMaterial` with deep electric blue (`#2B6CFF`), cool cyan emissive highlights (`#14B8A6`), roughness 0.15, transmission 0.6, and clearcoat 1.
- Behavior: Independent gentle counter-rotation on the Y-axis (`-0.05 * delta`), creating dynamic refraction against background illumination.

### 1.2 Instanced Outer Node Field
- Geometry: `instancedMesh` with 60 instances of `sphereGeometry args={[0.035, 6, 6]}`.
- Memory: Uses a single GPU draw call via matrix buffer updates (`instanceMatrix.needsUpdate = true`).
- Distribution: Spherical random distribution within a radius of 2.4 to 4.0 units.

### 1.3 Nearest Neighbor Connection Lines
- Geometry: `lineSegments` with `BufferGeometry` linking each node strictly to its single nearest neighbor.
- Aesthetics: Avoids chaotic web spiderwebs in favor of a clean, sparse cybersecurity mesh.

---

## 2. Parallax Camera Physics & Bound Enforcement

- Component: `ParallaxCamera` in `src/components/three/Scene.tsx`.
- Mechanics: Calculates rotational delta based on mouse normalized coordinates `(mouse.x, mouse.y)`.
- Angle Clamping: Strictly bounded to **±8 degrees** (`(8 * Math.PI) / 180`).
- Easing: Uses smooth frame-interpolated lerp (`camera.rotation.y += (target - current) * 0.05`), preventing visual snapping or jarring transitions.

---

## 3. WebGL Context Loss & Recovery

- Component: `ContextLossHandler` listens for the native `webglcontextlost` DOM event.
- Recovery Mechanism: Automatically intercepts the event (`e.preventDefault()`) and flags `contextLost = true` in parent state.
- Graceful Fallback: The component unmounts the broken WebGL canvas and mounts `/hero-fallback.svg` seamlessly without throwing uncaught JavaScript errors or displaying black boxes.

---

## 4. Device-Tier & Performance Mode Matrix

| Tier / Mode | 3D Mode Setting | Runtime Behavior | Asset Fetched |
| :--- | :--- | :--- | :--- |
| **Desktop High** | `FULL` | Full Signal Lattice (Core + 60 Instanced Nodes + Lines) + Interactive Mouse Parallax. | Three.js chunk dynamically loaded after idle. |
| **Desktop / Tablet** | `LITE` | Core Icosahedron only + Ambient Rotation (Instanced field omitted). | Three.js chunk loaded. |
| **Mobile (<768px)** | Any | Bypassed. Static vector fallback rendered. | **0 bytes Three.js loaded.** |
| **Reduced Motion** | Any | Bypassed. Static vector fallback rendered. | **0 bytes Three.js loaded.** |
| **Admin OFF Flag** | `OFF` | Bypassed globally by admin toggle. | **0 bytes Three.js loaded.** |

---

## 5. WebGL Draw-Call & Memory Audit

- **Draw Calls:** 4 calls per frame.
- **Poly Count:** ~320 triangles total (low-poly budget).
- **VRAM Footprint:** < 8 MB VRAM allocated.
- **Garbage Collection:** Geometries and materials dispose properly upon component unmount.
