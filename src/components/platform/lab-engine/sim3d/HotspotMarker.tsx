"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

// A small glowing, gently pulsing sphere that marks a tappable point of
// interest on a 3D model. Turns green and stops pulsing once its fact has
// been discovered. Pure Three.js primitives — no external assets.
export function HotspotMarker({
  position,
  found,
  onClick,
}: {
  position: [number, number, number];
  found: boolean;
  onClick: () => void;
}) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!ref.current || found) return;
    const s = 1 + Math.sin(clock.elapsedTime * 3) * 0.18;
    ref.current.scale.setScalar(s);
  });

  return (
    <mesh
      ref={ref}
      position={position}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        document.body.style.cursor = "auto";
      }}
    >
      <sphereGeometry args={[0.16, 16, 16]} />
      <meshStandardMaterial
        color={found ? "#22c55e" : "#ff6b4a"}
        emissive={found ? "#22c55e" : "#ff6b4a"}
        emissiveIntensity={found ? 0.6 : 1.2}
        toneMapped={false}
      />
    </mesh>
  );
}
