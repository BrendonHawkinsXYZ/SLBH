import fs from "fs";
import path from "path";
import matter from "gray-matter";

export type ProjectStatus = "ongoing" | "complete" | "archived";

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
  cover: string;
  thumbnail: string;
  summary: string;
  related: string[];
  links: ProjectLink[];
};

const CONTENT_DIR = path.join(process.cwd(), "content/projects");

export function getAllProjects(): Project[] {
  const dirs = fs
    .readdirSync(CONTENT_DIR)
    .filter((name) =>
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
      status: (data.status ?? "ongoing") as ProjectStatus,
      cover: data.cover ?? "cover.webp",
      thumbnail: data.thumbnail ?? "thumbnail.webp",
      summary: data.summary ?? "",
      related: (data.related ?? []) as string[],
      links: (data.links ?? []) as ProjectLink[],
    };
  });

  return projects.sort((a, b) => a.index.localeCompare(b.index));
}
