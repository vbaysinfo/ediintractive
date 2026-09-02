"use client";

import { motion } from "framer-motion";
import type { LabItem } from "@/platform/types";
import { playSound } from "@/platform/lib/sound";
import { pointFromDragEvent } from "@/components/platform/lab-engine/dnd";

export function DraggableChip({
  item,
  onDrop,
  disabled,
  size = "md",
}: {
  item: LabItem;
  onDrop: (point: { x: number; y: number }) => void;
  disabled?: boolean;
  size?: "sm" | "md";
}) {
  const dims = size === "sm" ? "h-24 w-24 text-4xl" : "h-32 w-32 text-5xl";
  return (
    <motion.div
      data-item-id={item.id}
      drag={!disabled}
      dragSnapToOrigin
      dragElastic={0.18}
      dragMomentum={false}
      whileDrag={{ scale: 1.12, zIndex: 50, boxShadow: "0 20px 40px -12px rgba(0,0,0,0.35)" }}
      whileHover={disabled ? undefined : { scale: 1.05, y: -2 }}
      onDragStart={() => playSound("pickup")}
      onDragEnd={(event) => {
        if (disabled) return;
        const point = pointFromDragEvent(event as MouseEvent | TouchEvent | PointerEvent);
        onDrop(point);
      }}
      className={`relative flex ${dims} shrink-0 cursor-grab select-none flex-col items-center justify-center rounded-2xl border-2 border-white text-white shadow-lg active:cursor-grabbing ${
        disabled ? "cursor-default opacity-40" : ""
      }`}
      style={{
        background: `linear-gradient(145deg, ${item.colorFrom}, ${item.colorTo})`,
        touchAction: "none",
      }}
    >
      <span className="drop-shadow">{item.emoji}</span>
      <span className="mt-1 px-1.5 text-center text-xs font-bold leading-tight drop-shadow">
        {item.label}
      </span>
    </motion.div>
  );
}
