"use client";

import { useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import type { LabContent } from "@/platform/types";
import { seededShuffle } from "@/components/platform/lab-engine/dnd";
import { playSound } from "@/platform/lib/sound";

interface MemoryCard {
  cardId: string;
  pairId: string;
  emoji: string;
  label: string;
  colorFrom: string;
  colorTo: string;
}

// Classic face-down pairs game. Reuses the same correctCombos data as
// DragMatch/DragMix — no new content authoring needed — but the mechanic
// (flip two cards, find the match) is a completely different, very
// graphical experience with zero dragging.
export function MemoryFlip({
  lab,
  onProgress,
  onComplete,
}: {
  lab: LabContent;
  onProgress: (done: number, total: number) => void;
  onComplete: (score: number, max: number) => void;
}) {
  const total = lab.correctCombos.length;
  const maxPoints = lab.correctCombos.reduce((s, c) => s + c.points, 0);

  const cards = useMemo<MemoryCard[]>(() => {
    const built: MemoryCard[] = [];
    lab.correctCombos.forEach((combo, i) => {
      const pairId = `pair-${i}`;
      const frontItem = lab.items.find((it) => it.id === combo.combo[0]);
      const backItem = lab.items.find((it) => it.id === combo.combo[1]);
      if (!frontItem) return;
      built.push({
        cardId: `${pairId}-a`,
        pairId,
        emoji: frontItem.emoji,
        label: frontItem.label,
        colorFrom: frontItem.colorFrom,
        colorTo: frontItem.colorTo,
      });
      if (backItem) {
        // drag-mix style combo: both sides are real items
        built.push({
          cardId: `${pairId}-b`,
          pairId,
          emoji: backItem.emoji,
          label: backItem.label,
          colorFrom: backItem.colorFrom,
          colorTo: backItem.colorTo,
        });
      } else if (combo.zoneLabel) {
        // vocabulary-style combo: the other side is a text clue
        built.push({
          cardId: `${pairId}-b`,
          pairId,
          emoji: combo.zoneEmoji ?? "📖",
          label: combo.zoneLabel,
          colorFrom: frontItem.colorTo,
          colorTo: frontItem.colorFrom,
        });
      } else {
        // picture-match style combo: the other side is just the picture
        built.push({
          cardId: `${pairId}-b`,
          pairId,
          emoji: frontItem.emoji,
          label: "",
          colorFrom: frontItem.colorTo,
          colorTo: frontItem.colorFrom,
        });
      }
    });
    return seededShuffle(built, lab.id);
  }, [lab]);

  const [flipped, setFlipped] = useState<string[]>([]);
  const [matched, setMatched] = useState<Set<string>>(new Set());
  const [lock, setLock] = useState(false);
  const [mismatchIds, setMismatchIds] = useState<string[]>([]);
  const finishedRef = useRef(false);

  const handleFlip = (card: MemoryCard) => {
    if (lock || flipped.includes(card.cardId) || matched.has(card.pairId)) return;
    playSound("pickup");
    const nextFlipped = [...flipped, card.cardId];
    setFlipped(nextFlipped);
    if (nextFlipped.length < 2) return;

    const [firstId, secondId] = nextFlipped;
    const first = cards.find((c) => c.cardId === firstId)!;
    const second = cards.find((c) => c.cardId === secondId)!;

    if (first.pairId === second.pairId) {
      playSound("correct");
      const nextMatched = new Set(matched);
      nextMatched.add(first.pairId);
      setMatched(nextMatched);
      setFlipped([]);
      onProgress(nextMatched.size, total);
      if (nextMatched.size === total && !finishedRef.current) {
        finishedRef.current = true;
        setTimeout(() => onComplete(maxPoints, maxPoints), 700);
      }
    } else {
      playSound("incorrect");
      setLock(true);
      setMismatchIds([firstId, secondId]);
      setTimeout(() => {
        setFlipped([]);
        setMismatchIds([]);
        setLock(false);
      }, 800);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <p className="text-center text-base font-semibold text-[var(--p-ink-soft)]">
        Tap two cards to flip them. Find every matching pair!
      </p>

      <div className="grid grid-cols-3 gap-4 sm:grid-cols-4 lg:grid-cols-5">
        {cards.map((card) => {
          const isUp = flipped.includes(card.cardId) || matched.has(card.pairId);
          const isMatched = matched.has(card.pairId);
          const isMismatch = mismatchIds.includes(card.cardId);
          return (
            <motion.button
              key={card.cardId}
              type="button"
              onClick={() => handleFlip(card)}
              disabled={isMatched}
              className="aspect-square [perspective:800px]"
              whileTap={isUp ? undefined : { scale: 0.94 }}
            >
              <motion.div
                animate={{ rotateY: isUp ? 180 : 0 }}
                transition={{ duration: 0.4 }}
                className={`relative h-full w-full [transform-style:preserve-3d] ${isMismatch ? "p-animate-shake" : ""}`}
              >
                {/* face down */}
                <div
                  className="absolute inset-0 flex items-center justify-center rounded-2xl border-2 border-white text-4xl shadow-lg [backface-visibility:hidden]"
                  style={{ background: "linear-gradient(145deg, var(--p-primary), var(--p-primary-dark))" }}
                >
                  ❓
                </div>
                {/* face up */}
                <div
                  className={`absolute inset-0 flex flex-col items-center justify-center gap-1 rounded-2xl border-2 p-2 text-center text-white shadow-lg [backface-visibility:hidden] [transform:rotateY(180deg)] ${
                    isMatched ? "border-[var(--p-success)] ring-4 ring-[var(--p-success-soft)]" : "border-white"
                  }`}
                  style={{ background: `linear-gradient(145deg, ${card.colorFrom}, ${card.colorTo})` }}
                >
                  <span className="text-4xl drop-shadow sm:text-5xl">{card.emoji}</span>
                  {card.label && (
                    <span className="px-1 text-[11px] font-bold leading-tight drop-shadow sm:text-xs">
                      {card.label}
                    </span>
                  )}
                </div>
              </motion.div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
