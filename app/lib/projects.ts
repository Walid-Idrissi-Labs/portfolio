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
  /** true wraps the shot in the faux-window chrome; defaults to a raw screenshot with just a border. */
  chrome?: boolean;
  /** Intrinsic pixel dimensions; when set the frame matches the image's real
   *  aspect ratio instead of forcing 16:9. Give both or neither. */
  width?: number;
  height?: number;
};


const defaultFauxWindowChrome = {
  chrome: false,
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
  screenshots: ProjectScreenshot[] ;
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
      "A fully serverless URL shortener on AWS : API Gateway, Lambda and DynamoDB, provisioned entirely with Terraform.",
    links: {
      repo: "https://github.com/walid-idrissi-labs/url-shortener",
      demo: true,
    },
    background: [
      "This one started as a challenge I set for myself: after months of AWS coursework and labs, I wanted to find out if I could actually ship something real. A URL shortener is about as basic as it gets, I know. But I gave myself one rule: every resource had to be provisioned with Terraform, no clicking around in the console. That constraint is what turned a simple weekend project into an actual lesson in cloud engineering and infrastructure.",
      "The architecture is fully serverless. API Gateway receives the request, a Lambda function generates the short code (or looks it up and handles the redirect), and DynamoDB keeps the mappings. There's no idle compute, so it scales to zero and costs close to nothing to keep alive. Honestly, The part I spent the most time on wasn't the application logic, it was IAM. I followed least privilege throughout, scoping every role down to exactly the actions and resources it needed, nothing broader. Looking back, that was the most valuable part of the build.",
      "What stayed with me isn't the shortener itself, it's the workflow. Define the infrastructure in code, version it, tear it down, rebuild it from scratch in minutes. Once you've worked that way, clicking around a cloud console feels like a step backwards.",
    ],
    features: [
      {
        title: "Serverless end to end",
        body: "API Gateway takes the request, Lambda resolves it, DynamoDB stores the mappings. There is no server to patch, and the whole thing scales to zero when idle.",
      },
      {
        title: "IaC : Infrastructure as code",
        body: "Every resource is provisionned in Terraform. The entire stack can be destroyed and rebuilt from scratch with Terraform commands.",
      },
      {
        title: "Least-privilege IAM",
        body: "Each component gets exactly the permissions it needs, and nothing more. That's the point of least privilege. A compromised Lambda can't touch resources it was never scoped to reach in the first place. It takes more upfront work than attaching a broad managed policy, but it shrinks the blast radius if anything ever goes wrong.",
      },
      {
        title: "Built to cost nothing at rest",
        body: "The whole stack is serverless and billed pay-per-request, so it idles for free. Lambda only spins up when a link is actually resolved, runs for a few milliseconds, and then shuts back down. No servers sitting around waiting for traffic.",
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
        src: "/project-url-shortener-1.png",
        alt: "URL Shortener home page",
        caption: "Home page of the URL Shortener.",
        width: 2872,
        height: 2384,
      },
      {
        src: "/project-url-shortener-2.png",
        alt: "Inserting link to shorten",
        caption: "Inserting a link to shorten —> the Lambda generates a short code and stores it in DynamoDB.",
        width: 2872,
        height: 2384,
      },
      {
        src: "/project-url-shortener-3.png",
        alt: "Generated URL and redirect",
        caption: "The generated short URL and the redirect behavior.",
        width: 2872,
        height: 2384,
      },
      {
        src: "/project-url-shortener-4.png",
        alt: "AWS architecture diagram of the URL Shortener",
        caption: "AWS architecture diagram of the URL Shortener, showing CloudFront, API Gateway, Lambda, DynamoDB and S3 (for the static assets).",
        chrome: false,
        width: 2872,
        height: 2384,
      },
    ],
  },









  
  {
    slug: "tascii",
    name: "tascii",
    tagline: "A fast, minimal task manager that lives where I do... in the terminal.",
    type: "Terminal App",
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
      "Developers and Engineers spend most of their time in the terminal. Every task manager I tried wanted to pull me out of it: a separate app, a browser tab, an account to sync. I wanted the opposite: open a terminal, see my tasks, get back to work. So I built tascii.",
      "It's written in Go, mainly for startup time. A tool you open fifty times a day has to be instant, not 'loading spinner' instant. Everything's keyboard-driven, no mouse, no menus. The UI stays plain and efficient on purpose: no colors competing for attention, no features bolted on because they looked good in a demo.",
      "Still actively building it, and I use it daily, which is the real test. Every annoyance becomes the next task, and the todo list for tascii is managed in tascii.",
    ],
    features: [
      {
        title: "Starts before you before you lose the idea",
        body: "A single compiled Go binary with no runtime to warm up. Launch, capture the task, close.",
      },
      {
        title: "Hands on Keyboard all the time",
        body: "Every action is a keystroke. No mouse, no menus.",
      },
      {
        title: "Nothing to install around it",
        body: "One binary on your PATH and you're done. No daemon, no account, no sync service, no bloat...",
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
        src: "/project-tascii-1.png",
        alt: "basic tascii commands",
        caption: "Basic tasks in tascii : adding new tasks, viewing all tasks, viewing tasks due today",
      },
      {
        src: "/project-tascii-2.png",
        alt: "elaborate tascii task creation",
        caption: "Tasks in more detail : priority, starting tasks, editing tasks ,viewing single task details,",
      },
      {
        src: "/project-tascii-3.png",
        alt: "completing and clearing tasks in tascii",
        caption: "Completing and clearing tasks in tascii : marking tasks as complete, clearing completed tasks, viewing completed tasks",
      },
    ],
  },








  {
    slug: "applyr",
    name: "Applyr",
    tagline: "A workspace built for hiring momentum,  applications, resumes, and follow-ups in one easy to use app.",
    type: "Full-Stack SaaS",
    year: "2026",
    status: "in-progress",
    role: "Team of Two",
    icon: "briefcase",
    heroImage: "/project-applyr-0.png",
    heroImageAlt: "Applyr — job application tracking SaaS",
    seoDescription:
      "Applyr — a job application tracking SaaS with a Laravel API, a React SPA, AI-tailored resumes, and browser extensions that capture listings straight from job boards.",
    links: {
      repo: "https://github.com/Walid-Idrissi-Labs/Applyr",
      demo: true,
    },
    background: [
      "Applyr came out of a problem my classmate and I knew personally, the job hunt thsese days turns quickly into chaos. Spreadsheets, bookmarked listings, five versions of the same resume. The goal was to make a single app that holds all of it. So we built it as a real SaaS: a Laravel REST API for the backend, a React SPA for the frontend, communication between them is done with a token and a contract shared between them, keeping the two apps isolated and secure.",
      "This app is more than basic CRUD. Every application added moves through a proper pipeline : wishlist to applied to interview to offer, and every status change is logged to its history automatically. Resumes have a master profile that AI tailors per application, with OCR to pull text out of an uploaded PDF and a clean A4 export at the end.",
      "We also shipped browser extensions for Chrome and Firefox: allowing for quick capture of job listings on the fly and without leaving the tab.",
      "Building it as a duo taught me things solo projects never had : agreeing on the API before writing either side of it, reviewing each other's assumptions, and keeping fourteen pages of frontend consistent while both of us moved fast, working in git simulatneously and resolving merge conflicts. By the end we had auth flows, an admin panel, scheduled reminder emails.",
    ],
    features: [
      {
        title: "One pipeline, every transition on record",
        body: "Applications flow from wishlist to accepted through a defined coherent lifecycle, and each status change is written to a history log automatically.",
      },
      {
        title: "AI Resume tailoring",
        body: "A master profile feeds an AI that drafts per-application resume variants. Uploaded PDFs are parsed with OCR as a fallback  and the result exports as a clean A4 document.",
      },
      {
        title: "Capture jobs without leaving the tab",
        body: "Chrome and Firefox extensions send the listing you're viewing to the API and are directly added to your account.",
      },
      {
        title: "Two apps, API Communication",
        body: "A React SPA talks to a Laravel REST API over Sanctum tokens. 40+ endpoints with form-request validation, API resources, an admin panel, and daily scheduled reminder emails.",
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
        src: "/project-applyr-1.png",
        alt: "Applyr landing page",
        caption: "The landing page, pitching the workspace with a live pipeline preview.",
      },
      {
        src: "/project-applyr-2.png",
        alt: "Applyr sign-in page",
        caption: "Signing in to Applyr.",
      },
      {
        src: "/project-applyr-3.png",
        alt: "Applyr dashboard overview",
        caption: "The dashboard: recent activity, in-progress applications, and top-level KPIs.",
      },
      {
        src: "/project-applyr-4.png",
        alt: "Applyr dashboard status breakdown and key indicators",
        caption: "Further down the dashboard: a status breakdown chart and key indicators.",
      },
      {
        src: "/project-applyr-5.png",
        alt: "Applyr applications list",
        caption: "The full applications list, filterable by status.",
      },
      {
        src: "/project-applyr-6.png",
        alt: "Applyr application detail page",
        caption: "A single application's detail page, with status history and AI actions.",
      },
      {
        src: "/project-applyr-7.png",
        alt: "Applyr resume workspace",
        caption: "The resume workspace: a master profile plus tailored drafts per application.",
      },
      {
        src: "/project-applyr-8.png",
        alt: "Applyr notifications page",
        caption: "Notifications, logging every status change automatically.",
      },
      {
        src: "/project-applyr-9.png",
        alt: "Applyr profile page",
        caption: "The profile page, for account details and password changes.",
      },
      {
        src: "/project-applyr-10.png",
        alt: "Applyr resume PDF preview with AI refine",
        caption: "A resume PDF preview, with version history and a Refine with AI action.",
      },
      {
        src: "/project-applyr-11.png",
        alt: "Applyr dashboard in dark mode",
        caption: "The dashboard again, this time in dark mode.",
      },
      {
        src: "/project-applyr-12.png",
        alt: "Applyr browser extension capturing a job listing",
        caption: "The browser extension, capturing a job listing straight from the job board.",
      },
    ],
  },








  {
    slug: "sla-monitor",
    name: "SLA Monitor",
    tagline: "A serverless AWS platform that monitors endpoints minute by minute, detects incidents, and generates weekly SLA reports.",
    type: "Cloud Architecture",
    year: "2026",
    status: "in-progress",
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
      "After the URL shortener I set my goal on a more ambitious project, and a project that would deepen my understanding of Cloud Architectures, and my engineering approach and problem solving.",
      "I built it in the order the problem itself demanded. First the Monitor Lambda: EventBridge wakes it every minute, it probes each target, and logs status and latency to DynamoDB.", 
      "Only once that history existed could I reason about the next question. One failed ping isn't an incident, three in a row is, so the SLA Processor came next, running hourly, opening incidents on consecutive failures and closing them the moment a target recovers.", 
      "The Report Generator came last, because it needed the other two to already be trustworthy: every Monday it rolls the week into uptime, p50/p95/p99 latency, error rate, MTTR and MTBF, checks each number against that project's own thresholds, and mails the verdict out through SES.", 
      "Five Lambdas, five different clocks, each doing exactly their job.",
      "The API and auth layer came last. Cognito handles sign-in with Google OAuth wired in as an Identity Provider, API Gateway validates the JWT before anything reaches compute, and the read-only API's Lambda role is scoped narrow enough that even a fully compromised endpoint physically cannot write a record. Every resource behind all of it went in through Terraform modules.",
    ],
    features: [
      {
        title: "Five Lambdas, each its job",
        body: "Monitor every minute, incident detection every hour, reports every Monday, a read-only API, and a project manager for writes. each function triggered on its own schedule with EventBridge.",
      },
      {
        title: "Professional Metrics",
        body: "Weekly reports compute uptime, p50/p95/p99 latency, error rate, downtime, MTTR and MTBF, evaluate them against per-project thresholds, and assign a severity before landing in user's inbox.",
      },
      {
        title: "Terraform Provisioning",
        body: "Clear Modular IaC with remote state in Terraform Cloud. Lambda deployments are content-hashed and immutable, a code change produces a new artifact, and nothing was made in the console.",
      },
      {
        title: "Least-privilege access control",
        body: "API Gateway validates Cognito JWTs before any request reaches compute. Each Lambda function runs under its own scoped role, no shared roles, no wildcard ARNs. If the read path were ever compromised, not a single record would ever be written.",
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
