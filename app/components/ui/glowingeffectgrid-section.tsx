"use client";

import Image from "next/image";
import { Construction, Cloud, Terminal } from "lucide-react";

import { GlowingEffect } from "../ui/glowingeffectgrid-bit";
import { AnimatedContainer } from "../utilities/animated-container";

const url_shortener = "/project-url-shortener.png";
const tascii = "/project-tascii.png";

export default function GlowingEffectSection() {
  return (
    <ul className="grid grid-cols-1 grid-rows-none gap-4 md:grid-cols-12 md:grid-rows-3 lg:gap-4 xl:max-h-136 xl:grid-rows-2">
      <GridItem
        area="md:[grid-area:1/1/2/7] xl:[grid-area:1/1/2/5]"
        icon={<Cloud className="h-4 w-4 text-faint_white" />}
        title="URL Shortener"
        description="Serverless URL shortener built with AWS and provisioned entirely with Terraform"
        href="https://github.com/walid-idrissi-labs/url-shortener"
        backgroundImage={url_shortener}
        duration={1.8}
        delay={0.25}
      />

      <GridItem
        area="md:[grid-area:1/7/2/13] xl:[grid-area:2/1/3/5]"
        icon={<Terminal className="h-4 w-4 text-faint_white" />}
        title="tascii"
        description="A fast, minimal task manager for the terminal built in Go."
        href="https://github.com/walid-idrissi-labs/tascii"
        backgroundImage={tascii}
        duration={1.8}
        delay={1}
      />

      <GridItem
        area="md:[grid-area:2/1/3/7] xl:[grid-area:1/5/3/8]"
        icon={<Construction className="h-4 w-4 text-faint_white" />}
        title="Under Construction"
        description="more projects coming very soon..."
        href="https://github.com/walid-idrissi-labs/"
        duration={1.8}
        delay={1.5}
      />

      <GridItem
        area="md:[grid-area:2/7/3/13] xl:[grid-area:1/8/2/13]"
        icon={<Construction className="h-4 w-4 text-faint_white" />}
        title="Under Construction"
        description="still figuring out what to put here..."
        href="https://github.com/walid-idrissi-labs/"
        duration={1.8}
        delay={2}
      />

      <GridItem
        area="md:[grid-area:3/1/4/13] xl:[grid-area:2/8/3/13]"
        icon={<Construction className="h-4 w-4 text-faint_white" />}
        title="Under Construction"
        description="still figuring out what to put here..."
        href="https://github.com/walid-idrissi-labs/"
        duration={1.8}
        delay={2.5}
      />
    </ul>
  );
}

interface GridItemProps {
  area: string;
  icon: React.ReactNode;
  title: string;
  description: React.ReactNode;
  href: string;
  backgroundImage?: string;
  delay?: number;
  duration?: number;
}

const GridItem = ({
  area,
  icon,
  title,
  description,
  href,
  backgroundImage,
  delay = 0,
  duration = 1,
}: GridItemProps) => {
  return (
    <li className={`min-h-56 list-none ${area}`}>
      <AnimatedContainer delay={delay} duration={duration} className="h-full" initialY={10}>
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative block h-full rounded-2xl border p-2 md:rounded-3xl md:p-3"
        >
          <GlowingEffect
            blur={0.5}
            borderWidth={4}
            spread={67}
            glow={true}
            disabled={false}
            proximity={34}
            inactiveZone={0.01}
            movementDuration={3}
          />
          <div className="border-0.75 relative flex h-full flex-col justify-between gap-6 overflow-hidden rounded-xl p-6 md:p-6 dark:shadow-[0px_0px_27px_0px_#2D2D2D]">
            {/* Background image layer — sits behind everything; the dark
                overlay fades out on hover to reveal it. */}
            {backgroundImage && (
              <>
                <Image
                  src={backgroundImage}
                  alt=""
                  aria-hidden="true"
                  fill
                  sizes="(max-width: 768px) 90vw, (max-width: 1280px) 45vw, 35vw"
                  className="object-cover object-center transition-opacity duration-500"
                />
                <div className="absolute inset-0 bg-black/80 transition-opacity duration-500 group-hover:opacity-0" />
              </>
            )}

            {/* Card content — z-10 ensures it always sits above the image and overlay */}
            <div className="relative z-10 flex flex-1 flex-col justify-between gap-3">
              <div className="w-fit rounded-lg border border-gray-600 p-2 bg-black/30 backdrop-blur-sm">
                {icon}
              </div>
              <div className="space-y-3">
                <h3 className="-tracking-4 pt-0.5 font-sans text-xl/[1.375rem] font-semibold text-balance md:text-2xl/[1.875rem] text-faint_white">
                  {title}
                </h3>
                <h2 className="font-sans text-sm/[1.125rem] md:text-base/[1.375rem] text-faint_white [&_b]:md:font-semibold [&_strong]:md:font-semibold">
                  {description}
                </h2>
              </div>
            </div>
          </div>
        </a>
      </AnimatedContainer>
    </li>
  );
};
