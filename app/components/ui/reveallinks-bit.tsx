"use client";

import React from "react";
import { motion } from "motion/react";

export const RevealLinks = () => {
  return (
    <section className="flex h-full w-full flex-col items-center justify-center bg-transparent px-2 py-4 text-center lg:items-end lg:py-0 lg:text-right">
      <FlipLink target="_blank" href="https://github.com/walid-idrissi-labs">GitHub</FlipLink>
      <FlipLink target="_blank" href="https://linkedin.com/in/walid-idrissi-labkhati">Linkedin</FlipLink>
    </section>
  );
};

const DURATION = 0.25;
const STAGGER = 0.025;

interface FlipLinkProps {
  children: string;
  href: string;
  target?: string;
}

const FlipLink = ({ children, href, target }: FlipLinkProps) => {
  return (
    <motion.a
      initial="initial"
      whileHover="hovered"
      href={href}
      target={target}
      rel={target === "_blank" ? "noopener noreferrer" : undefined}
      // text color is inherited from parent section, so no explicit color here
      className="relative block overflow-hidden whitespace-nowrap text-[3.35rem] font-black uppercase sm:text-6xl md:text-6xl lg:text-7xl xl:text-8xl font-unbounded"
      style={{
        lineHeight: 1,
      }}
    >
      <div >
        {children.split("").map((l, i) => (
          <motion.span
            variants={{
              initial: {
                y: 0,
              },
              hovered: {
                y: "-100%",
              },
            }}
            transition={{
              duration: DURATION,
              ease: "easeInOut",
              delay: STAGGER * i,
            }}
            className="inline-block"
            key={i}
          >
            {l}
          </motion.span>
        ))}
      </div>
      {/* Removed text-white dark:text-black so it inherits the color from the parent <a> */}
      <div className="absolute inset-0 text-[#74818C]">
        {children.split("").map((l, i) => (
          <motion.span
            variants={{
              initial: {
                y: "100%",
              },
              hovered: {
                y: 0,
              },
            }}
            transition={{
              duration: DURATION,
              ease: "easeInOut",
              delay: STAGGER * i,
            }}
            className="inline-block"
            key={i}
          >
            {l}
          </motion.span>
        ))}
      </div>
    </motion.a>
  );
};