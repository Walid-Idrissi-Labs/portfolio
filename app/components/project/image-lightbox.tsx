"use client";

import Image from "next/image";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { X } from "lucide-react";

import type { ProjectScreenshot } from "../../lib/projects";

// Mobile-only "tap a capture to blow it up" lightbox. A thumbnail and the
// enlarged overlay share a `layoutId`, so Motion morphs the image out of its
// exact spot in the strip into a near-fullscreen view over a blurred backdrop
// — and reverses it on close. Desktop never opens it (see `enabled`), so the
// pinned-scroll gallery keeps its own transforms untouched.

type OpenItem = { id: string; shot: ProjectScreenshot };

type LightboxContextValue = {
  /** null when zoom is unavailable (desktop / reduced motion off-path). */
  open: ((item: OpenItem) => void) | null;
  activeId: string | null;
};

const LightboxContext = createContext<LightboxContextValue>({ open: null, activeId: null });

export function useLightbox() {
  return useContext(LightboxContext);
}

// Same fallback the gallery uses: intrinsic ratio when known, else 16:9.
const ratioOf = (shot: ProjectScreenshot) =>
  shot.width && shot.height ? shot.width / shot.height : 16 / 9;

export function LightboxProvider({
  enabled,
  children,
}: {
  enabled: boolean;
  children: ReactNode;
}) {
  const [item, setItem] = useState<OpenItem | null>(null);
  const shouldReduceMotion = useReducedMotion();

  const open = useCallback((next: OpenItem) => setItem(next), []);
  const close = useCallback(() => setItem(null), []);

  // If the feature flips off (e.g. resize to desktop) mid-open, this masks the
  // stale item so the overlay exits and the scroll lock releases.
  const activeItem = enabled ? item : null;

  // While open, freeze the page (Lenis reads window scroll, so locking <html>
  // overflow is enough on touch) and wire up Escape.
  useEffect(() => {
    if (!activeItem) return;
    const html = document.documentElement;
    const prevOverflow = html.style.overflow;
    html.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      html.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [activeItem, close]);

  const value = useMemo<LightboxContextValue>(
    () => ({ open: enabled ? open : null, activeId: activeItem?.id ?? null }),
    [enabled, open, activeItem?.id]
  );

  return (
    <LightboxContext.Provider value={value}>
      {children}
      {typeof document !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {activeItem && (
              <Overlay
                key="lightbox"
                item={activeItem}
                onClose={close}
                reduceMotion={!!shouldReduceMotion}
              />
            )}
          </AnimatePresence>,
          document.body
        )}
    </LightboxContext.Provider>
  );
}

function Overlay({
  item,
  onClose,
  reduceMotion,
}: {
  item: OpenItem;
  onClose: () => void;
  reduceMotion: boolean;
}) {
  const { shot, id } = item;
  const ratio = ratioOf(shot);

  // Fit the biggest box that respects both the width and height budgets while
  // keeping the shot's ratio, so portrait and landscape captures both fit
  // without cropping the box (the image inside keeps its own object-fit).
  const width = `min(92vw, calc(82svh * ${ratio}))`;

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={shot.alt}
      data-lenis-prevent
      className="fixed inset-0 z-[120] flex touch-none flex-col items-center justify-center overscroll-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      {/* Blurred, dimmed backdrop — tap anywhere off the image to dismiss. */}
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 h-full w-full cursor-zoom-out bg-black/70 backdrop-blur-xl"
      />

      <motion.button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="absolute right-5 top-6 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-black/40 text-neutral-200 backdrop-blur transition-colors active:border-beige_bright/60 active:text-beige_bright"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { delay: 0.12 } }}
        exit={{ opacity: 0, transition: { duration: 0.15 } }}
      >
        <X className="h-5 w-5" strokeWidth={1.5} />
      </motion.button>

      {/* The morphing capture — shares layoutId with its thumbnail. Drag it
          down to flick the lightbox away. */}
      <motion.div
        layoutId={reduceMotion ? undefined : id}
        initial={reduceMotion ? { opacity: 0, scale: 0.92 } : undefined}
        animate={reduceMotion ? { opacity: 1, scale: 1 } : undefined}
        exit={reduceMotion ? { opacity: 0, scale: 0.92 } : undefined}
        drag={reduceMotion ? false : "y"}
        dragSnapToOrigin
        dragElastic={0.25}
        onDragEnd={(_event, info) => {
          if (info.offset.y > 120 || info.velocity.y > 600) onClose();
        }}
        className="relative z-[1] max-w-[92vw] cursor-grab overflow-hidden rounded-2xl border border-white/10 bg-not_quite_black shadow-2xl active:cursor-grabbing"
        style={{ width, aspectRatio: ratio }}
        transition={{ type: "spring", stiffness: 260, damping: 32 }}
      >
        <Image
          src={shot.src}
          alt={shot.alt}
          fill
          sizes="92vw"
          className={shot.fit === "contain" ? "object-contain" : "object-cover"}
          draggable={false}
        />
      </motion.div>

      {shot.caption && (
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0, transition: { delay: 0.12 } }}
          exit={{ opacity: 0, y: 8, transition: { duration: 0.15 } }}
          className="relative z-[1] mt-5 max-w-[85vw] text-center font-unbounded font-extralight text-xs text-neutral-300"
        >
          {shot.caption}
        </motion.p>
      )}
    </motion.div>
  );
}
