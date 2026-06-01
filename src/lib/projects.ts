import fs from "fs";
import path from "path";
import matter from "gray-matter";

export type ProjectStatus = "active" | "ongoing" | "paused" | "complete";

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
  summary: string;
  related: string[];
  links: ProjectLink[];
  coverPath: string;     // resolved public URL or "" if not found
  thumbnailPath: string; // resolved public URL or "" if not found
};

const CONTENT_DIR = path.join(process.cwd(), "content/projects");
const PUBLIC_DIR = path.join(process.cwd(), "public/projects");
const EXTS = ["webp", "jpg", "jpeg", "png"];

export function findImage(slug: string, base: string): string {
  for (const ext of EXTS) {
    if (fs.existsSync(path.join(PUBLIC_DIR, slug, `${base}.${ext}`))) {
      return `/projects/${slug}/${base}.${ext}`;
    }
  }
  return "";
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
      summary: data.summary ?? "",
      related: (data.related ?? []) as string[],
      links: (data.links ?? []) as ProjectLink[],
      coverPath: findImage(slug, "cover"),
      thumbnailPath: findImage(slug, "thumbnail"),
    };
  });

  return projects.sort((a, b) => a.index.localeCompare(b.index));
}
