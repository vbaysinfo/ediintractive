"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { HotspotMarker } from "@/components/platform/lab-engine/sim3d/HotspotMarker";

// A procedural 3D plant — root system, stem, a few leaves and a flower —
// built entirely from primitive geometry. The whole plant "grows" up out
// of the soil when the scene mounts, then gently sways, echoing the real
// textbook fact that every part has its own job to do.
export function PlantScene({
  found,
  onHotspotClick,
}: {
  found: Set<string>;
  onHotspotClick: (id: string) => void;
}) {
  const growth = useRef(0);
  const plantGroup = useRef<THREE.Group>(null);

  const roots = useMemo(
    () =>
      Array.from({ length: 5 }, (_, i) => {
        const angle = (i / 5) * Math.PI * 2;
        return { angle, len: 0.55 + (i % 2) * 0.15 };
      }),
    []
  );

  useFrame(({ clock }, delta) => {
    growth.current = Math.min(1, growth.current + delta * 0.6);
    if (plantGroup.current) {
      const sway = Math.sin(clock.elapsedTime * 0.8) * 0.03;
      plantGroup.current.rotation.z = sway;
      plantGroup.current.scale.setScalar(0.3 + growth.current * 0.7);
    }
  });

  return (
    <group>
      {/* soil */}
      <mesh position={[0, -0.12, 0]} receiveShadow>
        <cylinderGeometry args={[1.3, 1.3, 0.24, 32]} />
        <meshStandardMaterial color="#8b5a2b" roughness={1} />
      </mesh>

      {/* roots (below soil) */}
      <group onClick={(e) => { e.stopPropagation(); onHotspotClick("root"); }}>
        {roots.map((r, i) => (
          <mesh
            key={i}
            position={[Math.cos(r.angle) * 0.15, -0.3 - r.len / 2, Math.sin(r.angle) * 0.15]}
            rotation={[Math.cos(r.angle) * 0.5, 0, Math.sin(r.angle) * 0.5]}
          >
            <coneGeometry args={[0.05, r.len, 6]} />
            <meshStandardMaterial color="#d6a97a" roughness={0.9} />
          </mesh>
        ))}
      </group>

      <group ref={plantGroup} position={[0, 0, 0]}>
        {/* stem */}
        <mesh
          position={[0, 0.55, 0]}
          onClick={(e) => { e.stopPropagation(); onHotspotClick("stem"); }}
        >
          <cylinderGeometry args={[0.06, 0.09, 1.1, 12]} />
          <meshStandardMaterial color="#2fa84f" roughness={0.7} />
        </mesh>

        {/* leaves */}
        <group
          position={[0.32, 0.68, 0.1]}
          rotation={[0.3, 0.4, 0.5]}
          onClick={(e) => { e.stopPropagation(); onHotspotClick("leaf"); }}
        >
          <mesh scale={[1, 0.35, 0.5]}>
            <sphereGeometry args={[0.42, 16, 16]} />
            <meshStandardMaterial color="#3fb85f" roughness={0.6} />
          </mesh>
        </group>
        <group
          position={[-0.38, 0.85, -0.08]}
          rotation={[-0.2, -0.5, -0.4]}
          onClick={(e) => { e.stopPropagation(); onHotspotClick("leaf"); }}
        >
          <mesh scale={[1, 0.35, 0.5]}>
            <sphereGeometry args={[0.38, 16, 16]} />
            <meshStandardMaterial color="#38a856" roughness={0.6} />
          </mesh>
        </group>

        {/* flower */}
        <group
          position={[0, 1.28, 0]}
          onClick={(e) => { e.stopPropagation(); onHotspotClick("flower"); }}
        >
          {Array.from({ length: 6 }, (_, i) => {
            const a = (i / 6) * Math.PI * 2;
            return (
              <mesh key={i} position={[Math.cos(a) * 0.22, 0, Math.sin(a) * 0.22]}>
                <sphereGeometry args={[0.15, 12, 12]} />
                <meshStandardMaterial color="#f472b6" roughness={0.5} />
              </mesh>
            );
          })}
          <mesh>
            <sphereGeometry args={[0.14, 16, 16]} />
            <meshStandardMaterial color="#fbbf24" roughness={0.5} />
          </mesh>
        </group>
      </group>

      <HotspotMarker position={[0, -0.95, 0.9]} found={found.has("root")} onClick={() => onHotspotClick("root")} />
      <HotspotMarker position={[0.55, 0.55, 0]} found={found.has("stem")} onClick={() => onHotspotClick("stem")} />
      <HotspotMarker position={[0.75, 0.7, 0.35]} found={found.has("leaf")} onClick={() => onHotspotClick("leaf")} />
      <HotspotMarker position={[0, 1.65, 0]} found={found.has("flower")} onClick={() => onHotspotClick("flower")} />
    </group>
  );
}
