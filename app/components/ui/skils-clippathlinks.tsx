"use client"
import React from "react";
import { useAnimate } from "motion/react";

export type LogoItem = {
  src: string;
  alt: string;
  href: string;
  span: string;
  minWidth?: string;
};

type ClipPathLinksColorClasses = {
  containerBorder: string;
  boxBorder: string;
  boxBackground: string;
  boxText: string;
  overlayBackground: string;
  overlayText: string;
  logoBase: string;
  logoOverlay: string;
};

type ClipPathLinksProps = {
  colors?: Partial<ClipPathLinksColorClasses>;
  typography?: Partial<ClipPathLinksTypographyClasses>;
  /** Logo grid to render; defaults to the full skills grid used on the home page. */
  rows?: LogoItem[][];
};

type ClipPathLinksTypographyClasses = {
  labelBaseWeight: string;
  labelOverlayWeight: string;
};

const DEFAULT_COLOR_CLASSES: ClipPathLinksColorClasses = {
  containerBorder: "border-border/80",
  boxBorder: "border-border/80",
  boxBackground: "bg-background",
  boxText: "text-foreground",
  overlayBackground: "bg-beige_dark",
  overlayText: "text-white",
  logoBase: "",
  logoOverlay: "brightness-0 invert",
};

const DEFAULT_TYPOGRAPHY_CLASSES: ClipPathLinksTypographyClasses = {
  labelBaseWeight: "font-light",
  labelOverlayWeight: "font-medium",
};

const techLogoRows: LogoItem[][] = [
  [
    
    { src: "/logo-react.svg", alt: "React", href: "https://react.dev/", span: "col-span-7 sm:col-span-3", minWidth: "5rem" },
    { src: "/logo-vue.svg", alt: "VueJS", href: "https://vuejs.org/", span: "col-span-5 sm:col-span-3", minWidth: "5rem" },
    { src: "/logo-javascript.svg", alt: "JavaScript", href: "https://developer.mozilla.org/en-US/docs/Web/JavaScript", span: "col-span-4 sm:col-span-2", minWidth: "5rem" },
    { src: "/logo-typescript.svg", alt: "TypeScript", href: "https://www.typescriptlang.org/", span: "col-span-4 sm:col-span-2", minWidth: "5rem" },
    { src: "/logo-nextjs.svg", alt: "Next.js", href: "https://nextjs.org/", span: "col-span-4 sm:col-span-2", minWidth: "5rem" },
],
[
    { src: "/logo-tailwind.svg", alt: "Tailwind CSS", href: "https://tailwindcss.com/", span: "col-span-4 sm:col-span-3", minWidth: "5rem" },
    { src: "/logo-three.svg", alt: "Three.js", href: "https://threejs.org/", span: "col-span-3 sm:col-span-2", minWidth: "5rem" },
    { src: "/logo-terraform.svg", alt: "Terraform", href: "https://www.terraform.io/", span: "col-span-5 sm:col-span-3", minWidth: "5rem" },
    { src: "/logo-aws.svg", alt: "AWS", href: "https://aws.amazon.com/", span: "col-span-12 sm:col-span-4", minWidth: "5rem" },
  ],
  [
    { src: "/logo-postgres.svg", alt: "PostgreSQL", href: "https://www.postgresql.org/", span: "col-span-3 sm:col-span-2", minWidth: "5rem" },
    { src: "/logo-mysql.svg", alt: "MySQL", href: "https://www.mysql.com/", span: "col-span-3 sm:col-span-2", minWidth: "5rem" },
    { src: "/logo-docker.svg", alt: "Docker", href: "https://www.docker.com/", span: "col-span-6 sm:col-span-4", minWidth: "5rem" },
    { src: "/logo-bash.svg", alt: "Bash", href: "https://www.gnu.org/software/bash/", span: "col-span-3 sm:col-span-2", minWidth: "5rem" },
    { src: "/logo-python.svg", alt: "Python", href: "https://www.python.org/", span: "col-span-4 sm:col-span-2", minWidth: "5rem" },
    { src: "/logo-laravel.svg", alt: "Laravel", href: "https://laravel.com/", span: "col-span-5 sm:col-span-3", minWidth: "5rem" },
    { src: "/logo-html5.svg", alt: "HTML5", href: "https://developer.mozilla.org/en-US/docs/Web/HTML", span: "col-span-6 sm:col-span-2", minWidth: "10rem" },
    { src: "/logo-css3.svg", alt: "CSS3", href: "https://developer.mozilla.org/en-US/docs/Web/CSS", span: "col-span-6 sm:col-span-2", minWidth: "9rem" },
  ],
];

export const ClipPathLinks = ({ colors, typography, rows = techLogoRows }: ClipPathLinksProps) => {
  const colorClasses = { ...DEFAULT_COLOR_CLASSES, ...colors };
  const typographyClasses = { ...DEFAULT_TYPOGRAPHY_CLASSES, ...typography };

  return (
    <div className={`w-full overflow-hidden border ${colorClasses.containerBorder}`}>
      {rows.map((row, rowIndex) => (
        <div key={rowIndex} className="grid grid-cols-12">
          {row.map((logo) => (
            <LinkBox
              key={logo.alt}
              href={logo.href}
              imgSrc={logo.src}
              imgAlt={logo.alt}
              span={logo.span}
              minWidth={logo.minWidth}
              className="h-8 w-auto object-contain sm:h-10 md:h-12"
              colors={colorClasses}
              typography={typographyClasses}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

const NO_CLIP = "polygon(0 0, 100% 0, 100% 100%, 0% 100%)";
const BOTTOM_RIGHT_CLIP = "polygon(0 0, 100% 0, 0 0, 0% 100%)";
const TOP_RIGHT_CLIP = "polygon(0 0, 0 100%, 100% 100%, 0% 100%)";
const BOTTOM_LEFT_CLIP = "polygon(100% 100%, 100% 0, 100% 100%, 0 100%)";
const TOP_LEFT_CLIP = "polygon(0 0, 100% 0, 100% 100%, 100% 0)";

const ENTRANCE_KEYFRAMES = {
  left: [BOTTOM_RIGHT_CLIP, NO_CLIP],
  bottom: [BOTTOM_RIGHT_CLIP, NO_CLIP],
  top: [BOTTOM_RIGHT_CLIP, NO_CLIP],
  right: [TOP_LEFT_CLIP, NO_CLIP],
};

const EXIT_KEYFRAMES = {
  left: [NO_CLIP, TOP_RIGHT_CLIP],
  bottom: [NO_CLIP, TOP_RIGHT_CLIP],
  top: [NO_CLIP, TOP_RIGHT_CLIP],
  right: [NO_CLIP, BOTTOM_LEFT_CLIP],
};

type HoverSide = keyof typeof ENTRANCE_KEYFRAMES;

type LinkBoxProps = {
  href: string;
  imgSrc: string;
  imgAlt: string;
  span?: string;
  minWidth?: string;
  className?: string;
  colors: ClipPathLinksColorClasses;
  typography: ClipPathLinksTypographyClasses;
};

type LinkBoxContentProps = {
  title: string;
  imgSrc: string;
  imgAlt: string;
  className?: string;
  textClassName?: string;
  imageClassName?: string;
  labelWeightClass?: string;
};

const LinkBoxContent = ({
  title,
  imgSrc,
  imgAlt,
  className,
  textClassName,
  imageClassName,
  labelWeightClass,
}: LinkBoxContentProps) => {
  return (
    <>
      <span
        className={`pointer-events-none absolute bottom-1.5 left-2 max-w-[calc(100%-1rem)] overflow-hidden text-ellipsis whitespace-nowrap font-ibm text-[8px] tracking-[0.14em] uppercase sm:text-[9px] md:text-[10px] lg:text-xs xl:text-sm ${labelWeightClass ?? "font-light"} ${textClassName ?? "text-stone-100"}`}
      >
        {title}
      </span>
      <img
        src={imgSrc}
        alt={imgAlt}
        loading="lazy"
        decoding="async"
        className={`${className ?? "max-h-10 max-w-[calc(100%-1.5rem)] object-contain sm:max-h-16 md:max-h-20"} ${imageClassName ?? ""}`}
      />
    </>
  );
};

const LinkBox = ({ href, imgSrc, imgAlt, span, minWidth, className, colors, typography }: LinkBoxProps) => {
  const [scope, animate] = useAnimate();

  const getNearestSide = (e: React.MouseEvent<HTMLAnchorElement>): HoverSide => {
    const box = e.currentTarget.getBoundingClientRect();

    const proximityToLeft = {
      proximity: Math.abs(box.left - e.clientX),
      side: "left",
    };
    const proximityToRight = {
      proximity: Math.abs(box.right - e.clientX),
      side: "right",
    };
    const proximityToTop = {
      proximity: Math.abs(box.top - e.clientY),
      side: "top",
    };
    const proximityToBottom = {
      proximity: Math.abs(box.bottom - e.clientY),
      side: "bottom",
    };

    const sortedProximity = [
      proximityToLeft,
      proximityToRight,
      proximityToTop,
      proximityToBottom,
    ].sort((a, b) => a.proximity - b.proximity);

    return sortedProximity[0].side as HoverSide;
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const side = getNearestSide(e);
    animate(scope.current, {
      clipPath: ENTRANCE_KEYFRAMES[side],
    });
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const side = getNearestSide(e);
    animate(scope.current, {
      clipPath: EXIT_KEYFRAMES[side],
    });
  };

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ minWidth: minWidth ?? "8.5rem" }}
      className={`relative -mr-px -mb-px grid h-20 min-w-0 overflow-hidden place-content-center border-r border-b pb-5 sm:h-28 sm:pb-6 md:h-36 md:pb-7 ${colors.boxBorder} ${colors.boxBackground} ${colors.boxText} ${span ?? "col-span-12 sm:col-span-1"}`}
    >
      <LinkBoxContent
        title={imgAlt}
        imgSrc={imgSrc}
        imgAlt={imgAlt}
        className={className}
        textClassName={colors.boxText}
        imageClassName={colors.logoBase}
        labelWeightClass={typography.labelBaseWeight}
      />

      <div
        ref={scope}
        style={{ clipPath: BOTTOM_RIGHT_CLIP }}
        className={`absolute inset-0 grid place-content-center pb-5 transition-colors duration-300 sm:pb-6 md:pb-7 ${colors.overlayBackground}`}
      >
        <LinkBoxContent
          title={imgAlt}
          imgSrc={imgSrc}
          imgAlt={imgAlt}
          className={className}
          textClassName={colors.overlayText}
          imageClassName={colors.logoOverlay}
          labelWeightClass={typography.labelOverlayWeight}
        />
      </div>
    </a>
  );
};
