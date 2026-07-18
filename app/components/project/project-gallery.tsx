"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";

import type { ProjectScreenshot } from "../../lib/projects";

type ProjectGalleryProps = {
  slug: string;
  shots: ProjectScreenshot[];
};

// Scroll-pinned filmstrip: the section spans several viewport heights, the
// inner viewport sticks, and vertical scroll drives the strip horizontally
// while the off-center frames blur and dim. Small screens and reduced-motion
// users get a native swipe-snap strip instead, so the pinned path is purely a
// progressive enhancement (it is also what the server renders first).
export function ProjectGallery({ slug, shots }: ProjectGalleryProps) {
  const [pinned, setPinned] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const query = window.matchMedia("(min-width: 768px)");
    const update = () => setPinned(query.matches && !shouldReduceMotion);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, [shouldReduceMotion]);

  if (shots.length === 0) return null;

  if (shots.length === 1) {
    return (
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-4 px-6 md:px-0">
        <Frame slug={slug} shot={shots[0]} index={0} />
        <p className="font-unbounded font-extralight text-xs text-neutral-400 md:text-sm">{shots[0].caption}</p>
      </div>
    );
  }

  return pinned ? <PinnedStrip slug={slug} shots={shots} /> : <SwipeStrip slug={slug} shots={shots} />;
}

function PinnedStrip({ slug, shots }: ProjectGalleryProps) {
  const outerRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [shift, setShift] = useState(0);
  const [active, setActive] = useState(0);

  const { scrollYProgress } = useScroll({
    target: outerRef,
    offset: ["start start", "end end"],
  });

  // The strip travels exactly its overflow, so the first frame starts centered
  // (track side padding) and the last one ends centered.
  useEffect(() => {
    const measure = () => {
      const track = trackRef.current;
      if (!track) return;
      setShift(Math.max(0, track.scrollWidth - window.innerWidth));
    };
    measure();
    const observer = new ResizeObserver(measure);
    if (trackRef.current) observer.observe(trackRef.current);
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [shots.length]);

  const x = useTransform(scrollYProgress, [0, 1], [0, -shift]);

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    setActive(Math.min(shots.length - 1, Math.max(0, Math.round(value * (shots.length - 1)))));
  });

  return (
    <div ref={outerRef} style={{ height: `${shots.length * 65 + 60}vh` }}>
      <div className="sticky top-0 flex h-svh flex-col justify-center overflow-hidden">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 pb-8 font-ibm text-[10px] uppercase tracking-[0.3em] text-slate md:px-10 md:text-xs">
          <span>captures</span>
          <span aria-live="polite">
            <span className="text-beige_bright">{String(active + 1).padStart(2, "0")}</span>
            {" / "}
            {String(shots.length).padStart(2, "0")}
          </span>
        </div>

        <motion.div
          ref={trackRef}
          style={{ x }}
          className="flex w-max items-center gap-[4vw] px-[21vw] will-change-transform lg:px-[26vw] xl:px-[29vw]"
        >
          {shots.map((shot, index) => (
            <StripFrame
              key={`${shot.src}-${index}`}
              slug={slug}
              shot={shot}
              index={index}
              count={shots.length}
              progress={scrollYProgress}
            />
          ))}
        </motion.div>

        <div className="mx-auto mt-8 flex w-full max-w-6xl flex-col gap-4 px-6 md:mt-10 md:px-10">
          <div className="relative h-6 md:h-7">
            <AnimatePresence mode="wait">
              <motion.p
                key={active}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 truncate font-unbounded font-extralight text-xs text-neutral-300 md:text-sm"
              >
                {shots[active].caption}
              </motion.p>
            </AnimatePresence>
          </div>
          <div className="h-px w-full bg-white/10">
            <motion.div style={{ scaleX: scrollYProgress }} className="h-px origin-left bg-beige_bright/70" />
          </div>
        </div>
      </div>
    </div>
  );
}

function StripFrame({
  slug,
  shot,
  index,
  count,
  progress,
}: {
  slug: string;
  shot: ProjectScreenshot;
  index: number;
  count: number;
  progress: MotionValue<number>;
}) {
  // 0 when this frame sits dead-center, 1 once it is a full slot away.
  const distance = useTransform(progress, (value) => Math.min(1, Math.abs(value * (count - 1) - index)));
  const scale = useTransform(distance, [0, 1], [1, 0.92]);
  const opacity = useTransform(distance, [0, 1], [1, 0.45]);
  const filter = useTransform(distance, (value) =>
    value < 0.05 ? "none" : `blur(${(value * 2.5).toFixed(2)}px)`
  );

  return (
    <motion.div style={{ scale, opacity, filter }} className="w-[58vw] shrink-0 lg:w-[48vw] xl:w-[42vw]">
      <Frame slug={slug} shot={shot} index={index} />
    </motion.div>
  );
}

function SwipeStrip({ slug, shots }: ProjectGalleryProps) {
  return (
    <div className="flex w-full flex-col gap-4">
      <div className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-2">
        {shots.map((shot, index) => (
          <div key={`${shot.src}-${index}`} className="w-[85vw] max-w-md shrink-0 snap-center">
            <Frame slug={slug} shot={shot} index={index} />
            <p className="mt-3 px-1 font-unbounded font-extralight text-xs text-neutral-400">{shot.caption}</p>
          </div>
        ))}
      </div>
      <p className="px-6 font-ibm text-[10px] uppercase tracking-[0.3em] text-slate">swipe →</p>
    </div>
  );
}

// Every capture sits in a faux window: three palette dots, a mono "file path",
// and the shot itself — so mixed screenshots still read as one set.
function Frame({ slug, shot, index }: { slug: string; shot: ProjectScreenshot; index: number }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-not_quite_black">
      <div className="flex items-center gap-1.5 border-b border-white/10 px-4 py-2.5">
        <span className="h-2 w-2 rounded-full bg-red/80" />
        <span className="h-2 w-2 rounded-full bg-beige_dark/80" />
        <span className="h-2 w-2 rounded-full bg-slate/80" />
        <span className="ml-auto truncate font-ibm text-[9px] uppercase tracking-[0.2em] text-slate md:text-[10px]">
          ~/{slug}/{String(index + 1).padStart(2, "0")}.png
        </span>
      </div>
      <div className="relative aspect-video">
        <Image
          src={shot.src}
          alt={shot.alt}
          fill
          sizes="(max-width: 768px) 85vw, 60vw"
          className={shot.fit === "contain" ? "object-contain" : "object-cover"}
        />
      </div>
    </div>
  );
}
