'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';

import { isCoarsePointer, prefersReducedMotion } from '../../lib/device';

export default function SmoothScroll() {
  useEffect(() => {
    // Touch scrolling is native anyway (syncTouch is off), so on phones and
    // tablets Lenis would only run an idle animation-frame loop. Reduced-motion
    // users get plain native scrolling too.
    if (isCoarsePointer() || prefersReducedMotion()) return;

    // autoRaf lets Lenis own its animation-frame loop and cancel it on
    // destroy(), instead of a hand-rolled loop that never got cancelled.
    const lenis = new Lenis({ autoRaf: true });
    return () => lenis.destroy();
  }, []);

  return null;
}
