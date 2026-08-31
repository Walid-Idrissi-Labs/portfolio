# Portfolio — Performance Audit

> A structured audit of why the site struggles on mid-range laptops, with concrete fixes.
> Use this as the working backlog. Each finding has a severity, the affected files, the
> *why*, the *what to do*, and an estimated effort. Re-run the "quick wins" first — they
> are cheap and give most of the improvement.

---

## TL;DR — the three things that matter most

1. **Assets are enormous.** `public/` is **119 MB** of PNGs. The worst single file is
   `project-applyr-0.png` at **7684×4322 px / 8.6 MB**. These are decoded by
   `next/image` on the server for *every* optimized size request, and many are
   `loading="eager"`, so a project page fetches a dozen multi-MB images on first load.
2. **The `dicons` icon library is ~3.3 MB of JS** and is imported whole for **4 icons**.
   It is the single largest chunk in the client bundle. Replace it with `lucide-react`
   (already installed) or inline SVGs.
3. **Too much continuous main-thread / GPU work.** WebGL (Aurora), ~50 infinite
   Framer-Motion gradient animations (BackgroundBeams), ~600 per-word `motion.span`
   blur reveals (ScrollText), several `blur(20px)` border-gradient loops, and a
   global Lenis rAF — all run on top of two overlapping animation libraries (GSAP +
   Motion). This saturates CPU/GPU on integrated graphics.

Fixing #1–#3 will move the needle the most. Everything else is refinement.

---

## Severity legend

| Icon | Meaning |
|------|---------|
| 🔴 | Critical — direct, large impact on load/scroll performance |
| 🟠 | High — meaningful impact, moderate effort |
| 🟡 | Medium — worth doing, smaller/contained impact |
| 🟢 | Low / hygiene — polish, correctness, repo health |

---

## A. Asset weight

### A1. 🔴 Images are 5–10× too large and stored as PNG

- **Files:** `public/project-*.png` (48 tracked files, ~119 MB total)
- **Worst offenders:**
  - `public/project-applyr-0.png` — 7684×4322, 8.6 MB
  - `public/project-shipping-crm.png` / `-0.png` — 7.5 MB each
  - `public/project-applyr-1..12.png` — ~5 MB each
  - `public/project-url-shortener-1..4.png` — 2872×2384, ~1 MB each
- **Why it hurts:**
  - Next.js's default image optimizer has to **decode a 7684×4322 PNG on the server**
    to serve *every* derived width (AVIF/WebP). That's slow first-byte, high memory,
    and on Vercel it burns image-optimization credits.
  - Full-screen screenshots are rendered at `sizes="90vw"` / up to ~1600 px wide, yet
    the source is 4000–7684 px. The browser downloads/decodes far more pixels than it
    ever paints.
  - On mid-range laptops the decode + paint of a 7684×4322 image (even resized) causes
    jank, especially inside the scroll-pinned gallery.
- **Fix:**
  1. **Re-encode everything as WebP/AVIF** (screenshots: AVIF quality ~50, or WebP q~75;
     diagrams: PNG is fine if already small). Target dimensions: **≤ 2880 px** on the
     long edge for hero/card art, **≤ 1920 px** for gallery shots.
  2. Batch-convert locally, e.g. with `cwebp`/`avifenc`/`sips`/`sharp`:
     ```bash
     # WebP example (sharp CLI or ImageMagick):
     magick public/project-applyr-0.png -resize 2880x -quality 75 public/project-applyr-0.webp
     ```
  3. Update the `src` strings in `app/lib/projects.ts`, `app/components/ui/glowingeffectgrid-section.tsx`,
     `app/page.tsx`, and the memoji refs to the new extensions.
  4. Keep the `formats: ["image/avif","image/webp"]` config in `next.config.ts`.
- **Effort:** Medium (mostly mechanical; one conversion pass + `src` edits).
- **Expected win:** 60–90% smaller images → much faster page loads, gallery, and scroll.

### A2. 🔴 Gallery images are all `loading="eager"`

- **File:** `app/components/project/project-gallery.tsx` → `Frame()`
- **Code:**
  ```tsx
  <Image ... fill loading="eager" sizes="(max-width: 768px) 85vw, 90vw" />
  ```
- **Why it hurts:** Applyr has 13 shots, SLA Monitor 7. On those pages the browser
  fetches **every screenshot at once** on mount. With the current multi-MB PNGs this is
  a multi-second, memory-heavy first paint. (The comment "mount every frame up front"
  is precisely the problem on mid-range devices.)
- **Fix:** Keep the *first* shot `priority` + `eager`, and lazy-load the rest:
  ```tsx
  loading={index === 0 ? "eager" : "lazy"}
  priority={index === 0}
  ```
  The pinned strip is off-screen for the first shot anyway, so lazy images still load
  before they're needed.
- **Effort:** Tiny.
- **Expected win:** Large — project pages stop downloading all screenshots up front.

### A3. 🟠 Fonts load more weights than the design uses

- **File:** `app/fonts.ts`
- **Code:** `IBM_Plex_Mono` requests **5 weights** (`100,200,300,400,500`), `Unbounded`
  requests **4** (`200,400,500,700`), plus `DM_Serif_Display`.
- **Why it hurts:** Each weight is a separate font file. Most of those weights appear
  only once or twice in the UI (thin italic accents, etc.).
- **Fix:** Trim to the weights actually used (audit `font-weight`/`font-thin`/`font-medium`
  usage). Typical result: IBM `300,400,500`, Unbounded `200,400,700`, DM Serif `400`.
  Re-verify headings don't regress.
- **Effort:** Small.
- **Expected win:** Fewer font requests, less layout-shift risk, smaller initial CSS.

### A4. 🟢 Duplicate SVG gradient IDs across components

- **Files:** `app/components/ui/backgroundbeams-bit.tsx` and
  `app/components/ui/staticbackgroundbeams-bit.tsx` both define
  `id="paint0_radial_242_278"`.
- **Why it matters:** The home hero renders *both* SVGs at once; duplicate IDs can make
  the second SVG resolve its `url(#...)` to the first definition (or fail), producing
  subtle visual bugs and invalid HTML. Not a big perf cost, but worth fixing while here.
- **Fix:** Make IDs unique (e.g. suffix with the component name), or share a single
  `<defs>`/symbol.

---

## B. JavaScript bundle & code-splitting

### B1. 🔴 `dicons` imports the entire icon library (~3.3 MB chunk)

- **Files:**
  - `app/components/ui/highlighter-section.tsx` → `import { DIcons } from "dicons";`
  - `app/components/page/contact.tsx` → `import { DIcons } from "dicons";`
- **Used icons:** `Designali`, `Mail`, `LinkedIn`, `ArrowUpRight` (4 icons).
- **Why it hurts:** `dicons` ships as a single `dist/esm/dicons.js` with no per-icon
  tree-shaking, so the whole library lands in the bundle. It is the **largest JS chunk**
  in the build (~3.3 MB in dev; still large minified in prod).
- **Fix:** Delete the `dicons` dependency and use `lucide-react` (already a dependency)
  or inline SVGs:
  ```tsx
  // instead of DIcons.Mail / DIcons.LinkedIn / DIcons.ArrowUpRight
  import { Mail, Linkedin, ArrowUpRight } from "lucide-react";
  ```
  For `DIcons.Designali` (a logo mark), paste a small inline SVG once.
- **Effort:** Small (4 call sites).
- **Expected win:** Remove ~3 MB from the client JS bundle — the biggest single JS win.

### B2. 🟠 Heavy animation libraries are loaded on every page, with no code-splitting

- **Files:** `app/components/ui/splittext-bit.tsx` (GSAP + ScrollTrigger + SplitText),
  `app/components/ui/aurora-bit.tsx` (ogl), `app/components/utilities/SmoothScroll.tsx`
  (lenis), plus Motion throughout.
- **Why it hurts:** GSAP SplitText + ScrollTrigger and ogl are large, and they're pulled
  into the shared client graph via the home page / project pages. Pages that don't need
  them still pay for them. Running **two** animation systems (GSAP + Motion) also
  duplicates scheduling/compositing work.
- **Fix (incremental, low risk):**
  1. Dynamically import the heavy bits so they're fetched only when needed:
     ```tsx
     // e.g. in the aurora wrapper
     const Aurora = dynamic(() => import("./aurora-bit"), { ssr: false });
     ```
     and apply the same to `SplitText` where it's below the fold.
  2. Longer term: consolidate on **one** animation library (Motion is already used
     everywhere and has `ScrollTrigger`-style via `useScroll`; or stay on GSAP and drop
     Motion). Pick one to reduce total JS.
- **Effort:** Medium (dynamic imports are easy; consolidation is larger).
- **Expected win:** Smaller initial JS, faster hydration on mid-range CPUs.

### B3. 🟡 `motion` is imported from a broad barrel in many files

- **Files:** most `motion/react` imports pull `motion`, `useScroll`, `useTransform`,
  `AnimatePresence`, etc. This is generally fine, but combined with B2 it adds up.
- **Fix:** Keep, but revisit once B1/B2 are done — after removing `dicons` and
  code-splitting, re-measure with `@next/bundle-analyzer` before micro-optimizing.

---

## C. Runtime animation / main-thread & GPU pressure

### C1. 🔴 Aurora WebGL runs a full-screen fragment shader with no resolution/quality caps

- **File:** `app/components/ui/aurora-bit.tsx`
- **Why it hurts:**
  - A per-pixel `snoise` fragment shader runs every frame at full canvas resolution,
    with `antialias: true` and no device-pixel-ratio or resolution cap.
  - There is **no `prefers-reduced-motion` check** and no device-tier check — it runs
    identically on a 4K desktop and a weak iGPU.
  - It's mounted on the home hero, the catalogue hero, and the 404 page.
- **Fix:**
  1. Cap resolution: render at ~0.5–0.66× of the element and let CSS upscale:
     ```ts
     const scale = 0.6;
     renderer.setSize(width * scale, height * scale);
     gl.canvas.style.width = `${width}px`;
     gl.canvas.style.height = `${height}px`;
     ```
  2. Honor `prefers-reduced-motion`: render one static frame and stop the rAF loop.
  3. Optionally add a `navigator.hardwareConcurrency` / `deviceMemory` gate to skip the
     WebGL entirely on weak devices and fall back to a CSS gradient.
- **Effort:** Small–Medium.
- **Expected win:** Much lower GPU load during the hero — the most visible jank source.

### C2. 🟠 BackgroundBeams animates ~50 infinite Framer-Motion gradients

- **File:** `app/components/ui/backgroundbeams-bit.tsx`
- **Why it hurts:** When in view, ~50 `motion.linearGradient` elements each run an
  infinite `x1/x2/y1/y2` animation with per-beam delays/durations. That's ~50
  continuously-updated SVG attributes per frame, driven by JS, on the "About" section.
  It also re-renders the same paths twice (backdrop + per-beam).
- **Fix:**
  1. Reduce `intensity` / beam count (the section uses the default of *all* 50+ paths).
  2. Replace the JS-driven gradient animation with a **single CSS-animated SVG** or a
     `background-image` keyframe (the project already uses CSS `gradient-pan-x` for
     GradientText — reuse the same pattern).
  3. Or render the animated version only when `inView` and above the `lg` breakpoint
     (it's already hidden on mobile, but still animates on every tablet/desktop).
- **Effort:** Medium.
- **Expected win:** Noticeable main-thread relief while the About section is on screen.

### C3. 🔴 `ScrollText` creates ~200 motion values + blur filters per paragraph

- **File:** `app/components/ui/scrolltext.tsx`
- **Why it hurts:**
  - Every word becomes a `motion.span` with its own `useTransform` for `opacity`, `y`,
    and a **blur filter** (the code comment admits "~200 of them"). Blur forces each
    word onto its own compositing layer → huge memory/GPU cost and jank while scrolling.
  - It's used on the home page **and** every project backstory (3–5 paragraphs each),
    so a project page can render **~600 animated word spans**.
- **Fix:**
  1. Replace per-word blur with **opacity + a small translate only** (no `filter`), or
     better, a single per-line/per-block reveal.
  2. Or use the existing `AnimatedContainer` (whileInView, once) per paragraph instead
     of per-word.
  3. If the per-word effect is desired, cap it to one section and drop `filter` blur.
- **Effort:** Medium.
- **Expected win:** Big scroll-performance gain on the longest, most content-heavy pages.

### C4. 🟠 `HoverBorderGradient` runs a blurred gradient rotation timer per instance

- **File:** `app/components/utilities/hoverbordergradient.tsx`
- **Why it hurts:** Each instance has a `setInterval` (default 1 s) that flips an animated
  `background` on a `filter: blur(20px)` element. `blur(20px)` over a rounded element is
  GPU-expensive; the contact page, project actions, and closers each mount several.
- **Fix:** Replace the `blur(20px)` gradient loop with a CSS `@property`-based rotating
  conic gradient (GPU-composited, no JS timer), or a static border. Remove the interval.
- **Effort:** Medium.
- **Expected win:** Less continuous work + fewer expensive blur layers.

### C5. 🟡 `GlowingEffect` (5 cards on home) tracks pointer + scroll with rAF

- **File:** `app/components/ui/glowingeffectgrid-bit.tsx`
- **Why it hurts:** Each card adds `pointermove` + `scroll` listeners and drives a
  conic-gradient mask via Motion's `animate()` + `after:bg-fixed`. `background-attachment:
  fixed`-style effects are costly on integrated GPUs, and 5 cards multiply it.
- **Fix:** Debounce/throttle the pointer handler (it already rAF-coalesces, good), and
  consider disabling the effect below `lg`, or replacing with a hover-only CSS transition
  on the card. At minimum add a `prefers-reduced-motion` short-circuit.
- **Effort:** Small–Medium.
- **Expected win:** Smoother hover/scroll over the "Project Catalogue" grid.

### C6. 🟡 Lenis `autoRaf` runs globally on every page + conflicts with CSS smooth scroll

- **File:** `app/components/utilities/SmoothScroll.tsx`, `app/globals.css`
- **Why it hurts:** Lenis adds a perpetual rAF loop on every route (mounted in the root
  layout), and `globals.css` also sets `scroll-behavior: smooth`, which can fight Lenis's
  own scrolling and cause double-smoothing. The gallery lightbox locks
  `document.documentElement.style.overflow`, which Lenis also reads/writes.
- **Fix:** Pick one. If keeping Lenis: remove `html { scroll-behavior: smooth }`, respect
  `prefers-reduced-motion` (skip Lenis), and add `data-lenis-prevent` where it's already
  used. If dropping Lenis: remove the component and keep native CSS smooth scroll.
- **Effort:** Small.
- **Expected win:** One fewer global rAF; fewer scroll conflicts.

### C7. 🟡 `InfiniteGrid` runs a constant animation-frame loop + global pointer/touch listeners

- **File:** `app/components/ui/bg-infinitegrid.tsx`
- **Why it hurts:** On the contact page a fixed full-screen grid uses `useAnimationFrame`
  (always running, even idle) plus `pointermove`/`touchmove` listeners on `window`.
- **Fix:** Pause the loop when the tab is hidden / grid isn't in view (it's fixed, so it's
  always "visible" — gate behind `prefers-reduced-motion` and consider static grid on
  mobile), and attach pointer listeners to the grid element instead of `window`.
- **Effort:** Small.
- **Expected win:** Less idle CPU on the contact page.

### C8. 🟡 Several `setInterval` / infinite loops accumulate

- **Files:** `hoverbordergradient.tsx` (interval), `stateful-button.tsx` (interval),
  `contact.tsx` → `useMarrakechClock` (1 s interval), `logoloop-bit.tsx` (rAF),
  `pillnav-bit.tsx` (IntersectionObserver with 101 thresholds + image luminance sampling).
- **Fix:** Leave the ones that are user-triggered, but:
  - Throttle the clock to 1 Hz only while the contact page is visible.
  - Reduce the `pillnav` IntersectionObserver threshold list from 101 entries to a few
    coarse steps.
- **Effort:** Small.

---

## D. Specific component issues

### D1. 🟠 `PillNav` samples luminance of every image on the page

- **File:** `app/components/page/pillnav-bit.tsx` (`imageLuminance`, `considerImage`)
- **Why it hurts:** It attaches a capture-phase `load` listener and, for every complete
  `<img>` on the page (including the huge screenshots), does a synchronous
  `drawImage` + `getImageData` on a canvas. On a project page with 13 screenshots this is
  repeated decode + readback work after the images load.
- **Fix:** Only sample the images the feature actually needs (the nav's own memoji, or a
  small allow-list), or sample only images above a size/`data-` marker. Skip
  `naturalWidth > 2000` images.
- **Effort:** Small.
- **Expected win:** Removes redundant decode/readback after image load.

### D2. 🟡 `LogoLoop` duplicates every logo (gray + color twin) and runs a rAF loop

- **File:** `app/components/ui/logoloop-bit.tsx`
- **Why it hurts:** 18 logos × 2 (gray + color) × ≥2 copies = 70+ `<img>` nodes in a
  marquee with a continuous rAF transform. It's SVG (small), but the node count and
  per-frame transform on a wide strip add up, and the color twin loads eagerly.
- **Fix:** Only render the color twin on demand (it's already lazy but present in DOM);
  consider `content-visibility: auto` on off-screen copies, and keep the existing
  off-screen rAF pause (already implemented).
- **Effort:** Small.

### D3. 🟡 `AnimatedContainer` animates `filter: blur` on many large sections

- **File:** `app/components/utilities/animated-container.tsx`
- **Why it hurts:** `blur(4px) → blur(0px)` on whole sections forces large compositing
  layers during reveal. Used heavily across the site.
- **Fix:** Drop `filter` from the animation (keep opacity + translate), or set
  `filter: none` once complete (Motion leaves `blur(0px)` inline, which keeps the layer
  alive — see the comment in `contact.tsx` about exactly this).
- **Effort:** Small.
- **Expected win:** Fewer persistent compositing layers, less memory.

### D4. 🟢 `SplitText` splits headline text into chars with `force3D` + `will-change`

- **File:** `app/components/ui/splittext-bit.tsx`
- **Why it hurts:** `willChange: 'transform, opacity'` and `force3D: true` on every
  character of large headlines promotes many layers. Acceptable for a hero, but there are
  two (`home` + `contact`) plus the nav.
- **Fix:** Remove `force3D`/`willChange` (or clear `willChange` after the tween completes)
  and rely on the once-only animation. Minor.

---

## E. Accessibility & reduced-motion gaps

- **Aurora** (`aurora-bit.tsx`) does **not** respect `prefers-reduced-motion` and always
  runs the WebGL loop. → Gate it like the other components already do.
- **Lenis** (`SmoothScroll.tsx`) does not check `prefers-reduced-motion`. → Skip when set.
- **InfiniteGrid** and **GlowingEffect** have no reduced-motion fallback. → Add one.
- **Consistency:** many components *do* check (`useReducedMotion` in Motion components,
  `matchMedia` in `logoloop`, `backgroundbeams`, etc.). Bring the stragglers in line.
- These also matter because reduced-motion users on weak hardware are exactly the cohort
  most affected by the continuous loops.

---

## F. Repo / build hygiene

### F1. 🟠 `public/` (119 MB) is committed to git — `.git` is 125 MB

- **Why it hurts:** Every image is tracked, so clone times, CI, and deploys carry ~120 MB
  of binary history that never shrinks (even after re-encoding, old blobs stay in history).
- **Fix:** After re-encoding images (A1):
  1. Move large screenshots to a CDN/S3 bucket (the repo already references an S3 resume),
     or use Git LFS.
  2. Rewrite history to purge the old PNG blobs (`git filter-repo`) **only if** the repo
     is private / you accept the force-push implications.
- **Effort:** Medium (after A1).
- **Expected win:** Faster clones/deploys, cleaner repo.

### F2. 🟢 `.env` is correctly gitignored

- Confirmed not tracked. Keep it that way; the `RESEND_FIRST_API_KEY` stays local. ✅

### F3. 🟢 Add a bundle analyzer to prevent regressions

- **Fix:** Add `@next/bundle-analyzer` and run it in CI (or locally) after each change.
  Track: total JS, the `dicons` chunk (should be gone), and largest image requests.

---

## Prioritized implementation checklist

**Wave 1 — quick wins (do first):**
- [ ] B1 — Remove `dicons`, use `lucide-react`/inline SVG (4 call sites).
- [ ] A2 — `loading={index === 0 ? "eager" : "lazy"}` + `priority` on first gallery shot.
- [ ] A3 — Trim unused font weights in `app/fonts.ts`.
- [ ] C6 — Remove `scroll-behavior: smooth` (or Lenis); add reduced-motion skip to Lenis.
- [ ] D3 — Remove `filter: blur` from `AnimatedContainer`.

**Wave 2 — the big asset & runtime wins:**
- [ ] A1 — Re-encode all `project-*.png` to WebP/AVIF ≤ 2880 px; update `src` refs.
- [ ] C1 — Cap Aurora resolution + reduced-motion gate (or CSS fallback on weak devices).
- [ ] C3 — Rewrite `ScrollText` to drop per-word blur (per-line/block reveal).
- [ ] C2 — Cut BackgroundBeams to CSS animation / fewer beams.

**Wave 3 — refinement:**
- [ ] B2 — `dynamic()` import Aurora/SplitText; plan single-animation-library consolidation.
- [ ] C4 — Replace `HoverBorderGradient` blur timer with a CSS conic border.
- [ ] C5/C7 — Add reduced-motion + debounce gates to `GlowingEffect` and `InfiniteGrid`.
- [ ] D1 — Narrow `PillNav` luminance sampling.
- [ ] A4 — Deduplicate SVG gradient IDs.
- [ ] F1 — Move images to CDN/LFS; (optionally) rewrite history.
- [ ] F3 — Add `@next/bundle-analyzer` to CI.

**Wave 4 — polish:**
- [ ] D2/D4 — LogoLoop `content-visibility`; clear `willChange` after SplitText completes.
- [ ] C8 — Throttle clock/interval loops.

---

## How to verify after each wave

1. **Build & analyze:** `npm run build` + bundle analyzer → confirm `dicons` chunk is gone
   and total JS dropped.
2. **Lighthouse (mobile, mid-tier CPU throttle):** target LCP < 2.5 s, TBT < 200 ms,
   CLS < 0.1.
3. **Manual:** scroll the home page, an Applyr/SLA project page, and the contact page on a
   mid-range laptop — the hero should stay 60 fps, gallery should not stutter, and the
   "More About me"/backstory paragraphs should scroll smoothly.
4. **DevTools Performance panel:** confirm no idle rAF/interval spikes when the tab is
   backgrounded or scrolled away from animated sections.
