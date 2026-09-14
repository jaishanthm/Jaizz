"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * 3D Live Transition Animation Background Engine
 * - Dynamic undulating topological wave mesh (multi-frequency harmonic sinusoidal lattice)
 * - Interactive cursor wave disturbance & smooth damped parallax tilt
 * - Scroll-depth camera transition receding into atmospheric obsidian fog (#09090b)
 * - Off-center faceted architectural core & floating counter-rotating spatial shards
 * - Pulsing signal-red telemetry beacons & hairline network connection vectors
 * - Dynamic orbital key light sweeping specular metallic glints across the terrain
 * - Full memory disposal on unmount & adaptive mobile lite tier
 */

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

    const width = container.clientWidth || 1200;
    const height = container.clientHeight || 800;

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

    const dpr = lite ? 1 : Math.min(window.devicePixelRatio || 1, 1.5);
    renderer.setPixelRatio(dpr);
    renderer.setSize(width, height, false);

    const scene = new THREE.Scene();
    // Atmospheric fog fading naturally into exact page background (#09090b)
    scene.fog = new THREE.FogExp2(0x09090b, 0.085);

    const camera = new THREE.PerspectiveCamera(44, width / height, 0.1, 80);
    const baseCamPos = new THREE.Vector3(0, 1.4, 7.6);
    camera.position.copy(baseCamPos);

    // Studio & Architectural Lighting
    const ambientLight = new THREE.AmbientLight(0x18181b, 1.4);
    scene.add(ambientLight);

    // Dynamic sweeping key white light
    const keyWhiteLight = new THREE.DirectionalLight(0xf4f4f5, 2.5);
    keyWhiteLight.position.set(5, 6, 4);
    scene.add(keyWhiteLight);

    // Soft zinc fill light
    const softFillLight = new THREE.DirectionalLight(0x71717a, 0.7);
    softFillLight.position.set(-5, -2, -3);
    scene.add(softFillLight);

    // Signal Red Accent Point Light (pulses in rhythm)
    const signalRedLight = new THREE.PointLight(0xef4444, 26, 16);
    signalRedLight.position.set(2.4, -0.6, 2.8);
    scene.add(signalRedLight);

    // Main 3D World Group
    const worldGroup = new THREE.Group();
    scene.add(worldGroup);

    // ------------------------------------------------------------------------
    // 1. DYNAMIC UNDULATING TOPOLOGICAL WAVE LATTICE
    // ------------------------------------------------------------------------
    const planeW = 40;
    const planeH = 26;
    const segX = lite ? 38 : 68;
    const segY = lite ? 24 : 46;
    const waveGeo = new THREE.PlaneGeometry(planeW, planeH, segX, segY);

    // Save initial coordinates for harmonic wave calculations
    const posAttr = waveGeo.attributes.position;
    const vertCount = posAttr.count;
    const origX = new Float32Array(vertCount);
    const origY = new Float32Array(vertCount);
    for (let i = 0; i < vertCount; i++) {
      origX[i] = posAttr.getX(i);
      origY[i] = posAttr.getY(i);
    }

    // Hairline wireframe lattice material
    const wireMat = new THREE.MeshStandardMaterial({
      color: 0x3f3f46,
      wireframe: true,
      transparent: true,
      opacity: 0.38,
      metalness: 0.9,
      roughness: 0.25,
    });
    const waveMesh = new THREE.Mesh(waveGeo, wireMat);
    waveMesh.rotation.x = -Math.PI * 0.44;
    waveMesh.position.set(0, -2.4, -1.8);
    worldGroup.add(waveMesh);

    // Subtle dark translucent underlying base surface (adds tactile depth)
    let baseMat: THREE.MeshStandardMaterial | null = null;
    let baseMesh: THREE.Mesh | null = null;
    if (!lite) {
      baseMat = new THREE.MeshStandardMaterial({
        color: 0x0c0c11,
        transparent: true,
        opacity: 0.55,
        roughness: 0.6,
        metalness: 0.4,
        flatShading: true,
      });
      baseMesh = new THREE.Mesh(waveGeo, baseMat);
      baseMesh.rotation.x = -Math.PI * 0.44;
      baseMesh.position.set(0, -2.42, -1.8);
      worldGroup.add(baseMesh);
    }

    // ------------------------------------------------------------------------
    // 2. OFF-CENTER ARCHITECTURAL CORE & FLOATING SHARDS
    // (Framing the workstation terminal on the right side)
    // ------------------------------------------------------------------------
    const coreGroup = new THREE.Group();
    coreGroup.position.set(2.4, 0.3, -0.2);
    worldGroup.add(coreGroup);

    // Faceted Polyhedron Core
    const coreGeo = new THREE.IcosahedronGeometry(1.5, 0);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0x131318,
      metalness: 0.94,
      roughness: 0.18,
      flatShading: true,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    coreGroup.add(coreMesh);

    // Precision Ridge Edges
    const edgesGeo = new THREE.EdgesGeometry(coreGeo);
    const edgesMat = new THREE.LineBasicMaterial({
      color: 0x71717a,
      transparent: true,
      opacity: 0.75,
    });
    const edgeLines = new THREE.LineSegments(edgesGeo, edgesMat);
    coreGroup.add(edgeLines);

    // Floating Spatial Planar Shards
    const fragmentGeos: THREE.BufferGeometry[] = [];
    const fragmentMats: THREE.Material[] = [];
    const fragmentMeshes: THREE.Mesh[] = [];

    const fragmentConfigs = [
      { pos: [1.6, 1.1, -0.7], rot: [0.4, 0.8, 0.2], scale: [1.1, 0.5, 0.02] },
      { pos: [-1.7, 1.3, 0.4], rot: [-0.6, 0.3, 0.9], scale: [0.9, 0.7, 0.02] },
      { pos: [0.5, -1.9, 0.9], rot: [0.8, -0.5, 0.3], scale: [1.2, 0.4, 0.02] },
      { pos: [-1.8, -1.3, -0.7], rot: [-0.3, 0.9, -0.5], scale: [0.8, 0.8, 0.02] },
      { pos: [2.3, -0.8, 0.6], rot: [0.5, -0.7, -0.2], scale: [0.7, 1.0, 0.02] },
      { pos: [-0.3, 2.1, -0.5], rot: [0.2, 0.4, 0.7], scale: [1.2, 0.5, 0.02] },
      // Secondary subtle deep-left background shards (framing depth)
      { pos: [-6.2, 0.8, -2.5], rot: [0.3, -0.4, 0.5], scale: [1.4, 0.8, 0.02] },
      { pos: [-5.4, -1.6, -3.0], rot: [-0.5, 0.6, -0.3], scale: [1.1, 0.6, 0.02] },
    ];

    if (!lite) {
      const fragMat = new THREE.MeshStandardMaterial({
        color: 0x181820,
        metalness: 0.95,
        roughness: 0.2,
      });
      fragmentMats.push(fragMat);

      fragmentConfigs.forEach((cfg) => {
        const geo = new THREE.BoxGeometry(cfg.scale[0], cfg.scale[1], cfg.scale[2]);
        fragmentGeos.push(geo);

        const mesh = new THREE.Mesh(geo, fragMat);
        mesh.position.set(cfg.pos[0], cfg.pos[1], cfg.pos[2]);
        mesh.rotation.set(cfg.rot[0], cfg.rot[1], cfg.rot[2]);
        coreGroup.add(mesh);
        fragmentMeshes.push(mesh);

        const fragEdgeGeo = new THREE.EdgesGeometry(geo);
        fragmentGeos.push(fragEdgeGeo);
        const fragEdgeMat = new THREE.LineBasicMaterial({
          color: 0x52525b,
          transparent: true,
          opacity: 0.6,
        });
        fragmentMats.push(fragEdgeMat);
        const fragEdge = new THREE.LineSegments(fragEdgeGeo, fragEdgeMat);
        mesh.add(fragEdge);
      });
    }

    // ------------------------------------------------------------------------
    // 3. TELEMETRY NODES & CONSTELLATION NETWORK VECTORS
    // ------------------------------------------------------------------------
    let vectorLines: THREE.LineSegments | null = null;
    let nodePoints: THREE.InstancedMesh | null = null;
    let pointGeo: THREE.SphereGeometry | null = null;
    let pointMat: THREE.MeshBasicMaterial | null = null;
    let linesGeo: THREE.BufferGeometry | null = null;
    let linesMat: THREE.LineBasicMaterial | null = null;

    if (!lite) {
      const nodePositions: THREE.Vector3[] = [
        new THREE.Vector3(1.5, 0.6, 0.8),
        new THREE.Vector3(-1.4, 1.1, -0.5),
        new THREE.Vector3(0.4, -1.6, 0.9),
        new THREE.Vector3(-1.1, -1.2, -0.9),
        new THREE.Vector3(0.7, 1.4, -1.0),
        new THREE.Vector3(-0.6, 0.3, 1.6),
        new THREE.Vector3(1.8, -0.7, -0.4),
        new THREE.Vector3(0.0, 1.9, 0.3),
        new THREE.Vector3(-1.7, 0.2, 0.7),
        new THREE.Vector3(1.2, -1.5, -0.7),
        new THREE.Vector3(-4.5, 0.4, -1.8),
        new THREE.Vector3(-3.8, -1.1, -2.2),
      ];

      pointGeo = new THREE.SphereGeometry(0.045, 8, 8);
      pointMat = new THREE.MeshBasicMaterial({ color: 0xef4444 });
      nodePoints = new THREE.InstancedMesh(pointGeo, pointMat, nodePositions.length);

      const dummy = new THREE.Object3D();
      nodePositions.forEach((pos, i) => {
        dummy.position.copy(pos);
        dummy.updateMatrix();
        nodePoints!.setMatrixAt(i, dummy.matrix);
      });
      nodePoints.instanceMatrix.needsUpdate = true;
      coreGroup.add(nodePoints);

      // Fine connection lines
      const lineCoords: number[] = [];
      for (let i = 0; i < nodePositions.length; i++) {
        for (let j = i + 1; j < nodePositions.length; j++) {
          const dist = nodePositions[i].distanceTo(nodePositions[j]);
          if (dist < 2.3) {
            lineCoords.push(
              nodePositions[i].x, nodePositions[i].y, nodePositions[i].z,
              nodePositions[j].x, nodePositions[j].y, nodePositions[j].z
            );
          }
        }
      }

      linesGeo = new THREE.BufferGeometry();
      linesGeo.setAttribute("position", new THREE.Float32BufferAttribute(lineCoords, 3));
      linesMat = new THREE.LineBasicMaterial({
        color: 0x52525b,
        transparent: true,
        opacity: 0.35,
      });
      vectorLines = new THREE.LineSegments(linesGeo, linesMat);
      coreGroup.add(vectorLines);
    }

    // ------------------------------------------------------------------------
    // 4. INTERACTION & SCROLL-DEPTH TRACKING
    // ------------------------------------------------------------------------
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    const handleMouseMove = (e: MouseEvent) => {
      if (!interactive) return;
      mouse.targetX = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.targetY = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    let scrollOffset = 0;
    let targetScrollOffset = 0;
    const handleScroll = () => {
      const scrollY = window.scrollY || window.pageYOffset || 0;
      const vh = window.innerHeight || 800;
      targetScrollOffset = Math.min(scrollY / vh, 1.8);
    };

    if (interactive) {
      window.addEventListener("mousemove", handleMouseMove, { passive: true });
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    const handleContextLost = (e: Event) => {
      e.preventDefault();
      onContextLost();
    };
    canvas.addEventListener("webglcontextlost", handleContextLost);

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

    // ------------------------------------------------------------------------
    // 5. ANIMATION LOOP: LIVE WAVE TRANSITIONS & PROCEDURAL MOTION
    // ------------------------------------------------------------------------
    let animId: number;
    let lastTime = performance.now();
    const maxTiltRad = (6 * Math.PI) / 180;

    const animate = (currentTime: number) => {
      const delta = Math.min((currentTime - lastTime) / 1000, 0.1);
      lastTime = currentTime;
      const t = currentTime * 0.001;

      // Smooth damped scroll transition
      scrollOffset += (targetScrollOffset - scrollOffset) * 0.06;

      // Smooth damped mouse tracking
      if (interactive) {
        mouse.x += (mouse.targetX - mouse.x) * 0.05;
        mouse.y += (mouse.targetY - mouse.y) * 0.05;
      }

      // Camera live transition: Parallax tilt + scroll-depth dolly
      camera.position.x = baseCamPos.x + mouse.x * 0.5;
      camera.position.y = baseCamPos.y + mouse.y * 0.35 - scrollOffset * 1.6;
      camera.position.z = baseCamPos.z + scrollOffset * 3.2;

      camera.rotation.y = -mouse.x * maxTiltRad;
      camera.rotation.x = mouse.y * maxTiltRad - scrollOffset * 0.16;

      // Stately rotation on architectural core
      coreMesh.rotation.y += delta * 0.045;
      coreMesh.rotation.x += delta * 0.02;
      edgeLines.rotation.copy(coreMesh.rotation);

      // Gentle orbital counter-rotation on floating shards
      fragmentMeshes.forEach((mesh, idx) => {
        const factor = idx % 2 === 0 ? 1 : -1;
        mesh.rotation.y += delta * 0.035 * factor;
        mesh.rotation.z += delta * 0.02 * factor;
      });

      // Shifting dynamic lighting
      keyWhiteLight.position.x = 5 + Math.sin(t * 0.35) * 2.2;
      keyWhiteLight.position.z = 4 + Math.cos(t * 0.35) * 1.8;
      signalRedLight.intensity = 24 + Math.sin(t * 2.2) * 8;

      // Live undulating topological wave computation
      const mousePlaneX = mouse.x * 14;
      const mousePlaneY = mouse.y * 9;

      for (let i = 0; i < vertCount; i++) {
        const x = origX[i];
        const y = origY[i];

        // Multi-frequency organic undulating wave harmonics
        const w1 = Math.sin(x * 0.22 + t * 0.95) * Math.cos(y * 0.24 + t * 0.75) * 0.8;
        const w2 = Math.sin((x + y) * 0.16 + t * 0.65) * 0.45;
        const w3 = Math.cos(x * 0.38 - t * 0.45) * Math.sin(y * 0.32 + t * 0.55) * 0.3;

        // Interactive cursor wave disturbance (emanating outward)
        const dx = x - mousePlaneX;
        const dy = y - mousePlaneY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const ripple =
          Math.sin(dist * 1.4 - t * 3.4) * Math.exp(-dist * 0.32) * (interactive ? 0.65 : 0.2);

        posAttr.setZ(i, w1 + w2 + w3 + ripple);
      }
      posAttr.needsUpdate = true;

      if (!lite && Math.floor(currentTime / 33) % 2 === 0) {
        // Recompute normals at ~30fps for realistic metallic specular glints
        waveGeo.computeVertexNormals();
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
      window.removeEventListener("scroll", handleScroll);
      canvas.removeEventListener("webglcontextlost", handleContextLost);
      resizeObserver.disconnect();

      // Complete Resource Disposal
      waveGeo.dispose();
      wireMat.dispose();
      baseMat?.dispose();
      coreGeo.dispose();
      coreMat.dispose();
      edgesGeo.dispose();
      edgesMat.dispose();
      fragmentGeos.forEach((g) => g.dispose());
      fragmentMats.forEach((m) => m.dispose());
      pointGeo?.dispose();
      pointMat?.dispose();
      nodePoints?.dispose();
      linesGeo?.dispose();
      linesMat?.dispose();
      renderer.dispose();
    };
  }, [interactive, lite, onContextLost]);

  return (
    <div ref={containerRef} className="w-full h-full relative overflow-hidden pointer-events-none">
      <canvas ref={canvasRef} className="w-full h-full block pointer-events-none" />
    </div>
  );
}
