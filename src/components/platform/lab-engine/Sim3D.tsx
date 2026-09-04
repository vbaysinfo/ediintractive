"use client";

import { Suspense, useRef, useState, type ComponentRef } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { motion, AnimatePresence } from "framer-motion";
import type { LabContent } from "@/platform/types";
import { PlantScene } from "@/components/platform/lab-engine/sim3d/PlantScene";
import { WaterCycleScene } from "@/components/platform/lab-engine/sim3d/WaterCycleScene";
import { CircuitScene } from "@/components/platform/lab-engine/sim3d/CircuitScene";
import { JointsScene } from "@/components/platform/lab-engine/sim3d/JointsScene";
import { MagnetScene } from "@/components/platform/lab-engine/sim3d/MagnetScene";
import { ShadowScene } from "@/components/platform/lab-engine/sim3d/ShadowScene";
import { playSound } from "@/platform/lib/sound";

// A real, orbit-controllable 3D lab — drag to rotate, scroll/pinch to
// zoom, tap the glowing hotspots to reveal real textbook facts. The
// scene itself is picked by `lab.sim3dTopic`; every scene is built from
// plain Three.js primitives (no downloaded models), and a couple of them
// (the circuit, the joints) are live simulations you can actually
// operate, not just a static model to look at.
export function Sim3D({
  lab,
  onProgress,
  onComplete,
}: {
  lab: LabContent;
  onProgress: (done: number, total: number) => void;
  onComplete: (score: number, max: number) => void;
}) {
  const hotspots = lab.sim3dHotspots ?? [];
  const total = Math.max(hotspots.length, 1);
  const [found, setFound] = useState<Set<string>>(new Set());
  const [activeFact, setActiveFact] = useState<string | null>(null);
  const finishedRef = useRef(false);
  const controlsRef = useRef<ComponentRef<typeof OrbitControls>>(null);

  const activeHotspot = hotspots.find((h) => h.id === activeFact);

  const handleHotspotClick = (id: string) => {
    setActiveFact(id);
    if (!found.has(id)) {
      playSound(hotspots.some((h) => h.id === id) ? "correct" : "click");
      const next = new Set(found).add(id);
      setFound(next);
      onProgress(Math.min(next.size, total), total);
      if (next.size >= hotspots.length && !finishedRef.current && hotspots.length > 0) {
        finishedRef.current = true;
        setTimeout(() => onComplete(next.size, total), 900);
      }
    } else {
      playSound("click");
    }
  };

  const resetView = () => {
    controlsRef.current?.reset();
  };

  const scene = (() => {
    switch (lab.sim3dTopic) {
      case "plant":
        return <PlantScene found={found} onHotspotClick={handleHotspotClick} />;
      case "water-cycle":
        return <WaterCycleScene found={found} onHotspotClick={handleHotspotClick} />;
      case "circuit":
        return <CircuitScene found={found} onHotspotClick={handleHotspotClick} />;
      case "joints":
        return <JointsScene found={found} onHotspotClick={handleHotspotClick} />;
      case "magnets":
        return <MagnetScene found={found} onHotspotClick={handleHotspotClick} />;
      case "shadows":
        return <ShadowScene found={found} onHotspotClick={handleHotspotClick} />;
      default:
        return null;
    }
  })();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between text-xs font-bold text-[var(--p-muted)]">
        <span>🖱️ Drag to rotate · scroll to zoom · tap a glowing dot</span>
        <button
          type="button"
          onClick={resetView}
          className="rounded-full bg-[var(--p-bg-soft)] px-3 py-1 font-bold text-[var(--p-ink-soft)] hover:bg-[var(--p-border)]"
        >
          ↺ Reset View
        </button>
      </div>

      <div className="relative h-[420px] w-full overflow-hidden rounded-[var(--p-radius)] border border-[var(--p-border)] bg-[linear-gradient(180deg,#eaf2ff,#ffffff)] sm:h-[480px]">
        <Canvas camera={{ position: [2.6, 1.6, 3.2], fov: 45 }} shadows dpr={[1, 1.5]}>
          <Suspense fallback={null}>
            <ambientLight intensity={0.7} />
            <directionalLight position={[3, 4, 2]} intensity={1.2} castShadow />
            <directionalLight position={[-3, 2, -2]} intensity={0.4} />
            {scene}
            <OrbitControls
              ref={controlsRef}
              enablePan={false}
              minDistance={2}
              maxDistance={7}
              minPolarAngle={0.3}
              maxPolarAngle={Math.PI / 2 + 0.3}
            />
          </Suspense>
        </Canvas>

        <div className="pointer-events-none absolute right-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-[var(--p-ink-soft)] shadow">
          {found.size} of {hotspots.length} discovered
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeHotspot ? (
          <motion.div
            key={activeHotspot.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="rounded-2xl border border-[var(--p-border)] bg-[var(--p-bg-soft)] p-5"
          >
            <p className="text-xs font-bold uppercase tracking-wide text-[var(--p-primary)]">{activeHotspot.label}</p>
            <p className="mt-1 text-base font-semibold text-[var(--p-ink)]">{activeHotspot.fact}</p>
          </motion.div>
        ) : (
          <motion.div
            key="hint"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="rounded-2xl border border-dashed border-[var(--p-border)] bg-[var(--p-bg-soft)] p-5 text-center text-sm font-semibold text-[var(--p-ink-soft)]"
          >
            {lab.hints.default}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
