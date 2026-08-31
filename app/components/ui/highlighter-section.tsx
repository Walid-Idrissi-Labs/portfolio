"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "../../lib/utils";
// The four brand icons below are inlined verbatim from the `dicons` library
// (which shipped a ~3.3 MB bundle). Keeping the exact paths/fills/colors means
// the UI is unchanged while dropping that dependency.
function DesignaliMark({ className }: { className?: string }) {
  return (
    <svg aria-hidden="true" focusable="false" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={className}>
      <path strokeWidth={0} fill="currentColor" d="M2.8,1.43h7.53c3.47,0,6.15.92,8.04,2.75,1.89,1.84,2.83,4.45,2.83,7.85s-.92,5.98-2.77,7.8c-1.85,1.83-4.49,2.74-7.92,2.74H2.8V1.43Z" />
    </svg>
  );
}

function MailIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path fill="none" d="M19.48,5.87h.52c1.1,0,2,.9,2,2v12c0,1.1-.9,2-2,2H4c-1.1,0-2-.9-2-2V7.87c0-1.1.9-2,2-2h.45" />
      <path fill="none" d="M22,8.87l-8.97,5.7c-.63.39-1.43.39-2.06,0L2,8.87" />
      <path d="M11.16,7.29c-.07-.29-.3-.51-.58-.58l-2.5-.64c-.11-.03-.17-.14-.14-.25.02-.07.07-.12.14-.14l2.5-.64c.29-.07.51-.3.58-.58l.64-2.5c.03-.11.14-.17.25-.14.07.02.12.07.14.14l.64,2.5c.07.29.3.51.58.58l2.5.64c.11.03.17.14.14.25-.02.07-.07.12-.14.14l-2.5.64c-.29.07-.51.3-.58.58l-.64,2.5c-.03.11-.14.17-.25.14-.07-.02-.12-.07-.14-.14l-.64-2.5Z" />
    </svg>
  );
}

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className={className}>
      <rect strokeWidth={0} fill="#ffffff" x="2.96" y="3.11" width="18.09" height="17.79" />
      <path strokeWidth={0} fill="#2867b2" d="M12,2.01c2.84,0,5.68,0,8.52,0,.76,0,1.37.54,1.47,1.2.01.07.02.15.02.22v17.14c0,.76-.6,1.38-1.36,1.42-.05,0-.1,0-.15,0H3.5c-.71,0-1.25-.38-1.44-1.03-.04-.14-.06-.28-.06-.42,0-5.69,0-11.39,0-17.08,0-.81.61-1.44,1.42-1.45.69,0,1.37,0,2.06,0h6.51ZM12.67,10.79c0-.4,0-.74,0-1.08,0-.17-.04-.23-.22-.22-.82,0-1.63.01-2.45,0-.19,0-.24.06-.24.25,0,3.04,0,6.07,0,9.11,0,.19.05.25.24.25.85,0,1.7,0,2.54,0,.19,0,.24-.05.24-.25,0-1.53,0-3.06,0-4.58,0-.32.02-.64.08-.95.12-.65.41-1.17,1.1-1.34.21-.05.44-.06.67-.06.69,0,1.14.34,1.3,1.01.09.39.12.8.13,1.2.01,1.57,0,3.14,0,4.71,0,.18.05.25.24.25.85,0,1.7,0,2.54,0,.18,0,.23-.06.23-.24,0-1.69,0-3.38,0-5.07,0-.69-.03-1.38-.19-2.06-.22-.92-.64-1.71-1.55-2.12-.9-.4-1.85-.48-2.81-.23-.79.21-1.39.69-1.85,1.42h0ZM7.95,14.27c0-1.52,0-3.04,0-4.56,0-.17-.05-.22-.22-.22-.86,0-1.72,0-2.58,0-.17,0-.22.04-.22.22,0,3.05,0,6.11,0,9.16,0,.18.07.22.23.22.85,0,1.7,0,2.54,0q.25,0,.25-.25v-4.56h0ZM6.44,8.2c.96,0,1.73-.77,1.73-1.73s-.77-1.74-1.74-1.74-1.73.77-1.73,1.75c0,.96.77,1.72,1.74,1.72h0Z" />
    </svg>
  );
}

function ArrowUpRightIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M7 7h10v10" />
      <path d="M7 17 17 7" />
    </svg>
  );
}
import { useAnimate, useInView, type AnimationPlaybackControls } from "motion/react";
import { Github  , File} from "lucide-react";

import { Button, buttonVariants } from "../utilities/button";

import { AnimatedContainer } from "../utilities/animated-container";
import { HoverBorderGradient } from "../utilities/hoverbordergradient";

import { HighlightGroup, Particles } from "./highlighter";

export function HighlighterSection() {
  const [scope, animate] = useAnimate();
  const controlsRef = React.useRef<AnimationPlaybackControls | null>(null);
  const inView = useInView(scope);

  React.useEffect(() => {
    controlsRef.current = animate(
      [
        ["#pointer", { left: 200, top: 60 }, { duration: 0 }],
        ["#javascript", { opacity: 1 }, { duration: 0.3 }],
        [
          "#pointer",
          { left: 50, top: 102 },
          { at: "+0.5", duration: 0.5, ease: "easeInOut" },
        ],
        ["#javascript", { opacity: 0.4 }, { at: "-0.3", duration: 0.1 }],
        ["#react-js", { opacity: 1 }, { duration: 0.3 }],
        [
          "#pointer",
          { left: 224, top: 170 },
          { at: "+0.5", duration: 0.5, ease: "easeInOut" },
        ],
        ["#react-js", { opacity: 0.4 }, { at: "-0.3", duration: 0.1 }],
        ["#typescript", { opacity: 1 }, { duration: 0.3 }],
        [
          "#pointer",
          { left: 88, top: 198 },
          { at: "+0.5", duration: 0.5, ease: "easeInOut" },
        ],
        ["#typescript", { opacity: 0.4 }, { at: "-0.3", duration: 0.1 }],
        ["#next-js", { opacity: 1 }, { duration: 0.3 }],
        [
          "#pointer",
          { left: 200, top: 60 },
          { at: "+0.5", duration: 0.5, ease: "easeInOut" },
        ],
        ["#next-js", { opacity: 0.5 }, { at: "-0.3", duration: 0.1 }],
      ],
      {
        repeat: Number.POSITIVE_INFINITY,
      },
    );
    return () => controlsRef.current?.stop();
  }, [animate]);

  // Pause the looping pointer animation while the card is offscreen.
  React.useEffect(() => {
    const controls = controlsRef.current;
    if (!controls) return;
    if (inView) {
      controls.play();
    } else {
      controls.pause();
    }
  }, [inView]);

  return (
    <section className="relative mx-auto mb-20 mt-6 w-full max-w-5xl">
      <AnimatedContainer duration={1.8} delay={0}>
        <HighlightGroup className="group h-full">
          <div
            className="group/item h-full md:col-span-6 lg:col-span-12"
            data-aos="fade-down"
          >
            <HoverBorderGradient
              as="div"
              containerClassName="rounded-3xl w-full h-full"
              className="p-0 w-full h-full bg-transparent!"
            >
              <div className="relative h-full overflow-hidden rounded-3xl bg-black">
                <Particles
                  className="absolute inset-0 -z-10 opacity-10 transition-opacity duration-1000 ease-in-out group-hover/item:opacity-100"
                  quantity={200}
                  color={"#555555"}
                  vy={-0.2}
                />
                <div className="flex justify-center">
                  <div className="flex h-full flex-col justify-center gap-10 p-4 md:h-75 md:flex-row">
                    <div
                      className="relative mx-auto h-67.5 w-75 md:h-67.5 md:w-75"
                      ref={scope}
                    >
                      <DesignaliMark className="absolute left-1/2 top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2" />
                      <div
                        id="next-js"
                        className="absolute font-ibm bottom-12 left-14 rounded-3xl border border-slate-600 bg-slate-800 px-2 py-1.5 text-xs opacity-50"
                      >
                        UI-UX
                      </div>
                      <div
                        id="react-js"
                        className="absolute font-ibm left-2 top-20 rounded-3xl border border-slate-600 bg-slate-800 px-2 py-1.5 text-xs opacity-50"
                      >
                        Full-Stack Dev
                      </div>
                      <div
                        id="typescript"
                        className="absolute font-ibm bottom-20 right-1 rounded-3xl border border-slate-600 bg-slate-800 px-2 py-1.5 text-xs opacity-50"
                      >
                        Networking
                      </div>
                      <div
                        id="javascript"
                        className="absolute font-ibm right-12 top-10 rounded-3xl border border-slate-600 bg-slate-800 px-2 py-1.5 text-xs opacity-50"
                      >
                        AWS & Cloud
                      </div>

                      <div id="pointer" className="absolute">
                        <svg
                          width="16.8"
                          height="18.2"
                          viewBox="0 0 12 13"
                          className="fill-[#F2E6D8]"
                          stroke="white"
                          strokeWidth="1"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M12 5.50676L0 0L2.83818 13L6.30623 7.86537L12 5.50676V5.50676Z"
                          />
                        </svg>
                        <span className="bg-ali relative -top-1 left-3 rounded-3xl px-2 py-1 text-xs text-white"></span>
                      </div>
                    </div>

                    <div className="mt-2 flex h-full flex-col justify-center p-2 text-center md:-mt-4 md:ml-10 md:w-100 md:text-left">
                      <div className="flex flex-col items-center">
                        <h3 className="mt-6 pb-1 font-bold">
                          <span className="text-2xl md:text-4xl font-unbounded font-medium ">
                            Open to Opportunities & Collaboration
                          </span>
                        </h3>
                      </div>
                      <p className="my-1 mb-4 text-slate-400 font-unbounded font-light">
                        Interested in working together, discussing an idea, or
                        exploring an opportunity? I&apos;d be glad to connect.
                      </p>
                      <div className="flex flex-wrap justify-center gap-2">
                        <Link
                          href={"mailto:walid.idrissi.labs@gmail.com"}
                          target="_blank"
                          className={cn(
                            buttonVariants({
                              variant: "outline",
                              size: "icon",
                            }),
                          )}
                        >
                          <span className="flex items-center gap-1">
                            <MailIcon className="h-5 w-5" />
                          </span>
                        </Link>

                        <Link
                          href={"https://walid-idrissi-resume.s3.us-west-2.amazonaws.com/walid-idrissi-labkhati-resume.pdf"}
                          target="_blank"
                          className={cn(
                            buttonVariants({
                              variant: "outline",
                              size: "icon",
                            }),
                          )}
                        >
                          <span className="flex items-center gap-1">
                            <File strokeWidth={1} className="h-5 w-5" />
                          </span>
                        </Link>

                        <Link
                          href={"https://linkedin.com/in/walid-idrissi-labkhati"}
                          target="_blank"
                          className={cn(
                            buttonVariants({
                              variant: "outline",
                              size: "icon",
                            }),
                          )}
                        >
                          <span className="flex items-center gap-1">
                            <LinkedInIcon className="h-5 w-5" />
                          </span>
                        </Link>

                        <Link
                          href={"https://github.com/walid-idrissi-labs"}
                          target="_blank"
                          className={cn(
                            buttonVariants({
                              variant: "outline",
                              size: "icon",
                            }),
                          )}
                        >
                          <span className="flex items-center gap-1">
                            <Github strokeWidth={1} className="h-5 w-5" />
                          </span>
                        </Link>

                        <Link href="/contact" target="_blank" >
                          <Button className="cursor-pointer">
                            Contact Me
                            <span>
                              <ArrowUpRightIcon className="h-4 w-4" />
                            </span>
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </HoverBorderGradient>
          </div>
        </HighlightGroup>
      </AnimatedContainer>
    </section>
  );
}
