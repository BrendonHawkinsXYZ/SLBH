import type { MetadataRoute } from "next";
import { getAllResearchPapers } from "@/lib/research";
import { getAllProjects } from "@/lib/projects";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  // Top-level content pages. (/research redirects to the latest paper, so the
  // individual papers below stand in for it.)
  const staticPaths = ["", "/projects", "/studio", "/field-notes"];
  const staticEntries: MetadataRoute.Sitemap = staticPaths.map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: path === "" ? 1 : 0.8,
  }));

  const paperEntries: MetadataRoute.Sitemap = getAllResearchPapers().map((paper) => ({
    url: `${SITE_URL}/research/${paper.slug}`,
    lastModified: paper.date ? new Date(paper.date) : now,
    changeFrequency: "yearly",
    priority: 0.7,
  }));

  // Project detail pages. Some projects override their link via `href`
  // (e.g. Field Notes -> /field-notes); only internal paths belong here, and
  // anything already covered by a static entry is dropped.
  const projectPaths = new Set<string>();
  for (const project of getAllProjects()) {
    const path = project.href ?? `/projects/${project.slug}`;
    if (path.startsWith("/") && !staticPaths.includes(path)) {
      projectPaths.add(path);
    }
  }
  const projectEntries: MetadataRoute.Sitemap = [...projectPaths].map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticEntries, ...paperEntries, ...projectEntries];
}
