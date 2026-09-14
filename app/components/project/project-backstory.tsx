"use client";

import { useId, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ChevronDown } from "lucide-react";

import { ScrollText } from "../ui/scrolltext";

export function ProjectBackstory({ paragraphs, year }: { paragraphs: string[]; year: string }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const contentId = useId();
  const hasMoreParagraphs = paragraphs.length > 1;
  const firstParagraph = paragraphs[0] ?? "";
  const remainingParagraphs = paragraphs.slice(1);

  return (
    <div>
      <div id={contentId}>
        <ScrollText text={firstParagraph} lineBreakSpacing={18} />

        <AnimatePresence initial={false}>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0, y: -12 }}
              animate={{ height: "auto", opacity: 1, y: 0 }}
              exit={{ height: 0, opacity: 0, y: -12 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden"
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
            onClick={() => setIsExpanded((expanded) => !expanded)}
            className="flex cursor-pointer items-center gap-2 rounded-full border border-white/15 px-5 py-2.5 font-ibm text-[11px] uppercase tracking-[0.25em] text-neutral-300 transition-colors duration-300 hover:border-beige_bright/60 hover:text-beige_bright focus-visible:border-beige_bright focus-visible:text-beige_bright focus-visible:outline-none"
          >
            {isExpanded ? "Show Less" : "Show More…"}
            <motion.span animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.3 }}>
              <ChevronDown aria-hidden="true" className="size-3.5" />
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
