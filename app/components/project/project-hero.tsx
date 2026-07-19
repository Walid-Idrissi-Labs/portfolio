"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { Activity, BriefcaseBusiness, Cloud, Github, Terminal, Truck } from "lucide-react";

import GradientText from "../page/gradienttext-bit";
import { colors } from "../../lib/colors";
import type { Project } from "../../lib/projects";

const titleColors = [colors.beige_dark, colors.slate, colors.beige_bright];

const typeIcons = {
  cloud: Cloud,
  terminal: Terminal,
  briefcase: BriefcaseBusiness,
  activity: Activity,
  truck: Truck,
} as const;

export function ProjectHero({ project }: { project: Project }) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const shouldReduceMotion = useReducedMotion();

  // The backdrop drifts down and zooms slightly as the page scrolls away from
  // the hero, while the copy lifts and fades — classic depth parallax.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "16%"]);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.65], [1, 0]);
  const contentY = useTransform(scrollYProgress, [0, 0.65], [0, -40]);
  // Fade the whole backdrop to black as the hero scrolls away so the image
  // dissolves into the black content below with no visible seam at the edges.
  const backdropDarken = useTransform(scrollYProgress, [0, 0.35, 1], [0, 0.15, 1]);

  const TypeIcon = typeIcons[project.icon];
  const inProgress = project.status === "in-progress";

  const entrance = (delay: number) =>
    shouldReduceMotion
      ? {}
      : {
          initial: { opacity: 0, y: 26, filter: "blur(6px)" },
          animate: { opacity: 1, y: 0, filter: "blur(0px)" },
          transition: { delay, duration: 0.9, ease: "easeOut" as const },
        };

  return (
    <section
      id="project-hero"
      ref={sectionRef}
      className="relative flex min-h-[100svh] w-full flex-col justify-end overflow-hidden bg-black"
    >
      <motion.div
        aria-hidden="true"
        style={shouldReduceMotion ? undefined : { y: imageY, scale: imageScale }}
        className="absolute inset-0"
      >
        <Image
          src={project.heroImage}
          alt={project.heroImageAlt}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/25 to-black" />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black via-black/40 to-transparent" />
        <motion.div
          style={{ opacity: backdropDarken }}
          className="absolute inset-0 bg-black"
        />
      </motion.div>

      <motion.div
        {...entrance(0.1)}
        className="absolute inset-x-0 top-6 z-20 flex items-center justify-between px-6 md:top-28 md:px-10"
      >
        <Link
          href="/projects"
          className="group flex items-center gap-2 font-ibm text-[11px] uppercase tracking-[0.25em] text-neutral-400 transition-colors duration-300 hover:text-beige_bright"
        >
          <span aria-hidden="true" className="transition-transform duration-300 group-hover:-translate-x-1">
            ←
          </span>
          project catalogue
        </Link>
        {project.links.repo && (
          <a
            href={project.links.repo}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${project.name} repository on GitHub`}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-black/40 text-neutral-300 backdrop-blur transition-colors duration-300 hover:border-beige_bright/60 hover:text-beige_bright"
          >
            <Github className="h-4 w-4" strokeWidth={1.5} />
          </a>
        )}
      </motion.div>

      <motion.div
        style={shouldReduceMotion ? undefined : { opacity: contentOpacity, y: contentY }}
        className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-24 md:px-10 md:pb-28"
      >
        <motion.div {...entrance(0.2)} className="flex flex-wrap items-center gap-2 md:gap-3">
          <span className="flex items-center gap-2 rounded-full border border-white/15 bg-black/40 px-3.5 py-1.5 font-ibm text-[10px] uppercase tracking-[0.2em] text-neutral-300 backdrop-blur md:text-xs">
            <TypeIcon className="h-3.5 w-3.5 text-faint_white" strokeWidth={1.5} />
            {project.type}
          </span>
          <span className="rounded-full border border-white/15 bg-black/40 px-3.5 py-1.5 font-ibm text-[10px] uppercase tracking-[0.2em] text-neutral-300 backdrop-blur md:text-xs">
            {project.year}
          </span>
          <span className="flex items-center gap-2 rounded-full border border-white/15 bg-black/40 px-3.5 py-1.5 font-ibm text-[10px] uppercase tracking-[0.2em] text-neutral-300 backdrop-blur md:text-xs">
            <span className="relative flex h-2 w-2">
              {inProgress && (
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red opacity-60" />
              )}
              <span
                className={`relative inline-flex h-2 w-2 rounded-full ${inProgress ? "bg-red" : "bg-beige_bright"}`}
              />
            </span>
            {inProgress ? "In Progress" : "Completed"}
          </span>
        </motion.div>

        <motion.h1
          {...entrance(0.32)}
          className="mt-5 w-fit text-[2.6rem] leading-[1.05] font-unbounded sm:text-6xl md:mt-7 md:text-7xl xl:text-8xl"
        >
          <GradientText colors={titleColors} animationSpeed={4} showBorder={false}>
            {project.name}
          </GradientText>
        </motion.h1>

        <motion.p
          {...entrance(0.44)}
          className="mt-4 max-w-2xl font-unbounded font-extralight text-sm leading-relaxed text-neutral-300 sm:text-base md:mt-6 md:text-xl"
        >
          {project.tagline}
        </motion.p>
      </motion.div>

      <div className="pointer-events-none absolute bottom-5 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2">
        <span className="font-ibm text-[9px] uppercase tracking-[0.35em] text-neutral-500">scroll</span>
        <span className="relative block h-10 w-px overflow-hidden bg-white/10">
          {!shouldReduceMotion && (
            <motion.span
              className="absolute left-0 top-0 h-full w-full bg-beige_bright/70"
              animate={{ y: ["-100%", "100%"] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            />
          )}
        </span>
      </div>
    </section>
  );
}
