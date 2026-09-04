"use client";

import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { HotspotMarker } from "@/components/platform/lab-engine/sim3d/HotspotMarker";

// Two real bar magnets. Tap the moving magnet to flip which pole faces
// the fixed one — watch it actually slide together (unlike poles
// attract) or push apart and jitter (like poles repel). Tap the nail to
// see it fly to the magnet; the wood chip stays put no matter what.
export function MagnetScene({
  found,
  onHotspotClick,
}: {
  found: Set<string>;
  onHotspotClick: (id: string) => void;
}) {
  const [facing, setFacing] = useState<"attract" | "repel">("attract");
  const [nailPulled, setNailPulled] = useState(false);
  const movingMagnet = useRef<THREE.Group>(null);
  const nail = useRef<THREE.Mesh>(null);

  const toggleFacing = (mode: "attract" | "repel") => {
    setFacing(mode);
    onHotspotClick(mode);
  };

  const pullNail = () => {
    setNailPulled(true);
    onHotspotClick("magnetic");
  };

  useFrame(({ clock }, delta) => {
    const t = clock.elapsedTime;
    if (movingMagnet.current) {
      const targetX = facing === "attract" ? -0.05 : 0.75;
      const jitter = facing === "repel" ? Math.sin(t * 18) * 0.03 : 0;
      movingMagnet.current.position.x = THREE.MathUtils.damp(movingMagnet.current.position.x, targetX + jitter, 6, delta);
      movingMagnet.current.rotation.y = facing === "repel" ? Math.PI : 0;
    }
    if (nail.current) {
      const targetX = nailPulled ? -1.05 : -0.1;
      const targetZ = nailPulled ? 0 : 0.55;
      nail.current.position.x = THREE.MathUtils.damp(nail.current.position.x, targetX, 5, delta);
      nail.current.position.z = THREE.MathUtils.damp(nail.current.position.z, targetZ, 5, delta);
    }
  });

  return (
    <group position={[0, -0.1, 0]}>
      <mesh position={[0, -0.35, 0]} receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[3.4, 2.2]} />
        <meshStandardMaterial color="#e7dcc8" roughness={0.9} />
      </mesh>

      {/* fixed magnet, N on the right */}
      <group position={[-1.3, 0, 0]} onClick={(e) => { e.stopPropagation(); toggleFacing(facing === "attract" ? "repel" : "attract"); }}>
        <mesh position={[-0.2, 0, 0]} castShadow>
          <boxGeometry args={[0.4, 0.28, 0.28]} />
          <meshStandardMaterial color="#3b82f6" metalness={0.5} roughness={0.3} />
        </mesh>
        <mesh position={[0.2, 0, 0]} castShadow>
          <boxGeometry args={[0.4, 0.28, 0.28]} />
          <meshStandardMaterial color="#ef4444" metalness={0.5} roughness={0.3} />
        </mesh>
      </group>

      {/* moving magnet — flips to show attract (unlike poles meet) or repel (like poles meet) */}
      <group ref={movingMagnet} position={[-0.05, 0, 0]} onClick={(e) => { e.stopPropagation(); toggleFacing(facing === "attract" ? "repel" : "attract"); }}>
        <mesh position={[-0.2, 0, 0]} castShadow>
          <boxGeometry args={[0.4, 0.28, 0.28]} />
          <meshStandardMaterial color="#3b82f6" metalness={0.5} roughness={0.3} />
        </mesh>
        <mesh position={[0.2, 0, 0]} castShadow>
          <boxGeometry args={[0.4, 0.28, 0.28]} />
          <meshStandardMaterial color="#ef4444" metalness={0.5} roughness={0.3} />
        </mesh>
      </group>

      {/* nail — magnetic, flies to the fixed magnet when tapped */}
      <mesh
        ref={nail}
        position={[-0.1, -0.18, 0.55]}
        rotation={[0, 0, Math.PI / 2]}
        castShadow
        onClick={(e) => { e.stopPropagation(); pullNail(); }}
      >
        <cylinderGeometry args={[0.03, 0.03, 0.4, 10]} />
        <meshStandardMaterial color="#a1a1aa" metalness={0.8} roughness={0.3} />
      </mesh>

      {/* wood chip — non-magnetic, never moves */}
      <mesh
        position={[0.9, -0.28, 0.6]}
        castShadow
        onClick={(e) => { e.stopPropagation(); onHotspotClick("nonmagnetic"); }}
      >
        <boxGeometry args={[0.32, 0.06, 0.22]} />
        <meshStandardMaterial color="#a16207" roughness={0.95} />
      </mesh>

      <HotspotMarker position={[-0.65, 0.35, 0]} found={found.has(facing)} onClick={() => toggleFacing(facing === "attract" ? "repel" : "attract")} />
      <HotspotMarker position={[-0.1, -0.05, 0.85]} found={found.has("magnetic")} onClick={pullNail} />
      <HotspotMarker position={[0.9, 0, 0.6]} found={found.has("nonmagnetic")} onClick={() => onHotspotClick("nonmagnetic")} />
    </group>
  );
}
