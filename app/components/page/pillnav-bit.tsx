"use client";

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { gsap } from 'gsap';
import { colors } from '../../lib/colors';
import { liquidGlassStyle } from '../../lib/glass';

export type PillNavItem = {
  label: string;
  href: string;
  ariaLabel?: string;
};

export interface PillNavProps {
  logos: [string, string];
  logoAlt?: string;
  /** Where the memoji leads — the same on every page. */
  homeHref?: string;
  /** 'white': a white ring draws itself around the memoji on load. */
  logoVariant?: 'glass' | 'white';
  items: PillNavItem[];
  activeHref?: string;
  className?: string;
  ease?: string;
  baseColor?: string;
  pillColor?: string;
  hoveredPillTextColor?: string;
  pillTextColor?: string;
  /** Text color while the nav overlaps the hero; falls back to pillTextColor after scrolling past it. */
  heroPillTextColor?: string;
  heroSelector?: string;
  /** Dark text color used while bright page content ([data-nav-bright]) sits behind the glass. */
  contrastPillTextColor?: string;
  onMobileMenuClick?: () => void;
  initialLoadAnimation?: boolean;
}




// Average relative luminance of an image, 0 (black) to 1 (white), sampled
// once through a tiny offscreen canvas. Returns null if the image can't be
// read (cross-origin taint) — those simply don't participate in detection.
const LUMINANCE_SAMPLE = 12;
let luminanceCanvas: HTMLCanvasElement | null = null;
const imageLuminance = (img: HTMLImageElement): number | null => {
  try {
    luminanceCanvas ??= document.createElement('canvas');
    luminanceCanvas.width = LUMINANCE_SAMPLE;
    luminanceCanvas.height = LUMINANCE_SAMPLE;
    const ctx = luminanceCanvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return null;
    ctx.clearRect(0, 0, LUMINANCE_SAMPLE, LUMINANCE_SAMPLE);
    ctx.drawImage(img, 0, 0, LUMINANCE_SAMPLE, LUMINANCE_SAMPLE);
    const { data } = ctx.getImageData(0, 0, LUMINANCE_SAMPLE, LUMINANCE_SAMPLE);
    let sum = 0;
    for (let i = 0; i < data.length; i += 4) {
      const alpha = data[i + 3] / 255;
      sum += ((0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2]) / 255) * alpha;
    }
    return sum / (data.length / 4);
  } catch {
    return null;
  }
};

const PillNav: React.FC<PillNavProps> = ({
  logos,
  logoAlt = 'Logo',
  homeHref = '/',
  logoVariant = 'glass',
  items,
  activeHref,
  className = '',
  ease = 'power3.easeOut',
  baseColor = colors.beige_bright,
  pillColor = colors.slate,
  hoveredPillTextColor = colors.beige_dark,
  pillTextColor,
  heroPillTextColor,
  heroSelector = '#home',
  contrastPillTextColor = colors.not_quite_black,
  onMobileMenuClick,
  initialLoadAnimation = true
}) => {
  const resolvedPillTextColor = pillTextColor ?? baseColor;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [pastHero, setPastHero] = useState(false);
  const [brightBehind, setBrightBehind] = useState(false);
  const circleRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const tlRefs = useRef<Array<gsap.core.Timeline | null>>([]);
  const activeTweenRefs = useRef<Array<gsap.core.Tween | null>>([]);
  const logoLayerRefs = useRef<Array<HTMLImageElement | null>>([]);
  const logoTweenRef = useRef<gsap.core.Timeline | null>(null);
  const activeLogoIndexRef = useRef(0);
  const hamburgerRef = useRef<HTMLButtonElement | null>(null);
  const mobileMenuRef = useRef<HTMLDivElement | null>(null);
  const navItemsRef = useRef<HTMLDivElement | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const layout = () => {
      circleRefs.current.forEach(circle => {
        if (!circle?.parentElement) return;

        const pill = circle.parentElement as HTMLElement;
        const rect = pill.getBoundingClientRect();
        const { width: w, height: h } = rect;
        const R = ((w * w) / 4 + h * h) / (2 * h);
        const D = Math.ceil(2 * R) + 2;
        const delta = Math.ceil(R - Math.sqrt(Math.max(0, R * R - (w * w) / 4))) + 1;
        const originY = D - delta;

        circle.style.width = `${D}px`;
        circle.style.height = `${D}px`;
        circle.style.bottom = `-${delta}px`;

        gsap.set(circle, {
          xPercent: -50,
          scale: 0,
          transformOrigin: `50% ${originY}px`
        });

        const label = pill.querySelector<HTMLElement>('.pill-label');
        const white = pill.querySelector<HTMLElement>('.pill-label-hover');

        if (label) gsap.set(label, { y: 0 });
        if (white) gsap.set(white, { y: h + 12, opacity: 0 });

        const index = circleRefs.current.indexOf(circle);
        if (index === -1) return;

        tlRefs.current[index]?.kill();
        const tl = gsap.timeline({ paused: true });

        tl.to(circle, { scale: 1.2, xPercent: -50, duration: 2, ease, overwrite: 'auto' }, 0);

        if (label) {
          tl.to(label, { y: -(h + 8), duration: 2, ease, overwrite: 'auto' }, 0);
        }

        if (white) {
          gsap.set(white, { y: Math.ceil(h + 100), opacity: 0 });
          tl.to(white, { y: 0, opacity: 1, duration: 2, ease, overwrite: 'auto' }, 0);
        }

        tlRefs.current[index] = tl;
      });
    };

    layout();

    const onResize = () => layout();
    window.addEventListener('resize', onResize);

    if (document.fonts) {
      document.fonts.ready.then(layout).catch(() => {});
    }

    const firstLogo = logoLayerRefs.current[0];
    const secondLogo = logoLayerRefs.current[1];
    if (firstLogo && secondLogo) {
      gsap.set(firstLogo, {
        autoAlpha: 1,
        filter: 'blur(0px)',
        scale: 0.9,
        zIndex: 2
      });
      gsap.set(secondLogo, {
        autoAlpha: 0,
        filter: 'blur(7px)',
        scale: 0.9,
        zIndex: 1
      });
    }

    return () => window.removeEventListener('resize', onResize);
  }, [items, ease]);

  const handleEnter = (i: number) => {
    const tl = tlRefs.current[i];
    if (!tl) return;
    activeTweenRefs.current[i]?.kill();
    activeTweenRefs.current[i] = tl.tweenTo(tl.duration(), {
      duration: 0.4,
      ease,
      overwrite: 'auto'
    });
  };

  const handleLeave = (i: number) => {
    const tl = tlRefs.current[i];
    if (!tl) return;
    activeTweenRefs.current[i]?.kill();
    activeTweenRefs.current[i] = tl.tweenTo(0, {
      duration: 0.65,
      ease,
      overwrite: 'auto'
    });
  };

  const animateLogoTo = (targetIndex: 0 | 1) => {
    const fromIndex = activeLogoIndexRef.current as 0 | 1;
    if (fromIndex === targetIndex) return;

    const fromLogo = logoLayerRefs.current[fromIndex];
    const toLogo = logoLayerRefs.current[targetIndex];
    if (!fromLogo || !toLogo) return;

    logoTweenRef.current?.kill();
    gsap.set(toLogo, { zIndex: 2 });
    gsap.set(fromLogo, { zIndex: 1 });

    logoTweenRef.current = gsap.timeline({ defaults: { ease, overwrite: 'auto' } });
    logoTweenRef.current
      .fromTo(
        toLogo,
        { autoAlpha: 0, filter: 'blur(9px)', scale: 0.9 },
        { autoAlpha: 1, filter: 'blur(0px)', scale: 1, duration: 0.5 },
        0
      )
      .to(
        fromLogo,
        { autoAlpha: 0, filter: 'blur(7px)', scale: 0.89, duration: 0.42 },
        0
      );

    activeLogoIndexRef.current = targetIndex;
  };

  const handleLogoEnter = () => animateLogoTo(1);
  const handleLogoLeave = () => animateLogoTo(0);

  useEffect(() => {
    if (!heroPillTextColor) return;
    const hero = document.querySelector(heroSelector);
    if (!hero) return;

    // Swap once only 15% of the hero is still visible — i.e. ~85% scrolled
    // through it — rather than waiting for it to fully clear the nav.
    const observer = new IntersectionObserver(
      ([entry]) => setPastHero(entry.intersectionRatio < 0.15),
      { threshold: 0.15 }
    );
    observer.observe(hero);
    return () => observer.disconnect();
  }, [heroPillTextColor, heroSelector]);

  // Liquid-glass adaptive text: like iOS, the nav watches what's behind the
  // glass and flips the whole pill row to dark text — but only for genuinely
  // white images (sampled luminance), and only once one covers most of the
  // pill row's height. Text passing behind never triggers it. Zero scroll
  // listeners: an IntersectionObserver whose viewport root is shrunk (via
  // negative rootMargin) down to the pill row's own screen box.
  useEffect(() => {
    const band = navItemsRef.current;
    if (!band) return;

    let observer: IntersectionObserver | null = null;
    let lingerTimer: number | undefined;
    let bandHeight = 0;
    const covering = new Set<Element>();
    const brightImages = new Set<Element>();
    const measuredImages = new WeakSet<HTMLImageElement>();

    const considerImage = (img: HTMLImageElement) => {
      // The nav's own logo images always sit "behind" the band — skip them,
      // along with anything not loaded yet (the load listener catches those).
      if (measuredImages.has(img) || img.closest('nav')) return;
      if (!img.complete || img.naturalWidth === 0) return;
      // Large project screenshots are never the bright-white decorative images
      // this adaptive-text feature targets, and drawImage + getImageData on a
      // 3000-4000px source is the expensive part. Only sample small images.
      if (img.naturalWidth > 1500) return;
      measuredImages.add(img);
      const lum = imageLuminance(img);
      if (lum !== null && lum > 0.8) {
        brightImages.add(img);
        observer?.observe(img);
      }
    };

    // 'load' doesn't bubble, but it does capture — one document listener
    // covers every lazy image that finishes after the initial scan.
    const onAnyLoad = (event: Event) => {
      if (event.target instanceof HTMLImageElement) considerImage(event.target);
    };

    const build = () => {
      observer?.disconnect();
      covering.clear();
      window.clearTimeout(lingerTimer);
      setBrightBehind(false);

      // The pill row is display:none below md; no pills, nothing to adapt.
      const rect = band.getBoundingClientRect();
      if (rect.width < 2 || rect.height < 2) return;
      bandHeight = rect.height;

      observer = new IntersectionObserver(
        entries => {
          for (const entry of entries) {
            // Flip only when the image blankets the band — at least 80% of
            // the pill row's height — not on a shallow graze.
            const covers =
              entry.isIntersecting &&
              entry.intersectionRect.height >= bandHeight * 0.8;
            if (covers) covering.add(entry.target);
            else covering.delete(entry.target);
          }
          window.clearTimeout(lingerTimer);
          if (covering.size > 0) {
            setBrightBehind(true);
          } else {
            // Brief linger so the text doesn't strobe at the boundary.
            lingerTimer = window.setTimeout(() => setBrightBehind(false), 140);
          }
        },
        {
          rootMargin: [
            -rect.top,
            -(window.innerWidth - rect.right),
            -(window.innerHeight - rect.bottom),
            -rect.left
          ]
            .map(v => `${Math.round(v)}px`)
            .join(' '),
          // Fine-grained thresholds so we keep getting callbacks while an
          // image slides through the band and its covered height changes.
          threshold: Array.from({ length: 101 }, (_, i) => i / 100)
        }
      );

      brightImages.forEach(el => observer!.observe(el));
    };

    const init = () => {
      Array.from(document.images).forEach(considerImage);
      build();
    };

    // The pill row's box is stable from first paint (its intro is a clip-path
    // wipe). Resize rebuilds (which also covers crossing the md breakpoint).
    const settle = window.setTimeout(init, 0);
    window.addEventListener('resize', build);
    document.addEventListener('load', onAnyLoad, true);
    return () => {
      window.clearTimeout(settle);
      window.clearTimeout(lingerTimer);
      window.removeEventListener('resize', build);
      document.removeEventListener('load', onAnyLoad, true);
      observer?.disconnect();
    };
  }, []);

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  // Close on navigation, whatever triggered it (back button included).
  const [menuPath, setMenuPath] = useState(pathname);
  if (menuPath !== pathname) {
    setMenuPath(pathname);
    setIsMobileMenuOpen(false);
  }

  // While open: Escape, a tap anywhere outside the nav, or scrolling the page
  // dismisses the menu, the way native dropdowns behave.
  useEffect(() => {
    if (!isMobileMenuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      setIsMobileMenuOpen(false);
      hamburgerRef.current?.focus();
    };
    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as Node;
      if (mobileMenuRef.current?.contains(target) || hamburgerRef.current?.contains(target)) return;
      setIsMobileMenuOpen(false);
    };
    const startY = window.scrollY;
    const onScroll = () => {
      if (Math.abs(window.scrollY - startY) > 40) setIsMobileMenuOpen(false);
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('scroll', onScroll);
    };
  }, [isMobileMenuOpen]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(open => !open);
    onMobileMenuClick?.();
  };

  // Already home: the memoji scrolls back to the top instead of a no-op
  // navigation, and drops any #section left in the URL.
  const handleHomeClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    closeMobileMenu();
    if (pathname !== homeHref) return;
    e.preventDefault();
    window.history.replaceState(null, '', homeHref);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isExternalLink = (href: string) =>
    href.startsWith('http://') ||
    href.startsWith('https://') ||
    href.startsWith('//') ||
    href.startsWith('mailto:') ||
    href.startsWith('tel:') ||
    href.startsWith('#');

  const isRouterLink = (href?: string) => href && !isExternalLink(href);

  const cssVars = {
    ['--base']: baseColor,
    ['--pill-bg']: pillColor,
    ['--hover-text']: hoveredPillTextColor,
    ['--pill-text']: brightBehind
      ? contrastPillTextColor
      : heroPillTextColor && !pastHero
        ? heroPillTextColor
        : resolvedPillTextColor,
    ['--nav-h']: '47px',
    ['--logo']: '47px',
    ['--pill-pad-x']: '17px',
    ['--pill-gap']: '15px'
  } as React.CSSProperties;

  // Shared liquid-glass material (app/lib/glass.ts) — same object the contact
  // form panel uses, so the two surfaces can never drift apart.
  const glassStyle: React.CSSProperties = liquidGlassStyle;

  // Shared by both logo branches below; next/image serves a ~47px optimized
  // version of the memoji instead of the full-size PNG.
  const logoLayers = (
    <>
      <Image
        src={logos[0]}
        alt={logoAlt}
        fill
        sizes="47px"
        priority
        ref={el => {
          logoLayerRefs.current[0] = el;
        }}
        className="object-cover block"
      />
      <Image
        src={logos[1]}
        alt={logoAlt}
        fill
        sizes="47px"
        ref={el => {
          logoLayerRefs.current[1] = el;
        }}
        className="object-cover block"
      />
    </>
  );

  return (
    // The bar spans the full width on mobile but only its own controls should
    // catch taps — it's pinned over scrolling content now, so a transparent
    // full-width strip would otherwise swallow every tap along the top edge.
    <div className="absolute top-[1em] z-1000 w-full left-0 md:w-auto md:left-auto pointer-events-none">
      <nav
        className={`w-full md:w-max flex items-center justify-between  md:justify-start box-border gap-3 px-4 md:px-0  ${className}`}
        aria-label="Primary"
        style={cssVars}
      >
        {logoVariant === 'white' ? (
          // Intro: the ring draws itself clockwise from 12 o'clock, then the
          // face settles in. All CSS (globals.css, nav-ring-*), so it starts
          // on first paint. The ring's size is explicit because an <svg> is a
          // replaced element: WebKit won't stretch one from insets alone like
          // Chrome does, so iOS drew it off-center.
          <span className="group relative inline-flex shrink-0 pointer-events-auto">
            <svg
              aria-hidden="true"
              viewBox="0 0 100 100"
              className="nav-ring absolute -top-1.25 -left-1.25 size-[calc(100%+0.625rem)] overflow-visible transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]"
            >
              <circle
                cx="50"
                cy="50"
                r="49"
                pathLength={1}
                fill="none"
                stroke="#fff"
                strokeWidth="3"
                strokeLinecap="round"
                className="nav-ring-draw"
              />
            </svg>
            <Link
              href={homeHref}
              aria-label="Home"
              onClick={handleHomeClick}
              onMouseEnter={handleLogoEnter}
              onMouseLeave={handleLogoLeave}
              className="rounded-full p-2 inline-flex items-center justify-center overflow-hidden relative"
              style={{
                ...glassStyle,
                width: 'var(--nav-h)',
                height: 'var(--nav-h)'
              }}
            >
              <span className="nav-face-in absolute inset-0">{logoLayers}</span>
            </Link>
          </span>
        ) : (
          <Link
            href={homeHref}
            aria-label="Home"
            onClick={handleHomeClick}
            onMouseEnter={handleLogoEnter}
            onMouseLeave={handleLogoLeave}
            className={`rounded-full p-2 inline-flex items-center justify-center overflow-hidden relative shrink-0 pointer-events-auto ${initialLoadAnimation ? 'nav-logo-in' : ''}`}
            style={{
              ...glassStyle,
              width: 'var(--nav-h)',
              height: 'var(--nav-h)'
            }}
          >
            {logoLayers}
          </Link>
        )}

        <div
          ref={navItemsRef}
          className={`relative items-center rounded-full hidden md:flex ml-1 pointer-events-auto ${initialLoadAnimation ? 'nav-pills-in' : ''}`}
          style={{
            ...glassStyle,
            height: 'var(--nav-h)'
          }}
        >
          <ul
            role="menubar"
            className="list-none flex items-stretch m-0 p-0.75 h-full"
            style={{ gap: 'var(--pill-gap)' }}
          >
            {items.map((item, i) => {
              const isActive = activeHref === item.href;

              const pillStyle: React.CSSProperties = {
                background: 'var(--pill-bg, #fff)',
                color: 'var(--pill-text, var(--base, #000))',
                transition: 'color 0.35s ease',
                paddingLeft: 'var(--pill-pad-x)',
                paddingRight: 'var(--pill-pad-x)'
              };

              const PillContent = (
                <>
                  <span
                    className="hover-circle absolute left-1/2 bottom-0 rounded-full z-1 block pointer-events-none"
                    style={{
                      background: 'var(--base, #000)',
                      willChange: 'transform'
                    }}
                    aria-hidden="true"
                    ref={el => {
                      circleRefs.current[i] = el;
                    }}
                  />
                  <span className="label-stack relative inline-block leading-none z-2">
                    <span
                      className="pill-label relative z-2 inline-block leading-none"
                      style={{ willChange: 'transform' }}
                    >
                      {item.label}
                    </span>
                    <span
                      className="pill-label-hover absolute left-0 top-0 z-3 inline-block"
                      style={{
                        color: 'var(--hover-text, #fff)',
                        willChange: 'transform, opacity'
                      }}
                      aria-hidden="true"
                    >
                      {item.label}
                    </span>
                  </span>
                  {isActive && (
                    <span
                      className="absolute left-1/2 bottom-[6px] -translate-x-1/2 w-4 h-[2.5px] rounded-full z-4"
                      style={{ background: 'currentColor' }}
                      aria-hidden="true"
                    />
                  )}
                </>
              );

              const basePillClasses =
                'relative overflow-hidden inline-flex items-center justify-center h-full no-underline rounded-full box-border font-semibold text-[16px] leading-[0] uppercase tracking-[0.2px] whitespace-nowrap cursor-pointer px-0 ';

              return (
                <li key={item.href} role="none" className="flex h-full">
                  {isRouterLink(item.href) ? (
                    <Link
                      role="menuitem"
                    //   to={item.href}
                      href={item.href}
                      className={basePillClasses}
                      style={pillStyle}
                      aria-label={item.ariaLabel || item.label}
                      aria-current={isActive ? 'page' : undefined}
                      onMouseEnter={() => handleEnter(i)}
                      onMouseLeave={() => handleLeave(i)}
                    >
                      {PillContent}
                    </Link>
                  ) : (
                    <a
                      role="menuitem"
                      href={item.href}
                      className={basePillClasses}
                      style={pillStyle}
                      aria-label={item.ariaLabel || item.label}
                      aria-current={isActive ? 'page' : undefined}
                      onMouseEnter={() => handleEnter(i)}
                      onMouseLeave={() => handleLeave(i)}
                    >
                      {PillContent}
                    </a>
                  )}
                </li>
              );
            })}
          </ul>
        </div>

        <button
          ref={hamburgerRef}
          type="button"
          onClick={toggleMobileMenu}
          aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isMobileMenuOpen}
          aria-controls="mobile-nav-menu"
          className={`md:hidden rounded-full border-0 flex flex-col items-center justify-center gap-1 cursor-pointer relative shrink-0 pointer-events-auto ${initialLoadAnimation ? 'nav-logo-in' : ''}`}
          style={{
            ...glassStyle,
            width: 'var(--nav-h)',
            height: 'var(--nav-h)'
          }}
        >
          {/* Lines sit 6px apart center-to-center; ±3px meets them in an X. */}
          <span
            className={`w-5 h-0.5 rounded transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${isMobileMenuOpen ? 'translate-y-[3px] rotate-45' : ''}`}
            style={{ background: colors.beige_bright }}
          />
          <span
            className={`w-5 h-0.5 rounded transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${isMobileMenuOpen ? '-translate-y-[3px] -rotate-45' : ''}`}
            style={{ background: colors.beige_bright }}
          />
        </button>
      </nav>

      {/* Mobile menu. Hidden in the server HTML itself (state-driven classes,
          not a post-hydration JS tween), so it can never flash on load. */}
      <div
        id="mobile-nav-menu"
        ref={mobileMenuRef}
        className={`md:hidden absolute left-4 right-4 rounded-[1.75rem] p-2 z-998 origin-top transition-[opacity,transform,visibility] duration-250 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          isMobileMenuOpen
            ? 'visible opacity-100 translate-y-0 scale-100 pointer-events-auto'
            : 'invisible opacity-0 -translate-y-2 scale-[0.98] pointer-events-none'
        }`}
        style={{
          ...glassStyle,
          top: 'calc(47px + 10px)',
          backdropFilter: 'blur(24px) saturate(170%)',
          WebkitBackdropFilter: 'blur(24px) saturate(170%)'
        }}
      >
        <ul className="list-none m-0 p-0 flex flex-col gap-1">
          {items.map((item, i) => {
            const isActive = activeHref === item.href;
            const linkClasses = `flex items-center justify-between min-h-13 px-5 rounded-[1.25rem] font-semibold text-[15px] uppercase tracking-[0.08em] no-underline transition-[background-color,opacity,transform] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] active:bg-white/10 hover:bg-white/6 ${
              isMobileMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-1'
            } ${isActive ? 'bg-white/6' : ''}`;
            const linkStyle: React.CSSProperties = {
              color: isActive ? colors.beige_bright : colors.primary,
              transitionDelay: isMobileMenuOpen ? `${60 + i * 40}ms` : '0ms'
            };
            const content = (
              <>
                {item.label}
                <span
                  aria-hidden="true"
                  className={`h-1.5 w-1.5 rounded-full ${isActive ? '' : 'opacity-0'}`}
                  style={{ background: colors.beige_bright }}
                />
              </>
            );

            return (
              <li key={item.href}>
                {isRouterLink(item.href) ? (
                  <Link
                    href={item.href}
                    className={linkClasses}
                    style={linkStyle}
                    aria-current={isActive ? 'page' : undefined}
                    tabIndex={isMobileMenuOpen ? undefined : -1}
                    onClick={closeMobileMenu}
                  >
                    {content}
                  </Link>
                ) : (
                  <a
                    href={item.href}
                    className={linkClasses}
                    style={linkStyle}
                    aria-current={isActive ? 'page' : undefined}
                    tabIndex={isMobileMenuOpen ? undefined : -1}
                    onClick={closeMobileMenu}
                  >
                    {content}
                  </a>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default PillNav;
