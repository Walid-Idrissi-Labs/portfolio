"use client";

import { useEffect } from "react";

import { GITHUB_URL, SITE_URL } from "../../lib/site";

// The favicon (window with two dots around the {W} mark) as ASCII art, printed
// in the browser console for anyone who opens dev tools.
const ART = [
  "╭──────────────────────────────╮",
  "│ •  •                         │",
  "│                              │",
  "│      .-              -.      │",
  String.raw`│      |  \    /\    /  |      │`,
  String.raw`│     <    \  /  \  /    >     │`,
  String.raw`│      |    \/    \/    |      │`,
  "│      '-              -'      │",
  "│                              │",
  "╰──────────────────────────────╯",
].join("\n");

const stripProtocol = (url: string) => url.replace(/^https?:\/\//, "");

// Module-level so React's dev double-run of effects doesn't print it twice.
let printed = false;

export function ConsoleSignature() {
  useEffect(() => {
    if (printed) return;
    printed = true;

    console.log(`%c${ART}`, "color:#8C8C8C;font-family:monospace;line-height:1.2");
    console.log(
      `%cwalid idrissi%c — software engineering student\n%copen to opportunities → ${stripProtocol(SITE_URL)}/contact\n${stripProtocol(GITHUB_URL)}`,
      "color:#ffffff;font-weight:bold",
      "color:#D9D9D9",
      "color:#8C8C8C",
    );
  }, []);

  return null;
}
