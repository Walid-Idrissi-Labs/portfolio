"use client" 

import * as React from "react"
 
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useRef } from "react";
import { colors } from "../../lib/colors";

export interface MagicTextProps {
  text: string;
  lineBreakSpacing?: number;
}

interface WordProps {
  children: string;
  progress: MotionValue<number>;
  range: number[];
  highlight?: boolean;
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
const keywordGradient: React.CSSProperties = {
  backgroundImage: `linear-gradient(to right, ${[...keywordColors, keywordColors[0]].join(", ")})`,
  backgroundSize: "300% 100%",
  backgroundRepeat: "repeat",
  animation: "gradient-pan-x 6s linear infinite",
  WebkitBackgroundClip: "text",
  backgroundClip: "text",
  color: "transparent",
};

const Word: React.FC<WordProps> = ({ children, progress, range, highlight }) => {
  const opacity = useTransform(progress, range, [0, 1]);
  const y = useTransform(progress, range, [10, 0]);
  const blur = useTransform(progress, range, [6, 0]);
  // Drop the filter entirely once sharp so revealed words don't keep a
  // compositing layer alive (this paragraph renders ~200 of them).
  const filter = useTransform(blur, (b) => (b < 0.1 ? "none" : `blur(${b}px)`));

  return (
    <span className="relative mt-3 mr-2 text-xl md:text-3xl xl:text-3xl font-unbounded font-light text-neutral-100 ">
      <span className="absolute opacity-20" style={highlight ? keywordGradient : undefined}>
        {children}
      </span>
      <motion.span
        className="inline-block will-change-transform"
        style={{ opacity, y, filter, ...(highlight ? keywordGradient : undefined) }}
      >
        {children}
      </motion.span>
    </span>
  );
};
 
export const ScrollText: React.FC<MagicTextProps> = ({ text, lineBreakSpacing = 14 }) => {
  const container = useRef(null);
 
  const { scrollYProgress } = useScroll({
    target: container,
    // Start when the top of the text enters the lower viewport, finish when
    // its bottom reaches mid-screen, so the reveal keeps pace with reading.
    offset: ["start 0.8", "end 0.45"],
  });
  const lines = text.split("\n");
  const entries: WordEntry[] = [];

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

  const totalWords = entries.filter((entry) => entry.type === "word").length;
  let wordIndex = 0;
 
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

        // Each word transitions over ~3 words' worth of progress, so a few
        // neighbours are always mid-blur — reads as a motion-blurred edge.
        const start = totalWords > 0 ? wordIndex / totalWords : 0;
        const end = totalWords > 0 ? Math.min(1, start + 3 / totalWords) : 1;
        const currentWord = entry.value ?? "";
        wordIndex += 1;

        return (
          <Word key={`word-${i}`} progress={scrollYProgress} range={[start, end]} highlight={entry.highlight}>
            {currentWord}
          </Word>
        );
      })}
    </p>
  );
};