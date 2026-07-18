import { AnimatedContainer } from "../utilities/animated-container";
import type { ProjectFeature } from "../../lib/projects";

export function ProjectFeatures({ features }: { features: ProjectFeature[] }) {
  return (
    <ol className="w-full">
      {features.map((feature, index) => (
        <li
          key={feature.title}
          className={`group border-t border-white/10 ${index === features.length - 1 ? "border-b" : ""}`}
        >
          <AnimatedContainer duration={1.4} delay={0.15 + index * 0.12} initialY={20}>
            <div className="grid gap-3 py-8 md:grid-cols-12 md:items-baseline md:gap-6 md:py-10">
              {/* Single gradient-clipped span: the resting tint is neutral-800
                  (the opaque equivalent of white/15 on black) painted over the
                  gradient, so hovering only fades `color` to transparent —
                  no overlay node or extra compositing layer per row. */}
              <span
                aria-hidden="true"
                className="bg-gradient-to-r from-beige_dark via-slate to-beige_bright bg-clip-text font-unbounded text-3xl font-extralight text-neutral-800 transition-colors duration-500 group-hover:text-transparent md:col-span-2 md:text-5xl"
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
      ))}
    </ol>
  );
}
