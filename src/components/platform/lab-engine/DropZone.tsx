"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";

export function DropZone({
  id,
  registerZone,
  label,
  emoji,
  filled,
  glow,
  children,
  className = "",
}: {
  id: string;
  registerZone: (id: string, el: HTMLElement | null) => void;
  label?: string;
  emoji?: string;
  filled?: boolean;
  glow?: "success" | "error" | null;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      ref={(el) => registerZone(id, el)}
      data-zone-id={id}
      animate={
        glow === "success"
          ? { scale: [1, 1.08, 1], borderColor: "var(--p-success)" }
          : glow === "error"
            ? { borderColor: "var(--p-warn)" }
            : {}
      }
      className={`flex min-h-[10rem] flex-col items-center justify-center gap-2 rounded-3xl border-[3px] border-dashed p-4 text-center transition-colors ${
        filled
          ? "border-solid border-[var(--p-success)] bg-[var(--p-success-soft)]"
          : "border-[var(--p-border)] bg-[var(--p-bg-soft)]"
      } ${className}`}
    >
      {children ?? (
        <>
          {emoji && <span className="text-4xl">{emoji}</span>}
          {label && <span className="text-sm font-bold text-[var(--p-muted)]">{label}</span>}
        </>
      )}
    </motion.div>
  );
}
