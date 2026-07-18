"use client";

import { useRef, useEffect } from "react";
import { cn } from "../../lib/utils";
import {
  motion,
  useMotionValue,
  useMotionTemplate,
  useAnimationFrame,
  type MotionValue,
} from "motion/react";

type InfiniteGridProps = {
  className?: string;
};

// Grid drift speed in px/s (equivalent to the original 0.5px per frame at 60fps,
// but consistent on every refresh rate).
const GRID_SPEED = 30;
const GRID_SIZE = 40;

export const InfiniteGrid = ({ className }: InfiniteGridProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => {
    const updateMouse = (clientX: number, clientY: number) => {
      const container = containerRef.current;
      if (!container) return;
      const { left, top } = container.getBoundingClientRect();
      mouseX.set(clientX - left);
      mouseY.set(clientY - top);
    };

    const handlePointerMove = (e: PointerEvent) => {
      updateMouse(e.clientX, e.clientY);
    };

    const handleTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0];
      if (!touch) return;
      updateMouse(touch.clientX, touch.clientY);
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("touchmove", handleTouchMove, { passive: true });

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, [mouseX, mouseY]);

  const gridOffsetX = useMotionValue(0);
  const gridOffsetY = useMotionValue(0);
  const lastTime = useRef<number | null>(null);

  useAnimationFrame((time) => {
    if (lastTime.current === null) {
      lastTime.current = time;
      return;
    }
    const delta = (time - lastTime.current) / 1000;
    lastTime.current = time;
    const step = GRID_SPEED * delta;
    gridOffsetX.set((gridOffsetX.get() + step) % GRID_SIZE);
    gridOffsetY.set((gridOffsetY.get() + step) % GRID_SIZE);
  });

  const maskImage = useMotionTemplate`radial-gradient(300px circle at ${mouseX}px ${mouseY}px, black, transparent)`;

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative w-full h-screen flex flex-col items-center justify-center overflow-hidden bg-black",
        className
      )}
    >
      <div className="absolute inset-0 z-0 opacity-[0.1]">
        <GridPattern offsetX={gridOffsetX} offsetY={gridOffsetY} />
      </div>
      <motion.div
        className="absolute inset-0 z-0 opacity-40"
        style={{ maskImage, WebkitMaskImage: maskImage }}
      >
        <GridPattern offsetX={gridOffsetX} offsetY={gridOffsetY} />
      </motion.div>

      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute right-[-20%] top-[-20%] w-[40%] h-[40%] rounded-full blur-[120px] bg-beige_bright/18" />
        <div className="absolute right-[10%] top-[-10%] w-[20%] h-[20%] rounded-full blur-[100px] bg-primary/14" />
        <div className="absolute left-[-10%] bottom-[-20%] w-[40%] h-[40%] rounded-full blur-[120px] bg-slate/18" />
      </div>
    </div>
  );
};

const GridPattern = ({ offsetX, offsetY }: { offsetX: MotionValue<number>; offsetY: MotionValue<number> }) => {
  return (
    <svg className="w-full h-full">
      <defs>
        <motion.pattern
          id="grid-pattern"
          width={GRID_SIZE}
          height={GRID_SIZE}
          patternUnits="userSpaceOnUse"
          x={offsetX}
          y={offsetY}
        >
          <path
            d={`M ${GRID_SIZE} 0 L 0 0 0 ${GRID_SIZE}`}
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            className="text-muted-foreground"
          />
        </motion.pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid-pattern)" />
    </svg>
  );
};
