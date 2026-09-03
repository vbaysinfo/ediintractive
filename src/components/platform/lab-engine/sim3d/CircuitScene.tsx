"use client";

import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { HotspotMarker } from "@/components/platform/lab-engine/sim3d/HotspotMarker";

// A genuinely working circuit: tap the switch and watch the lever lift
// away from the wire and the bulb go dark — exactly what "a switch opens
// or closes an electric circuit" means. Tap the other parts to learn what
// each one does.
export function CircuitScene({
  found,
  onHotspotClick,
}: {
  found: Set<string>;
  onHotspotClick: (id: string) => void;
}) {
  const [closed, setClosed] = useState(true);
  const leverGroup = useRef<THREE.Group>(null);
  const bulbLight = useRef<THREE.PointLight>(null);
  const bulbMat = useRef<THREE.MeshStandardMaterial>(null);

  useFrame((_, delta) => {
    const targetAngle = closed ? 0 : -0.7;
    if (leverGroup.current) {
      leverGroup.current.rotation.z = THREE.MathUtils.damp(leverGroup.current.rotation.z, targetAngle, 6, delta);
    }
    const targetGlow = closed ? 1.8 : 0.05;
    if (bulbMat.current) {
      bulbMat.current.emissiveIntensity = THREE.MathUtils.damp(bulbMat.current.emissiveIntensity, targetGlow, 6, delta);
    }
    if (bulbLight.current) {
      bulbLight.current.intensity = THREE.MathUtils.damp(bulbLight.current.intensity, closed ? 2.2 : 0, 6, delta);
    }
  });

  const toggleSwitch = () => {
    setClosed((c) => !c);
    onHotspotClick("switch");
  };

  return (
    <group position={[0, -0.15, 0]}>
      {/* base table */}
      <mesh position={[0, -0.7, 0]} receiveShadow>
        <boxGeometry args={[3.2, 0.15, 2]} />
        <meshStandardMaterial color="#e7dcc8" roughness={0.9} />
      </mesh>

      {/* cell */}
      <mesh
        position={[-1.1, 0.35, 0]}
        onClick={(e) => { e.stopPropagation(); onHotspotClick("cell"); }}
      >
        <boxGeometry args={[0.35, 0.7, 0.35]} />
        <meshStandardMaterial color="#facc15" roughness={0.4} metalness={0.3} />
      </mesh>
      <mesh position={[-1.1, 0.73, 0]}>
        <boxGeometry args={[0.12, 0.08, 0.12]} />
        <meshStandardMaterial color="#78350f" />
      </mesh>

      {/* bulb */}
      <mesh
        position={[0, 0.75, 0]}
        onClick={(e) => { e.stopPropagation(); onHotspotClick("bulb"); }}
      >
        <sphereGeometry args={[0.26, 20, 20]} />
        <meshStandardMaterial ref={bulbMat} color="#fef3c7" emissive="#fbbf24" emissiveIntensity={closed ? 1.8 : 0.05} toneMapped={false} transparent opacity={0.9} />
      </mesh>
      <mesh position={[0, 0.75, 0]}>
        <torusKnotGeometry args={[0.06, 0.015, 32, 4, 2, 3]} />
        <meshStandardMaterial color="#78350f" />
      </mesh>
      <pointLight ref={bulbLight} position={[0, 0.75, 0]} color="#fbbf24" intensity={closed ? 2.2 : 0} distance={3} />

      {/* top wire (two segments, gap for the bulb) */}
      <mesh position={[-0.55, 0.75, 0]} onClick={(e) => { e.stopPropagation(); onHotspotClick("conductor"); }}>
        <boxGeometry args={[0.9, 0.05, 0.05]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.6} roughness={0.3} />
      </mesh>

      {/* right vertical wire down to bottom rail */}
      <mesh position={[1.1, 0.35, 0]} onClick={(e) => { e.stopPropagation(); onHotspotClick("conductor"); }}>
        <boxGeometry args={[0.05, 0.7, 0.05]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.6} roughness={0.3} />
      </mesh>

      {/* switch lever, hinged at the top-right corner */}
      <group ref={leverGroup} position={[1.1, 0.75, 0]}>
        <mesh
          position={[-0.45, 0, 0]}
          onClick={(e) => { e.stopPropagation(); toggleSwitch(); }}
        >
          <boxGeometry args={[0.9, 0.06, 0.06]} />
          <meshStandardMaterial color={closed ? "#22c55e" : "#ef4444"} metalness={0.4} roughness={0.4} />
        </mesh>
      </group>

      {/* bottom rail */}
      <mesh position={[0, 0, 0]} onClick={(e) => { e.stopPropagation(); onHotspotClick("conductor"); }}>
        <boxGeometry args={[2.2, 0.05, 0.05]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.6} roughness={0.3} />
      </mesh>

      {/* insulator sample block, sitting off to the side */}
      <mesh
        position={[0.5, -0.55, 0.7]}
        onClick={(e) => { e.stopPropagation(); onHotspotClick("insulator"); }}
      >
        <boxGeometry args={[0.4, 0.18, 0.4]} />
        <meshStandardMaterial color="#dc2626" roughness={0.95} />
      </mesh>

      <HotspotMarker position={[-1.1, 0.95, 0.3]} found={found.has("cell")} onClick={() => onHotspotClick("cell")} />
      <HotspotMarker position={[0, 1.15, 0.2]} found={found.has("bulb")} onClick={() => onHotspotClick("bulb")} />
      <HotspotMarker position={[-0.55, 0.95, 0.25]} found={found.has("conductor")} onClick={() => onHotspotClick("conductor")} />
      <HotspotMarker position={[1.35, 0.95, 0.25]} found={found.has("switch")} onClick={toggleSwitch} />
      <HotspotMarker position={[0.5, -0.35, 0.9]} found={found.has("insulator")} onClick={() => onHotspotClick("insulator")} />
    </group>
  );
}
