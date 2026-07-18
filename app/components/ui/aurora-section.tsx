"use client";

import Aurora from "./aurora-bit";
import { colors } from "../../lib/colors";

const AURORA_COLORS = [colors.beige_bright, "#ffffff", colors.slate];

export default function AuroraSection() {
    return (
        <Aurora
            colorStops={AURORA_COLORS}
            blend={0.99}
            amplitude={0.37}
            speed={1.1}
        />
    );
}
