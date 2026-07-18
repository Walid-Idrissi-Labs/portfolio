import type { CSSProperties } from "react";

// Apple-style "liquid glass", dark variant: frosted blur + saturation boost
// on whatever renders behind the surface, over a smoked dark tint. The faint
// rim + inner top highlight keep it reading as glass rather than a flat fill.
// -webkit- prefix needed for Safari. The two-layer drop shadow (tight contact
// + wide ambient) lifts the surface off the page like a floating island.
// Single source of truth: the nav (pillnav-bit) and the contact form panel
// share this exact material — change it here and both update together.
export const liquidGlassStyle: CSSProperties = {
    background:
        'linear-gradient(120deg, rgba(32,32,36,0.55), rgba(13,13,15,0.52) 45%, rgba(9,9,11,0.50) 60%, rgba(26,26,30,0.50))',
    backdropFilter: 'blur(18px) saturate(170%)',
    WebkitBackdropFilter: 'blur(18px) saturate(170%)',
    border: '1px solid rgba(255,255,255,0.09)',
    boxShadow:
        'inset 0 1px 1.5px rgba(255,255,255,0.16), inset 0 -1px 1px rgba(0,0,0,0.3), 0 2px 5px rgba(0,0,0,0.35), 0 16px 40px -8px rgba(0,0,0,0.6)',
};
