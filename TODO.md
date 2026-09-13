# TODO

- [ ] **Upgrade Next.js 16.1.6 → 16.3.5 (security, do first)** — `npm audit` flags 30 advisories on the
  installed `next`, including two critical RCEs:
  [GHSA-2xp9-vwfh-vxw4](https://github.com/advisories/GHSA-2xp9-vwfh-vxw4) (Image Optimization API when
  AVIF is used — `next.config.ts` enables AVIF) and
  [GHSA-p293-qw3h-jr36](https://github.com/advisories/GHSA-p293-qw3h-jr36) (Windows-hosted servers).
  16.3.5 is a non-breaking minor bump; also run `npm audit fix` for the 8 transitive advisories
  (postcss, sharp, nanoid, …) and re-check the build.
- [ ] **Section heading `lg` size is ignored** — `app/components/page/section-heading.tsx:20` has `lg:text-[4.4]` (missing `rem`), which generates invalid CSS, so `lg` screens fall back to the `md` size (3.8rem) until `xl`. Fixing it to `lg:text-[4.4rem]` will make headings visibly larger on `lg`, so check the look before shipping.
- [ ] **Check borderless GradientText titles on Windows** — the big titles on `/projects`, `/projects/[slug]` (`project-hero.tsx`) and the 404 page use `GradientText` with `showBorder={false}`. Its wrapper has `overflow-hidden` with no padding, and the `h1`s use `leading-[1.05]`, so glyph edges/descenders could be clipped there. Unverified — look on a Windows screen and fix only if it shows.
- [ ] **Home project card descriptions still use the system font** — `app/components/ui/glowingeffectgrid-section.tsx:141` uses `font-sans`, which is San Francisco on Mac and Segoe UI on Windows. The titles were moved to Unbounded; pick a loaded font for the descriptions too (IBM Plex Mono or Unbounded extralight fit the rest of the site).
- [ ] **Dead `-tracking-4` class on project card titles** — `glowingeffectgrid-section.tsx:138`; it isn't a valid Tailwind utility and generates no CSS. Remove it, or replace it with a real one (e.g. `tracking-tight`) if tighter spacing is wanted.
- [ ] **`metadataBase` not set** — every build warns that Open Graph/Twitter image URLs resolve against `http://localhost:3000`. Set `metadataBase: new URL("https://<production domain>")` in `app/layout.tsx` before adding OG images.
