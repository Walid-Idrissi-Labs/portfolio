"use client";

import { useId, useState } from "react";
import { MoveRight } from "lucide-react";

import { ScrollText } from "../ui/scrolltext";

export function ProjectBackstory({ paragraphs, year }: { paragraphs: string[]; year: string }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const contentId = useId();
  const hasMoreParagraphs = paragraphs.length > 1;

  return (
    <div>
      <div id={contentId}>
        <ScrollText
          text={paragraphs.join("\n")}
          lineBreakSpacing={18}
          visibleParagraphCount={isExpanded ? paragraphs.length : 1}
          completedParagraphCount={isExpanded ? 1 : 0}
          animateVisibleParagraphs={isExpanded}
        />
      </div>

      {hasMoreParagraphs && (
        <div className="mt-7 flex justify-center">
          <button
            type="button"
            aria-controls={contentId}
            aria-expanded={isExpanded}
            onClick={() => setIsExpanded((expanded) => !expanded)}
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
