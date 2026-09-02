"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { LabContent } from "@/platform/types";
import { DraggableChip } from "@/components/platform/lab-engine/DraggableChip";
import { DropZone } from "@/components/platform/lab-engine/DropZone";
import { useDropZones } from "@/components/platform/lab-engine/dnd";
import { playSound } from "@/platform/lib/sound";

// Classify each item into its correct category bin — e.g. sort vegetables
// by how they grow, or words by their sound. Unlike DragMatch (one item per
// zone), a bin here accepts many items, so zones are the label's `bins`
// list rather than one-per-combo.
export function DragSort({
  lab,
  onProgress,
  onComplete,
}: {
  lab: LabContent;
  onProgress: (done: number, total: number) => void;
  onComplete: (score: number, max: number) => void;
}) {
  const { registerZone, getZoneAtPoint } = useDropZones();
  const bins = lab.bins ?? [];
  const [placed, setPlaced] = useState<Record<string, string[]>>({}); // binId -> itemIds
  const [errorBin, setErrorBin] = useState<string | null>(null);
  const [hint, setHint] = useState(lab.hints.default);
  const finishedRef = useRef(false);
  const total = lab.correctCombos.length;
  const maxPoints = lab.correctCombos.reduce((s, c) => s + c.points, 0);
  const placedCount = Object.values(placed).reduce((s, arr) => s + arr.length, 0);

  const handleDrop = (itemId: string, point: { x: number; y: number }) => {
    const binId = getZoneAtPoint(point.x, point.y);
    if (!binId || !bins.some((b) => b.id === binId)) return;
    const combo = lab.correctCombos.find((c) => c.combo[0] === itemId);
    if (!combo) return;

    if (combo.combo[1] === binId) {
      playSound("correct");
      const next = { ...placed, [binId]: [...(placed[binId] ?? []), itemId] };
      setPlaced(next);
      setHint(combo.result);
      const nextCount = placedCount + 1;
      onProgress(nextCount, total);
      if (nextCount === total && !finishedRef.current) {
        finishedRef.current = true;
        setTimeout(() => onComplete(maxPoints, maxPoints), 700);
      }
    } else {
      playSound("incorrect");
      setErrorBin(binId);
      setHint(lab.hints.onWrong ?? lab.hints.default);
      setTimeout(() => setErrorBin(null), 450);
    }
  };

  const placedItemIds = new Set(Object.values(placed).flat());
  const availableItems = lab.items.filter((item) => !placedItemIds.has(item.id));

  return (
    <div className="flex flex-col gap-6">
      <motion.div
        key={hint}
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-[var(--p-border)] bg-[var(--p-bg-soft)] p-4 text-sm font-semibold text-[var(--p-ink-soft)]"
      >
        {hint}
      </motion.div>

      <div>
        <p className="mb-2 text-xs font-bold uppercase tracking-wide text-[var(--p-muted)]">
          {lab.targetLabel}
        </p>
        <div className={`grid gap-4 ${bins.length >= 3 ? "sm:grid-cols-3" : "sm:grid-cols-2"}`}>
          {bins.map((bin) => {
            const binItems = placed[bin.id] ?? [];
            return (
              <DropZone
                key={bin.id}
                id={bin.id}
                registerZone={registerZone}
                filled={binItems.length > 0}
                glow={errorBin === bin.id ? "error" : null}
                className={`min-h-[9rem] flex-col !justify-start p-3 ${errorBin === bin.id ? "p-animate-shake" : ""}`}
              >
                <div className="flex flex-col items-center gap-1">
                  <span className="text-2xl">{bin.emoji}</span>
                  <span className="text-center text-xs font-bold text-[var(--p-ink)]">{bin.label}</span>
                </div>
                <div className="mt-2 flex flex-wrap justify-center gap-1.5">
                  <AnimatePresence>
                    {binItems.map((itemId) => {
                      const item = lab.items.find((i) => i.id === itemId);
                      if (!item) return null;
                      return (
                        <motion.span
                          key={itemId}
                          initial={{ scale: 0, y: -10 }}
                          animate={{ scale: 1, y: 0 }}
                          className="flex items-center gap-1 rounded-full bg-[var(--p-success-soft)] px-2 py-1 text-xs font-bold text-[#166534]"
                        >
                          {item.emoji} {item.label}
                        </motion.span>
                      );
                    })}
                  </AnimatePresence>
                </div>
              </DropZone>
            );
          })}
        </div>
      </div>

      <div>
        <p className="mb-2 text-xs font-bold uppercase tracking-wide text-[var(--p-muted)]">Drag from here</p>
        <div className="flex flex-wrap gap-4">
          {availableItems.map((item) => (
            <DraggableChip key={item.id} item={item} size="sm" onDrop={(point) => handleDrop(item.id, point)} />
          ))}
          {availableItems.length === 0 && (
            <p className="text-sm text-[var(--p-muted)]">All sorted — nice work! 🎉</p>
          )}
        </div>
      </div>
    </div>
  );
}
