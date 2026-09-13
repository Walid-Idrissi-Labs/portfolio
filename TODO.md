# TODO

- [ ] **Section heading `lg` size is ignored** — `app/components/page/section-heading.tsx:20` has `lg:text-[4.4]` (missing `rem`), which generates invalid CSS, so `lg` screens fall back to the `md` size (3.8rem) until `xl`. Fixing it to `lg:text-[4.4rem]` will make headings visibly larger on `lg`, so check the look before shipping.
- [ ] **Check borderless GradientText titles on Windows** — the big titles on `/projects`, `/projects/[slug]` (`project-hero.tsx`) and the 404 page use `GradientText` with `showBorder={false}`. Its wrapper has `overflow-hidden` with no padding, and the `h1`s use `leading-[1.05]`, so glyph edges/descenders could be clipped there. Unverified — look on a Windows screen and fix only if it shows.
