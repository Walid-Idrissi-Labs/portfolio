import { colors } from "../../lib/colors";
import GradientText from "./gradienttext-bit";

const headingColors = [colors.beige_dark, colors.slate, colors.beige_bright];

export function SectionHeading({
  children,
  animationSpeed,
  align = "start",
  sizeClassName = "text-[3rem]",
  glass = false,
}: {
  children: React.ReactNode;
  animationSpeed: number;
  align?: "start" | "end";
  sizeClassName?: string;
  /** Pass when the heading sits over a non-flat backdrop (see GradientText). */
  glass?: boolean;
}) {
  const alignClassName = align === "end" ? "md:justify-end" : "md:justify-start";
  return (
    <div
      className={`relative w-full flex justify-center ${alignClassName} text-center md:text-left ${sizeClassName} sm:text-[3.6rem] md:text-[3.8rem] lg:text-[4.4] xl:text-[4.7rem] font-unbounded z-1 outline-red-600`}
    >
      <GradientText colors={headingColors} animationSpeed={animationSpeed} showBorder={true} glass={glass} className="custom-class">
        {children}
      </GradientText>
    </div>
  );
}
