"use client";

import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { HotspotMarker } from "@/components/platform/lab-engine/sim3d/HotspotMarker";

const DEMO_SECONDS = 2.2;

// A simplified skeleton. Tapping a joint doesn't just show a fact — it
// plays a short demo of exactly how that joint type moves: the shoulder
// wobbles freely in every direction (ball & socket), the elbow swings
// one way only (hinge, like a door), the neck spins (pivot), the wrist
// slides side to side (gliding), and the skull... doesn't move at all
// (fixed) — the demonstration IS the fact.
export function JointsScene({
  found,
  onHotspotClick,
}: {
  found: Set<string>;
  onHotspotClick: (id: string) => void;
}) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const prevActiveId = useRef<string | null>(null);
  const activeStart = useRef(0);

  const neckPivot = useRef<THREE.Group>(null);
  const shoulderPivot = useRef<THREE.Group>(null);
  const elbowPivot = useRef<THREE.Group>(null);
  const wristPivot = useRef<THREE.Group>(null);
  const skullFlash = useRef<THREE.MeshStandardMaterial>(null);

  const trigger = (id: string) => {
    setActiveId(id);
    onHotspotClick(id);
  };

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (activeId !== prevActiveId.current) {
      prevActiveId.current = activeId;
      activeStart.current = t;
    }
    const elapsed = activeId ? t - activeStart.current : Infinity;
    const live = activeId !== null && elapsed < DEMO_SECONDS;
    const decay = live ? 1 - elapsed / DEMO_SECONDS : 0;
    const id = live ? activeId : "";

    if (neckPivot.current) neckPivot.current.rotation.y = id === "pivot" ? Math.sin(elapsed * 5) * decay * 0.9 : 0;
    if (shoulderPivot.current) {
      shoulderPivot.current.rotation.x = id === "ballsocket" ? Math.sin(elapsed * 4) * decay * 0.6 : 0;
      shoulderPivot.current.rotation.z = id === "ballsocket" ? Math.cos(elapsed * 5) * decay * 0.6 : 0;
    }
    if (elbowPivot.current) elbowPivot.current.rotation.x = id === "hinge" ? Math.abs(Math.sin(elapsed * 5)) * decay * 1.1 : 0;
    if (wristPivot.current) wristPivot.current.position.x = id === "sliding" ? Math.sin(elapsed * 6) * decay * 0.12 : 0;
    if (skullFlash.current) skullFlash.current.emissiveIntensity = id === "fixed" ? 0.4 + Math.sin(elapsed * 10) * decay * 0.4 : 0.15;
  });

  return (
    <group position={[0, -0.4, 0]}>
      {/* skull (fixed joint) */}
      <mesh position={[0, 1.94, 0]} onClick={(e) => { e.stopPropagation(); trigger("fixed"); }}>
        <sphereGeometry args={[0.22, 20, 20]} />
        <meshStandardMaterial ref={skullFlash} color="#fcd9b8" emissive="#f59e0b" emissiveIntensity={0.15} roughness={0.6} />
      </mesh>

      {/* neck / pivot joint */}
      <group ref={neckPivot} position={[0, 1.72, 0]}>
        <mesh position={[0, -0.02, 0]} onClick={(e) => { e.stopPropagation(); trigger("pivot"); }}>
          <cylinderGeometry args={[0.08, 0.09, 0.12, 10]} />
          <meshStandardMaterial color="#fcd9b8" roughness={0.6} />
        </mesh>
      </group>

      {/* torso */}
      <mesh position={[0, 1.2, 0]}>
        <boxGeometry args={[0.5, 0.85, 0.28]} />
        <meshStandardMaterial color="#93c5fd" roughness={0.7} />
      </mesh>

      {/* left arm: shoulder (ball & socket) -> elbow (hinge) -> wrist (sliding) */}
      <group ref={shoulderPivot} position={[-0.35, 1.55, 0]}>
        <mesh position={[0, -0.2, 0]} onClick={(e) => { e.stopPropagation(); trigger("ballsocket"); }}>
          <boxGeometry args={[0.12, 0.4, 0.12]} />
          <meshStandardMaterial color="#fcd9b8" roughness={0.6} />
        </mesh>
        <group ref={elbowPivot} position={[0, -0.4, 0]}>
          <mesh position={[0, -0.17, 0]} onClick={(e) => { e.stopPropagation(); trigger("hinge"); }}>
            <boxGeometry args={[0.1, 0.35, 0.1]} />
            <meshStandardMaterial color="#fcd9b8" roughness={0.6} />
          </mesh>
          <group ref={wristPivot} position={[0, -0.35, 0]}>
            <mesh position={[0, -0.05, 0]} onClick={(e) => { e.stopPropagation(); trigger("sliding"); }}>
              <sphereGeometry args={[0.08, 12, 12]} />
              <meshStandardMaterial color="#fcd9b8" roughness={0.6} />
            </mesh>
          </group>
        </group>
      </group>

      {/* right arm (visual only, mirrors left, shares the same joint facts) */}
      <group position={[0.35, 1.55, 0]}>
        <mesh position={[0, -0.2, 0]} onClick={(e) => { e.stopPropagation(); trigger("ballsocket"); }}>
          <boxGeometry args={[0.12, 0.4, 0.12]} />
          <meshStandardMaterial color="#fcd9b8" roughness={0.6} />
        </mesh>
        <mesh position={[0, -0.57, 0]} onClick={(e) => { e.stopPropagation(); trigger("hinge"); }}>
          <boxGeometry args={[0.1, 0.35, 0.1]} />
          <meshStandardMaterial color="#fcd9b8" roughness={0.6} />
        </mesh>
      </group>

      {/* legs (hips are ball & socket too; ankles are hinge-like but we
          keep the sliding demo on the wrist — legs share existing facts) */}
      {[-0.16, 0.16].map((x, i) => (
        <group key={i} position={[x, 0.77, 0]}>
          <mesh position={[0, -0.25, 0]} onClick={(e) => { e.stopPropagation(); trigger("ballsocket"); }}>
            <boxGeometry args={[0.14, 0.5, 0.14]} />
            <meshStandardMaterial color="#334155" roughness={0.6} />
          </mesh>
          <mesh position={[0, -0.75, 0]} onClick={(e) => { e.stopPropagation(); trigger("hinge"); }}>
            <boxGeometry args={[0.12, 0.45, 0.12]} />
            <meshStandardMaterial color="#334155" roughness={0.6} />
          </mesh>
        </group>
      ))}

      <HotspotMarker position={[0, 2.28, 0]} found={found.has("fixed")} onClick={() => trigger("fixed")} />
      <HotspotMarker position={[0.35, 1.9, 0]} found={found.has("pivot")} onClick={() => trigger("pivot")} />
      <HotspotMarker position={[-0.7, 1.55, 0]} found={found.has("ballsocket")} onClick={() => trigger("ballsocket")} />
      <HotspotMarker position={[-0.55, 1.05, 0.25]} found={found.has("hinge")} onClick={() => trigger("hinge")} />
      <HotspotMarker position={[-0.4, 0.55, 0.2]} found={found.has("sliding")} onClick={() => trigger("sliding")} />
    </group>
  );
}
