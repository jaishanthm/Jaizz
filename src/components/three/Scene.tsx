"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

// Phase 11 — Native Three.js Signal Lattice:
// 1. Faceted low-poly icosahedron core with physical cyber materials + glowing wireframe
// 2. Counter-rotating sparse instanced field with nearest-neighbor lines
// 3. Desktop mouse-parallax camera tilt (±8° max, eased)
// 4. LITE mode (dpr 1, core only)
// 5. Automatic WebGL context loss handling and complete GPU memory disposal

const FIELD_COUNT = 60;
const FIELD_RADIUS = 4;

export default function Scene({
  interactive,
  lite,
  onContextLost,
}: {
  interactive: boolean;
  lite: boolean;
  onContextLost: () => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    let width = container.clientWidth || 400;
    let height = container.clientHeight || 400;

    // Renderer setup
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: !lite,
        powerPreference: "high-performance",
      });
    } catch (e) {
      console.warn("Failed to create WebGLRenderer:", e);
      onContextLost();
      return;
    }

    const dpr = lite ? 1 : Math.min(window.devicePixelRatio || 1, 2);
    renderer.setPixelRatio(dpr);
    renderer.setSize(width, height, false);

    // Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 5);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0x2b6cff, 35, 20);
    pointLight1.position.set(3, 3, 3);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x00e5ff, 25, 20);
    pointLight2.position.set(-3, -2, 2);
    scene.add(pointLight2);

    // Core Mesh & Wireframe
    const coreGroup = new THREE.Group();
    const coreGeo = new THREE.IcosahedronGeometry(1.35, 0);

    const coreMat = new THREE.MeshPhysicalMaterial({
      color: 0x2b6cff,
      emissive: 0x00e5ff,
      emissiveIntensity: 0.18,
      roughness: 0.2,
      metalness: 0.1,
      transparent: true,
      opacity: 0.85,
    });

    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    coreGroup.add(coreMesh);

    // Glowing faceted edge wireframe
    const wireGeo = new THREE.WireframeGeometry(coreGeo);
    const wireMat = new THREE.LineBasicMaterial({
      color: 0x00e5ff,
      transparent: true,
      opacity: 0.6,
    });
    const wireLines = new THREE.LineSegments(wireGeo, wireMat);
    coreGroup.add(wireLines);

    scene.add(coreGroup);

    // Field & Lines (if not lite)
    let fieldGroup: THREE.Group | null = null;
    let instancedMesh: THREE.InstancedMesh | null = null;
    let lineSegments: THREE.LineSegments | null = null;

    if (!lite) {
      fieldGroup = new THREE.Group();
      const positions: THREE.Vector3[] = [];

      for (let i = 0; i < FIELD_COUNT; i++) {
        const r = FIELD_RADIUS * (0.6 + Math.random() * 0.4);
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        positions.push(
          new THREE.Vector3(
            r * Math.sin(phi) * Math.cos(theta),
            r * Math.sin(phi) * Math.sin(theta),
            r * Math.cos(phi)
          )
        );
      }

      // Points InstancedMesh
      const sphereGeo = new THREE.SphereGeometry(0.04, 6, 6);
      const sphereMat = new THREE.MeshBasicMaterial({ color: 0x5b8fff });
      instancedMesh = new THREE.InstancedMesh(sphereGeo, sphereMat, FIELD_COUNT);

      const dummy = new THREE.Object3D();
      positions.forEach((pos, i) => {
        dummy.position.copy(pos);
        dummy.updateMatrix();
        instancedMesh!.setMatrixAt(i, dummy.matrix);
      });
      instancedMesh.instanceMatrix.needsUpdate = true;
      fieldGroup.add(instancedMesh);

      // Nearest-neighbor connection lines
      const lineCoords: number[] = [];
      positions.forEach((p, i) => {
        let nearestIdx = -1;
        let nearestDist = Infinity;
        positions.forEach((q, j) => {
          if (i === j) return;
          const d = p.distanceTo(q);
          if (d < nearestDist) {
            nearestDist = d;
            nearestIdx = j;
          }
        });
        if (nearestIdx !== -1) {
          lineCoords.push(p.x, p.y, p.z, positions[nearestIdx].x, positions[nearestIdx].y, positions[nearestIdx].z);
        }
      });

      const lineGeo = new THREE.BufferGeometry();
      lineGeo.setAttribute("position", new THREE.Float32BufferAttribute(lineCoords, 3));
      const lineMat = new THREE.LineBasicMaterial({
        color: 0x2b6cff,
        transparent: true,
        opacity: 0.35,
      });
      lineSegments = new THREE.LineSegments(lineGeo, lineMat);
      fieldGroup.add(lineSegments);

      scene.add(fieldGroup);
    }

    // Parallax mouse tracking
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    const handleMouseMove = (e: MouseEvent) => {
      if (!interactive) return;
      mouse.targetX = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.targetY = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    if (interactive) {
      window.addEventListener("mousemove", handleMouseMove, { passive: true });
    }

    // Context loss
    const handleContextLost = (e: Event) => {
      e.preventDefault();
      onContextLost();
    };
    canvas.addEventListener("webglcontextlost", handleContextLost);

    // Resize observer
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width: w, height: h } = entry.contentRect;
        if (w > 0 && h > 0) {
          camera.aspect = w / h;
          camera.updateProjectionMatrix();
          renderer.setSize(w, h, false);
        }
      }
    });
    resizeObserver.observe(container);

    // Animation loop
    let animId: number;
    let lastTime = performance.now();
    const maxTiltRad = (8 * Math.PI) / 180;

    const animate = (currentTime: number) => {
      const delta = Math.min((currentTime - lastTime) / 1000, 0.1);
      lastTime = currentTime;

      // Rotate core
      coreGroup.rotation.y -= delta * 0.08;
      coreGroup.rotation.x -= delta * 0.03;

      // Counter-rotate field
      if (fieldGroup) {
        fieldGroup.rotation.y += delta * 0.03;
        fieldGroup.rotation.z += delta * 0.015;
      }

      // Parallax easing
      if (interactive) {
        mouse.x += (mouse.targetX - mouse.x) * 0.05;
        mouse.y += (mouse.targetY - mouse.y) * 0.05;
        camera.rotation.y = -mouse.x * maxTiltRad;
        camera.rotation.x = mouse.y * maxTiltRad;
      }

      renderer.render(scene, camera);
      animId = requestAnimationFrame(animate);
    };

    animId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animId);
      if (interactive) {
        window.removeEventListener("mousemove", handleMouseMove);
      }
      canvas.removeEventListener("webglcontextlost", handleContextLost);
      resizeObserver.disconnect();

      // Dispose resources
      coreGeo.dispose();
      coreMat.dispose();
      wireGeo.dispose();
      wireMat.dispose();
      instancedMesh?.geometry.dispose();
      if (Array.isArray(instancedMesh?.material)) {
        instancedMesh?.material.forEach((m) => m.dispose());
      } else {
        instancedMesh?.material.dispose();
      }
      lineSegments?.geometry.dispose();
      if (Array.isArray(lineSegments?.material)) {
        lineSegments?.material.forEach((m) => m.dispose());
      } else {
        lineSegments?.material.dispose();
      }
      renderer.dispose();
    };
  }, [interactive, lite, onContextLost]);

  return (
    <div ref={containerRef} className="w-full h-full relative overflow-hidden">
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
}
