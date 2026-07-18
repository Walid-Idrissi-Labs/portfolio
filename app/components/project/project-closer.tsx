import Link from "next/link";
import { File, Github, Linkedin, Mail, MoveRight } from "lucide-react";

import { AnimatedContainer } from "../utilities/animated-container";
import { HoverBorderGradient } from "../utilities/hoverbordergradient";

const socialLinks = [
  { label: "Email", href: "mailto:walid.idrissi.labs@gmail.com", icon: Mail },
  { label: "GitHub", href: "https://github.com/walid-idrissi-labs", icon: Github },
  { label: "LinkedIn", href: "https://linkedin.com/in/walid-idrissi-labkhati", icon: Linkedin },
  {
    label: "Resume",
    href: "https://walid-idrissi-resume.s3.us-west-2.amazonaws.com/walid-idrissi-labkhati-resume.pdf",
    icon: File,
  },
];

// Closing conversion CTA: the page ends on "talk to me" — with a quiet path
// to the catalogue for browsers (hidden on the catalogue page itself).
export function ProjectCloser({
  kicker,
  showCatalogueLink = true,
}: {
  kicker: string;
  showCatalogueLink?: boolean;
}) {
  return (
    <section className="relative mt-24 overflow-hidden border-t border-white/10 bg-[radial-gradient(45%_180px_at_50%_0%,rgba(242,230,216,0.07),transparent)] md:mt-32">
      <div className="mx-auto flex w-full max-w-4xl flex-col items-center gap-8 px-6 py-24 text-center md:gap-10 md:py-32">
        <AnimatedContainer initialY={16} duration={1.2}>
          <p className="font-ibm text-[10px] uppercase tracking-[0.35em] text-slate md:text-xs">
            {kicker}
          </p>
        </AnimatedContainer>

        <AnimatedContainer initialY={20} duration={1.4} delay={0.15}>
          <h2 className="font-unbounded text-[1.9rem] leading-snug text-faint_white sm:text-4xl md:text-5xl">
            Like what you saw?
            <br />
            <span className="bg-gradient-to-r from-beige_dark via-slate to-beige_bright bg-clip-text text-transparent">
              Let&apos;s build something together.
            </span>
          </h2>
        </AnimatedContainer>

        <AnimatedContainer initialY={20} duration={1.4} delay={0.3}>
          <p className="max-w-xl font-unbounded font-extralight text-sm leading-relaxed text-neutral-400 md:text-base">
            I&apos;m open to opportunities, collaborations, and good conversations — if this project
            sparked an idea, my inbox is the shortest path to it.
          </p>
        </AnimatedContainer>

        <AnimatedContainer initialY={20} duration={1.4} delay={0.45}>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/Contact">
              <HoverBorderGradient
                as="div"
                containerClassName="rounded-full"
                className="flex items-center gap-2 bg-black px-7 py-3 font-ibm text-xs uppercase tracking-[0.15em] text-faint_white md:text-sm"
              >
                <Mail className="h-4 w-4" strokeWidth={1.5} />
                Get in Touch
              </HoverBorderGradient>
            </Link>
            <div className="flex items-center gap-2.5">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-black/40 text-neutral-300 transition-colors duration-300 hover:border-beige_bright/60 hover:text-beige_bright"
                >
                  <social.icon className="h-4 w-4" strokeWidth={1.5} />
                </a>
              ))}
            </div>
          </div>
        </AnimatedContainer>

        {showCatalogueLink && (
          <AnimatedContainer initialY={16} duration={1.4} delay={0.6}>
            <Link
              href="/projects"
              className="group flex items-center gap-2 font-ibm text-[11px] uppercase tracking-[0.25em] text-neutral-500 transition-colors duration-300 hover:text-beige_bright"
            >
              browse the full catalogue
              <MoveRight
                className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1.5"
                strokeWidth={1.5}
              />
            </Link>
          </AnimatedContainer>
        )}
      </div>
    </section>
  );
}
