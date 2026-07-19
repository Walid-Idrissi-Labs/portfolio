"use client"
import React, { useEffect, useRef } from "react";
import gsap from "gsap";

import { colors as brand } from "../../lib/colors";

export type LogoItem = {
  src: string;
  alt: string;
  /** No longer used for navigation — tiles pin the reveal on click instead of linking out. Kept optional so existing stack data stays valid. */
  href?: string;
  span: string;
  minWidth?: string;
  /** Brand-colored variant shown inside the highlight; resolved from TECH_COLOR_MAP when omitted. */
  colorSrc?: string;
  /** Brand tint driving the highlight glow, ring, and label; resolved from TECH_COLOR_MAP when omitted. */
  color?: string;
};

type ClipPathLinksColorClasses = {
  containerBorder: string;
  boxBorder: string;
  boxBackground: string;
  boxText: string;
  logoBase: string;
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
  logoBase: "",
};

// Brand color variants for the highlight, shared with the logo loop's
// /public/color assets. Keyed by the gray logo's src so project stackRows
// resolve automatically; techs without an entry (e.g. Go) fall back to the
// white-inverted gray logo with a beige tint.
const TECH_COLOR_MAP: Record<string, { colorSrc: string; color: string }> = {
  "/logo-html5.svg": { colorSrc: "/color/logo-html5.svg", color: "#E34F26" },
  "/logo-react.svg": { colorSrc: "/color/logo-react.svg", color: "#61DAFB" },
  "/logo-vue.svg": { colorSrc: "/color/logo-vue.svg", color: "#42B883" },
  "/logo-javascript.svg": { colorSrc: "/color/logo-javascript.svg", color: "#F7DF1E" },
  "/logo-typescript.svg": { colorSrc: "/color/logo-typescript.svg", color: "#3178C6" },
  "/logo-nextjs.svg": { colorSrc: "/color/logo-nextjs.svg", color: "#FFFFFF" },
  "/logo-tailwind.svg": { colorSrc: "/color/logo-tailwind.svg", color: "#38BDF8" },
  "/logo-terraform.svg": { colorSrc: "/color/logo-terraform.svg", color: "#7B42BC" },
  "/logo-aws.svg": { colorSrc: "/color/logo-aws.svg", color: "#FF9900" },
  "/logo-python.svg": { colorSrc: "/color/logo-python.svg", color: "#FFD43B" },
  "/logo-postgres.svg": { colorSrc: "/color/logo-postgres.svg", color: "#336791" },
  "/logo-bash.svg": { colorSrc: "/color/logo-bash.svg", color: "#4EAA25" },
  "/logo-three.svg": { colorSrc: "/color/logo-three.svg", color: "#FFFFFF" },
  "/logo-docker.svg": { colorSrc: "/color/logo-docker.svg", color: "#2496ED" },
  "/logo-laravel.svg": { colorSrc: "/color/logo-laravel.svg", color: "#FF2D20" },
  "/logo-mysql.svg": { colorSrc: "/color/logo-mysql.svg", color: "#00758F" },
  "/logo-php.svg": { colorSrc: "/color/logo-php.svg", color: "#777BB4" },
  "/logo-css3.svg": { colorSrc: "/color/logo-css3.svg", color: "#1572B6" },
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

type Rect = { x: number; y: number; w: number; h: number };
type HoverSide = "left" | "right" | "top" | "bottom";

/** Overlays are clipped to their intersection with this virtual rect; this hides them. */
const HIDDEN_CLIP = "inset(50% 50% 50% 50%)";

const getNearestSide = (box: DOMRect, clientX: number, clientY: number): HoverSide => {
  const proximities: { proximity: number; side: HoverSide }[] = [
    { proximity: Math.abs(box.left - clientX), side: "left" },
    { proximity: Math.abs(box.right - clientX), side: "right" },
    { proximity: Math.abs(box.top - clientY), side: "top" },
    { proximity: Math.abs(box.bottom - clientY), side: "bottom" },
  ];

  return proximities.sort((a, b) => a.proximity - b.proximity)[0].side;
};

const collapseToSide = (cell: Rect, side: HoverSide): Rect => {
  switch (side) {
    case "left":
      return { x: cell.x, y: cell.y, w: 0, h: cell.h };
    case "right":
      return { x: cell.x + cell.w, y: cell.y, w: 0, h: cell.h };
    case "top":
      return { x: cell.x, y: cell.y, w: cell.w, h: 0 };
    case "bottom":
      return { x: cell.x, y: cell.y + cell.h, w: cell.w, h: 0 };
  }
};

export const ClipPathLinks = ({ colors, typography, rows = techLogoRows }: ClipPathLinksProps) => {
  const colorClasses = { ...DEFAULT_COLOR_CLASSES, ...colors };
  const typographyClasses = { ...DEFAULT_TYPOGRAPHY_CLASSES, ...typography };

  const containerRef = useRef<HTMLDivElement>(null);
  const cellEls = useRef(new Map<string, HTMLButtonElement>());
  const overlayEls = useRef(new Map<string, HTMLDivElement>());
  const cellRects = useRef(new Map<string, Rect>());
  const highlight = useRef<Rect>({ x: 0, y: 0, w: 0, h: 0 });
  const isActive = useRef(false);
  const lastHoveredId = useRef<string | null>(null);
  // Cell whose reveal is pinned by a click/tap; the highlight returns here on
  // mouse-leave instead of collapsing. null = nothing pinned.
  const lockedId = useRef<string | null>(null);
  const tween = useRef<gsap.core.Tween | null>(null);

  useEffect(() => {
    return () => {
      tween.current?.kill();
    };
  }, []);

  const cacheCellRects = () => {
    const container = containerRef.current;
    if (!container) return;
    const containerBox = container.getBoundingClientRect();
    cellEls.current.forEach((el, id) => {
      const box = el.getBoundingClientRect();
      cellRects.current.set(id, {
        x: box.left - containerBox.left,
        y: box.top - containerBox.top,
        w: box.width,
        h: box.height,
      });
    });
  };

  const paintOverlays = () => {
    const r = highlight.current;
    overlayEls.current.forEach((overlay, id) => {
      const cell = cellRects.current.get(id);
      if (!cell) return;
      const top = Math.max(0, r.y - cell.y);
      const left = Math.max(0, r.x - cell.x);
      const right = Math.max(0, cell.x + cell.w - (r.x + r.w));
      const bottom = Math.max(0, cell.y + cell.h - (r.y + r.h));
      overlay.style.clipPath =
        left + right >= cell.w || top + bottom >= cell.h
          ? HIDDEN_CLIP
          : `inset(${top}px ${right}px ${bottom}px ${left}px)`;
    });
  };

  const tweenHighlightTo = (target: Rect, onComplete?: () => void) => {
    tween.current?.kill();
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    tween.current = gsap.to(highlight.current, {
      ...target,
      duration: reducedMotion ? 0 : 0.45,
      ease: "power3.out",
      onUpdate: paintOverlays,
      onComplete,
    });
  };

  const popOverlay = (id: string) => {
    const overlay = overlayEls.current.get(id);
    if (!overlay) return;
    const pops = overlay.querySelectorAll("[data-pop]");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) {
      gsap.set(pops, { scale: 1, opacity: 1 });
    } else {
      gsap.fromTo(
        pops,
        { scale: 0.75, opacity: 0.4 },
        { scale: 1, opacity: 1, duration: 0.55, ease: "back.out(1.7)", overwrite: true },
      );
    }
  };

  const handleCellEnter = (id: string, e: React.MouseEvent<HTMLButtonElement>) => {
    if (!isActive.current) cacheCellRects();
    const cell = cellRects.current.get(id);
    if (!cell) return;

    if (!isActive.current) {
      const side = getNearestSide(e.currentTarget.getBoundingClientRect(), e.clientX, e.clientY);
      Object.assign(highlight.current, collapseToSide(cell, side));
      isActive.current = true;
    }

    lastHoveredId.current = id;
    tweenHighlightTo(cell);
    popOverlay(id);
  };

  // Click/tap pins the reveal: it survives mouse-leave and lets touch users
  // (who never hover) trigger the highlight. Clicking the pinned tile releases it.
  const handleCellClick = (id: string, e: React.MouseEvent<HTMLButtonElement>) => {
    if (!isActive.current) cacheCellRects();
    const cell = cellRects.current.get(id);
    if (!cell) return;

    if (lockedId.current === id) {
      lockedId.current = null;
      const side = getNearestSide(e.currentTarget.getBoundingClientRect(), e.clientX, e.clientY);
      tweenHighlightTo(collapseToSide(cell, side), () => {
        isActive.current = false;
      });
      return;
    }

    lockedId.current = id;
    // Seed the highlight from the tap edge when there was no prior hover (touch).
    if (!isActive.current) {
      const side = getNearestSide(e.currentTarget.getBoundingClientRect(), e.clientX, e.clientY);
      Object.assign(highlight.current, collapseToSide(cell, side));
      isActive.current = true;
    }
    lastHoveredId.current = id;
    tweenHighlightTo(cell);
    popOverlay(id);
  };

  const handleContainerLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isActive.current || !lastHoveredId.current) return;

    // A pinned tile stays lit: return the highlight to it instead of collapsing.
    if (lockedId.current) {
      const lockedCell = cellRects.current.get(lockedId.current);
      if (lockedCell) {
        lastHoveredId.current = lockedId.current;
        tweenHighlightTo(lockedCell);
        popOverlay(lockedId.current);
        return;
      }
    }

    const cell = cellRects.current.get(lastHoveredId.current);
    if (!cell) return;

    const side = getNearestSide(e.currentTarget.getBoundingClientRect(), e.clientX, e.clientY);
    tweenHighlightTo(collapseToSide(cell, side), () => {
      isActive.current = false;
    });
  };

  const registerCell = (id: string) => (el: HTMLButtonElement | null) => {
    if (el) cellEls.current.set(id, el);
    else cellEls.current.delete(id);
  };

  const registerOverlay = (id: string) => (el: HTMLDivElement | null) => {
    if (el) overlayEls.current.set(id, el);
    else overlayEls.current.delete(id);
  };

  return (
    <div
      ref={containerRef}
      onMouseLeave={handleContainerLeave}
      className={`relative w-full overflow-hidden border ${colorClasses.containerBorder}`}
    >
      {rows.map((row, rowIndex) => (
        <div key={rowIndex} className="grid grid-cols-12">
          {row.map((logo) => (
            <LinkBox
              key={logo.alt}
              imgSrc={logo.src}
              imgAlt={logo.alt}
              colorSrc={logo.colorSrc}
              color={logo.color}
              span={logo.span}
              minWidth={logo.minWidth}
              className="h-8 w-auto object-contain sm:h-10 md:h-12"
              colors={colorClasses}
              typography={typographyClasses}
              cellRef={registerCell(logo.alt)}
              overlayRef={registerOverlay(logo.alt)}
              onEnter={(e) => handleCellEnter(logo.alt, e)}
              onClick={(e) => handleCellClick(logo.alt, e)}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

type LinkBoxProps = {
  imgSrc: string;
  imgAlt: string;
  colorSrc?: string;
  color?: string;
  span?: string;
  minWidth?: string;
  className?: string;
  colors: ClipPathLinksColorClasses;
  typography: ClipPathLinksTypographyClasses;
  cellRef: (el: HTMLButtonElement | null) => void;
  overlayRef: (el: HTMLDivElement | null) => void;
  onEnter: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
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

const LinkBox = ({
  imgSrc,
  imgAlt,
  colorSrc,
  color,
  span,
  minWidth,
  className,
  colors,
  typography,
  cellRef,
  overlayRef,
  onEnter,
  onClick,
}: LinkBoxProps) => {
  const brandAsset =
    colorSrc && color ? { colorSrc, color } : TECH_COLOR_MAP[imgSrc];
  const tint = brandAsset?.color ?? brand.beige_bright;
  const overlaySrc = brandAsset?.colorSrc ?? imgSrc;
  const overlayFilter = brandAsset
    ? `drop-shadow(0 0 16px ${tint}66)`
    : `brightness(0) invert(1) drop-shadow(0 0 16px ${tint}66)`;

  return (
    <button
      type="button"
      ref={cellRef}
      aria-label={imgAlt}
      onMouseEnter={onEnter}
      onClick={onClick}
      style={{ minWidth: minWidth ?? "8.5rem" }}
      className={`relative -mr-px -mb-px grid h-20 min-w-0 cursor-pointer overflow-hidden place-content-center border-r border-b pb-5 text-left sm:h-28 sm:pb-6 md:h-36 md:pb-7 ${colors.boxBorder} ${colors.boxBackground} ${colors.boxText} ${span ?? "col-span-12 sm:col-span-1"}`}
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
        ref={overlayRef}
        style={{
          clipPath: HIDDEN_CLIP,
          backgroundColor: brand.not_quite_black,
          boxShadow: `inset 0 0 0 1px ${tint}40`,
        }}
        className="absolute inset-0 grid place-content-center pb-5 sm:pb-6 md:pb-7"
      >
        <div
          data-pop
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background: `radial-gradient(ellipse 75% 65% at 50% 42%, ${tint}38 0%, ${tint}14 45%, transparent 72%)`,
          }}
        />
        <span
          className={`pointer-events-none absolute bottom-1.5 left-2 max-w-[calc(100%-1rem)] overflow-hidden text-ellipsis whitespace-nowrap font-ibm text-[8px] tracking-[0.14em] uppercase sm:text-[9px] md:text-[10px] lg:text-xs xl:text-sm ${typography.labelOverlayWeight}`}
          style={{ color: `color-mix(in srgb, ${tint} 70%, white)` }}
        >
          {imgAlt}
        </span>
        <img
          data-pop
          src={overlaySrc}
          alt={imgAlt}
          loading="lazy"
          decoding="async"
          style={{ filter: overlayFilter }}
          className={className ?? "max-h-10 max-w-[calc(100%-1.5rem)] object-contain sm:max-h-16 md:max-h-20"}
        />
      </div>
    </button>
  );
};
