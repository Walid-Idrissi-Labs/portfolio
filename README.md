# Walid Idrissi — Portfolio

[![Live](https://img.shields.io/badge/demo-live-brightgreen?style=flat-square)](https://walid-idrissi.vercel.app/)
![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-19-149ECA?style=flat-square&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
[![License](https://img.shields.io/badge/license-All_Rights_Reserved-red?style=flat-square)](./LICENSE)

Personal portfolio site built with Next.js — a project catalogue with individual case-study pages, a contact form, and a "request a demo" flow, wrapped in a heavily animated, WebGL-flavored UI.

**Live at [walid-idrissi.vercel.app](https://walid-idrissi.vercel.app/)**

## Tech stack

- **Framework:** [Next.js 16](https://nextjs.org) (App Router) + React 19 + TypeScript
- **Styling:** Tailwind CSS 4, [Radix UI](https://www.radix-ui.com) primitives, `class-variance-authority`
- **Motion:** GSAP, [Motion](https://motion.dev), [Lenis](https://lenis.darkroom.engineering) for smooth scrolling
- **Graphics:** [ogl](https://github.com/oframe/ogl) for lightweight WebGL effects
- **Email:** [Resend](https://resend.com) for the contact form and demo requests
- **Icons:** Lucide, Dicons

## Project structure

```
app/
├── api/
│   ├── send/            # Contact form submission handler
│   └── request-demo/    # "Request a demo" submission handler
├── components/
│   ├── page/             # Landing-page sections (hero, contact, footer, ...)
│   ├── project/          # Project case-study page building blocks
│   ├── catalogue/        # Project index/grid
│   ├── ui/                # Larger composed UI blocks and animated bits
│   └── utilities/         # Low-level shared components (buttons, inputs, ...)
├── lib/
│   ├── projects.ts       # Single source of truth for project case studies
│   ├── resend.ts         # Resend client
│   └── colors.ts / glass.ts / utils.ts
├── projects/[slug]/      # Dynamic project case-study route
└── contact/              # Contact page
```

Adding a new project case study is a matter of adding one entry to `app/lib/projects.ts` and dropping its screenshots into `public/`.

## License

Code and content are © Walid Idrissi — all rights reserved. See [LICENSE](./LICENSE).
