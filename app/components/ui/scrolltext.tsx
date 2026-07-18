"use client" 

import * as React from "react"
 
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useRef } from "react";

export interface MagicTextProps {
  text: string;
  lineBreakSpacing?: number;
}

interface WordProps {
  children: string;
  progress: MotionValue<number>;
  range: number[];
}

interface WordEntry {
  type: "word" | "break";
  value?: string;
}
 
const Word: React.FC<WordProps> = ({ children, progress, range }) => {
  const opacity = useTransform(progress, range, [0, 1]);
  const y = useTransform(progress, range, [10, 0]);
  const blur = useTransform(progress, range, [6, 0]);
  // Drop the filter entirely once sharp so revealed words don't keep a
  // compositing layer alive (this paragraph renders ~200 of them).
  const filter = useTransform(blur, (b) => (b < 0.1 ? "none" : `blur(${b}px)`));

  return (
    <span className="relative mt-3 mr-1 text-xl md:text-3xl xl:text-3xl font-unbounded font-light text-neutral-100 ">
      <span className="absolute opacity-20">{children}</span>
      <motion.span className="inline-block will-change-transform" style={{ opacity, y, filter }}>
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
    const lineWords = line.trim().split(/\s+/).filter(Boolean);

    lineWords.forEach((word) => {
      entries.push({ type: "word", value: word });
    });

    if (lineIndex < lines.length - 1) {
      entries.push({ type: "break" });
    }
  });

  const totalWords = entries.filter((entry) => entry.type === "word").length;
  let wordIndex = 0;
 
  return (
    <p ref={container} className="flex flex-wrap leading-[0.5] p-4">
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
          <Word key={`word-${i}`} progress={scrollYProgress} range={[start, end]}>
            {currentWord}
          </Word>
        );
      })}
    </p>
  );
};