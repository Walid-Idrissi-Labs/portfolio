import type { MetadataRoute } from "next";

import { projects } from "./lib/projects";
import { SITE_URL } from "./lib/site";

// Served at /sitemap.xml. Case studies come from the projects list, so a new
// project is listed as soon as its entry is added.
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: SITE_URL },
    { url: `${SITE_URL}/projects` },
    ...projects.map((project) => ({ url: `${SITE_URL}/projects/${project.slug}` })),
    { url: `${SITE_URL}/contact` },
  ];
}
