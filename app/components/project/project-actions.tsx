"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight, ChevronDown, Github, Globe } from "lucide-react";

import { SendButton } from "../ui/stateful-button";
import { HoverBorderGradient } from "../utilities/hoverbordergradient";
import { Input } from "../utilities/input";
import { Label } from "../utilities/label";
import { Textarea } from "../utilities/textarea";
import type { Project } from "../../lib/projects";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function ProjectActions({ project }: { project: Project }) {
  const [formOpen, setFormOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [note, setNote] = useState("");
  const [feedback, setFeedback] = useState<{ tone: "idle" | "success" | "error"; text: string }>({
    tone: "idle",
    text: "",
  });

  // Return value drives the SendButton's loader → check/error animation.
  const submitRequest = async (): Promise<boolean> => {
    const trimmedEmail = email.trim();
    if (!EMAIL_PATTERN.test(trimmedEmail)) {
      setFeedback({ tone: "error", text: "That email doesn't look right — mind checking it?" });
      return false;
    }
    try {
      const res = await fetch("/api/request-demo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ project: project.name, email: trimmedEmail, note: note.trim() }),
      });
      if (!res.ok) throw new Error("request failed");
      setFeedback({ tone: "success", text: `Request sent — I'll get back to you at ${trimmedEmail} soon.` });
      setNote("");
      return true;
    } catch {
      setFeedback({ tone: "error", text: "Something went wrong on the way to my inbox. Please try again in a minute." });
      return false;
    }
  };

  return (
    <div className="flex w-full flex-col items-center gap-8">
      <p className="max-w-xl text-center font-unbounded font-extralight text-sm leading-relaxed text-neutral-300 md:text-base">
        {project.private
          ? "This one runs on real client data, so the code stays private. Request a demo and I'll walk you through it directly."
          : "The code is public. If you'd rather see it running, request a demo and it lands straight in my inbox."}
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4">
        {project.links.repo && (
          <a href={project.links.repo} target="_blank" rel="noopener noreferrer">
            <HoverBorderGradient
              as="div"
              containerClassName="rounded-full"
              className="flex items-center gap-2 bg-black px-6 py-2.5 font-ibm text-xs uppercase tracking-[0.15em] text-faint_white md:text-sm"
            >
              <Github className="h-4 w-4" strokeWidth={1.5} />
              View Repository
              <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.5} />
            </HoverBorderGradient>
          </a>
        )}
        {project.links.live && (
          <a href={project.links.live} target="_blank" rel="noopener noreferrer">
            <HoverBorderGradient
              as="div"
              containerClassName="rounded-full"
              className="flex items-center gap-2 bg-black px-6 py-2.5 font-ibm text-xs uppercase tracking-[0.15em] text-faint_white md:text-sm"
            >
              <Globe className="h-4 w-4" strokeWidth={1.5} />
              Open Live App
              <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.5} />
            </HoverBorderGradient>
          </a>
        )}
        {project.links.demo && (
          <button
            type="button"
            onClick={() => setFormOpen((open) => !open)}
            aria-expanded={formOpen}
            className="flex cursor-pointer items-center gap-2 rounded-full border border-white/15 px-6 py-3 font-ibm text-xs uppercase tracking-[0.15em] text-neutral-300 transition-colors duration-300 hover:border-beige_bright/60 hover:text-beige_bright md:text-sm"
          >
            Request a Demo
            <ChevronDown
              className={`h-3.5 w-3.5 transition-transform duration-300 ${formOpen ? "rotate-180" : ""}`}
              strokeWidth={1.5}
            />
          </button>
        )}
      </div>

      <AnimatePresence initial={false}>
        {formOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.45, ease: "easeInOut" }}
            className="w-full max-w-md overflow-hidden"
          >
            <form
              onSubmit={(event) => event.preventDefault()}
              className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-5 md:p-6"
            >
              <div className="flex flex-col gap-2">
                <Label htmlFor="demo-email" className="font-ibm text-[10px] uppercase tracking-[0.25em] text-slate">
                  your email
                </Label>
                <Input
                  id="demo-email"
                  type="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@company.com"
                  className="h-10 rounded-lg border-white/10 bg-black/40 font-ibm text-sm text-faint_white placeholder:text-neutral-600"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="demo-note" className="font-ibm text-[10px] uppercase tracking-[0.25em] text-slate">
                  anything specific?
                  <span className="normal-case tracking-normal text-neutral-600">(optional)</span>
                </Label>
                <Textarea
                  id="demo-note"
                  value={note}
                  onChange={(event) => setNote(event.target.value)}
                  rows={3}
                  placeholder={`what would you like to see in ${project.name}?`}
                  className="rounded-lg border-white/10 bg-black/40 font-ibm text-sm text-faint_white placeholder:text-neutral-600"
                />
              </div>
              <div className="flex justify-center pt-1">
                <SendButton onAction={submitRequest} className="font-ibm text-sm">
                  Send Request
                </SendButton>
              </div>
              <p
                aria-live="polite"
                className={`min-h-5 text-center font-ibm text-xs ${
                  feedback.tone === "error"
                    ? "text-red"
                    : feedback.tone === "success"
                      ? "text-beige_bright"
                      : "text-neutral-600"
                }`}
              >
                {feedback.tone === "idle" ? "goes straight to my inbox — no forms, no middlemen" : feedback.text}
              </p>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
