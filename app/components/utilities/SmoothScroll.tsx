'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';

export default function SmoothScroll() {
  useEffect(() => {
    // autoRaf lets Lenis own its animation-frame loop and cancel it on
    // destroy(), instead of a hand-rolled loop that never got cancelled.
    const lenis = new Lenis({ autoRaf: true });
    return () => lenis.destroy();
  }, []);

  return null;
}
