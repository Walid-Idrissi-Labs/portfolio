import type { Config } from "tailwindcss";
import { colors } from "./app/lib/colors.ts";

export default {
    darkMode: "class",
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors,
            fontFamily: {
                ibm: ["var(--font-ibm)", "monospace"],
                unbounded: ["var(--font-unbounded)", "sans-serif"],
                dmserif: ["var(--font-dmserif)", "serif"],
            },
            backgroundImage: {
                "silver-text-gradient": "linear-gradient(to right, #D9D9D9, #8C8C8C)",
            },
        },
    },
} satisfies Config;
