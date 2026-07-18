import { DM_Serif_Display, IBM_Plex_Mono, Unbounded } from "next/font/google";

export const ibmFont = IBM_Plex_Mono({ subsets: ['latin'], weight: ['100', '200', '300', '400', '500'], variable: "--font-ibm", display: 'swap' });
export const unboundedFont = Unbounded({ subsets: ['latin'], weight: ['200', '400', '500', '700'], style: ['normal'], variable: "--font-unbounded", display: 'swap' });
export const dmSerifFont = DM_Serif_Display({ subsets: ['latin'], weight: '400', style: ['italic'], variable: "--font-dmserif", display: 'swap' });
