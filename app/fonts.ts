import { DM_Serif_Display, IBM_Plex_Mono, Unbounded } from "next/font/google";

export const ibmFont = IBM_Plex_Mono({ subsets: ['latin'], weight: ['100', '300', '400', '500'], variable: "--font-ibm", display: 'swap' });
export const unboundedFont = Unbounded({ subsets: ['latin'], weight: ['200', '400', '500', '700'], style: ['normal'], variable: "--font-unbounded", display: 'swap' });
// Used once, on the contact form's success message, so it isn't worth a
// preload on every page; it downloads on demand when that text renders.
export const dmSerifFont = DM_Serif_Display({ subsets: ['latin'], weight: '400', style: ['italic'], variable: "--font-dmserif", display: 'swap', preload: false });
