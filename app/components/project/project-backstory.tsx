"use client";

import { useEffect, useId, useRef, useState } from "react";
import { MoveRight } from "lucide-react";

import { ScrollText } from "../ui/scrolltext";

// Matches the fold transition in globals.css / FOLD_DURATION in scrolltext.tsx
// so the scroll-back on "Show Less" lands together with the fold closing.
const FOLD_DURATION = 600;
const TOP_MARGIN = 96;
const easeOutQuint = (t: number) => 1 - (1 - t) ** 5;

export function ProjectBackstory({ paragraphs, year }: { paragraphs: string[]; year: string }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const root = useRef<HTMLDivElement | null>(null);
  const cancelScroll = useRef<(() => void) | null>(null);
  const foldId = useId();
  const hasMoreParagraphs = paragraphs.length > 1;

  useEffect(() => () => cancelScroll.current?.(), []);

  // Folding from the bottom of a long backstory would leave the reader
  // staring at whatever follows the section, so bring the block's top back
  // into view on the same curve as the fold. The user's own wheel/touch/keys
  // take over immediately.
  const scrollBackToTop = () => {
    const el = root.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top;
    if (top >= 0) return;

    cancelScroll.current?.();
    const from = window.scrollY;
    const to = Math.max(0, from + top - TOP_MARGIN);

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      window.scrollTo({ top: to, behavior: "instant" });
      return;
    }

    const start = performance.now();
    let frame = window.requestAnimationFrame(function step(now) {
      const t = Math.min(1, (now - start) / FOLD_DURATION);
      // "instant" opts out of the html { scroll-behavior: smooth } rule,
      // which would otherwise re-smooth every frame of this tween.
      window.scrollTo({ top: from + (to - from) * easeOutQuint(t), behavior: "instant" });
      if (t < 1) frame = window.requestAnimationFrame(step);
      else cancel();
    });

    const cancel = () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("wheel", cancel);
      window.removeEventListener("touchstart", cancel);
      window.removeEventListener("keydown", cancel);
      cancelScroll.current = null;
    };
    window.addEventListener("wheel", cancel, { passive: true });
    window.addEventListener("touchstart", cancel, { passive: true });
    window.addEventListener("keydown", cancel);
    cancelScroll.current = cancel;
  };

  const toggle = () => {
    if (isExpanded) scrollBackToTop();
    setIsExpanded((expanded) => !expanded);
  };

  return (
    <div ref={root}>
      <ScrollText
        text={paragraphs.join("\n")}
        lineBreakSpacing={18}
        collapseAfter={hasMoreParagraphs ? 1 : undefined}
        expanded={isExpanded}
        collapsibleId={foldId}
      />

      {hasMoreParagraphs && (
        <div className="mt-7 flex justify-center">
          <button
            type="button"
            aria-controls={foldId}
            aria-expanded={isExpanded}
            onClick={toggle}
            className="group flex cursor-pointer items-center gap-2 font-ibm text-[11px] uppercase tracking-[0.25em] text-neutral-500 transition-colors duration-300 hover:text-beige_bright focus-visible:text-beige_bright focus-visible:outline-none"
          >
            {isExpanded ? "Show Less" : "Show More…"}
            <span className={`inline-flex transition-transform duration-300 ${isExpanded ? "-rotate-90" : "rotate-90"}`}>
              <MoveRight
                aria-hidden="true"
                className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1.5"
                strokeWidth={1.5}
              />
            </span>
          </button>
        </div>
      )}

      <p className="mt-6 pr-4 text-right font-ibm text-xs uppercase tracking-[0.3em] text-slate md:text-sm">
        — walid, {year}
      </p>
    </div>
  );
}
