"use client";

import React from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion, type Variants } from "motion/react";
import { ArrowRight, ArrowUpRight, Check, Copy } from "lucide-react";

import SplitText from "../ui/splittext-bit";
import { cn } from "../../lib/utils";
import { colors } from "../../lib/colors";
import { liquidGlassStyle } from "../../lib/glass";

const EMAIL = "walid.idrissi.labs@gmail.com";
const MESSAGE_LIMIT = 1000;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const SOCIAL_LINKS = [
  { label: "GitHub", href: "https://github.com/walid-idrissi-labs" },
  { label: "LinkedIn", href: "https://linkedin.com/in/walid-idrissi-labkhati" },
  {
    label: "Resume",
    href: "https://walid-idrissi-resume.s3.us-west-2.amazonaws.com/walid-idrissi-labkhati-resume.pdf",
  },
] as const;

const MARQUEE_ITEMS = [
  "open to opportunities",
  "internships",
  "collaborations",
  "freelance",
  "based in marrakech",
  "let's build together",
] as const;

const entrance: Variants = {
  hidden: { opacity: 0, y: 26, filter: "blur(6px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.9, ease: "easeOut" },
  },
};

// Same fade-up as `entrance`, minus the `filter`. Framer Motion leaves
// "blur(0px)" as a permanent inline style once settled, and any non-"none"
// filter forces the element's whole subtree onto an isolated compositing
// layer — trapping the form's backdrop-filter so it can only see that
// flattened layer instead of the real page background behind it. The panel
// needs this wrapper filter-free so its glass reads the same as the nav's.
const panelEntrance: Variants = {
  hidden: { opacity: 0, y: 26 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: "easeOut" },
  },
};

export function ContactExperience() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={shouldReduceMotion ? false : "hidden"}
      animate="show"
      variants={{ show: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } } }}
      className="grid w-full gap-y-14 lg:grid-cols-[1.05fr_1fr] lg:grid-rows-[auto_1fr] lg:gap-x-16 lg:gap-y-12 xl:gap-x-24"
    >
      <div className="lg:col-start-1 lg:row-start-1">
        <motion.p
          variants={entrance}
          className="font-ibm text-[11px] uppercase tracking-[0.35em] text-neutral-500"
        >
          [ get in touch ]
        </motion.p>

        <SplitText
          className="mt-5 text-[2.4rem] leading-[1.08] text-beige_bright sm:text-[3.2rem] md:text-[4rem] lg:text-[3.3rem] xl:text-[4.1rem] font-unbounded opacity-90"
          delay={70}
          duration={2.2}
          ease="power3.out"
          splitType="chars"
          from={{ opacity: 0, y: 16 }}
          to={{ opacity: 1, y: 0 }}
          threshold={0}
          rootMargin="0px"
          tag="h1"
          textAlign="left"
        >
          <span className="block">Let’s Shape</span>
          <span className="block font-ibm font-thin italic text-slate">What’s Next.</span>
        </SplitText>

        <motion.p
          variants={entrance}
          className="mt-6 max-w-xl font-unbounded font-extralight text-sm leading-relaxed text-neutral-400 md:text-base"
        >
          An internship, a collaboration, or an idea worth chasing — my inbox is open.
          Tell me what you&apos;re building and I&apos;ll get back to you within 24 hours.
        </motion.p>
      </div>

      <motion.div variants={panelEntrance} className="lg:col-start-2 lg:row-start-1 lg:row-span-2">
        <ContactForm />
      </motion.div>

      <motion.div variants={entrance} className="self-start lg:col-start-1 lg:row-start-2">
        <ContactChannels />
        <SocialLinks />
      </motion.div>
    </motion.div>
  );
}

/* ------------------------------ info channels ------------------------------ */

function useMarrakechClock() {
  const [now, setNow] = React.useState<Date | null>(null);
  const [offset, setOffset] = React.useState("GMT+1");

  React.useEffect(() => {
    try {
      const zone = new Intl.DateTimeFormat("en-GB", {
        timeZone: "Africa/Casablanca",
        timeZoneName: "shortOffset",
      })
        .formatToParts(new Date())
        .find((part) => part.type === "timeZoneName")?.value;
      if (zone) setOffset(zone);
    } catch {
      /* keep the GMT+1 fallback */
    }

    setNow(new Date());
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const formatter = React.useMemo(
    () =>
      new Intl.DateTimeFormat("en-GB", {
        timeZone: "Africa/Casablanca",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      }),
    [],
  );

  return { time: now ? formatter.format(now) : null, offset };
}

function ContactChannels() {
  const { time, offset } = useMarrakechClock();
  const [copied, setCopied] = React.useState(false);
  const copyTimer = React.useRef<number | null>(null);

  React.useEffect(
    () => () => {
      if (copyTimer.current) window.clearTimeout(copyTimer.current);
    },
    [],
  );

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      if (copyTimer.current) window.clearTimeout(copyTimer.current);
      copyTimer.current = window.setTimeout(() => setCopied(false), 2200);
    } catch {
      window.location.href = `mailto:${EMAIL}`;
    }
  };

  return (
    <div className="grid grid-cols-1 gap-x-10 gap-y-7 sm:grid-cols-2">
      <button
        type="button"
        onClick={copyEmail}
        title="Copy to clipboard"
        className="group flex cursor-pointer flex-col items-start gap-2 border-l border-white/10 pl-4 text-left transition-colors duration-300 hover:border-beige_bright/60"
      >
        <span
          className={cn(
            "font-ibm text-[10px] uppercase tracking-[0.3em] transition-colors duration-300",
            copied ? "text-beige_bright" : "text-neutral-500 group-hover:text-neutral-300",
          )}
        >
          {copied ? "copied to clipboard" : "email — click to copy"}
        </span>
        <span className="flex items-center gap-2 font-ibm text-sm font-light text-neutral-200 transition-colors duration-300 group-hover:text-beige_bright md:text-[15px]">
          <span className="break-all">{EMAIL}</span>

        </span>
        <span aria-live="polite" className="sr-only">
          {copied ? "Email copied to clipboard" : ""}
        </span>
      </button>

      <Channel label="based in" value="Marrakech, Morocco" />

      <Channel label="local time" value={`${time ?? "--:--:--"} ${offset}`} />

      <div className="flex flex-col gap-2 border-l border-white/10 ">
        <span className="font-ibm text-[10px] uppercase tracking-[0.3em] text-neutral-500">
          status
        </span>
        <span className="flex items-center gap-2 font-ibm text-sm font-light text-neutral-200 md:text-[15px]">
          <span className="relative flex h-2 w-2">
            {/* <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-beige_bright opacity-60" /> */}
            {/* <span className="relative inline-flex h-2 w-2 rounded-full bg-beige_bright" /> */}
          </span>
          Open to opportunities
        </span>
      </div>
    </div>
  );
}

function Channel({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2 border-l border-white/10 pl-4">
      <span className="font-ibm text-[10px] uppercase tracking-[0.3em] text-neutral-500">
        {label}
      </span>
      <span className="font-ibm text-sm font-light text-neutral-200 md:text-[15px]">{value}</span>
    </div>
  );
}

function SocialLinks() {
  return (
    <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
      {SOCIAL_LINKS.map(({ label, href }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-1.5 border-b border-white/10 pb-1.5 font-ibm text-[11px] uppercase tracking-[0.3em] text-neutral-400 transition-colors duration-300 hover:border-beige_bright/70 hover:text-beige_bright"
        >
          {label}
          <ArrowUpRight
            className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            strokeWidth={1.5}
          />
        </a>
      ))}
    </div>
  );
}

/* ---------------------------------- form ---------------------------------- */

type FormValues = { name: string; email: string; message: string };
type FormErrors = Partial<Record<keyof FormValues, string>>;

function validate(values: FormValues): FormErrors {
  const errors: FormErrors = {};
  if (values.name.trim().length < 2) errors.name = "tell me who you are";
  if (!EMAIL_PATTERN.test(values.email.trim())) errors.email = "that address doesn't look right";
  if (values.message.trim().length < 10) errors.message = "a few more words (min. 10 chars)";
  return errors;
}

const inputClasses =
  "w-full bg-transparent pb-3.5 pt-2.5 font-ibm text-base font-light text-beige_bright caret-beige_bright outline-none placeholder:text-neutral-700 md:text-[17px]";

// Same material as the nav (app/lib/glass.ts) — no local overrides.
const panelStyle: React.CSSProperties = liquidGlassStyle;


function ContactForm() {
  const shouldReduceMotion = useReducedMotion();
  const [values, setValues] = React.useState<FormValues>({ name: "", email: "", message: "" });
  const [errors, setErrors] = React.useState<FormErrors>({});
  const [status, setStatus] = React.useState<"idle" | "sending" | "error">("idle");
  const [sent, setSent] = React.useState(false);
  const [shake, setShake] = React.useState(0);
  const [honeypot, setHoneypot] = React.useState("");

  const nameRef = React.useRef<HTMLInputElement>(null);
  const emailRef = React.useRef<HTMLInputElement>(null);
  const messageRef = React.useRef<HTMLTextAreaElement>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) =>
      prev[name as keyof FormValues] ? { ...prev, [name]: undefined } : prev,
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "sending") return;

    const nextErrors = validate(values);
    setErrors(nextErrors);
    if (nextErrors.name || nextErrors.email || nextErrors.message) {
      setShake((n) => n + 1);
      if (nextErrors.name) nameRef.current?.focus();
      else if (nextErrors.email) emailRef.current?.focus();
      else messageRef.current?.focus();
      return;
    }

    setStatus("sending");
    try {
      if (honeypot) {
        // A filled hidden field means a bot: pretend it worked, send nothing.
        await new Promise((resolve) => setTimeout(resolve, 800));
      } else {
        const res = await fetch("/api/send", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: values.name.trim(),
            email: values.email.trim(),
            message: values.message.trim(),
          }),
        });
        if (!res.ok) throw new Error(`send failed: ${res.status}`);
      }
      setStatus("idle");
      setSent(true);
    } catch {
      setStatus("error");
    }
  };

  const resetForm = () => {
    setValues({ name: "", email: "", message: "" });
    setErrors({});
    setStatus("idle");
    setSent(false);
  };

  return (
    <div className="relative h-full">
      <span aria-hidden="true" className="pointer-events-none absolute -top-2.5 -left-2 select-none font-ibm text-sm text-neutral-600">+</span>
      <span aria-hidden="true" className="pointer-events-none absolute -top-2.5 -right-2 select-none font-ibm text-sm text-neutral-600">+</span>
      <span aria-hidden="true" className="pointer-events-none absolute -bottom-3 -left-2 select-none font-ibm text-sm text-neutral-600">+</span>
      <span aria-hidden="true" className="pointer-events-none absolute -bottom-3 -right-2 select-none font-ibm text-sm text-neutral-600">+</span>

      <div
        className="relative flex h-full flex-col overflow-hidden rounded-[1.75rem] p-6 sm:p-8 md:p-9"
        style={panelStyle}
      >

        <AnimatePresence mode="wait" initial={false}>
          {sent ? (
            <SuccessView
              key="success"
              name={values.name}
              email={values.email}
              onReset={resetForm}
              shouldReduceMotion={shouldReduceMotion ?? false}
            />
          ) : (
            <motion.form
              key="form"
              initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={shouldReduceMotion ? undefined : { opacity: 0, y: -18 }}
              transition={{ duration: 0.45, ease: "easeOut" }}
              onSubmit={handleSubmit}
              noValidate
              className="relative z-10 flex h-full flex-col"
            >
              <div className="flex items-center justify-between gap-4">
                <p className="font-ibm text-[10px] uppercase tracking-[0.3em] text-neutral-500">
                  {"// new message"}
                </p>
                <p className="font-ibm text-[10px] uppercase tracking-[0.2em] text-neutral-600">
                  * all fields required
                </p>
              </div>

              <div aria-hidden="true" className="pointer-events-none absolute -left-[9999px] h-px w-px overflow-hidden">
                <label htmlFor="company">Company</label>
                <input
                  id="company"
                  name="company"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                />
              </div>

              <div className="mt-8 flex flex-col gap-8">
                <FormField id="name" index="01" label="your name" error={errors.name}>
                  <input
                    ref={nameRef}
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    placeholder=""
                    value={values.name}
                    onChange={handleChange}
                    aria-invalid={Boolean(errors.name)}
                    aria-describedby={errors.name ? "name-error" : undefined}
                    className={inputClasses}
                  />
                </FormField>

                <FormField id="email" index="02" label="email address" error={errors.email}>
                  <input
                    ref={emailRef}
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder=""
                    value={values.email}
                    onChange={handleChange}
                    aria-invalid={Boolean(errors.email)}
                    aria-describedby={errors.email ? "email-error" : undefined}
                    className={inputClasses}
                  />
                </FormField>

                <FormField
                  id="message"
                  index="03"
                  label="message"
                  error={errors.message}
                  hint={`${values.message.length} / ${MESSAGE_LIMIT}`}
                >
                  <textarea
                    ref={messageRef}
                    id="message"
                    name="message"
                    rows={4}
                    maxLength={MESSAGE_LIMIT}
                    placeholder="..."
                    value={values.message}
                    onChange={handleChange}
                    aria-invalid={Boolean(errors.message)}
                    aria-describedby={errors.message ? "message-error" : undefined}
                    className={cn(
                      inputClasses,
                      "no-scrollbar field-sizing-content max-h-52 min-h-24 resize-none",
                    )}
                  />
                </FormField>
              </div>

              <div className="mt-10 lg:mt-auto lg:pt-10">
                <motion.div
                  key={`shake-${shake}`}
                  animate={
                    shake && !shouldReduceMotion ? { x: [0, -8, 8, -5, 5, 0] } : undefined
                  }
                  transition={{ duration: 0.45, ease: "easeInOut" }}
                >
                  <button
                    type="submit"
                    disabled={status === "sending"}
                    className="group relative flex h-13 w-full cursor-pointer items-center justify-center overflow-hidden rounded-full border border-white/15 bg-white/[0.03] transition-colors duration-500 hover:border-beige_bright/70 disabled:pointer-events-none disabled:opacity-70"
                  >
                    <span
                      aria-hidden="true"
                      className="absolute inset-0 translate-y-[102%] bg-beige_bright transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0"
                    />
                    <span className="relative z-10 flex items-center gap-3 font-ibm text-xs uppercase tracking-[0.3em] text-beige_bright transition-colors duration-500 group-hover:text-black">
                      {status === "sending" ? (
                        <>
                          <span
                            aria-hidden="true"
                            className="h-4 w-4 animate-spin rounded-full border border-beige_bright/30 border-t-beige_bright"
                          />
                          sending
                        </>
                      ) : (
                        <>
                          send message
                          <ArrowRight
                            className="h-4 w-4 transition-transform duration-500 group-hover:-rotate-45"
                            strokeWidth={1.5}
                          />
                        </>
                      )}
                    </span>
                  </button>
                </motion.div>

                <AnimatePresence>
                  {status === "error" && (
                    <motion.p
                      key="send-error"
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="mt-4 font-ibm text-[11px] leading-relaxed text-red"
                    >
                      {"// transmission failed — try again, or reach me directly at "}
                      <a
                        href={`mailto:${EMAIL}`}
                        className="underline underline-offset-4 transition-colors duration-300 hover:text-beige_bright"
                      >
                        {EMAIL}
                      </a>
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function FormField({
  id,
  index,
  label,
  error,
  hint,
  children,
}: {
  id: string;
  index: string;
  label: string;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="group/field">
      <div className="flex items-baseline gap-3">
        <span className="font-ibm text-[10px] text-neutral-600">{index}</span>
        <label
          htmlFor={id}
          className={cn(
            "font-ibm text-[10px] uppercase tracking-[0.3em] transition-colors duration-300",
            error
              ? "text-red"
              : "text-neutral-500 group-focus-within/field:text-beige_bright",
          )}
        >
          {label}
        </label>
        {!error && hint && (
          <span className="ml-auto font-ibm text-[10px] text-neutral-600">{hint}</span>
        )}
        <AnimatePresence>
          {error && (
            <motion.span
              key="error"
              id={`${id}-error`}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="ml-auto font-ibm text-[10px] tracking-wider text-red"
            >
              {error}
            </motion.span>
          )}
        </AnimatePresence>
      </div>
      {children}
      <div className="relative h-px w-full overflow-hidden bg-white/10">
        <span
          className={cn(
            "absolute inset-0 origin-left bg-beige_bright transition-transform duration-500 ease-out",
            error
              ? "scale-x-100 bg-red"
              : "scale-x-0 group-focus-within/field:scale-x-100",
          )}
        />
      </div>
    </div>
  );
}

function SuccessView({
  name,
  email,
  onReset,
  shouldReduceMotion,
}: {
  name: string;
  email: string;
  onReset: () => void;
  shouldReduceMotion: boolean;
}) {
  const firstName = name.trim().split(/\s+/)[0] ?? "";

  return (
    <motion.div
      initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      role="status"
      className="relative z-10 flex h-full min-h-[24rem] flex-col items-start justify-center gap-5"
    >
      <svg viewBox="0 0 52 52" className="h-14 w-14" fill="none" aria-hidden="true">
        <motion.circle
          cx="26"
          cy="26"
          r="24"
          stroke={colors.beige_bright}
          strokeOpacity="0.35"
          strokeWidth="1.5"
          initial={shouldReduceMotion ? undefined : { pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
        />
        <motion.path
          d="M15 27.5 L23 35 L37 19"
          stroke={colors.beige_bright}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={shouldReduceMotion ? undefined : { pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: shouldReduceMotion ? 0 : 0.55, duration: 0.45, ease: "easeOut" }}
        />
      </svg>

      <h2 className="font-unbounded text-2xl text-beige_bright md:text-3xl">
        Message <span className="font-dmserif italic text-slate">received.</span>
      </h2>

      <p className="max-w-md font-ibm text-sm font-light leading-relaxed text-neutral-400">
        Thanks{firstName ? ` ${firstName}` : ""} — it&apos;s in my inbox. Expect a reply at{" "}
        <span className="text-neutral-200">{email}</span> within 24 hours.
      </p>

      <div className="mt-2 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={onReset}
          className="cursor-pointer rounded-full border border-white/15 px-5 py-2.5 font-ibm text-[11px] uppercase tracking-[0.25em] text-neutral-300 transition-colors duration-300 hover:border-beige_bright/60 hover:text-beige_bright"
        >
          send another
        </button>
        <Link
          href="/"
          className="group flex items-center gap-2 px-2 py-2.5 font-ibm text-[11px] uppercase tracking-[0.25em] text-neutral-500 transition-colors duration-300 hover:text-beige_bright"
        >
          <span aria-hidden="true" className="transition-transform duration-300 group-hover:-translate-x-1">
            ←
          </span>
          back home
        </Link>
      </div>
    </motion.div>
  );
}

/* --------------------------------- marquee --------------------------------- */

function MarqueeRow({ ariaHidden = false }: { ariaHidden?: boolean }) {
  return (
    <div aria-hidden={ariaHidden || undefined} className="flex w-max shrink-0 items-center">
      {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
        <span
          key={`${item}-${i}`}
          className="flex items-center whitespace-nowrap font-ibm text-[10px] uppercase tracking-[0.4em] text-neutral-600"
        >
          <span className="px-7">{item}</span>
          <span aria-hidden="true" className="text-neutral-800">
            {"//"}
          </span>
        </span>
      ))}
    </div>
  );
}

export function ContactMarquee() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={shouldReduceMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.8, duration: 1 }}
      className="relative z-10 overflow-hidden border-t border-white/5 bg-black/40 py-4 backdrop-blur-sm"
    >
      <div className="animate-marquee flex w-max hover:[animation-play-state:paused]">
        <MarqueeRow />
        <MarqueeRow ariaHidden />
      </div>
    </motion.div>
  );
}
