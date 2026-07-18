import { AnimatedContainer } from "../utilities/animated-container";
import type { Project } from "../../lib/projects";

// Spec-sheet strip under the hero: hairline grid via gap-px over a white/10
// backdrop, echoing the bordered-grid language of ClipPathLinks.
export function ProjectRundown({ project }: { project: Project }) {
  const inProgress = project.status === "in-progress";
  const cells = [
    { label: "Type", value: project.type },
    { label: "Role", value: project.role },
    { label: "Status", value: inProgress ? "In Progress" : "Completed", status: true },
    { label: "Year", value: project.year },
  ];

  return (
    <AnimatedContainer duration={1.4} initialY={24}>
      <dl className="grid grid-cols-2 gap-px border border-white/10 bg-white/10 md:grid-cols-4">
        {cells.map((cell) => (
          <div key={cell.label} className="flex flex-col gap-3 bg-black px-5 py-6 md:px-7 md:py-8">
            <dt className="font-ibm text-[10px] uppercase tracking-[0.25em] text-slate">{cell.label}</dt>
            <dd className="flex items-center gap-2.5 font-unbounded font-extralight text-base text-beige_bright md:text-lg">
              {cell.status && (
                <span className="relative flex h-2 w-2 shrink-0">
                  {inProgress && (
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red opacity-60" />
                  )}
                  <span
                    className={`relative inline-flex h-2 w-2 rounded-full ${inProgress ? "bg-red" : "bg-beige_bright"}`}
                  />
                </span>
              )}
              {cell.value}
            </dd>
          </div>
        ))}
      </dl>
    </AnimatedContainer>
  );
}
