"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "motion/react";

import { AnimatedContainer } from "../utilities/animated-container";
import type { ProjectFeature } from "../../lib/projects";

export function ProjectFeatures({ features }: { features: ProjectFeature[] }) {
  // Touch has no hover, so on mobile the centred row lights up on scroll
  // instead. Desktop keeps its hover behaviour and never opts into this.
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  return (
    <ol className="w-full">
      {features.map((feature, index) => (
        <FeatureRow
          key={feature.title}
          feature={feature}
          index={index}
          last={index === features.length - 1}
          scrollGlow={isMobile}
        />
      ))}
    </ol>
  );
}

function FeatureRow({
  feature,
  index,
  last,
  scrollGlow,
}: {
  feature: ProjectFeature;
  index: number;
  last: boolean;
  scrollGlow: boolean;
}) {
  const ref = useRef<HTMLLIElement | null>(null);
  // A zero-height detection line pinned to the viewport's vertical centre: the
  // row is "in view" only while it straddles that line, so exactly the centred
  // row reports true as you scroll.
  const centered = useInView(ref, { margin: "-50% 0px -50% 0px" });
  // Same reveal as the desktop hover — fade the number's fill to transparent so
  // the gradient painted behind it shows through.
  const glow = scrollGlow && centered;

  return (
    <li ref={ref} className={`group border-t border-white/10 ${last ? "border-b" : ""}`}>
      <AnimatedContainer duration={1.4} delay={0.15 + index * 0.12} initialY={20}>
        <div className="grid gap-3 py-8 md:grid-cols-12 md:items-baseline md:gap-6 md:py-10">
          {/* Single gradient-clipped span: the resting tint is neutral-800
              (the opaque equivalent of white/15 on black) painted over the
              gradient, so revealing it only fades `color` to transparent —
              no overlay node or extra compositing layer per row. */}
          <span
            aria-hidden="true"
            className={`bg-gradient-to-r from-beige_dark via-slate to-beige_bright bg-clip-text font-unbounded text-3xl font-extralight transition-colors duration-500 group-hover:text-transparent md:col-span-2 md:text-5xl ${
              glow ? "text-transparent" : "text-neutral-800"
            }`}
          >
            {String(index + 1).padStart(2, "0")}
          </span>
          <h3 className="font-unbounded text-lg text-beige_bright md:col-span-4 md:text-xl">{feature.title}</h3>
          <p className="font-ibm text-sm/[1.125rem] font-light text-neutral-400 md:col-span-6 md:text-base/[1.375rem]">
            {feature.body}
          </p>
        </div>
      </AnimatedContainer>
    </li>
  );
}
