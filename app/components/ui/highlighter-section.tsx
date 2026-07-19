"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "../../lib/utils";
import { DIcons } from "dicons";
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
                      <DIcons.Designali className="absolute left-1/2 top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2" />
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
                            <DIcons.Mail strokeWidth={1} className="h-5 w-5" />
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
                            <DIcons.LinkedIn strokeWidth={1} className="h-5 w-5" />
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
                              <DIcons.ArrowUpRight strokeWidth={1} className="h-4 w-4" />
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
