"use client";

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
  onMobileMenuClick?: () => void;
  initialLoadAnimation?: boolean;
}




const PillNav: React.FC<PillNavProps> = ({
  logos,
  logoAlt = 'Logo',
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
  onMobileMenuClick,
  initialLoadAnimation = true
}) => {
  const resolvedPillTextColor = pillTextColor ?? baseColor;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [pastHero, setPastHero] = useState(false);
  const circleRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const tlRefs = useRef<Array<gsap.core.Timeline | null>>([]);
  const activeTweenRefs = useRef<Array<gsap.core.Tween | null>>([]);
  const logoLayerRefs = useRef<Array<HTMLImageElement | null>>([]);
  const logoTweenRef = useRef<gsap.core.Timeline | null>(null);
  const activeLogoIndexRef = useRef(0);
  const hamburgerRef = useRef<HTMLButtonElement | null>(null);
  const mobileMenuRef = useRef<HTMLDivElement | null>(null);
  const navItemsRef = useRef<HTMLDivElement | null>(null);
  const logoRef = useRef<HTMLAnchorElement | HTMLElement | null>(null);

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

    const menu = mobileMenuRef.current;
    if (menu) {
      gsap.set(menu, { visibility: 'hidden', opacity: 0, scaleY: 1, y: 0 });
    }

    if (initialLoadAnimation) {
      const logo = logoRef.current;
      const navItems = navItemsRef.current;

      if (logo) {
        gsap.set(logo, { scale: 0 });
        gsap.to(logo, {
          scale: 1,
          duration: 0.8,
          ease
        });
      }

      if (navItems) {
        gsap.set(navItems, { width: 0, overflow: 'hidden' });
        gsap.to(navItems, {
          width: 'auto',
          duration: 1.4,
          ease
        });
      }
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
  }, [items, ease, initialLoadAnimation]);

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

  const toggleMobileMenu = () => {
    const newState = !isMobileMenuOpen;
    setIsMobileMenuOpen(newState);

    const hamburger = hamburgerRef.current;
    const menu = mobileMenuRef.current;

    if (hamburger) {
      const lines = hamburger.querySelectorAll('.hamburger-line');
      if (newState) {
        gsap.to(lines[0], { rotation: 45, y: 3, duration: 0.3, ease });
        gsap.to(lines[1], { rotation: -45, y: -3, duration: 0.3, ease });
      } else {
        gsap.to(lines[0], { rotation: 0, y: 0, duration: 0.3, ease });
        gsap.to(lines[1], { rotation: 0, y: 0, duration: 0.3, ease });
      }
    }

    if (menu) {
      if (newState) {
        gsap.set(menu, { visibility: 'visible' });
        gsap.fromTo(
          menu,
          { opacity: 0, y: 10, scaleY: 1 },
          {
            opacity: 1,
            y: 0,
            scaleY: 1,
            duration: 0.3,
            ease,
            transformOrigin: 'top center'
          }
        );
      } else {
        gsap.to(menu, {
          opacity: 0,
          y: 10,
          scaleY: 1,
          duration: 0.2,
          ease,
          transformOrigin: 'top center',
          onComplete: () => {
            gsap.set(menu, { visibility: 'hidden' });
          }
        });
      }
    }

    onMobileMenuClick?.();
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
    ['--pill-text']:
      heroPillTextColor && !pastHero ? heroPillTextColor : resolvedPillTextColor,
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
    <div className="absolute top-[1em] z-1000 w-full left-0 md:w-auto md:left-auto">
      <nav
        className={`w-full md:w-max flex items-center justify-between  md:justify-start box-border gap-3 px-4 md:px-0  ${className}`}
        aria-label="Primary"
        style={cssVars}
      >
        {isRouterLink(items?.[0]?.href) ? (
          <Link
            href={items[0].href}
            aria-label="Home"
            onMouseEnter={handleLogoEnter}
            onMouseLeave={handleLogoLeave}
            role="menuitem"
            ref={el => {
              logoRef.current = el;
            }}
            className="rounded-full p-2 inline-flex items-center justify-center overflow-hidden relative"
            style={{
              ...glassStyle,
              width: 'var(--nav-h)',
              height: 'var(--nav-h)'
            }}
          >
            {logoLayers}
          </Link>
        ) : (
          <a
            href={items?.[0]?.href || '#'}
            aria-label="Home"
            onMouseEnter={handleLogoEnter}
            onMouseLeave={handleLogoLeave}
            ref={el => {
              logoRef.current = el;
            }}
            className="rounded-full p-2 inline-flex items-center justify-center overflow-hidden relative"
            style={{
              ...glassStyle,
              width: 'var(--nav-h)',
              height: 'var(--nav-h)'
            }}
          >
            {logoLayers}
          </a>
        )}

        <div
          ref={navItemsRef}
          className="relative items-center rounded-full hidden md:flex ml-1"
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

        <button   //HAMBURGER BUTTON ON MOBILE
          ref={hamburgerRef}
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
          aria-expanded={isMobileMenuOpen}
          className="md:hidden rounded-full border-0 flex flex-col items-center justify-center gap-1 cursor-pointer relative"
          style={{
            ...glassStyle,
            width: 'var(--nav-h)',
            height: 'var(--nav-h)'
          }}
        >
          <span
            className="hamburger-line w-5 h-0.5 rounded origin-center transition-all duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)]"
            style={{ background: colors.beige_bright }}
          />
          <span
            className="hamburger-line w-5 h-0.5 rounded origin-center transition-all duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)]"
            style={{ background: colors.beige_bright }}
          />
        </button>
      </nav>

      <div
    //   MOBILE MENU
        ref={mobileMenuRef}
        className="md:hidden absolute  top-[3em] left-[3em] right-[3em] rounded-[1.75rem] shadow-[0_8px_32px_rgba(0,0,0,0.12)] z-998 origin-top text-center"
        style={{
          ...cssVars,
          ...glassStyle,
          backdropFilter: 'blur(24px) saturate(170%)',
          WebkitBackdropFilter: 'blur(24px) saturate(170%)'
        }}
      >
        <ul className="list-none m-0 p-0 flex flex-col gap-1.75">
          {items.map(item => {
            const defaultStyle: React.CSSProperties = {
              background: 'var(--pill-bg, #fff)',
              color: 'var(--pill-text, #fff)'
            };
            const hoverIn = (e: React.MouseEvent<HTMLAnchorElement>) => {
              e.currentTarget.style.background = 'var(--base)';
              e.currentTarget.style.color = 'var(--hover-text, #fff)';
            };
            const hoverOut = (e: React.MouseEvent<HTMLAnchorElement>) => {
              e.currentTarget.style.background = 'var(--pill-bg, #fff)';
              e.currentTarget.style.color = 'var(--pill-text, #fff)';
            };

            const linkClasses =
              'block py-4 px-4 text-[16px] font-medium rounded-[50px] transition-all duration-200 ease-[cubic-bezier(0.25,0.1,0.25,1)]';

            return (
              <li key={item.href}>
                {isRouterLink(item.href) ? (
                  <Link
                    href={item.href}
                    className={linkClasses}
                    style={defaultStyle}
                    onMouseEnter={hoverIn}
                    onMouseLeave={hoverOut}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ) : (
                  <a
                    href={item.href}
                    className={linkClasses}
                    style={defaultStyle}
                    onMouseEnter={hoverIn}
                    onMouseLeave={hoverOut}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.label}
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
