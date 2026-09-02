"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import type { LabContent } from "@/platform/types";
import { DropZone } from "@/components/platform/lab-engine/DropZone";
import { playSound } from "@/platform/lib/sound";

// A no-drag alternative to DragMatch: tap an item, then tap the card you
// think it pairs with. No dragging at all — pure point-and-tap, which
// reads as a completely different (and more accessible) game than the
// drag interactions.
export function ClickMatch({
  lab,
  onProgress,
  onComplete,
}: {
  lab: LabContent;
  onProgress: (done: number, total: number) => void;
  onComplete: (score: number, max: number) => void;
}) {
  const [selected, setSelected] = useState<string | null>(null);
  const [placed, setPlaced] = useState<Record<string, string>>({}); // zoneId -> itemId
  const [shakeItem, setShakeItem] = useState<string | null>(null);
  const [shakeZone, setShakeZone] = useState<string | null>(null);
  const [hint, setHint] = useState(lab.hints.default);
  const finishedRef = useRef(false);
  const total = lab.correctCombos.length;
  const maxPoints = lab.correctCombos.reduce((s, c) => s + c.points, 0);

  const placedItemIds = new Set(Object.values(placed));
  const availableItems = lab.items.filter((item) => !placedItemIds.has(item.id));

  const attemptMatch = (itemId: string, zoneId: string) => {
    const combo = lab.correctCombos.find((c) => c.combo[1] === zoneId);
    if (combo && combo.combo[0] === itemId) {
      playSound("correct");
      const next = { ...placed, [zoneId]: itemId };
      setPlaced(next);
      setHint(combo.result);
      setSelected(null);
      onProgress(Object.keys(next).length, total);
      if (Object.keys(next).length === total && !finishedRef.current) {
        finishedRef.current = true;
        setTimeout(() => onComplete(maxPoints, maxPoints), 700);
      }
    } else {
      playSound("incorrect");
      setHint(lab.hints.onWrong ?? lab.hints.default);
      setShakeItem(itemId);
      setShakeZone(zoneId);
      setTimeout(() => {
        setShakeItem(null);
        setShakeZone(null);
        setSelected(null);
      }, 450);
    }
  };

  const handleItemTap = (itemId: string) => {
    playSound("click");
    setSelected((prev) => (prev === itemId ? null : itemId));
  };

  const handleZoneTap = (zoneId: string) => {
    if (placed[zoneId]) return;
    if (!selected) {
      playSound("click");
      return;
    }
    attemptMatch(selected, zoneId);
  };

  return (
    <div className="flex flex-col gap-6">
      <motion.div
        key={hint}
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-[var(--p-border)] bg-[var(--p-bg-soft)] p-5 text-base font-semibold text-[var(--p-ink-soft)]"
      >
        {selected ? "Now tap the card it matches!" : hint}
      </motion.div>

      <div>
        <p className="mb-3 text-xs font-bold uppercase tracking-wide text-[var(--p-muted)]">
          {lab.targetLabel}
        </p>
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
          {lab.correctCombos.map((combo) => {
            const zoneId = combo.combo[1];
            const targetItem = lab.items.find((i) => i.id === combo.combo[0]);
            const filledWith = placed[zoneId];
            const clueText = combo.zoneLabel;
            const clueEmoji = combo.zoneEmoji ?? targetItem?.emoji;
            return (
              <motion.button
                key={zoneId}
                type="button"
                onClick={() => handleZoneTap(zoneId)}
                whileTap={filledWith ? undefined : { scale: 0.95 }}
                disabled={!!filledWith}
              >
                <DropZone
                  id={zoneId}
                  registerZone={() => {}}
                  filled={!!filledWith}
                  glow={shakeZone === zoneId ? "error" : filledWith ? "success" : null}
                  className={`cursor-pointer transition-transform ${
                    selected && !filledWith ? "ring-4 ring-[var(--p-primary-soft)]" : ""
                  } ${shakeZone === zoneId ? "p-animate-shake" : ""}`}
                >
                  {filledWith ? (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex flex-col items-center px-1">
                      <span className="text-5xl">{clueEmoji}</span>
                      <span className="mt-2 text-center text-sm font-bold text-[var(--p-success)]">
                        {targetItem?.label}
                      </span>
                    </motion.div>
                  ) : clueText ? (
                    <div className="flex flex-col items-center gap-2 px-1 text-center">
                      <span className="text-3xl">{clueEmoji ?? "📖"}</span>
                      <span className="text-xs font-semibold leading-snug text-[var(--p-ink-soft)]">{clueText}</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center opacity-40">
                      <span className="text-5xl">{clueEmoji}</span>
                      <span className="mt-2 text-sm font-bold text-[var(--p-muted)]">?</span>
                    </div>
                  )}
                </DropZone>
              </motion.button>
            );
          })}
        </div>
      </div>

      <div>
        <p className="mb-3 text-xs font-bold uppercase tracking-wide text-[var(--p-muted)]">Tap a card</p>
        <div className="flex flex-wrap gap-5">
          {availableItems.map((item) => {
            const isSelected = selected === item.id;
            return (
              <motion.button
                key={item.id}
                type="button"
                onClick={() => handleItemTap(item.id)}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                animate={
                  isSelected
                    ? { scale: 1.08, y: -6 }
                    : shakeItem === item.id
                      ? {}
                      : { scale: 1, y: 0 }
                }
                className={`relative flex h-32 w-32 flex-col items-center justify-center rounded-2xl border-2 text-white shadow-lg select-none ${
                  isSelected ? "border-[var(--p-primary)] ring-4 ring-[var(--p-primary-soft)]" : "border-white"
                } ${shakeItem === item.id ? "p-animate-shake" : ""}`}
                style={{ background: `linear-gradient(145deg, ${item.colorFrom}, ${item.colorTo})` }}
              >
                <span className="text-5xl drop-shadow">{item.emoji}</span>
                <span className="mt-1 px-1.5 text-center text-xs font-bold leading-tight drop-shadow">
                  {item.label}
                </span>
              </motion.button>
            );
          })}
          {availableItems.length === 0 && (
            <p className="text-sm text-[var(--p-muted)]">All matched — nice work! 🎉</p>
          )}
        </div>
      </div>
    </div>
  );
}
