import Link from "next/link";
import { MoveRight } from "lucide-react";

import { colors } from "./lib/colors";

import AuroraSection from "./components/ui/aurora-section";
import LogoLoopSection from "./components/ui/logoloop-section";
import SplitTextSection from "./components/ui/splittext-section";
import PillNav from "./components/page/pillnav-bit";
import { SectionHeading } from "./components/page/section-heading";
import BackgroundBeamsSection from "./components/ui/backgroundbeams-section";
import StaticBackgroundBeamsSection from "./components/ui/staticbackgroundbeams-section";
import GlowingEffectSection from "./components/ui/glowingeffectgrid-section";
import { ScrollText } from "./components/ui/scrolltext";
import { AccordionSection } from "./components/ui/accordion-items";
import { HighlighterSection } from "./components/ui/highlighter-section";
import { ClipPathLinks } from "./components/ui/skils-clippathlinks";
import { Footer } from "./components/page/footer-section";
import { AnimatedContainer } from "./components/utilities/animated-container";

const walid_1 = "/walid_memoji_face1.png";
const walid_2 = "/walid_memoji_facewmac.png";

export default function Home() {
  return (
    <>
      <section className="fixed inset-x-0 top-0 flex items-center justify-center px-6 xl:px-16 z-90">
        <div className="flex justify-around px-1 lg:px-1 font-ibm font-weight-500">
          <PillNav
            logos={[walid_1, walid_2]}
            logoAlt="Walid"
            items={[
              { label: 'About', href: '#about' },
              { label: 'Projects', href: '#projects' },
              { label: 'Contact', href: '/contact' }
            ]}
            activeHref="/"
            className="custom-nav"
            ease="power2.easeOut"
            baseColor="#0d0d0d99"
            pillColor="transparent"
            hoveredPillTextColor={colors.beige_bright}
            pillTextColor={colors.slate}
            heroPillTextColor={colors.beige_bright}
            initialLoadAnimation
          />
        </div>
      </section>

      <section id="home" className="flex relative w-full h-screen flex-col items-center justify-between p-0 bg-black">
        <div className="absolute z-0 w-full h-full">
          <AuroraSection />
          <StaticBackgroundBeamsSection />
        </div>

        <div className="relative z-1 px-10 flex items-center justify-center h-full w-full max-w-7xl">
          <SplitTextSection />
        </div>
      </section>

      <section id="about" className="pt-4 md:min-h-[95vh] md:pt-6 w-full px-4 md:px-10 lg:px-15 outline-red-500">
        <div className="z-10 relative w-full h-full flex flex-col items-center justify-center outline-green-500">
          <BackgroundBeamsSection />

          <SectionHeading animationSpeed={3}>The Big Picture</SectionHeading>

          <section className="z-1 flex justify-center items-center h-full w-full mt-3 md:mt-4 outline-cyan-500">
            <div className="flex flex-col mx-auto w-[90vw] md:flex-row px-2 sm:px-6 md:px-10 pt-6 pb-2 md:py-40 outline-purple-600">
              <AnimatedContainer duration={2} initialY={100}>
                <AccordionSection />
              </AnimatedContainer>
            </div>
          </section>
        </div>
      </section>

      <section id="logoloop" className="no-scrollbar mt-15">
        <div style={{ height: '110px', position: 'relative', overflow: 'hidden' }}>
          <LogoLoopSection />
        </div>
      </section>

      <section id="projects">
        <div className="min-h-[55vh] pt-4 md:pt-6 w-full px-4 md:px-6 lg:px-8 flex flex-col justify-center items-center outline-green-500">
          <SectionHeading animationSpeed={4} align="end" sizeClassName="text-[2.25rem]">
            Project Catalogue
          </SectionHeading>

          <section className="outline-red-500">
            <div className="w-[90vw] mx-auto my-5 py-10 flex items-center justify-center outline-purple-700">
              <GlowingEffectSection />
            </div>
          </section>

          <Link
            href="/projects"
            className="group -mt-6 mb-8 flex items-center gap-2 font-ibm text-[11px] uppercase tracking-[0.25em] text-neutral-500 transition-colors duration-300 hover:text-beige_bright"
          >
            view the full catalogue
            <MoveRight
              className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1.5"
              strokeWidth={1.5}
            />
          </Link>
        </div>
      </section>

      <section id="contact">
        <div className="min-h-[15vh] pt-30 md:pt-6 w-full px-7 md:px-10 lg:px-15 flex flex-col justify-center items-center outline-green-500">
          <SectionHeading animationSpeed={4}>Get in Touch</SectionHeading>

          <div className="flex w-[90vw] max-w-4xl flex-col items-center justify-center px-2 py-12 md:my-5 md:h-[40vh] md:px-0 lg:my-15 outline-red-500">
            <HighlighterSection />
          </div>
        </div>
      </section>

      <section id="skills">
        <div className="min-h-[15vh] pt-30 md:pt-6 w-full px-7 md:px-10 lg:px-15 flex flex-col justify-center items-center outline-green-500">
          <SectionHeading animationSpeed={4} align="end" sizeClassName="text-[2.5rem]">
            Applied Technologies
          </SectionHeading>
        </div>

        <div className="mx-auto my-15 py-10 flex w-[90vw] items-center justify-center px-2 md:px-4 outline-red-500">
          <AnimatedContainer duration={1.8} className="w-full">
            <ClipPathLinks />
          </AnimatedContainer>
        </div>
      </section>

      <section id="info">
        <div className="min-h-[15vh] pt-4 md:pt-6 w-full px-7 md:px-10 lg:px-15 flex flex-col justify-center items-center outline-green-500">
          <SectionHeading animationSpeed={2}>More About me</SectionHeading>

          <div className="mt-10 mb-50 md:my-6 lg:mb-30 xl:my-10 lg:w[80vw] xl:w-[75vw] lg:my-4 mx-auto outline-red-500">
            <AnimatedContainer duration={3} delay={0.0}>
              <ScrollText text={`I'm Walid, a software engineering student at Cadi Ayyad University in Marrakech, currently in the engineering cycle specializing in computer networks and information systems.
                        I work across the stack. On the frontend I focus on clean, functional interfaces. On the backend and infrastructure side, I've spent a lot of time learning Cloud Computing Essentials with AWS, building and deploying real projects using serverless architecture, cloud storage, and infrastructure as code. I enjoy both sides and I've found that working across them makes me a better engineer overall.
                        Outside of university I invest a lot of time in self-directed learning. I've completed coursework through Cisco Networking Academy and AWS Skill Builder and AWS Educate, covering networking fundamentals, cloud architecture, and core AWS services. I'm currently preparing for the AWS Certified Cloud Practitioner certification, expected in 2027. I've also done coursework  in machine learning, Python, SQL, and project management through Udemy.
                        I'm at an early stage in my career, but I take it seriously. The projects here are things I built out of genuine interest, and I'm always working on something new.`}
                lineBreakSpacing={15}
              />
            </AnimatedContainer>
          </div>
        </div>
      </section>

      <footer>
        <div className="relative flex flex-col justify-end pt-20 mt-60 w-screen h-auto">
          <Footer />
        </div>
      </footer>
    </>
  );
}
