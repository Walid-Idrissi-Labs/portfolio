import { projects } from "../lib/projects";
import { GITHUB_URL, LINKEDIN_URL, RESUME_URL, SITE_URL } from "../lib/site";

// Served at /llms.txt (https://llmstxt.org): a plain-text summary of the site
// for AI tools. Built once at build time from the projects list, so it stays
// in sync with the catalogue.
export const dynamic = "force-static";

export function GET() {
  const body = [
    "# Walid Idrissi",
    "",
    "> Portfolio of Walid Idrissi — software engineering student building for the web and the cloud.",
    "",
    "Software engineering student at Cadi Ayyad University in Marrakech, in the engineering cycle specializing in computer networks and information systems. Works across the stack: clean, functional frontends, plus backend and AWS cloud infrastructure (serverless architecture, infrastructure as code).",
    "",
    "## Projects",
    "",
    ...projects.map((project) => `- [${project.name}](${SITE_URL}/projects/${project.slug}): ${project.seoDescription}`),
    "",
    "## Pages",
    "",
    `- [Home](${SITE_URL}/): overview, background, and applied technologies`,
    `- [Project catalogue](${SITE_URL}/projects): the full index of projects`,
    `- [Contact](${SITE_URL}/contact): contact form and profile links`,
    "",
    "## Links",
    "",
    `- [GitHub](${GITHUB_URL})`,
    `- [LinkedIn](${LINKEDIN_URL})`,
    `- [Resume (PDF)](${RESUME_URL})`,
    "",
  ].join("\n");

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
