"use client";

import { useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { LabContent } from "@/platform/types";
import { seededShuffle } from "@/components/platform/lab-engine/dnd";
import { playSound } from "@/platform/lib/sound";
import { PButton } from "@/components/platform/ui";

// A no-drag alternative to DragSequence: tap cards from the pool, in
// order, into numbered slots. Tap the last-placed card to undo it. Same
// `sequence` data as DragSequence, entirely different feel — button-tap
// pacing instead of precise dragging.
export function TapSequence({
  lab,
  onProgress,
  onComplete,
}: {
  lab: LabContent;
  onProgress: (done: number, total: number) => void;
  onComplete: (score: number, max: number) => void;
}) {
  const sequence = lab.sequence ?? lab.items.map((i) => i.id);
  const pool = useMemo(() => seededShuffle(sequence, lab.id), [sequence, lab.id]);
  const [placed, setPlaced] = useState<string[]>([]);
  const [checked, setChecked] = useState<"idle" | "correct" | "wrong">("idle");
  const [shake, setShake] = useState(false);
  const finishedRef = useRef(false);

  const remaining = pool.filter((id) => !placed.includes(id));

  const placeCard = (id: string) => {
    if (placed.length >= sequence.length) return;
    playSound("pickup");
    setPlaced((prev) => [...prev, id]);
    setChecked("idle");
  };

  const undoLast = () => {
    if (placed.length === 0) return;
    playSound("click");
    setPlaced((prev) => prev.slice(0, -1));
    setChecked("idle");
  };

  const checkOrder = () => {
    const isCorrect = placed.every((id, i) => id === sequence[i]);
    if (isCorrect) {
      playSound("correct");
      setChecked("correct");
      onProgress(sequence.length, sequence.length);
      if (!finishedRef.current) {
        finishedRef.current = true;
        setTimeout(() => onComplete(sequence.length, sequence.length), 700);
      }
    } else {
      playSound("incorrect");
      setChecked("wrong");
      setShake(true);
      setTimeout(() => setShake(false), 450);
    }
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <p className="text-center text-base font-semibold text-[var(--p-ink-soft)]">
        Tap the cards below, in order. Tap your last card again to undo it.
      </p>

      <div className={`flex w-full flex-wrap justify-center gap-4 ${shake ? "p-animate-shake" : ""}`}>
        {sequence.map((_, i) => {
          const id = placed[i];
          const item = id ? lab.items.find((it) => it.id === id) : null;
          const isLast = i === placed.length - 1;
          return (
            <button
              key={i}
              type="button"
              onClick={() => (isLast ? undoLast() : undefined)}
              disabled={!item}
              className={`flex h-44 w-40 shrink-0 flex-col items-center justify-center gap-2 rounded-3xl border-2 border-dashed p-4 text-center transition-colors ${
                item
                  ? "border-solid border-[var(--p-border)] text-white shadow-lg"
                  : "border-[var(--p-border)] bg-[var(--p-bg-soft)] text-[var(--p-muted)]"
              } ${isLast && item ? "cursor-pointer" : item ? "cursor-default" : ""}`}
              style={item ? { background: `linear-gradient(145deg, ${item.colorFrom}, ${item.colorTo})` } : undefined}
            >
              {item ? (
                <>
                  <span className="text-xs font-black opacity-80">STEP {i + 1}</span>
                  <span className="text-6xl">{item.emoji}</span>
                  <span className="text-base font-bold">{item.label}</span>
                </>
              ) : (
                <span className="text-3xl font-black">{i + 1}</span>
              )}
            </button>
          );
        })}
      </div>

      <div>
        <p className="mb-3 text-center text-xs font-bold uppercase tracking-wide text-[var(--p-muted)]">
          Tap in the order they happened
        </p>
        <div className="flex flex-wrap justify-center gap-5">
          <AnimatePresence>
            {remaining.map((id) => {
              const item = lab.items.find((it) => it.id === id)!;
              return (
                <motion.button
                  key={id}
                  type="button"
                  layout
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => placeCard(id)}
                  className="flex h-32 w-32 flex-col items-center justify-center gap-1 rounded-2xl border-2 border-white text-white shadow-lg"
                  style={{ background: `linear-gradient(145deg, ${item.colorFrom}, ${item.colorTo})` }}
                >
                  <span className="text-5xl drop-shadow">{item.emoji}</span>
                  <span className="px-1 text-center text-xs font-bold leading-tight drop-shadow">{item.label}</span>
                </motion.button>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {checked === "wrong" && (
        <p className="rounded-xl bg-[var(--p-warn-soft)] px-4 py-2 text-sm font-semibold text-[#946200]">
          {lab.hints.onWrong ?? lab.hints.default}
        </p>
      )}
      {checked === "correct" && (
        <p className="rounded-xl bg-[var(--p-success-soft)] px-4 py-2 text-sm font-semibold text-[#166534]">
          Perfect order! 🎉
        </p>
      )}

      <PButton onClick={checkOrder} disabled={placed.length < sequence.length || checked === "correct"} size="lg">
        Check My Order
      </PButton>
    </div>
  );
}
