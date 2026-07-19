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

// Aspect ratio (w/h) of a shot, falling back to 16:9 when it has no intrinsic
// dimensions — the same fallback Frame uses for its box.
const ratioOf = (shot: ProjectScreenshot) =>
  shot.width && shot.height ? shot.width / shot.height : 16 / 9;

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
  const [active, setActive] = useState(0);
  const [viewport, setViewport] = useState(() => ({
    vw: typeof window !== "undefined" ? window.innerWidth : 1280,
    vh: typeof window !== "undefined" ? window.innerHeight : 800,
  }));

  const { scrollYProgress } = useScroll({
    target: outerRef,
    offset: ["start start", "end end"],
  });

  useEffect(() => {
    const measure = () => setViewport({ vw: window.innerWidth, vh: window.innerHeight });
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  // Two scroll phases that never overlap on the timeline. During GROW the frames
  // grow from their ORIGINAL width (byte-for-byte the old layout, so the strip
  // is untouched before you reach it) up to a height-filling width; only after
  // that does `travel` run 0 -> 1 and drive the strip horizontally.
  //
  // The frames no longer share a width, so we can't lean on "scroll the overflow"
  // to end centered — we compute the exact translation that puts the first
  // frame's centre on screen at the start and the last frame's centre on screen
  // at the end. These mirror the CSS: 58/48/42vw frames, 21/26/29vw side padding,
  // 4vw gaps.
  const { vw, vh } = viewport;
  const originalWidth = (vw >= 1280 ? 0.42 : vw >= 1024 ? 0.48 : 0.58) * vw;
  const sidePad = (vw >= 1280 ? 0.29 : vw >= 1024 ? 0.26 : 0.21) * vw;
  const gap = 0.04 * vw;
  const widths = shots.map((shot) => Math.min(0.88 * vw, 0.7 * vh * ratioOf(shot)));

  // Track-local centre of each frame at full (grown) width.
  const centerOf = (i: number) =>
    sidePad + widths.slice(0, i).reduce((sum, w) => sum + w, 0) + i * gap + widths[i] / 2;
  // Translations that land the first / last frame's centre on the viewport centre.
  const xStart = vw / 2 - centerOf(0);
  const xEnd = vw / 2 - centerOf(shots.length - 1);

  const GROW = 0.16;
  const grow = useTransform(scrollYProgress, [0, GROW], [0, 1]);
  const travel = useTransform(scrollYProgress, [GROW, 1], [0, 1]);
  // Grow eases the strip from centered-original (x = 0) to centered-grown-first
  // (x = xStart); travel then slides from xStart to xEnd (last frame centered).
  const x = useTransform([grow, travel], ([g, t]: number[]) => xStart * g + (xEnd - xStart) * t);

  useMotionValueEvent(travel, "change", (value) => {
    setActive(Math.min(shots.length - 1, Math.max(0, Math.round(value * (shots.length - 1)))));
  });

  return (
    <div ref={outerRef} style={{ height: `${shots.length * 80 + 100}vh` }}>
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
              progress={travel}
              grow={grow}
              originalWidth={originalWidth}
              fullWidth={widths[index]}
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
            <motion.div style={{ scaleX: travel }} className="h-px origin-left bg-beige_bright/70" />
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
  grow,
  originalWidth,
  fullWidth,
}: {
  slug: string;
  shot: ProjectScreenshot;
  index: number;
  count: number;
  progress: MotionValue<number>;
  grow: MotionValue<number>;
  originalWidth: number;
  fullWidth: number;
}) {
  // 0 when this frame sits dead-center, 1 once it is a full slot away.
  const distance = useTransform(progress, (value) => Math.min(1, Math.abs(value * (count - 1) - index)));
  const scale = useTransform(distance, [0, 1], [1, 0.92]);
  const opacity = useTransform(distance, [0, 1], [1, 0.45]);
  const filter = useTransform(distance, (value) =>
    value < 0.05 ? "none" : `blur(${(value * 2.5).toFixed(2)}px)`
  );

  // Real layout width, interpolated from the original size to a height-filling
  // size as the intro scroll runs. At grow = 0 it is byte-for-byte the old
  // width; the frame's height follows via its aspect ratio inside Frame.
  const width = useTransform(grow, (g) => originalWidth + g * (fullWidth - originalWidth));

  return (
    <motion.div style={{ scale, opacity, filter, width }} className="shrink-0">
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

// By default a capture shows raw behind just the border. Pass `chrome: true`
// on a shot to wrap it in a faux window — three palette dots, a mono "file
// path", and the shot itself — for shots that read better as a set.
function Frame({ slug, shot, index }: { slug: string; shot: ProjectScreenshot; index: number }) {
  const showChrome = shot.chrome === true;
  // When intrinsic dimensions are given the box matches the image's real
  // aspect ratio; otherwise fall back to the shared 16:9 slot.
  const ratio = shot.width && shot.height ? shot.width / shot.height : undefined;
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-not_quite_black">
      {showChrome && (
        <div className="flex items-center gap-1.5 border-b border-white/10 px-4 py-2.5">
          <span className="h-2 w-2 rounded-full bg-red/80" />
          <span className="h-2 w-2 rounded-full bg-beige_dark/80" />
          <span className="h-2 w-2 rounded-full bg-slate/80" />
          <span className="ml-auto truncate font-ibm text-[9px] uppercase tracking-[0.2em] text-slate md:text-[10px]">
            ~/{slug}/{String(index + 1).padStart(2, "0")}.png
          </span>
        </div>
      )}
      <div
        className={`relative ${ratio ? "" : "aspect-video"}`}
        style={ratio ? { aspectRatio: ratio } : undefined}
      >
        <Image
          src={shot.src}
          alt={shot.alt}
          fill
          sizes="(max-width: 768px) 85vw, 90vw"
          className={shot.fit === "contain" ? "object-contain" : "object-cover"}
        />
      </div>
    </div>
  );
}
