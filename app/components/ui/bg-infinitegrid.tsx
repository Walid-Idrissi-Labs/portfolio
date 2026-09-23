"use client";

import { useRef, useEffect } from "react";
import { cn } from "../../lib/utils";
import { motion, useMotionValue, useMotionTemplate } from "motion/react";

type InfiniteGridProps = {
  className?: string;
};

// Grid drift speed in px/s (equivalent to the original 0.5px per frame at 60fps,
// but consistent on every refresh rate).
const GRID_SPEED = 30;
const GRID_SIZE = 40;

// The drift is a CSS keyframe (`.grid-drift` in globals.css): the SVG is one
// cell larger than its box, starts one cell up-left, and slides by exactly one
// cell before looping. That is pixel-identical to offsetting the pattern every
// frame, but runs on the compositor instead of re-rasterising the SVG.
const driftVars = {
  "--grid-size": `${GRID_SIZE}px`,
  "--grid-period": `${GRID_SIZE / GRID_SPEED}s`,
} as React.CSSProperties;

export const InfiniteGrid = ({ className }: InfiniteGridProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => {
    // Coalesce pointer events to one mask update per frame.
    let frame: number | null = null;
    let pending = { x: 0, y: 0 };

    const flush = () => {
      frame = null;
      const container = containerRef.current;
      if (!container) return;
      const { left, top } = container.getBoundingClientRect();
      mouseX.set(pending.x - left);
      mouseY.set(pending.y - top);
    };

    const updateMouse = (clientX: number, clientY: number) => {
      pending = { x: clientX, y: clientY };
      if (frame === null) frame = requestAnimationFrame(flush);
    };

    const handlePointerMove = (e: PointerEvent) => {
      updateMouse(e.clientX, e.clientY);
    };

    const handleTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0];
      if (!touch) return;
      updateMouse(touch.clientX, touch.clientY);
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });

    return () => {
      if (frame !== null) cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, [mouseX, mouseY]);

  const maskImage = useMotionTemplate`radial-gradient(300px circle at ${mouseX}px ${mouseY}px, black, transparent)`;

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative w-full h-screen flex flex-col items-center justify-center overflow-hidden bg-black",
        className
      )}
      style={driftVars}
    >
      <div className="absolute inset-0 z-0 opacity-[0.1] overflow-hidden">
        <GridPattern id="grid-pattern-base" />
      </div>
      <motion.div
        className="absolute inset-0 z-0 opacity-40 overflow-hidden"
        style={{ maskImage, WebkitMaskImage: maskImage }}
      >
        <GridPattern id="grid-pattern-spot" />
      </motion.div>

      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute right-[-20%] top-[-20%] w-[40%] h-[40%] rounded-full blur-[120px] bg-beige_bright/18" />
        <div className="absolute right-[10%] top-[-10%] w-[20%] h-[20%] rounded-full blur-[100px] bg-primary/14" />
        <div className="absolute left-[-10%] bottom-[-20%] w-[40%] h-[40%] rounded-full blur-[120px] bg-slate/18" />
      </div>
    </div>
  );
};

const GridPattern = ({ id }: { id: string }) => {
  return (
    <svg
      className="grid-drift absolute"
      style={{
        left: -GRID_SIZE,
        top: -GRID_SIZE,
        width: `calc(100% + ${GRID_SIZE}px)`,
        height: `calc(100% + ${GRID_SIZE}px)`,
      }}
    >
      <defs>
        <pattern id={id} width={GRID_SIZE} height={GRID_SIZE} patternUnits="userSpaceOnUse">
          <path
            d={`M ${GRID_SIZE} 0 L 0 0 0 ${GRID_SIZE}`}
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            className="text-muted-foreground"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
};
