"use client";

import { useEffect, useState } from "react";

// Client-only capability checks. Every heavy effect consults these so weak
// hardware gets a lighter (or static) variant while capable desktops keep the
// full version. All of them are safe to call during SSR: they return false.

const query = (media: string) =>
  typeof window !== "undefined" && typeof window.matchMedia === "function"
    ? window.matchMedia(media).matches
    : false;

/** Touch-first device (phone/tablet). */
export const isCoarsePointer = () => query("(pointer: coarse)");

export const prefersReducedMotion = () => query("(prefers-reduced-motion: reduce)");

type LowEndNavigator = Navigator & {
  deviceMemory?: number;
  connection?: { saveData?: boolean };
};

/** Few cores, little memory, or the user asked for data saving. */
export const isLowEndDevice = () => {
  if (typeof navigator === "undefined") return false;
  const nav = navigator as LowEndNavigator;
  if (nav.deviceMemory !== undefined && nav.deviceMemory <= 4) return true;
  if (nav.hardwareConcurrency !== undefined && nav.hardwareConcurrency <= 4) return true;
  return nav.connection?.saveData === true;
};

/**
 * Reactive media-query flag. Starts false (matches SSR) and updates after
 * mount, so the first client render always matches the server HTML.
 */
export function useMediaFlag(media: string) {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    const list = window.matchMedia(media);
    const update = () => setMatches(list.matches);
    update();
    list.addEventListener("change", update);
    return () => list.removeEventListener("change", update);
  }, [media]);
  return matches;
}
