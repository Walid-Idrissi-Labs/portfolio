"use client";

import { useEffect, useId, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { MoveRight } from "lucide-react";

import { ScrollText } from "../ui/scrolltext";

const introReadDuration = 800;

export function ProjectBackstory({ paragraphs, year }: { paragraphs: string[]; year: string }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isIntroRead, setIsIntroRead] = useState(false);
  const [isOpening, setIsOpening] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const contentId = useId();
  const hasMoreParagraphs = paragraphs.length > 1;
  const firstParagraph = paragraphs[0] ?? "";
  const remainingParagraphs = paragraphs.slice(1);

  useEffect(() => {
    if (!isOpening) return;

    const timer = window.setTimeout(() => {
      setIsExpanded(true);
      setIsOpening(false);
    }, shouldReduceMotion ? 0 : introReadDuration);

    return () => window.clearTimeout(timer);
  }, [isOpening, shouldReduceMotion]);

  const toggleBackstory = () => {
    if (isExpanded) {
      setIsExpanded(false);
      return;
    }

    if (isIntroRead) {
      setIsExpanded(true);
      return;
    }

    setIsIntroRead(true);
    setIsOpening(true);
  };

  return (
    <div>
      <div id={contentId}>
        <ScrollText text={firstParagraph} lineBreakSpacing={18} forceReveal={isIntroRead} />

        <AnimatePresence initial={false}>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0, y: shouldReduceMotion ? 0 : -12 }}
              animate={{ height: "auto", opacity: 1, y: 0 }}
              exit={{ height: 0, opacity: 0, y: shouldReduceMotion ? 0 : -8 }}
              transition={
                shouldReduceMotion
                  ? { duration: 0 }
                  : {
                      height: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
                      opacity: { duration: 0.35, delay: 0.08, ease: "easeOut" },
                      y: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
                    }
              }
              className="overflow-hidden will-change-[height,opacity,transform]"
            >
              <ScrollText text={remainingParagraphs.join("\n")} lineBreakSpacing={18} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {hasMoreParagraphs && (
        <div className="mt-7 flex justify-center">
          <button
            type="button"
            aria-controls={contentId}
            aria-expanded={isExpanded}
            aria-busy={isOpening}
            disabled={isOpening}
            onClick={toggleBackstory}
            className="group flex cursor-pointer items-center gap-2 font-ibm text-[11px] uppercase tracking-[0.25em] text-neutral-500 transition-colors duration-300 hover:text-beige_bright focus-visible:text-beige_bright focus-visible:outline-none disabled:cursor-wait disabled:opacity-70"
          >
            {isExpanded ? "Show Less" : isOpening ? "Marking as read…" : "Show More…"}
            <motion.span
              animate={{ rotate: isExpanded ? -90 : 90 }}
              transition={{ duration: shouldReduceMotion ? 0 : 0.3 }}
              className="inline-flex"
            >
              <MoveRight
                aria-hidden="true"
                className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1.5"
                strokeWidth={1.5}
              />
            </motion.span>
          </button>
        </div>
      )}

      <p className="mt-6 pr-4 text-right font-ibm text-xs uppercase tracking-[0.3em] text-slate md:text-sm">
        — walid, {year}
      </p>
    </div>
  );
}
