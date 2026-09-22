"use client";

import { useEffect, useRef } from "react";
import type { ReactNode } from "react";

/**
 * Pauses every CSS animation inside its subtree while the subtree is far from
 * the viewport (see `[data-offscreen]` in globals.css). Animations resume from
 * the same frame they paused on, so nothing looks different on screen; the
 * browser just stops ticking and repainting gradient text nobody can see.
 *
 * Wrap a heading together with the content whose animations must stay in
 * phase with it, so they pause and resume as one.
 */
export function PauseOffscreen({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) el.removeAttribute("data-offscreen");
        else el.setAttribute("data-offscreen", "");
      },
      // Half a viewport of slack on each side: animations are already running
      // by the time the content scrolls into view.
      { rootMargin: "50% 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
