"use client";

import { useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { LabContent } from "@/platform/types";
import { PButton } from "@/components/platform/ui";
import { playSound } from "@/platform/lib/sound";

// An illustrated, page-by-page retelling of the real textbook story. No
// dragging, no matching — just tap through the story, tap the highlighted
// word on each page for a fun aside, and answer an occasional "what
// happens next?" checkpoint. A completely different, book-like feel from
// every other lab type, built on real narrative text from the chapter.
export function StoryReader({
  lab,
  onProgress,
  onComplete,
}: {
  lab: LabContent;
  onProgress: (done: number, total: number) => void;
  onComplete: (score: number, max: number) => void;
}) {
  const pages = useMemo(() => lab.storyPages ?? [], [lab.storyPages]);
  const checkpoints = useMemo(() => lab.storyCheckpoints ?? [], [lab.storyCheckpoints]);
  const checkpointByPage = useMemo(() => {
    const map = new Map<number, (typeof checkpoints)[number]>();
    checkpoints.forEach((c) => map.set(c.afterPageIndex, c));
    return map;
  }, [checkpoints]);

  const total = pages.length + checkpoints.length;
  const [pageIndex, setPageIndex] = useState(0);
  const [revealed, setRevealed] = useState<Set<string>>(new Set());
  const [pendingCheckpoint, setPendingCheckpoint] = useState<number | null>(null);
  const [checkpointChoice, setCheckpointChoice] = useState<number | null>(null);
  const [checkpointsAnswered, setCheckpointsAnswered] = useState<Record<number, boolean>>({});
  const finishedRef = useRef(false);

  const page = pages[pageIndex];
  const isLastPage = pageIndex === pages.length - 1;
  const activeCheckpoint = pendingCheckpoint !== null ? checkpointByPage.get(pendingCheckpoint) : null;

  const reportProgress = (answeredMap: Record<number, boolean>, visitedPageIndex: number) => {
    const done = Math.min(visitedPageIndex + 1, pages.length) + Object.keys(answeredMap).length;
    onProgress(Math.min(done, total), total);
  };

  const revealHighlight = () => {
    if (!page?.highlight) return;
    playSound("click");
    setRevealed((prev) => new Set(prev).add(page.id));
  };

  const finish = (finalAnswers: Record<number, boolean>) => {
    const correct = Object.values(finalAnswers).filter(Boolean).length;
    const max = Math.max(checkpoints.length, 1);
    playSound("complete");
    finishedRef.current = true;
    onComplete(correct, max);
  };

  const goNext = () => {
    const checkpointHere = checkpointByPage.get(pageIndex);
    if (checkpointHere && checkpointsAnswered[pageIndex] === undefined) {
      playSound("click");
      setPendingCheckpoint(pageIndex);
      setCheckpointChoice(null);
      return;
    }
    if (isLastPage) {
      if (!finishedRef.current) finish(checkpointsAnswered);
      return;
    }
    const next = pageIndex + 1;
    setPageIndex(next);
    reportProgress(checkpointsAnswered, next);
  };

  const goBack = () => {
    if (pageIndex === 0) return;
    playSound("click");
    setPageIndex((p) => p - 1);
  };

  const answerCheckpoint = (optionIndex: number) => {
    if (checkpointChoice !== null || activeCheckpoint === undefined || activeCheckpoint === null) return;
    setCheckpointChoice(optionIndex);
    const correct = optionIndex === activeCheckpoint.correctIndex;
    playSound(correct ? "correct" : "incorrect");
    const nextAnswers = { ...checkpointsAnswered, [pendingCheckpoint as number]: correct };
    setCheckpointsAnswered(nextAnswers);
    reportProgress(nextAnswers, pageIndex);
  };

  const continueAfterCheckpoint = () => {
    setPendingCheckpoint(null);
    setCheckpointChoice(null);
    if (isLastPage) {
      if (!finishedRef.current) finish(checkpointsAnswered);
      return;
    }
    const next = pageIndex + 1;
    setPageIndex(next);
    reportProgress(checkpointsAnswered, next);
  };

  if (!page) return null;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex gap-1.5">
        {pages.map((p, i) => (
          <div
            key={p.id}
            className="h-1.5 flex-1 overflow-hidden rounded-full bg-[var(--p-bg-soft)]"
          >
            <div
              className="h-full rounded-full bg-[linear-gradient(90deg,var(--p-primary),var(--p-secondary))] transition-all"
              style={{ width: i <= pageIndex ? "100%" : "0%" }}
            />
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeCheckpoint ? (
          <motion.div
            key="checkpoint"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex flex-col gap-4 rounded-[var(--p-radius)] border-2 border-[var(--p-primary-soft)] bg-[var(--p-surface)] p-6"
          >
            <p className="text-xs font-bold uppercase tracking-wide text-[var(--p-primary)]">
              🤔 What do you think?
            </p>
            <p className="text-lg font-extrabold text-[var(--p-ink)]">{activeCheckpoint.question}</p>
            <div className="grid gap-2.5 sm:grid-cols-2">
              {activeCheckpoint.options.map((opt, i) => {
                const isChosen = checkpointChoice === i;
                const isCorrectOpt = i === activeCheckpoint.correctIndex;
                const showState = checkpointChoice !== null;
                return (
                  <motion.button
                    key={i}
                    type="button"
                    disabled={checkpointChoice !== null}
                    onClick={() => answerCheckpoint(i)}
                    whileTap={checkpointChoice === null ? { scale: 0.97 } : undefined}
                    className={`rounded-2xl border-2 p-4 text-left text-sm font-bold transition-colors ${
                      showState && isCorrectOpt
                        ? "border-[var(--p-success)] bg-[var(--p-success-soft)] text-[var(--p-ink)]"
                        : showState && isChosen
                          ? "border-[var(--p-danger)] bg-[var(--p-danger-soft)] text-[var(--p-ink)]"
                          : "border-[var(--p-border)] bg-[var(--p-bg-soft)] text-[var(--p-ink-soft)]"
                    }`}
                  >
                    {opt}
                  </motion.button>
                );
              })}
            </div>
            {checkpointChoice !== null && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl bg-[var(--p-accent-soft)] p-4 text-sm font-semibold text-[var(--p-ink-soft)]"
              >
                💡 {activeCheckpoint.funFact}
              </motion.div>
            )}
            {checkpointChoice !== null && (
              <PButton onClick={continueAfterCheckpoint} size="lg">
                Continue the Story →
              </PButton>
            )}
          </motion.div>
        ) : (
          <motion.div
            key={page.id}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.25 }}
            className="flex flex-col gap-5 rounded-[var(--p-radius)] border border-[var(--p-border)] bg-[var(--p-surface)] p-6 sm:p-8"
          >
            <div className="flex justify-center">
              <motion.span
                className="p-animate-float text-8xl sm:text-9xl"
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
              >
                {page.emoji}
              </motion.span>
            </div>
            {page.speaker && (
              <p className="text-center text-xs font-black uppercase tracking-wide text-[var(--p-primary)]">
                {page.speaker}
              </p>
            )}
            <p className="text-center text-lg leading-relaxed text-[var(--p-ink)] sm:text-xl">
              {renderPageText(page.text, page.highlight?.word)}
            </p>
            {page.highlight && (
              <div className="flex flex-col items-center gap-2">
                <motion.button
                  type="button"
                  onClick={revealHighlight}
                  whileTap={{ scale: 0.95 }}
                  className="rounded-full bg-[var(--p-primary-soft)] px-4 py-1.5 text-xs font-bold text-[var(--p-primary-dark)]"
                >
                  👆 Tap &ldquo;{page.highlight.word}&rdquo; to find out more
                </motion.button>
                <AnimatePresence>
                  {revealed.has(page.id) && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="max-w-md rounded-2xl bg-[var(--p-secondary-soft)] px-4 py-3 text-center text-sm font-semibold text-[var(--p-ink-soft)]"
                    >
                      💡 {page.highlight.note}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {!activeCheckpoint && (
        <div className="flex items-center justify-between gap-3">
          <PButton variant="secondary" onClick={goBack} disabled={pageIndex === 0}>
            ◀ Back
          </PButton>
          <p className="text-xs font-bold text-[var(--p-muted)]">
            Page {pageIndex + 1} of {pages.length}
          </p>
          <PButton onClick={goNext} size="lg">
            {isLastPage ? "Finish Story 🎉" : "Next ▶"}
          </PButton>
        </div>
      )}
    </div>
  );
}

function renderPageText(text: string, highlightWord?: string) {
  if (!highlightWord) return text;
  const idx = text.indexOf(highlightWord);
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <span className="rounded-md bg-[var(--p-accent-soft)] px-1 font-black text-[var(--p-ink)]">
        {highlightWord}
      </span>
      {text.slice(idx + highlightWord.length)}
    </>
  );
}
