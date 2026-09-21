// Canonical production origin, used wherever an absolute URL is required
// (sitemap, robots.txt, llms.txt, structured data).
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "https://walid-idrissi.vercel.app";
export const SITE_NAME = "Walid Idrissi";
export const SITE_DESCRIPTION =
  "Walid Idrissi is a software engineering student in Marrakech building full-stack applications, AWS cloud infrastructure, and developer tools.";

export const GITHUB_URL = "https://github.com/walid-idrissi-labs";
export const LINKEDIN_URL = "https://linkedin.com/in/walid-idrissi-labkhati";
export const RESUME_URL = "https://walid-idrissi-resume.s3.us-west-2.amazonaws.com/walid-idrissi-labkhati-resume.pdf";
