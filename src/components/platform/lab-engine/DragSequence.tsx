"use client";

import { useRef, useState } from "react";
import { Reorder } from "framer-motion";
import type { LabContent } from "@/platform/types";
import { playSound } from "@/platform/lib/sound";
import { PButton } from "@/components/platform/ui";
import { seededShuffle } from "@/components/platform/lab-engine/dnd";

export function DragSequence({
  lab,
  onProgress,
  onComplete,
}: {
  lab: LabContent;
  onProgress: (done: number, total: number) => void;
  onComplete: (score: number, max: number) => void;
}) {
  const sequence = lab.sequence ?? lab.items.map((i) => i.id);
  const [order, setOrder] = useState<string[]>(() => seededShuffle(sequence, lab.id));
  const [checked, setChecked] = useState<"idle" | "correct" | "wrong">("idle");
  const [shake, setShake] = useState(false);
  const finishedRef = useRef(false);

  const checkOrder = () => {
    const isCorrect = order.every((id, i) => id === sequence[i]);
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
      <p className="text-center text-sm font-semibold text-[var(--p-ink-soft)]">
        Drag the cards left-to-right into the correct order, then check your answer.
      </p>
      <Reorder.Group
        axis="x"
        values={order}
        onReorder={(next) => {
          setOrder(next);
          setChecked("idle");
        }}
        className={`flex w-full flex-wrap justify-center gap-4 ${shake ? "p-animate-shake" : ""}`}
      >
        {order.map((id, index) => {
          const item = lab.items.find((i) => i.id === id)!;
          return (
            <Reorder.Item
              key={id}
              value={id}
              data-item-id={id}
              onDragStart={() => playSound("pickup")}
              onDragEnd={() => playSound("drop")}
              whileDrag={{ scale: 1.08, zIndex: 10, boxShadow: "0 20px 40px -12px rgba(0,0,0,0.35)" }}
              className="flex w-44 shrink-0 cursor-grab flex-col items-center gap-2 rounded-3xl border-2 border-white p-5 text-white shadow-lg active:cursor-grabbing"
              style={{ background: `linear-gradient(145deg, ${item.colorFrom}, ${item.colorTo})`, touchAction: "none" }}
            >
              <span className="text-xs font-black opacity-80">STEP {index + 1}</span>
              <span className="text-6xl">{item.emoji}</span>
              <span className="text-center text-base font-bold">{item.label}</span>
            </Reorder.Item>
          );
        })}
      </Reorder.Group>

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

      <PButton onClick={checkOrder} disabled={checked === "correct"}>
        Check My Order
      </PButton>
    </div>
  );
}
