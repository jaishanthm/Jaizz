"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

// Phase 11 §1 — the "Signal Lattice" concept: a faceted core + a sparse
// instanced point field connected to its nearest neighbor by thin lines.
// Poly/draw-call budget from Phase 11 §5: core stays low-poly, field uses a
// single InstancedMesh, not 60-80 separate mesh objects.

const FIELD_COUNT = 60; // within the 40-80 range from Phase 11 §1
const FIELD_RADIUS = 4;

function useFieldPositions() {
  return useMemo(() => {
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
    return positions;
  }, []);
}

// Connect each point to its single nearest neighbor — sparse, not a dense
// mesh of lines (Phase 11 §1's "no excessive particles/lines" rule).
function useNearestNeighborLines(positions: THREE.Vector3[]) {
  return useMemo(() => {
    const linePositions: number[] = [];
    positions.forEach((p, i) => {
      let nearestIdx = -1;
      let nearestDist = Infinity;
      positions.forEach((q, j) => {
        if (i === j) return;
        const d = p.distanceTo(q);
        if (d < nearestDist) { nearestDist = d; nearestIdx = j; }
      });
      if (nearestIdx !== -1) {
        linePositions.push(p.x, p.y, p.z, positions[nearestIdx].x, positions[nearestIdx].y, positions[nearestIdx].z);
      }
    });
    return new Float32Array(linePositions);
  }, [positions]);
}

function FacetedCore() {
  const meshRef = useRef<THREE.Mesh>(null);
  useFrame((_, delta) => {
    if (meshRef.current) meshRef.current.rotation.y -= delta * 0.05; // independent counter-rotation, Phase 11 §1
  });
  return (
    <mesh ref={meshRef}>
      <icosahedronGeometry args={[1.4, 0]} />
      <meshPhysicalMaterial
        color="#2B6CFF"
        emissive="#14B8A6"
        emissiveIntensity={0.15}
        roughness={0.15}
        metalness={0.1}
        transmission={0.6}
        thickness={1.2}
        clearcoat={1}
      />
    </mesh>
  );
}

function InstancedField({ positions }: { positions: THREE.Vector3[] }) {
  const instancedRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame(() => {
    if (!instancedRef.current) return;
    positions.forEach((pos, i) => {
      dummy.position.copy(pos);
      dummy.updateMatrix();
      instancedRef.current!.setMatrixAt(i, dummy.matrix);
    });
    instancedRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={instancedRef} args={[undefined, undefined, FIELD_COUNT]}>
      <sphereGeometry args={[0.035, 6, 6]} />
      <meshBasicMaterial color="#5B8FFF" />
    </instancedMesh>
  );
}

function ConnectionLines({ positions }: { positions: THREE.Vector3[] }) {
  const linePositions = useNearestNeighborLines(positions);
  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(linePositions, 3));
    return geo;
  }, [linePositions]);

  return (
    // eslint-disable-next-line react/no-unknown-property
    <lineSegments geometry={geometry}>
      <lineBasicMaterial color="#14B8A6" transparent opacity={0.25} />
    </lineSegments>
  );
}

export default function SignalLattice() {
  const groupRef = useRef<THREE.Group>(null);
  const positions = useFieldPositions();

  // Ambient rotation: one full rotation ≈ 90s, per Phase 11 §1 — barely
  // perceptible, reads as "alive" not "spinning."
  useFrame((_, delta) => {
    if (groupRef.current) groupRef.current.rotation.y += delta * ((Math.PI * 2) / 90);
  });

  return (
    <group ref={groupRef}>
      <FacetedCore />
      <InstancedField positions={positions} />
      <ConnectionLines positions={positions} />
      <ambientLight intensity={0.4} />
      <pointLight position={[3, 3, 3]} color="#2B6CFF" intensity={40} />
      <pointLight position={[-3, -2, 2]} color="#14B8A6" intensity={25} />
    </group>
  );
}
