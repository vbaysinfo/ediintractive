"use client";

import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { HotspotMarker } from "@/components/platform/lab-engine/sim3d/HotspotMarker";

const LIGHT_POSITIONS: [number, number, number][] = [
  [-1.6, 1.3, 1.6],
  [0, 1.6, 2.2],
  [1.6, 1.1, 1.4],
];

// Real shadows, cast by a real light, using the browser's own WebGL
// shadow map — not a drawn-on shadow graphic. Three objects made of
// different materials (opaque, transparent, translucent) sit between the
// light and the screen, so the class can compare, side by side, exactly
// how much light each one blocks. Tap the light to move it and watch
// every shadow shift in real time.
export function ShadowScene({
  found,
  onHotspotClick,
}: {
  found: Set<string>;
  onHotspotClick: (id: string) => void;
}) {
  const [lightIndex, setLightIndex] = useState(0);
  const lightRef = useRef<THREE.PointLight>(null);
  const lightMesh = useRef<THREE.Mesh>(null);

  const cycleLight = () => {
    setLightIndex((i) => (i + 1) % LIGHT_POSITIONS.length);
    onHotspotClick("shadow");
  };

  useFrame((_, delta) => {
    const [x, y, z] = LIGHT_POSITIONS[lightIndex];
    if (lightRef.current) {
      lightRef.current.position.x = THREE.MathUtils.damp(lightRef.current.position.x, x, 6, delta);
      lightRef.current.position.y = THREE.MathUtils.damp(lightRef.current.position.y, y, 6, delta);
      lightRef.current.position.z = THREE.MathUtils.damp(lightRef.current.position.z, z, 6, delta);
    }
    if (lightMesh.current) lightMesh.current.position.copy(lightRef.current?.position ?? new THREE.Vector3());
  });

  return (
    <group position={[0, -0.3, 0]}>
      {/* the screen the shadows fall on */}
      <mesh position={[0, 0.9, -1]} receiveShadow>
        <planeGeometry args={[3.6, 2.2]} />
        <meshStandardMaterial color="#fdfaf3" roughness={1} />
      </mesh>
      {/* floor */}
      <mesh position={[0, -0.1, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[3.6, 2]} />
        <meshStandardMaterial color="#e7dcc8" roughness={1} />
      </mesh>

      {/* the movable light */}
      <pointLight ref={lightRef} position={LIGHT_POSITIONS[lightIndex]} intensity={9} distance={8} castShadow shadow-mapSize={[1024, 1024]} />
      <mesh ref={lightMesh} onClick={(e) => { e.stopPropagation(); cycleLight(); }}>
        <sphereGeometry args={[0.14, 16, 16]} />
        <meshStandardMaterial color="#fef3c7" emissive="#fbbf24" emissiveIntensity={1.6} toneMapped={false} />
      </mesh>

      {/* opaque object */}
      <mesh position={[-0.9, 0.35, 0]} castShadow onClick={(e) => { e.stopPropagation(); onHotspotClick("opaque"); }}>
        <boxGeometry args={[0.45, 0.7, 0.3]} />
        <meshStandardMaterial color="#b91c1c" roughness={0.7} />
      </mesh>

      {/* transparent object — barely blocks light */}
      <mesh position={[0, 0.35, 0]} castShadow onClick={(e) => { e.stopPropagation(); onHotspotClick("transparent"); }}>
        <boxGeometry args={[0.45, 0.7, 0.3]} />
        <meshPhysicalMaterial color="#bae6fd" roughness={0.05} transmission={0.9} transparent opacity={0.25} />
      </mesh>

      {/* translucent object — partially blocks light */}
      <mesh position={[0.9, 0.35, 0]} castShadow onClick={(e) => { e.stopPropagation(); onHotspotClick("translucent"); }}>
        <boxGeometry args={[0.45, 0.7, 0.3]} />
        <meshStandardMaterial color="#fef9c3" roughness={0.6} transparent opacity={0.55} />
      </mesh>

      <HotspotMarker position={LIGHT_POSITIONS[lightIndex].map((v, i) => (i === 1 ? v + 0.3 : v)) as [number, number, number]} found={found.has("shadow")} onClick={cycleLight} />
      <HotspotMarker position={[-0.9, 0.85, 0.25]} found={found.has("opaque")} onClick={() => onHotspotClick("opaque")} />
      <HotspotMarker position={[0, 0.85, 0.25]} found={found.has("transparent")} onClick={() => onHotspotClick("transparent")} />
      <HotspotMarker position={[0.9, 0.85, 0.25]} found={found.has("translucent")} onClick={() => onHotspotClick("translucent")} />
    </group>
  );
}
