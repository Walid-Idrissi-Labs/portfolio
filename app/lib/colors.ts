// Single source of truth for the brand palette.
// tailwind.config.ts consumes this for utility classes; components import it
// directly instead of pulling the whole Tailwind config into the client bundle.
export const colors = {
    primary: "#d9d9d9",
    red: "#D9414E",
    slate: "#74818C",
    beige_bright: "#F2E6D8",
    beige_dark: "#90877F",
    faint_white: "#e6e6e6",
    not_quite_black: "#0D0D0D",
} as const;
