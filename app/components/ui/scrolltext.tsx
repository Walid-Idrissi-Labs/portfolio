"use client";

import { useLayoutEffect, useMemo, useRef } from "react";
import type { CSSProperties } from "react";

import { colors } from "../../lib/colors";

export interface ScrollTextProps {
  text: string;
  lineBreakSpacing?: number;
  /** Paragraph index from which the copy folds away until `expanded` is true. */
  collapseAfter?: number;
  expanded?: boolean;
  /** id of the folded region, so a toggle button can point aria-controls at it. */
  collapsibleId?: string;
}

interface WordEntry {
  value: string;
  highlight: boolean;
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

// A word is revealed once it rises past this fraction of the viewport height,
// so copy reads in as it reaches the lower-middle of the screen and the
// ghosted preview below stays visible. Position-based rather than
// progress-based so folding paragraphs in or out never re-maps the words
// that are already on screen.
const READING_LINE = 0.74;
// Width of the blur/rise band, in row pitches. About half a row of words is
// mid-transition at any time, which reads as a soft typing edge.
const BAND_ROWS = 0.5;
// Sweep that reveals the unfolded paragraphs. Duration and easing must stay
// in sync with .scrolltext-fold in globals.css (600ms easeOutQuint).
const FOLD_DURATION = 600;
const easeOutQuint = (t: number) => 1 - (1 - t) ** 5;
const clamp01 = (value: number) => (value < 0 ? 0 : value > 1 ? 1 : value);

const hiddenWordStyle: CSSProperties = { opacity: 0, transform: "translateY(10px)" };
const hiddenKeywordStyle: CSSProperties = { ...hiddenWordStyle, ...keywordGradient };

interface Runtime {
  sweep: (region: HTMLElement) => void;
}

export function ScrollText({
  text,
  lineBreakSpacing = 14,
  collapseAfter,
  expanded = false,
  collapsibleId,
}: ScrollTextProps) {
  const container = useRef<HTMLDivElement | null>(null);
  const region = useRef<HTMLDivElement | null>(null);
  const runtime = useRef<Runtime | null>(null);
  const wasExpanded = useRef(expanded);

  // Parse the **bold** markup once; `text` is static in practice.
  const { paragraphs, regionStartWord } = useMemo(() => {
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
          prev?.value
        ) {
          prev.value += tokens[0];
          first = 1;
        }

        for (let t = first; t < tokens.length; t++) {
          entries.push({ value: tokens[t], highlight, paragraphIndex: lineIndex });
        }
      });
    });

    const paragraphs = lines.map(() => [] as Array<{ entry: WordEntry; wordIndex: number }>);
    entries.forEach((entry, wordIndex) => paragraphs[entry.paragraphIndex].push({ entry, wordIndex }));

    const foldAt = collapseAfter ?? lines.length;
    const regionStartWord = entries.findIndex((entry) => entry.paragraphIndex >= foldAt);

    return { paragraphs, regionStartWord: regionStartWord === -1 ? entries.length : regionStartWord };
  }, [collapseAfter, text]);

  const foldAt = collapseAfter !== undefined && collapseAfter < paragraphs.length ? collapseAfter : paragraphs.length;
  const hasFold = foldAt < paragraphs.length;

  // Everything scroll-related lives in one closure keyed on the parsed text:
  // word positions are measured once per layout, and each scroll frame is a
  // single rect read plus a float per word, writing only the words whose
  // reveal actually changed (a handful at the moving edge).
  useLayoutEffect(() => {
    const el = container.current;
    if (!el) return;

    const outers = Array.from(el.querySelectorAll<HTMLElement>("[data-scroll-word]"));
    const inners = outers.map((outer) => outer.lastElementChild as HTMLElement);
    const ghosts = outers.map((outer) => outer.firstElementChild as HTMLElement);
    const count = outers.length;
    // Reading-order key per word: its row top plus a diagonal term so words in
    // one row reveal left-to-right and flow straight into the next row.
    const keys = new Float32Array(count);
    const fractions = new Float32Array(count);
    const painted = new Float32Array(count).fill(-1);
    let band = 16;
    let viewportHeight = window.innerHeight;
    let frame: number | null = null;
    let sweep: { start: number; region: HTMLElement } | null = null;
    let disposed = false;
    // Scroll frames only do work while the block is within a viewport of the
    // screen; further away no word can be crossing the reading line.
    let near = true;

    const measure = () => {
      const rect = el.getBoundingClientRect();
      const width = rect.width || 1;
      let pitch = Number.POSITIVE_INFINITY;
      let previousTop = Number.NEGATIVE_INFINITY;

      for (let i = 0; i < count; i++) {
        const wordRect = outers[i].getBoundingClientRect();
        const top = wordRect.top - rect.top;
        if (previousTop > Number.NEGATIVE_INFINITY && top - previousTop > 1) {
          pitch = Math.min(pitch, top - previousTop);
        }
        previousTop = top;
        keys[i] = top;
        fractions[i] = (wordRect.left + wordRect.width / 2 - rect.left) / width;
        painted[i] = -1;
      }

      if (!Number.isFinite(pitch)) pitch = 32;
      for (let i = 0; i < count; i++) keys[i] += fractions[i] * pitch;
      band = Math.max(8, pitch * BAND_ROWS);
    };

    const paint = (index: number, progress: number) => {
      if (Math.abs(progress - painted[index]) < 0.002) return;
      painted[index] = progress;
      const style = inners[index].style;
      style.opacity = progress.toFixed(3);
      style.transform = progress >= 1 ? "none" : `translateY(${(10 * (1 - progress)).toFixed(2)}px)`;
      // Only the words inside the band carry a filter; fully hidden words are
      // invisible anyway, so skipping the blur keeps hundreds of them cheap.
      style.filter = progress <= 0 || progress >= 1 ? "none" : `blur(${(6 * (1 - progress)).toFixed(2)}px)`;
      // A fully revealed word covers its ghost completely, so the ghost (and
      // its keyword gradient animation) can stop painting until it's needed.
      ghosts[index].style.visibility = progress >= 1 ? "hidden" : "";
    };

    const apply = (now: number) => {
      const top = el.getBoundingClientRect().top;
      const line = viewportHeight * READING_LINE;
      let regionLine = line;
      let regionFrom = count;

      if (sweep) {
        const t = Math.min(1, (now - sweep.start) / FOLD_DURATION);
        // Starts above the first unfolded word so every word resets to hidden
        // on the first frame, then eases down to the reading line in step
        // with the fold opening.
        const from = sweep.region.getBoundingClientRect().top - band;
        regionLine = Math.min(line, from + (line - from) * easeOutQuint(t));
        regionFrom = regionStartWord;
        if (t >= 1) sweep = null;
      }

      for (let i = 0; i < count; i++) {
        const target = i >= regionFrom ? regionLine : line;
        paint(i, clamp01((target - (top + keys[i])) / band + 0.5));
      }

      if (sweep) schedule();
    };

    const schedule = () => {
      if (frame !== null || !near) return;
      frame = window.requestAnimationFrame((now) => {
        frame = null;
        apply(now);
      });
    };

    const remeasure = () => {
      if (disposed) return;
      measure();
      schedule();
    };

    const onResize = () => {
      viewportHeight = window.innerHeight;
      schedule();
    };

    measure();
    apply(performance.now());

    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });

    // Only a width change reflows the words. Height changes (the fold
    // opening, content above loading) leave every word where it was. The
    // first callback fires right after observe() and just sets the baseline.
    let observedWidth: number | null = null;
    const observer = new ResizeObserver(([entry]) => {
      if (!entry) return;
      const width = entry.contentRect.width;
      if (observedWidth !== null && Math.abs(width - observedWidth) > 0.5) remeasure();
      observedWidth = width;
    });
    observer.observe(el);
    document.fonts.ready.then(remeasure);

    const proximity = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        near = entry.isIntersecting;
        if (near) schedule();
      },
      { rootMargin: "100% 0px" }
    );
    proximity.observe(el);

    runtime.current = {
      sweep: (regionEl) => {
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
          sweep = null;
        } else {
          sweep = { start: performance.now(), region: regionEl };
        }
        schedule();
      },
    };

    return () => {
      disposed = true;
      runtime.current = null;
      observer.disconnect();
      proximity.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", onResize);
      if (frame !== null) window.cancelAnimationFrame(frame);
    };
  }, [regionStartWord, text]);

  // Layout effect so the reset-to-hidden frame lands before the fold's first
  // painted frame; otherwise previously revealed words could flash.
  useLayoutEffect(() => {
    const opened = expanded && !wasExpanded.current;
    wasExpanded.current = expanded;
    if (opened && region.current) runtime.current?.sweep(region.current);
  }, [expanded]);

  const renderParagraph = (paragraphIndex: number) => (
    <div
      key={paragraphIndex}
      className="flex flex-wrap leading-[0.65]"
      style={paragraphIndex === 0 ? undefined : { marginTop: `${lineBreakSpacing}px` }}
    >
      {paragraphs[paragraphIndex].map(({ entry, wordIndex }) => (
        <span
          key={wordIndex}
          data-scroll-word
          className="relative mt-3 mr-2 text-xl font-unbounded font-light text-neutral-100 md:text-3xl xl:text-3xl"
        >
          <span aria-hidden="true" className="absolute opacity-20" style={entry.highlight ? keywordGradient : undefined}>
            {entry.value}
          </span>
          <span className="inline-block" style={entry.highlight ? hiddenKeywordStyle : hiddenWordStyle}>
            {entry.value}
          </span>
        </span>
      ))}
    </div>
  );

  return (
    <div ref={container} className="p-4">
      {paragraphs.slice(0, foldAt).map((_, paragraphIndex) => renderParagraph(paragraphIndex))}
      {hasFold && (
        <div ref={region} id={collapsibleId} className="scrolltext-fold" data-open={expanded ? "" : undefined}>
          <div className="scrolltext-fold-inner">
            {paragraphs.slice(foldAt).map((_, offset) => renderParagraph(foldAt + offset))}
          </div>
        </div>
      )}
    </div>
  );
}
