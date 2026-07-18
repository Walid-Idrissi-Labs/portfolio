import { ScrollText } from "../ui/scrolltext";

export function ProjectBackstory({ paragraphs, year }: { paragraphs: string[]; year: string }) {
  return (
    <div>
      <ScrollText text={paragraphs.join("\n")} lineBreakSpacing={18} />
      <p className="mt-6 pr-4 text-right font-ibm text-xs uppercase tracking-[0.3em] text-slate md:text-sm">
        — walid, {year}
      </p>
    </div>
  );
}
