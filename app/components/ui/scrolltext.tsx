"use client";

import { useEffect, useMemo, useRef } from "react";
import { useScroll } from "motion/react";
import type { CSSProperties } from "react";

import { colors } from "../../lib/colors";

export interface MagicTextProps {
  text: string;
  lineBreakSpacing?: number;
}

interface WordEntry {
  type: "word" | "break";
  value?: string;
  highlight?: boolean;
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

export function ScrollText({ text, lineBreakSpacing = 14 }: MagicTextProps) {
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
  const { entries, wordRanges } = useMemo(() => {
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
          entries.push({ type: "word", value: tokens[t], highlight });
        }
      });

      if (lineIndex < lines.length - 1) {
        entries.push({ type: "break" });
      }
    });

    // Each word transitions over ~3 words' worth of progress, so a few
    // neighbours are always mid-blur — reads as a motion-blurred edge.
    const totalWords = entries.filter((entry) => entry.type === "word").length;
    const wordRanges: Array<[number, number]> = [];
    let wordIndex = 0;
    entries.forEach((entry) => {
      if (entry.type === "word") {
        const start = totalWords > 0 ? wordIndex / totalWords : 0;
        const end = totalWords > 0 ? Math.min(1, start + 3 / totalWords) : 1;
        wordRanges.push([start, end]);
        wordIndex += 1;
      }
    });

    return { entries, wordRanges };
  }, [text]);

  useEffect(() => {
    const el = container.current;
    if (!el) return;

    const apply = (progress: number) => {
      const words = el.querySelectorAll<HTMLElement>("[data-scroll-word]");
      words.forEach((word, i) => {
        const [start, end] = wordRanges[i] ?? [0, 1];
        const span = end - start || 1;
        const t = Math.min(1, Math.max(0, (progress - start) / span));
        word.style.opacity = t.toFixed(3);
        word.style.transform = `translateY(${(10 * (1 - t)).toFixed(3)}px)`;
        const blur = 6 * (1 - t);
        word.style.filter = blur < 0.1 ? "none" : `blur(${blur.toFixed(2)}px)`;
      });
    };

    // useScroll measures in a layout effect (before this effect), so read the
    // current value now, then follow every subsequent scroll change.
    apply(scrollYProgress.get());
    const unsubscribe = scrollYProgress.on("change", apply);
    return () => unsubscribe();
  }, [scrollYProgress, wordRanges]);

  return (
    <p ref={container} className="flex flex-wrap leading-[0.65] p-4">
      {entries.map((entry, i) => {
        if (entry.type === "break") {
          return (
            <span
              key={`break-${i}`}
              className="basis-full block"
              style={{ height: `${lineBreakSpacing}px` }}
              aria-hidden="true"
            />
          );
        }

        const currentWord = entry.value ?? "";
        return (
          <span
            key={`word-${i}`}
            className="relative mt-3 mr-2 text-xl md:text-3xl xl:text-3xl font-unbounded font-light text-neutral-100 "
          >
            <span className="absolute opacity-20" style={entry.highlight ? keywordGradient : undefined}>
              {currentWord}
            </span>
            <span
              data-scroll-word
              className="inline-block will-change-transform"
              style={{
                opacity: 0,
                transform: "translateY(10px)",
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
