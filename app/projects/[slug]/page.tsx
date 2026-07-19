import type { Metadata } from "next";
import { notFound } from "next/navigation";

import PillNav from "../../components/page/pillnav-bit";
import { SectionHeading } from "../../components/page/section-heading";
import { Footer } from "../../components/page/footer-section";
import { ClipPathLinks } from "../../components/ui/skils-clippathlinks";
import { AnimatedContainer } from "../../components/utilities/animated-container";
import { ProjectHero } from "../../components/project/project-hero";
import { ProjectRundown } from "../../components/project/project-rundown";
import { ProjectBackstory } from "../../components/project/project-backstory";
import { ProjectFeatures } from "../../components/project/project-features";
import { ProjectGallery } from "../../components/project/project-gallery";
import { ProjectActions } from "../../components/project/project-actions";
import { ProjectCloser } from "../../components/project/project-closer";
import { colors } from "../../lib/colors";
import { getProject, projects } from "../../lib/projects";

const walid_1 = "/walid_memoji_face1.png";
const walid_2 = "/walid_memoji_facewmac.png";

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  const title = `${project.name} — Walid Idrissi`;
  return {
    title,
    description: project.seoDescription,
    openGraph: {
      title,
      description: project.seoDescription,
      images: [project.heroImage],
    },
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

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
              { label: "Contact", href: "/contact" },
            ]}
            activeHref="/projects"
            className="custom-nav"
            ease="power2.easeOut"
            baseColor="#0d0d0d99"
            pillColor="transparent"
            hoveredPillTextColor={colors.beige_bright}
            pillTextColor={colors.slate}
            heroPillTextColor={colors.beige_bright}
            heroSelector="#project-hero"
            initialLoadAnimation
          />
        </div>
      </section>

      <ProjectHero project={project} />

      <main className="relative z-1">
        <section id="rundown" className="mx-auto w-full max-w-6xl px-6 pt-4 md:px-10 md:pt-8">
          <ProjectRundown project={project} />
        </section>

        <section id="backstory" className="w-full pt-24 md:pt-32">
          <div className="w-full px-4 md:px-10 lg:px-15">
            <SectionHeading animationSpeed={3} sizeClassName="text-[2.25rem]">
              The Backstory
            </SectionHeading>
          </div>
          <div className="mx-auto mt-10 w-full max-w-6xl px-6 md:mt-14 md:px-10">
            <ProjectBackstory paragraphs={project.background} year={project.year} />
          </div>
        </section>

        <section id="features" className="w-full pt-24 md:pt-32">
          <div className="w-full px-4 md:px-10 lg:px-15">
            <SectionHeading animationSpeed={4} align="end" sizeClassName="text-[2.25rem]">
              Under the Hood
            </SectionHeading>
          </div>
          <div className="mx-auto mt-10 w-full max-w-6xl px-6 md:mt-14 md:px-10">
            <ProjectFeatures features={project.features} />
          </div>
        </section>

        <section id="captures" className="w-full pt-24 md:pt-32">
          <div className="w-full px-4 md:px-10 lg:px-15">
            <SectionHeading animationSpeed={4} sizeClassName="text-[2.25rem]">
              In the Wild
            </SectionHeading>
          </div>
          <div className="mt-10 md:mt-14">
            <ProjectGallery slug={project.slug} shots={project.screenshots} />
          </div>
        </section>

        <section id="stack" className="w-full pt-24 md:pt-32">
          <div className="w-full px-4 md:px-10 lg:px-15">
            <SectionHeading animationSpeed={4} align="end" sizeClassName="text-[2.25rem]">
              Applied Technologies
            </SectionHeading>
          </div>
          <div className="mx-auto mt-10 w-full max-w-6xl px-6 md:mt-14 md:px-10">
            <AnimatedContainer duration={1.8} className="w-full">
              <ClipPathLinks
                rows={project.stackRows}
                colors={{
                  containerBorder: "border-border/80",
                  boxBorder: "border-border/80",
                  boxBackground: "bg-background",
                  boxText: "text-foreground",
                  overlayBackground: "bg-beige_dark",
                  overlayText: "text-black",
                  logoBase: "",
                  logoOverlay: "brightness-100 invert",
                }}
              />
            </AnimatedContainer>
          </div>
        </section>

        <section id="see-it" className="w-full pt-24 md:pt-32">
          <div className="w-full px-4 md:px-10 lg:px-15">
            <SectionHeading animationSpeed={3} sizeClassName="text-[2.25rem]">
              See It Yourself
            </SectionHeading>
          </div>
          <div className="mx-auto mt-10 w-full max-w-6xl px-6 md:mt-14 md:px-10">
            <ProjectActions project={project} />
          </div>
        </section>
      </main>

      <ProjectCloser kicker={`end of case study — ${project.name}`} />

      <footer>
        <div className="relative flex h-auto w-screen flex-col justify-end pt-20">
          <Footer />
        </div>
      </footer>
    </>
  );
}
