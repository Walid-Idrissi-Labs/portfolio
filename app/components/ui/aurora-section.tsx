"use client";

import dynamic from "next/dynamic";

import { colors } from "../../lib/colors";

// The WebGL renderer (ogl) only matters once the hero is on screen, so it
// loads in its own chunk instead of blocking hydration of the whole page.
// The placeholder fills the same box, and the hero is black underneath, so
// nothing shifts or flashes while it loads.
const Aurora = dynamic(() => import("./aurora-bit"), {
  ssr: false,
  loading: () => <div className="w-full h-full" aria-hidden="true" />,
});

const AURORA_COLORS = [colors.beige_bright, "#ffffff", colors.slate];

type AuroraSectionProps = {
  blend?: number;
  amplitude?: number;
  speed?: number;
};

export default function AuroraSection({ blend = 0.99, amplitude = 0.37, speed = 1.1 }: AuroraSectionProps) {
    return (
        <Aurora
            colorStops={AURORA_COLORS}
            blend={blend}
            amplitude={amplitude}
            speed={speed}
        />
    );
}
