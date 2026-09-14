"use client";

import { useEffect, useMemo, useRef } from "react";
import { useScroll } from "motion/react";
import type { CSSProperties } from "react";

import { colors } from "../../lib/colors";

export interface MagicTextProps {
  text: string;
  lineBreakSpacing?: number;
  /** Number of paragraphs currently visible, starting from the first. */
  visibleParagraphCount?: number;
  /** Paragraphs already considered read, so their words stay fully revealed. */
  completedParagraphCount?: number;
}

interface WordEntry {
  type: "word" | "break";
  value?: string;
  highlight?: boolean;
  paragraphIndex: number;
}

// Words wrapped in **double asterisks** get the section-heading gradient,
// clipped to the glyphs. Timing stays in sync with SectionHeading's
// GradientText (animationSpeed=2 → 6s gradient-pan-x period), minus the
// border; slate is swapped for faint_white so keywords stay bright on black.
const keywordColors = [colors.beige_dark, colors.faint_white, colors.beige_bright];
const keywordGradient: CSSProperties = {
  backgroundImage: `linear-gradient(to right, ${[...keywordColors, keywordColors[0]].join(", ")})`,
  backgroundSize: "300% 100%",
  backgroundRepeat: "repeat",
  animation: "gradient-pan-x 6s linear infinite",
  WebkitBackgroundClip: "text",
  backgroundClip: "text",
  color: "transparent",
};

export function ScrollText({
  text,
  lineBreakSpacing = 14,
  visibleParagraphCount = Number.POSITIVE_INFINITY,
  completedParagraphCount = 0,
}: MagicTextProps) {
  const container = useRef<HTMLParagraphElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: container,
    // Start when the top of the text enters the lower viewport, finish when
    // its bottom reaches mid-screen, so the reveal keeps pace with reading.
    offset: ["start 0.8", "end 0.45"],
  });

  // Parse the **bold** markup and precompute each word's scroll-progress
  // window. `text` is static, so this runs once. Words render as plain spans so
  // the reveal is driven by a single scroll subscription rather than one Motion
  // value + blur filter per word (~200-600 of them on the longest pages).
  const { entries, wordRanges, completedWordCount, activeWordCount } = useMemo(() => {
    const entries: WordEntry[] = [];
    const lines = text.split("\n");

    lines.forEach((line, lineIndex) => {
      const segments = line.split("**");
      segments.forEach((segment, segmentIndex) => {
        const highlight = segmentIndex % 2 === 1;
        const tokens = segment.split(/\s+/).filter(Boolean);
        let first = 0;
        const prev = entries[entries.length - 1];

        // Punctuation hugging a ** boundary ("**Terraform**,") glues onto the
        // preceding word instead of rendering as a standalone "word". Both sides
        // of the boundary have to be whitespace-free: testing only this segment
        // fuses the first word of every bold run onto the word before it
        // ("with **Terraform,**" -> "withTerraform,"), gradient and all.
        if (
          segmentIndex > 0 &&
          tokens.length > 0 &&
          !/\s$/.test(segments[segmentIndex - 1]) &&
          !/^\s/.test(segment) &&
          prev?.type === "word" &&
          prev.value
        ) {
          prev.value += tokens[0];
          first = 1;
        }

        for (let t = first; t < tokens.length; t++) {
          entries.push({ type: "word", value: tokens[t], highlight, paragraphIndex: lineIndex });
        }
      });

      if (lineIndex < lines.length - 1) {
        entries.push({ type: "break", paragraphIndex: lineIndex + 1 });
      }
    });

    const completedWordCount = entries.filter(
      (entry) => entry.type === "word" && entry.paragraphIndex < completedParagraphCount,
    ).length;
    const activeWordCount = entries.filter(
      (entry) =>
        entry.type === "word" &&
        entry.paragraphIndex >= completedParagraphCount &&
        entry.paragraphIndex < visibleParagraphCount,
    ).length;

    // Each active word transitions over ~3 words' worth of progress, so a few
    // neighbours are always mid-blur — reads as a motion-blurred edge.
    const wordRanges: Array<[number, number]> = [];
    let activeWordIndex = 0;
    entries.forEach((entry) => {
      if (entry.type === "word") {
        const isActive =
          entry.paragraphIndex >= completedParagraphCount && entry.paragraphIndex < visibleParagraphCount;
        const start = isActive && activeWordCount > 0 ? activeWordIndex / activeWordCount : 0;
        const end = isActive && activeWordCount > 0 ? Math.min(1, start + 3 / activeWordCount) : 1;
        wordRanges.push([start, end]);
        if (isActive) activeWordIndex += 1;
      }
    });

    return { entries, wordRanges, completedWordCount, activeWordCount };
  }, [completedParagraphCount, text, visibleParagraphCount]);

  useEffect(() => {
    const el = container.current;
    if (!el) return;

    // Query once per text change, then update only the handful of words at the
    // moving reveal edge. This keeps scroll work constant even for long copy.
    const words = Array.from(el.querySelectorAll<HTMLElement>("[data-scroll-word]"));
    let frame: number | null = null;
    let queuedProgress = scrollYProgress.get();
    let previousProgress: number | null = null;

    const getWordProgress = (index: number, progress: number) => {
      if (index < completedWordCount) return 1;
      const [start, end] = wordRanges[index] ?? [0, 1];
      return Math.min(1, Math.max(0, (progress - start) / (end - start || 1)));
    };

    const setWordProgress = (word: HTMLElement, progress: number) => {
      word.style.transition = "none";
      word.style.transitionDelay = "0ms";
      word.style.opacity = progress.toFixed(3);
      word.style.transform = `translate3d(0, ${(10 * (1 - progress)).toFixed(3)}px, 0)`;
      const blur = 6 * (1 - progress);
      word.style.filter = blur < 0.1 ? "none" : `blur(${blur.toFixed(2)}px)`;
    };

    const apply = (progress: number) => {
      if (activeWordCount === 0) return;

      // At any point only three neighbouring words are mid-transition. On a
      // jump, update the words crossed by that jump; otherwise leave the rest
      // of the paragraph alone.
      const activeStart = completedWordCount;
      const activeEnd = activeStart + activeWordCount - 1;
      const current = activeStart + progress * activeWordCount;
      const previous = activeStart + (previousProgress ?? progress) * activeWordCount;
      const isInitialPaint = previousProgress === null;
      const start = isInitialPaint
        ? 0
        : Math.max(activeStart, Math.floor(Math.min(current, previous)) - 4);
      const end = Math.min(activeEnd, Math.ceil(Math.max(current, previous)) + 1);

      for (let i = start; i <= end; i += 1) {
        setWordProgress(words[i], getWordProgress(i, progress));
      }

      previousProgress = progress;
    };

    // useScroll measures in a layout effect (before this effect), so read the
    // current value now, then follow every subsequent scroll change.
    apply(queuedProgress);
    const unsubscribe = scrollYProgress.on("change", (progress) => {
      queuedProgress = progress;
      if (frame !== null) return;

      frame = window.requestAnimationFrame(() => {
        apply(queuedProgress);
        frame = null;
      });
    });

    return () => {
      unsubscribe();
      if (frame !== null) window.cancelAnimationFrame(frame);
    };
  }, [activeWordCount, completedWordCount, scrollYProgress, wordRanges]);

  return (
    <p ref={container} className="flex flex-wrap leading-[0.65] p-4">
      {entries.map((entry, i) => {
        const isHidden = entry.paragraphIndex >= visibleParagraphCount;

        if (entry.type === "break") {
          return (
            <span
              key={`break-${i}`}
              className={`basis-full block${isHidden ? " hidden" : ""}`}
              style={{ height: `${lineBreakSpacing}px` }}
              aria-hidden="true"
            />
          );
        }

        const currentWord = entry.value ?? "";
        return (
          <span
            key={`word-${i}`}
            className={`relative mt-3 mr-2 text-xl md:text-3xl xl:text-3xl font-unbounded font-light text-neutral-100 ${
              isHidden ? "hidden" : ""
            }`}
          >
            <span className="absolute opacity-20" style={entry.highlight ? keywordGradient : undefined}>
              {currentWord}
            </span>
            <span
              data-scroll-word
              className="inline-block"
              style={{
                opacity: 0,
                transform: "translate3d(0, 10px, 0)",
                filter: "blur(6px)",
                ...(entry.highlight ? keywordGradient : undefined),
              }}
            >
              {currentWord}
            </span>
          </span>
        );
      })}
    </p>
  );
}
