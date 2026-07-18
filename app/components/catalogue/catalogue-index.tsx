import Link from "next/link";
import { MoveRight } from "lucide-react";

import { AnimatedContainer } from "../utilities/animated-container";
import type { Project } from "../../lib/projects";

// Editorial works index: numbered typographic rows with mono metadata.
// Hovering a row dims its siblings and slides the name/arrow — all pure CSS
// via the list/row hover groups, so the whole index renders on the server.
export function CatalogueIndex({ projects }: { projects: Project[] }) {
  return (
    <div className="group/list relative w-full">
      {projects.map((project, index) => {
        const inProgress = project.status === "in-progress";
        return (
          <AnimatedContainer key={project.slug} duration={1.4} delay={0.1 + index * 0.12} initialY={18}>
            <Link
              href={`/projects/${project.slug}`}
              className="group/row flex items-center gap-4 border-t border-white/10 py-7 transition-opacity duration-300 group-hover/list:opacity-40 hover:opacity-100! md:gap-8 md:py-9"
            >
              <span className="w-8 shrink-0 font-ibm text-xs text-slate md:text-sm">
                {String(index + 1).padStart(2, "0")}
              </span>

              <div className="min-w-0 flex-1">
                <h3 className="truncate font-unbounded text-xl text-faint_white transition-all duration-300 group-hover/row:translate-x-2 group-hover/row:text-beige_bright sm:text-2xl md:text-4xl">
                  {project.name}
                </h3>
                <p className="mt-1.5 font-ibm text-[10px] uppercase tracking-[0.2em] text-neutral-500 md:hidden">
                  {project.type} · {project.year}
                </p>
              </div>

              <span className="hidden w-44 shrink-0 font-ibm text-xs uppercase tracking-[0.2em] text-neutral-400 md:block">
                {project.type}
              </span>
              <span className="hidden w-12 shrink-0 font-ibm text-xs text-neutral-400 md:block">
                {project.year}
              </span>
              <span className="hidden w-32 shrink-0 items-center gap-2 font-ibm text-[10px] uppercase tracking-[0.2em] text-neutral-400 sm:flex">
                <span className="relative flex h-2 w-2 shrink-0">
                  {inProgress && (
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red opacity-60" />
                  )}
                  <span
                    className={`relative inline-flex h-2 w-2 rounded-full ${inProgress ? "bg-red" : "bg-beige_bright"}`}
                  />
                </span>
                {inProgress ? "In Progress" : "Completed"}
              </span>

              <MoveRight
                className="h-5 w-5 shrink-0 text-beige_dark transition-transform duration-300 group-hover/row:translate-x-2 md:h-6 md:w-6"
                strokeWidth={1.2}
              />
            </Link>
          </AnimatedContainer>
        );
      })}

      {/* Ghost row — the catalogue's "still figuring out what to put here". */}
      <AnimatedContainer duration={1.4} delay={0.1 + projects.length * 0.12} initialY={18}>
        <div
          aria-hidden="true"
          className="flex items-center gap-4 border-t border-b border-white/10 py-7 opacity-50 md:gap-8 md:py-9"
        >
          <span className="w-8 shrink-0 font-ibm text-xs text-slate md:text-sm">
            {String(projects.length + 1).padStart(2, "0")}
          </span>
          <span className="font-ibm text-sm tracking-[0.2em] text-neutral-500">
            [ more in the making...<span className="animate-pulse">…</span> ]
          </span>
        </div>
      </AnimatedContainer>
    </div>
  );
}
