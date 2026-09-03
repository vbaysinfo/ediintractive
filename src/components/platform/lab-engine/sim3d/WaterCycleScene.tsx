"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { HotspotMarker } from "@/components/platform/lab-engine/sim3d/HotspotMarker";

const VAPOR_COUNT = 14;
const RAIN_COUNT = 16;

// A tiny deterministic PRNG (seeded by index) so particle positions are
// pure/stable across renders instead of calling Math.random() at render
// time.
function pseudoRandom(seed: number) {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

// A continuously-animated water cycle: water rises off the ocean as
// vapour, gathers into clouds, and falls again as rain — running on a
// loop the whole time the lab is open, exactly like the real cycle it's
// named after. Hotspots let the student tap each stage to read the real
// textbook definition while watching it happen.
export function WaterCycleScene({
  found,
  onHotspotClick,
}: {
  found: Set<string>;
  onHotspotClick: (id: string) => void;
}) {
  const vaporRefs = useRef<(THREE.Mesh | null)[]>([]);
  const rainRefs = useRef<(THREE.Mesh | null)[]>([]);
  const sunRef = useRef<THREE.Mesh>(null);
  const cloudRef = useRef<THREE.Group>(null);

  const vaporSeeds = useMemo(
    () =>
      Array.from({ length: VAPOR_COUNT }, (_, i) => ({
        x: (pseudoRandom(i * 3 + 1) - 0.5) * 1.6,
        z: (pseudoRandom(i * 3 + 2) - 0.5) * 1.6,
        phase: pseudoRandom(i * 3 + 3),
      })),
    []
  );
  const rainSeeds = useMemo(
    () =>
      Array.from({ length: RAIN_COUNT }, (_, i) => ({
        x: (pseudoRandom(i * 5 + 101) - 0.5) * 1.3,
        z: (pseudoRandom(i * 5 + 102) - 0.5) * 1.3,
        phase: pseudoRandom(i * 5 + 103),
      })),
    []
  );

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (sunRef.current) sunRef.current.rotation.y = t * 0.15;
    if (cloudRef.current) cloudRef.current.position.y = 1.25 + Math.sin(t * 0.5) * 0.05;

    vaporRefs.current.forEach((m, i) => {
      if (!m) return;
      const seed = vaporSeeds[i];
      const cycle = ((t * 0.25 + seed.phase) % 1);
      m.position.set(seed.x, -0.85 + cycle * 2.1, seed.z);
      const mat = m.material as THREE.MeshStandardMaterial;
      mat.opacity = cycle < 0.15 ? cycle / 0.15 : cycle > 0.85 ? (1 - cycle) / 0.15 : 1;
    });

    rainRefs.current.forEach((m, i) => {
      if (!m) return;
      const seed = rainSeeds[i];
      const cycle = ((t * 0.6 + seed.phase) % 1);
      m.position.set(seed.x, 1.1 - cycle * 1.9, seed.z);
      const mat = m.material as THREE.MeshStandardMaterial;
      mat.opacity = cycle > 0.85 ? (1 - cycle) / 0.15 : 1;
    });
  });

  return (
    <group>
      {/* ocean */}
      <mesh position={[0, -0.95, 0]} onClick={(e) => { e.stopPropagation(); onHotspotClick("collection"); }}>
        <cylinderGeometry args={[1.6, 1.6, 0.15, 40]} />
        <meshStandardMaterial color="#2b8fd6" roughness={0.3} metalness={0.1} />
      </mesh>

      {/* sun */}
      <mesh ref={sunRef} position={[1.5, 1.7, -1.2]} onClick={(e) => { e.stopPropagation(); onHotspotClick("evaporation"); }}>
        <sphereGeometry args={[0.42, 20, 20]} />
        <meshStandardMaterial color="#fbbf24" emissive="#f59e0b" emissiveIntensity={1.4} toneMapped={false} />
      </mesh>

      {/* cloud */}
      <group ref={cloudRef} position={[0, 1.25, 0]} onClick={(e) => { e.stopPropagation(); onHotspotClick("condensation"); }}>
        {[[-0.35, 0, 0], [0.35, 0.05, 0.1], [0, 0.15, -0.15], [0.1, -0.05, 0.25]].map((p, i) => (
          <mesh key={i} position={p as [number, number, number]}>
            <sphereGeometry args={[0.35, 16, 16]} />
            <meshStandardMaterial color="#f1f5f9" roughness={0.9} />
          </mesh>
        ))}
      </group>

      {/* rising vapour */}
      {vaporSeeds.map((_, i) => (
        <mesh key={`v${i}`} ref={(el) => { vaporRefs.current[i] = el; }}>
          <sphereGeometry args={[0.045, 8, 8]} />
          <meshStandardMaterial color="#bfe3fb" transparent opacity={0.8} />
        </mesh>
      ))}

      {/* falling rain */}
      {rainSeeds.map((_, i) => (
        <mesh key={`r${i}`} ref={(el) => { rainRefs.current[i] = el; }}>
          <sphereGeometry args={[0.05, 8, 8]} />
          <meshStandardMaterial color="#3b82f6" transparent opacity={0.9} />
        </mesh>
      ))}

      <HotspotMarker position={[0.9, -0.5, 0.7]} found={found.has("evaporation")} onClick={() => onHotspotClick("evaporation")} />
      <HotspotMarker position={[0, 1.75, 0.5]} found={found.has("condensation")} onClick={() => onHotspotClick("condensation")} />
      <HotspotMarker position={[-0.6, 0.35, -0.4]} found={found.has("precipitation")} onClick={() => onHotspotClick("precipitation")} />
      <HotspotMarker position={[-1.3, -0.8, 0.9]} found={found.has("collection")} onClick={() => onHotspotClick("collection")} />
    </group>
  );
}
