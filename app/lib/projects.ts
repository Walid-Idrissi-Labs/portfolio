import type { LogoItem } from "../components/ui/skils-clippathlinks";

// Single source of truth for the project case-study pages (/projects/[slug]).
// Adding a project = adding one entry here plus its images in /public.
// Screenshots currently reuse the card art as placeholders — swap the
// `screenshots` entries (and `heroImage`, once the Figma art is ready) for
// real captures and the gallery picks them up automatically.

export type ProjectStatus = "completed" | "in-progress";

export type ProjectScreenshot = {
  src: string;
  alt: string;
  caption: string;
  /** "contain" letterboxes instead of cropping — for diagrams and tall shots. */
  fit?: "cover" | "contain";
};

export type ProjectFeature = {
  title: string;
  body: string;
};

export type ProjectLinks = {
  repo?: string;
  live?: string;
  /** Shows the "Request a Demo" flow (emails me through Resend). */
  demo?: boolean;
};

export type Project = {
  slug: string;
  name: string;
  tagline: string;
  type: string;
  year: string;
  status: ProjectStatus;
  role: string;
  icon: "cloud" | "terminal" | "briefcase" | "activity" | "truck";
  heroImage: string;
  heroImageAlt: string;
  seoDescription: string;
  links: ProjectLinks;
  /** First-person story paragraphs rendered with the scroll-reveal text. */
  background: string[];
  features: ProjectFeature[];
  stackRows: LogoItem[][];
  screenshots: ProjectScreenshot[];
};

export const projects: Project[] = [
  {
    slug: "url-shortener",
    name: "URL Shortener",
    tagline: "A serverless link shortener on AWS, provisioned end to end with Terraform.",
    type: "Cloud Architecture",
    year: "2026",
    status: "completed",
    role: "Solo Project",
    icon: "cloud",
    heroImage: "/project-url-shortener.png",
    heroImageAlt: "URL Shortener — AWS serverless project",
    seoDescription:
      "A fully serverless URL shortener on AWS — API Gateway, Lambda and DynamoDB, provisioned entirely with Terraform.",
    links: {
      repo: "https://github.com/walid-idrissi-labs/url-shortener",
      demo: true,
    },
    background: [
      "This one started as a challenge I set for myself: after months of AWS coursework and labs, I wanted to find out if I could actually ship something real. A URL shortener sounded almost too simple — until I added the rule that made it interesting: every single resource had to be provisioned with Terraform. No console clicking allowed. That one constraint turned a weekend build into a proper lesson in cloud engineering.",
      "The architecture is fully serverless. API Gateway receives the request, a Lambda function does the work, and DynamoDB keeps the mappings. Nothing runs when nobody is using it, so it costs close to nothing to keep alive. Honestly, the hardest part wasn't the application logic — it was IAM. Giving every component exactly the permissions it needs and not one more took longer than writing the actual code, and looking back, that was the most valuable part.",
      "What stayed with me isn't the shortener itself, it's the workflow. Define the infrastructure in code, version it, tear it down, rebuild it from scratch in minutes. Once you've worked that way, clicking around a cloud console feels like a step backwards.",
    ],
    features: [
      {
        title: "Serverless end to end",
        body: "API Gateway takes the request, Lambda resolves it, DynamoDB stores the mappings. There is no server to patch, and the whole thing scales to zero when idle.",
      },
      {
        title: "Infrastructure as code, no exceptions",
        body: "Every resource is declared in Terraform. The entire stack can be destroyed and rebuilt from scratch with one command — the AWS console stayed read-only.",
      },
      {
        title: "Least-privilege IAM",
        body: "Each component gets exactly the permissions it needs and nothing more. Getting these policies right took longer than the application code — on purpose.",
      },
      {
        title: "Built to cost nothing at rest",
        body: "Pay-per-request pricing across the stack means the project idles for free and only spends when a link is actually resolved.",
      },
    ],
    stackRows: [
      [
        { src: "/logo-aws.svg", alt: "AWS", href: "https://aws.amazon.com/", span: "col-span-6 sm:col-span-3", minWidth: "5rem" },
        { src: "/logo-terraform.svg", alt: "Terraform", href: "https://www.terraform.io/", span: "col-span-6 sm:col-span-3", minWidth: "5rem" },
        { src: "/logo-python.svg", alt: "Python", href: "https://www.python.org/", span: "col-span-6 sm:col-span-3", minWidth: "5rem" },
        { src: "/logo-bash.svg", alt: "Bash", href: "https://www.gnu.org/software/bash/", span: "col-span-6 sm:col-span-3", minWidth: "5rem" },
      ],
    ],
    screenshots: [
      {
        src: "/project-url-shortener.png",
        alt: "URL Shortener brand art",
        caption: "brand art holding the fort — real captures are on the way",
      },
      {
        src: "/project-url-shortener-portfolio-preview-card.png",
        alt: "URL Shortener preview card",
        caption: "the preview card, from back when this page didn't exist",
      },
      {
        src: "/project-url-shortener.png",
        alt: "URL Shortener architecture placeholder",
        caption: "future home of the architecture diagram",
      },
    ],
  },
  {
    slug: "tascii",
    name: "tascii",
    tagline: "A fast, minimal task manager that lives where I do — in the terminal.",
    type: "Terminal Application",
    year: "2026",
    status: "in-progress",
    role: "Solo Project",
    icon: "terminal",
    heroImage: "/project-tascii.png",
    heroImageAlt: "tascii — terminal task manager written in Go",
    seoDescription:
      "tascii — a fast, minimal, keyboard-driven task manager for the terminal, written in Go.",
    links: {
      repo: "https://github.com/walid-idrissi-labs/tascii",
      demo: true,
    },
    background: [
      "I live in the terminal, and every task manager I tried kept pulling me out of it — some app, some browser tab, some account that wanted syncing. All I actually wanted was: open a terminal, see my tasks, get back to work. Nothing I found did just that, so I built tascii.",
      "It's written in Go. I picked it partly for the instant startup — a tool you open fifty times a day cannot afford to feel slow — and partly because after years of scripting languages I wanted a compiled one in my toolbox. Everything is keyboard-driven, and the interface stays deliberately plain: no colors fighting for attention, no features I wouldn't use.",
      "It's still in progress, and I use it every day — which turns out to be the best QA process I know. Every rough edge I hit becomes the next item on the list, and fittingly, the todo list for my todo app is managed in tascii itself.",
    ],
    features: [
      {
        title: "Starts before you finish thinking",
        body: "A single compiled Go binary with no runtime to warm up. Launch, capture the task, close — faster than any app switch.",
      },
      {
        title: "Keyboard all the way down",
        body: "Every action is a keystroke. No mouse, no menus to hunt through — the same muscle memory as the rest of the terminal.",
      },
      {
        title: "Nothing to install around it",
        body: "One binary on your PATH and you're done. No daemon, no account, no sync service holding your tasks hostage.",
      },
      {
        title: "Tested on myself, daily",
        body: "I manage my actual work with it, including tascii's own roadmap. Rough edges get found the honest way.",
      },
    ],
    stackRows: [
      [
        { src: "/logo-go.svg", alt: "Go", href: "https://go.dev/", span: "col-span-6 sm:col-span-6", minWidth: "5rem" },
        { src: "/logo-bash.svg", alt: "Bash", href: "https://www.gnu.org/software/bash/", span: "col-span-6 sm:col-span-6", minWidth: "5rem" },
      ],
    ],
    screenshots: [
      {
        src: "/project-tascii.png",
        alt: "tascii brand art",
        caption: "brand art standing in — terminal captures coming soon",
      },
      {
        src: "/project-tascii.png",
        alt: "tascii task board placeholder",
        caption: "future home of the task board, in glorious monospace",
      },
    ],
  },
  {
    slug: "applyr",
    name: "Applyr",
    tagline: "A workspace built for hiring momentum — applications, resumes, and follow-ups in one calm hub.",
    type: "Full-Stack SaaS",
    year: "2026",
    status: "completed",
    role: "Team of Two",
    icon: "briefcase",
    heroImage: "/project-applyr.png",
    heroImageAlt: "Applyr — job application tracking SaaS",
    seoDescription:
      "Applyr — a job application tracking SaaS with a Laravel API, a React SPA, AI-tailored resumes, and browser extensions that capture listings straight from job boards.",
    links: {
      repo: "https://github.com/Walid-Idrissi-Labs/Applyr",
      demo: true,
    },
    background: [
      "Applyr came out of a problem my teammate and I knew personally: the job hunt turns into chaos fast. Spreadsheets, bookmarked listings, five versions of the same resume — we wanted one calm place that holds all of it. So we built it as a real SaaS: a Laravel REST API on one side, a React single-page app on the other, nothing shared between them but a token and a contract.",
      "The part I'm proudest of is how far we pushed past basic CRUD. Every application moves through a proper pipeline — wishlist to applied to interview to offer — and every status change is logged to its history automatically. Resumes have a master profile that AI tailors per application, with OCR to pull text out of an uploaded PDF and a clean A4 export at the end. We even shipped browser extensions for Chrome and Firefox: they read the job posting you're looking at, extract the company and position with AI, and file the application without you leaving the tab.",
      "Building it as a duo taught me things solo projects never had to: agreeing on the API before writing either side of it, reviewing each other's assumptions, and keeping fourteen pages of frontend consistent while both of us moved fast. By the end we had auth flows, an admin panel, scheduled reminder emails — the unglamorous plumbing that makes something feel like a product instead of a demo.",
    ],
    features: [
      {
        title: "One pipeline, every transition on record",
        body: "Applications flow from wishlist to accepted through a defined lifecycle, and each status change is written to a history log automatically — the timeline of the hunt writes itself.",
      },
      {
        title: "Resumes that tailor themselves",
        body: "A master profile feeds an AI that drafts per-application resume variants. Uploaded PDFs are parsed — with OCR as a fallback — and the result exports as a clean A4 document.",
      },
      {
        title: "Capture jobs where they live",
        body: "Chrome and Firefox extensions send the listing you're viewing to the API, where AI extracts company, position, and language — one click and it's filed in your pipeline.",
      },
      {
        title: "Two apps, one honest contract",
        body: "A React SPA talks to a Laravel REST API over Sanctum tokens — 40+ endpoints with form-request validation, API resources, an admin panel, and daily scheduled reminder emails.",
      },
    ],
    stackRows: [
      [
        { src: "/logo-laravel.svg", alt: "Laravel", href: "https://laravel.com/", span: "col-span-6 sm:col-span-4", minWidth: "5rem" },
        { src: "/logo-react.svg", alt: "React", href: "https://react.dev/", span: "col-span-6 sm:col-span-4", minWidth: "5rem" },
        { src: "/logo-tailwind.svg", alt: "Tailwind CSS", href: "https://tailwindcss.com/", span: "col-span-12 sm:col-span-4", minWidth: "5rem" },
      ],
      [
        { src: "/logo-php.svg", alt: "PHP", href: "https://www.php.net/", span: "col-span-6 sm:col-span-4", minWidth: "5rem" },
        { src: "/logo-javascript.svg", alt: "JavaScript", href: "https://developer.mozilla.org/en-US/docs/Web/JavaScript", span: "col-span-6 sm:col-span-4", minWidth: "5rem" },
        { src: "/logo-postgres.svg", alt: "PostgreSQL", href: "https://www.postgresql.org/", span: "col-span-12 sm:col-span-4", minWidth: "5rem" },
      ],
    ],
    screenshots: [
      {
        src: "/project-applyr-hero.png",
        alt: "Applyr landing page",
        caption: "the front door — pitch on the left, live pipeline preview on the right",
      },
      {
        src: "/project-applyr-dashboard.png",
        alt: "Applyr dashboard with activity and stats",
        caption: "the dashboard says good morning and keeps the score",
      },
      {
        src: "/project-applyr-applications.png",
        alt: "Applyr applications table",
        caption: "every application in one honest table — statuses included",
      },
      {
        src: "/project-applyr-detail.png",
        alt: "Applyr application detail view",
        caption: "one application unpacked: documents, checklist, history, AI actions",
      },
      {
        src: "/project-applyr-resume.png",
        alt: "Applyr AI resume preview",
        caption: "the AI tailor at work — version timeline left, fresh A4 right",
      },
      {
        src: "/project-applyr-extension.png",
        alt: "Applyr browser extension capturing a LinkedIn listing",
        caption: "the extension catching a LinkedIn listing red-handed",
      },
    ],
  },
  {
    slug: "sla-monitor",
    name: "SLA Monitor",
    tagline: "A serverless AWS platform that watches endpoints minute by minute, detects incidents, and grades every week against its SLA.",
    type: "Cloud Architecture",
    year: "2026",
    status: "completed",
    role: "Solo Project",
    icon: "activity",
    heroImage: "/project-sla-monitor.png",
    heroImageAlt: "SLA-Aware Website Monitoring System on AWS",
    seoDescription:
      "SLA-Aware Website Monitoring System — a fully serverless AWS platform with five Lambdas, DynamoDB, EventBridge, Cognito and SES, provisioned end to end with Terraform.",
    links: {
      repo: "https://github.com/Walid-Idrissi-Labs/SLA-Aware-Website-Monitoring-System",
      live: "https://sla-aware-website-monitoring-system.vercel.app",
      demo: true,
    },
    background: [
      "After the URL shortener I wanted the next size up: not a service that answers when called, but a system that runs on its own schedule, around the clock, and holds itself accountable. Uptime monitoring was the perfect excuse — everyone claims 99.9%, so I built the thing that checks.",
      "The architecture is event-driven end to end. EventBridge wakes a Monitor Lambda every minute to probe each target and log status and latency; an SLA Processor runs hourly to turn consecutive failures into incidents — and to close them when things recover; and every Monday a Report Generator aggregates the week into the full metric suite: uptime, p50/p95/p99 latency, error rate, MTTR, MTBF — judged against each project's own thresholds and emailed out via SES. Five Lambdas in total, and each one has an IAM role scoped to exactly the tables and actions it needs. The read-only API physically cannot write.",
      "Everything is Terraform — reusable modules for DynamoDB, IAM, Cognito, API Gateway, and a Lambda factory that hashes the source and redeploys only what changed, with remote state in Terraform Cloud. Auth runs through Cognito with Google OAuth wired in as an identity provider. It's the first project where I stopped feeling like I was using AWS and started feeling like I was operating it.",
    ],
    features: [
      {
        title: "Five Lambdas, five clean jobs",
        body: "Monitor every minute, incident detection every hour, reports every Monday, a read-only API, and a project manager for writes — each function triggered on its own schedule, each with its own scoped IAM role.",
      },
      {
        title: "Metrics that mean something",
        body: "Weekly reports compute uptime, p50/p95/p99 latency, error rate, downtime, MTTR and MTBF, evaluate them against per-project thresholds, and assign a severity before landing in your inbox.",
      },
      {
        title: "Terraform owns every resource",
        body: "Modular IaC with remote state in Terraform Cloud. Lambda deployments are content-hashed and immutable — a code change produces a new artifact, and nothing gets clicked together in the console.",
      },
      {
        title: "Security shaped like a blast radius",
        body: "API Gateway validates Cognito JWTs before anything reaches compute. No shared roles, no wildcard ARNs — if the read path is ever compromised, it still can't write a single record.",
      },
    ],
    stackRows: [
      [
        { src: "/logo-aws.svg", alt: "AWS", href: "https://aws.amazon.com/", span: "col-span-6 sm:col-span-4", minWidth: "5rem" },
        { src: "/logo-terraform.svg", alt: "Terraform", href: "https://www.terraform.io/", span: "col-span-6 sm:col-span-4", minWidth: "5rem" },
        { src: "/logo-python.svg", alt: "Python", href: "https://www.python.org/", span: "col-span-12 sm:col-span-4", minWidth: "5rem" },
      ],
      [
        { src: "/logo-react.svg", alt: "React", href: "https://react.dev/", span: "col-span-6 sm:col-span-4", minWidth: "5rem" },
        { src: "/logo-tailwind.svg", alt: "Tailwind CSS", href: "https://tailwindcss.com/", span: "col-span-6 sm:col-span-4", minWidth: "5rem" },
        { src: "/logo-javascript.svg", alt: "JavaScript", href: "https://developer.mozilla.org/en-US/docs/Web/JavaScript", span: "col-span-12 sm:col-span-4", minWidth: "5rem" },
      ],
    ],
    screenshots: [
      {
        src: "/project-sla-monitor-dashboard.png",
        alt: "SLA Monitor dashboard with monitored endpoints",
        caption: "mission control — three endpoints, all green, latency in plain sight",
      },
      {
        src: "/project-sla-monitor-latency.png",
        alt: "SLA Monitor latency analytics for one endpoint",
        caption: "24 hours of latency for one target, spikes and all",
      },
      {
        src: "/project-sla-monitor-cognito.png",
        alt: "Cognito hosted UI sign-in",
        caption: "the front gate — Cognito hosted UI with Google OAuth wired in",
      },
      {
        src: "/project-sla-monitor-architecture.png",
        alt: "AWS architecture diagram of the monitoring system",
        caption: "the whole system on one sheet — five Lambdas and exactly what each may touch",
        fit: "contain",
      },
    ],
  },
  {
    slug: "shipping-crm",
    name: "Shipping CRM",
    tagline: "A logistics CRM connecting a shipping provider with its clients — quotes, shipments, tracking, and invoicing under one roof.",
    type: "Full-Stack CRM",
    year: "2026",
    status: "in-progress",
    role: "Solo Project",
    icon: "truck",
    heroImage: "/project-shipping-crm.png",
    heroImageAlt: "Shipping CRM — logistics and shipment management platform",
    seoDescription:
      "Shipping CRM — a multi-tenant logistics platform built with Laravel and React: shipment lifecycle, public tracking, invoices and credit notes, PDF labels with barcodes.",
    links: {
      repo: "https://github.com/Walid-Idrissi-Labs/Shipping-CRM",
      demo: true,
    },
    background: [
      "This one started with a cahier des charges — a real, versioned spec for a Moroccan logistics operator, with the kind of business rules you don't invent for fun: clients may create shipments but can never touch a status, every account gets a unique six-digit number, invoices carry ICE and fiscal fields, and mistakes aren't edited away — they're corrected with a proper credit note. Reading it, I knew this would teach me more than any tutorial project could.",
      "The system serves four different audiences from one codebase: the provider running operations, account clients managing their shipments and invoices, guests requesting express quotes, and anyone at all tracking a parcel on the public page — no login, just a tracking number and a five-stage timeline. Under it sits a Laravel API and a React front end, with PostgreSQL holding a schema I modeled before writing a line of application code.",
      "I also made myself work designer-first: before the build, I wireframed every screen as plain HTML — dashboards, invoice builder, shipment forms, tracking — and studied how UPS, FedEx and DHL structure their own pages. It's still in progress, and it's the project where I've felt closest to real-world software: less clever code, more getting the rules exactly right.",
    ],
    features: [
      {
        title: "Four audiences, one system",
        body: "Provider, account clients, guest quote requests, and a fully public tracking page — each with exactly the permissions their role implies, and not one more.",
      },
      {
        title: "A paper trail by design",
        body: "Quotes become shipments, shipments become invoices, and corrections become credit notes. Documents render server-side as PDFs, shipping labels included — barcode and all.",
      },
      {
        title: "Business rules enforced where it counts",
        body: "Shipments are immutably bound to the client's account number, statuses only move by the provider's hand, and Moroccan fiscal identity — ICE, RC, IF — is a first-class citizen.",
      },
      {
        title: "Spec-first, wireframe-second, code-third",
        body: "A versioned cahier des charges, a full data model, and HTML wireframes for every screen came before the implementation — so the build has a blueprint to answer to.",
      },
    ],
    stackRows: [
      [
        { src: "/logo-laravel.svg", alt: "Laravel", href: "https://laravel.com/", span: "col-span-6 sm:col-span-4", minWidth: "5rem" },
        { src: "/logo-react.svg", alt: "React", href: "https://react.dev/", span: "col-span-6 sm:col-span-4", minWidth: "5rem" },
        { src: "/logo-postgres.svg", alt: "PostgreSQL", href: "https://www.postgresql.org/", span: "col-span-12 sm:col-span-4", minWidth: "5rem" },
      ],
      [
        { src: "/logo-php.svg", alt: "PHP", href: "https://www.php.net/", span: "col-span-6 sm:col-span-4", minWidth: "5rem" },
        { src: "/logo-tailwind.svg", alt: "Tailwind CSS", href: "https://tailwindcss.com/", span: "col-span-6 sm:col-span-4", minWidth: "5rem" },
        { src: "/logo-javascript.svg", alt: "JavaScript", href: "https://developer.mozilla.org/en-US/docs/Web/JavaScript", span: "col-span-12 sm:col-span-4", minWidth: "5rem" },
      ],
    ],
    screenshots: [
      {
        src: "/project-shipping-crm-dashboard.png",
        alt: "Shipping CRM client dashboard wireframe",
        caption: "the client dashboard, wireframe edition — the build is chasing this blueprint",
      },
      {
        src: "/project-shipping-crm-shipment-form.png",
        alt: "Shipping CRM shipment creation wireframe",
        caption: "creating a shipment: sender, recipient, parcel — the whole customs-ready form",
      },
      {
        src: "/project-shipping-crm-tracking.png",
        alt: "Shipping CRM public tracking wireframe",
        caption: "public tracking — five stops from information reçue to delivered",
      },
      {
        src: "/project-shipping-crm-invoice.png",
        alt: "Shipping CRM invoice builder wireframe",
        caption: "the invoice builder — TVA math included, en dirhams",
      },
    ],
  },
];

export function getProject(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}
