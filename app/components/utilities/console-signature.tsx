"use client";

import { useEffect } from "react";

import { colors } from "../../lib/colors";
import { GITHUB_URL, LINKEDIN_URL, RESUME_URL, SITE_URL } from "../../lib/site";

// The favicon window, opened up like a terminal: the {W} mark on the left and
// a short shell session on the right, printed in the browser console for
// anyone who opens dev tools.
const MARK = [
  "   ▄█▀  ██         ██  ▀█▄   ",
  "   █    ██         ██    █   ",
  "   █    ██    ▄    ██    █   ",
  "   █    ██   ███   ██    █   ",
  " ▄█▀    ██  ██ ██  ██    ▀█▄ ",
  " ▀█▄    ██ ██   ██ ██    ▄█▀ ",
  "   █    ████     ████    █   ",
  "   █    ▀███     ███▀    █   ",
  "   ▀█▄   ▀█▀     ▀█▀   ▄█▀   ",
];

// Same grid, one colour key per cell (see PALETTE). The braces step through
// the favicon's silver gradient one column at a time: 1 = light … 5 = dark.
const MARK_MAP = [
  "   345  ww         ww  123   ",
  "   3    ww         ww    3   ",
  "   3    ww    w    ww    3   ",
  "   3    ww   www   ww    3   ",
  " 123    ww  ww ww  ww    345 ",
  " 123    ww ww   ww ww    345 ",
  "   3    wwww     wwww    3   ",
  "   3    wwww     wwww    3   ",
  "   345   www     www   123   ",
];

// One shell line per mark row: [text, colour key]. Lines starting with "$ "
// get the prompt colour on the "$" itself.
const SHELL: [string, string][] = [
  ["$ whoami", "c"],
  ["walid idrissi", "n"],
  ["$ cat ~/.plan", "c"],
  ["software engineering student", "o"],
  ["cloud / aws / full-stack", "o"],
  ["open to opportunities", "o"],
  ["$ ls ~/links", "c"],
  ["github  linkedin  resume  contact", "o"],
  ["$ █", "n"],
];

// Linear blend of two hex colours, t in [0, 1].
const mix = (a: string, b: string, t: number) =>
  "#" +
  [1, 3, 5]
    .map((i) => Math.round(parseInt(a.slice(i, i + 2), 16) * (1 - t) + parseInt(b.slice(i, i + 2), 16) * t))
    .map((n) => n.toString(16).padStart(2, "0"))
    .join("");

// Colours straight from app/icon.svg (#8C8C8C frame, #D9D9D9 → #8C8C8C
// braces, white W) plus the site palette for the shell text.
const FRAME = "#8C8C8C";
const PALETTE: Record<string, string> = {
  f: FRAME,
  1: mix(colors.primary, FRAME, 0),
  2: mix(colors.primary, FRAME, 0.25),
  3: mix(colors.primary, FRAME, 0.5),
  4: mix(colors.primary, FRAME, 0.75),
  5: mix(colors.primary, FRAME, 1),
  w: "#ffffff",
  n: "#ffffff",
  t: colors.primary,
  p: colors.slate,
  c: colors.beige_bright,
  o: colors.primary,
};

const css = (color: string, extra = "") => `color:${color};font-family:monospace;line-height:1.2;${extra}`;

const stripProtocol = (url: string) => url.replace(/^https?:\/\//, "");

// Collapses ART/MAP into console.log's `%c` form: every run of cells sharing a
// key becomes one styled segment (spaces just ride along with their neighbour).
function paint(art: string[], map: string[]) {
  const segments: { key: string; text: string }[] = [];
  art.forEach((row, r) => {
    const keys = [...map[r]];
    [...row].forEach((ch, c) => {
      const last = segments[segments.length - 1];
      if (last && (last.key === keys[c] || keys[c] === " ")) last.text += ch;
      else segments.push({ key: keys[c], text: ch });
    });
    segments[segments.length - 1].text += "\n";
  });
  return {
    format: segments.map((s) => `%c${s.text}`).join(""),
    styles: segments.map((s) => css(PALETTE[s.key] ?? FRAME)),
  };
}

// Builds the window: title bar carrying the site host, the two dots, then the
// mark and the shell side by side. Width follows the longest shell line.
function compose() {
  const markWidth = [...MARK[0]].length;
  const shellWidth = Math.max(...SHELL.map(([text]) => [...text].length));
  const inner = 2 + markWidth + 3 + shellWidth + 2;

  const rows: [string, string][] = [];
  const row = (text: string, map: string) => rows.push([`│${text.padEnd(inner)}│`, `f${map.padEnd(inner)}f`]);

  const title = ` ${stripProtocol(SITE_URL)} `;
  const left = Math.max(0, Math.floor((inner - title.length) / 2));
  const right = Math.max(0, inner - left - title.length);
  rows.push([`╭${"─".repeat(left)}${title}${"─".repeat(right)}╮`, `${"f".repeat(left + 1)}${"t".repeat(title.length)}${"f".repeat(right + 1)}`]);
  row("  ▄ ▄", "  f f");
  row("", "");
  MARK.forEach((mark, i) => {
    const [text, key] = SHELL[i];
    const map = text.startsWith("$ ") ? `p${key.repeat(text.length - 1)}` : key.repeat(text.length);
    row(`  ${mark}   ${text}`, `  ${MARK_MAP[i]}   ${map}`);
  });
  row("", "");
  rows.push([`╰${"─".repeat(inner)}╯`, "f".repeat(inner + 2)]);

  return paint(
    rows.map(([text]) => text),
    rows.map(([, map]) => map),
  );
}

// Module-level so React's dev double-run of effects doesn't print it twice.
let printed = false;

export function ConsoleSignature() {
  useEffect(() => {
    if (printed) return;
    printed = true;

    const art = compose();
    console.log(
      `${art.format}\n%ccontact   ${SITE_URL}/contact\ngithub    ${GITHUB_URL}\nlinkedin  ${LINKEDIN_URL}\nrésumé    ${RESUME_URL}`,
      ...art.styles,
      css(FRAME),
    );
  }, []);

  return null;
}
