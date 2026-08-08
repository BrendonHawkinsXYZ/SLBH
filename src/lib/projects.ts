import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { findAsset } from "./assets";

export type ProjectStatus =
  | "flagship"
  | "active"
  | "seasonal"
  | "complete"
  | "archived"
  | "in-development";

export type ProjectType =
  | "Product"
  | "Instrument"
  | "Installation"
  | "Study"
  | "Research"
  | "Archive";

/**
 * Display order for the index: current work first, finished work last. Shared by
 * the sort in getAllProjects() and the readout strip on /projects, so the order
 * a visitor reads and the order the counts are tallied in can never drift.
 */
export const STATUS_ORDER: ProjectStatus[] = [
  "flagship",
  "active",
  "seasonal",
  "in-development",
  "complete",
  "archived",
];

const STATUS_RANK = new Map(STATUS_ORDER.map((status, i) => [status, i]));

export type ProjectLink = {
  label: string;
  url: string;
};

export type Project = {
  title: string;
  slug: string;
  year: string;
  index: string;
  discipline: string[];
  status: ProjectStatus;
  type: ProjectType;
  summary: string;
  related: string[];
  links: ProjectLink[];
  href?: string;        // overrides the default /projects/{slug} index link
  coverPath: string;     // resolved public URL or "" if not found
  thumbnailPath: string; // resolved public URL or "" if not found
};

const CONTENT_DIR = path.join(process.cwd(), "content/projects");

export function findImage(slug: string, base: string): string {
  return findAsset(`projects/${slug}`, base);
}

export function getAllProjects(): Project[] {
  const dirs = fs
    .readdirSync(CONTENT_DIR)
    .filter(
      (name) =>
        fs.statSync(path.join(CONTENT_DIR, name)).isDirectory() &&
        fs.existsSync(path.join(CONTENT_DIR, name, "index.mdx"))
    );

  const projects: Project[] = dirs.map((slug) => {
    const raw = fs.readFileSync(
      path.join(CONTENT_DIR, slug, "index.mdx"),
      "utf-8"
    );
    const { data } = matter(raw);
    return {
      title: data.title ?? slug,
      slug,
      year: String(data.year ?? ""),
      index: String(data.index ?? "00"),
      discipline: ((data.discipline ?? []) as string[]).map((d) =>
        d.toUpperCase()
      ),
      status: (data.status ?? "active") as ProjectStatus,
      type: (data.type ?? "Research") as ProjectType,
      summary: data.summary ?? "",
      related: (data.related ?? []) as string[],
      links: (data.links ?? []) as ProjectLink[],
      href: data.href ? String(data.href) : undefined,
      coverPath: findImage(slug, "cover"),
      thumbnailPath: findImage(slug, "thumbnail"),
    };
  });

  // Status first, then the authored index within each status band. An unknown
  // status sorts to the end rather than silently jumping the queue.
  return projects.sort((a, b) => {
    const ra = STATUS_RANK.get(a.status) ?? STATUS_ORDER.length;
    const rb = STATUS_RANK.get(b.status) ?? STATUS_ORDER.length;
    return ra !== rb ? ra - rb : a.index.localeCompare(b.index);
  });
}
