import Image from "next/image";
import Link from "next/link";
import { Activity, AppWindowMac, BriefcaseBusiness, Calculator, Cloud, Terminal, Truck } from "lucide-react";

import { GlowingEffect } from "../ui/glowingeffectgrid-bit";
import { AnimatedContainer } from "../utilities/animated-container";

const url_shortener = "/project-url-shortener.webp";
const tascii = "/project-tascii.webp";
const applyr = "/project-applyr.webp";
const sla_monitor = "/project-sla-monitor.webp";
const shipping_crm = "/project-shipping-crm-0.webp";
const ai_quotation = "/project-ai-quotation-prediction.webp";
const mactab = "/project-mactab-v2.webp";

export default function GlowingEffectSection() {
  return (
    <ul className="grid grid-cols-1 grid-rows-none gap-4 md:grid-cols-12 md:grid-rows-4 lg:gap-4 xl:max-h-206 xl:grid-rows-3">
      <GridItem
        area="md:[grid-area:1/1/2/7] xl:[grid-area:1/1/2/5]"
        icon={<Cloud className="h-4 w-4 text-faint_white" />}
        title="URL Shortener"
        description="Serverless URL shortener on API Gateway, Lambda and DynamoDB, provisioned entirely in Terraform."
        href="/projects/url-shortener"
        backgroundImage={url_shortener}
        duration={1.8}
        delay={0.1}
      />

      <GridItem
        area="md:[grid-area:1/7/2/13] xl:[grid-area:2/1/3/5]"
        icon={<Terminal className="h-4 w-4 text-faint_white" />}
        title="tascii"
        description="A fast, minimal task manager for the terminal built in Go."
        href="/projects/tascii"
        backgroundImage={tascii}
        duration={1.8}
        delay={0.22}
      />

      <GridItem
        area="md:[grid-area:2/1/3/7] xl:[grid-area:1/5/3/8]"
        icon={<Truck className="h-4 w-4 text-faint_white" />}
        title="Shipping CRM"
        description="A logistics CRM for a shipping company: shipments, public tracking, and invoicing."
        href="/projects/shipping-crm"
        backgroundImage={shipping_crm}
        duration={1.8}
        delay={0.34}
      />

      <GridItem
        area="md:[grid-area:2/7/3/13] xl:[grid-area:1/8/2/13]"
        icon={<Activity className="h-4 w-4 text-faint_white" />}
        title="SLA Monitor"
        description="Serverless AWS platform that watches websites, detects incidents, and grades weekly SLAs."
        href="/projects/sla-monitor"
        backgroundImage={sla_monitor}
        duration={1.8}
        delay={0.46}
      />

      <GridItem
        area="md:[grid-area:3/1/4/13] xl:[grid-area:2/8/3/13]"
        icon={<BriefcaseBusiness className="h-4 w-4 text-faint_white" />}
        title="Applyr"
        description="Job application tracking SaaS with AI-tailored resumes and a job-capturing browser extension."
        href="/projects/applyr"
        backgroundImage={applyr}
        duration={1.8}
        delay={0.58}
      />

      <GridItem
        area="md:[grid-area:4/1/5/7] xl:[grid-area:3/1/4/8]"
        icon={<Calculator className="h-4 w-4 text-faint_white" />}
        title="AI Quotation Prediction"
        description="AI quoting software on Django and React: embedding search over supplier history, then deterministic pricing."
        href="/projects/ai-assisted-quotation-prediction-software"
        backgroundImage={ai_quotation}
        duration={1.8}
        delay={0.7}
      />

      <GridItem
        area="md:[grid-area:4/7/5/13] xl:[grid-area:3/8/4/13]"
        icon={<AppWindowMac className="h-4 w-4 text-faint_white" />}
        title="MacTab"
        description="A macOS-style Alt+Tab for Windows, one icon per app, written in C++ on Win32."
        href="/projects/mactab"
        backgroundImage={mactab}
        duration={1.8}
        delay={0.82}
      />
    </ul>
  );
}

interface GridItemProps {
  area: string;
  icon: React.ReactNode;
  title: string;
  description: React.ReactNode;
  href: string;
  backgroundImage?: string;
  delay?: number;
  duration?: number;
}

const GridItem = ({
  area,
  icon,
  title,
  description,
  href,
  backgroundImage,
  delay = 0,
  duration = 1,
}: GridItemProps) => {
  // Internal hrefs (project case-study pages) navigate in-tab via Link;
  // external ones (GitHub) keep opening in a new tab.
  const isInternal = href.startsWith("/");
  const linkClassName = "group relative block h-full rounded-2xl border p-2 md:rounded-3xl md:p-3";

  const card = (
    <>
      <GlowingEffect
        blur={0.5}
        borderWidth={4}
        spread={67}
        glow={true}
        disabled={false}
        proximity={34}
        inactiveZone={0.01}
        movementDuration={3}
      />
      <div className="border-0.75 relative flex h-full flex-col justify-between gap-6 overflow-hidden rounded-xl p-6 md:p-6 dark:shadow-[0px_0px_27px_0px_#2D2D2D]">
        {/* Background image layer — sits behind everything; the dark
            overlay fades out on hover to reveal it. */}
        {backgroundImage && (
          <>
            <Image
              src={backgroundImage}
              alt=""
              aria-hidden="true"
              fill
              sizes="(max-width: 768px) 90vw, (max-width: 1280px) 45vw, 35vw"
              className="object-cover object-center transition-opacity duration-500"
            />
            <div className="absolute inset-0 bg-black/80 transition-opacity duration-500 group-hover:opacity-0" />
            {/* Bottom scrim — crossfades in as the overlay leaves so the
                title and description stay legible over bright captures. */}
            <div className="absolute inset-x-0 bottom-0 h-3/4 bg-gradient-to-t from-black/90 via-black/55 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          </>
        )}

        {/* Card content — z-10 ensures it always sits above the image and overlay */}
        <div className="relative z-10 flex flex-1 flex-col justify-between gap-3">
          <div className="w-fit rounded-lg border border-gray-600 p-2 bg-black/30 backdrop-blur-sm">
            {icon}
          </div>
          <div className="space-y-3 [text-shadow:0_1px_10px_rgba(0,0,0,0.6)]">
            <h3 className="-tracking-4 pt-0.5 font-unbounded text-xl/[1.375rem] font-medium text-balance md:text-2xl/[1.875rem] text-faint_white">
              {title}
            </h3>
            <h2 className="font-sans text-sm/[1.125rem] md:text-base/[1.375rem] text-faint_white [&_b]:md:font-semibold [&_strong]:md:font-semibold">
              {description}
            </h2>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <li className={`min-h-56 list-none ${area}`}>
      <AnimatedContainer delay={delay} duration={duration} className="h-full" initialY={10}>
        {isInternal ? (
          <Link href={href} className={linkClassName}>
            {card}
          </Link>
        ) : (
          <a href={href} target="_blank" rel="noopener noreferrer" className={linkClassName}>
            {card}
          </a>
        )}
      </AnimatedContainer>
    </li>
  );
};
