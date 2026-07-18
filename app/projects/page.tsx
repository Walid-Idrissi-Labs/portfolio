import type { Metadata } from "next";
import Link from "next/link";

import PillNav from "../components/page/pillnav-bit";
import GradientText from "../components/page/gradienttext-bit";
import { Footer } from "../components/page/footer-section";
import Aurora from "../components/ui/aurora-bit";
import StaticBackgroundBeamsSection from "../components/ui/staticbackgroundbeams-section";
import { AnimatedContainer } from "../components/utilities/animated-container";
import { CatalogueIndex } from "../components/catalogue/catalogue-index";
import { ProjectCloser } from "../components/project/project-closer";
import { colors } from "../lib/colors";
import { projects } from "../lib/projects";

const walid_1 = "/walid_memoji_face1.png";
const walid_2 = "/walid_memoji_facewmac.png";

const titleColors = [colors.beige_dark, colors.slate, colors.beige_bright];
const auroraColors = [colors.beige_bright, "#ffffff", colors.slate];

export const metadata: Metadata = {
  title: "Project Catalogue — Walid Idrissi",
  description:
    "The full index of projects by Walid Idrissi — cloud architecture, terminal tools, and full-stack work, each with its own case study.",
};

export default function CataloguePage() {
  const entryCount = String(projects.length).padStart(3, "0");
  const inProgressCount = String(projects.filter((p) => p.status === "in-progress").length).padStart(3, "0");

  return (
    <>
      <section className="w-full flex items-center justify-center px-6 xl:px-16 md:fixed z-90">
        <div className="flex justify-around px-1 lg:px-1 font-ibm font-weight-500">
          <PillNav
            logos={[walid_1, walid_2]}
            logoAlt="Walid"
            items={[
              { label: "About", href: "/#about" },
              { label: "Projects", href: "/projects" },
              { label: "Contact", href: "/#contact" },
            ]}
            activeHref="/projects"
            className="custom-nav"
            ease="power2.easeOut"
            baseColor="#0d0d0d99"
            pillColor="transparent"
            hoveredPillTextColor={colors.beige_bright}
            pillTextColor={colors.slate}
            heroPillTextColor={colors.beige_bright}
            heroSelector="#catalogue-hero"
            initialLoadAnimation
          />
        </div>
      </section>

      <section
        id="catalogue-hero"
        className="relative flex min-h-[55svh] w-full flex-col justify-end overflow-hidden bg-black pb-12 md:pb-16"
      >
        <div aria-hidden="true" className="absolute inset-0 z-0">
          {/* Same waves as the home hero, turned way down: calmer motion,
              lower crest, and faded so the header stays quiet. */}
          <div className="absolute inset-0 opacity-40">
            <Aurora colorStops={auroraColors} blend={0.99} amplitude={0.22} speed={0.55} />
          </div>
          <StaticBackgroundBeamsSection />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black" />
        </div>

        <div className="absolute inset-x-0 top-6 z-20 flex items-center px-6 md:top-28 md:px-10">
          <Link
            href="/"
            className="group flex items-center gap-2 font-ibm text-[11px] uppercase tracking-[0.25em] text-neutral-400 transition-colors duration-300 hover:text-beige_bright"
          >
            <span aria-hidden="true" className="transition-transform duration-300 group-hover:-translate-x-1">
              ←
            </span>
            home
          </Link>
        </div>

        <div className="relative z-10 mx-auto w-full max-w-7xl px-6 md:px-10">
          <AnimatedContainer duration={1.2} initialY={18}>
            <p className="font-ibm text-[10px] uppercase tracking-[0.35em] text-slate md:text-xs">
              the full index
            </p>
          </AnimatedContainer>
          <AnimatedContainer duration={1.4} delay={0.15} initialY={22}>
            <h1 className="mt-4 w-fit font-unbounded text-[2.4rem] leading-[1.05] sm:text-6xl md:mt-6 md:text-7xl">
              <GradientText colors={titleColors} animationSpeed={4} showBorder={false}>
                Project Catalogue
              </GradientText>
            </h1>
          </AnimatedContainer>
          <AnimatedContainer duration={1.4} delay={0.3} initialY={18}>
            <p className="mt-4 font-ibm text-[10px] uppercase tracking-[0.25em] text-neutral-500 md:mt-6 md:text-xs">
              {entryCount} entries · {inProgressCount} in progress · more compiling
            </p>
          </AnimatedContainer>
        </div>
      </section>

      <main className="relative z-1">
        <section className="w-full px-6 pt-10 md:px-10 md:pt-16 lg:px-15">
          <CatalogueIndex projects={projects} />
        </section>
      </main>

      <ProjectCloser kicker={`end of the catalogue... for now`} showCatalogueLink={false} />

      <footer>
        <div className="relative flex h-auto w-screen flex-col justify-end pt-20">
          <Footer />
        </div>
      </footer>
    </>
  );
}
