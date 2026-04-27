import fs from "fs";
import path from "path";
import matter from "gray-matter";

export type PaperStatus = "draft" | "preprint" | "published" | "archived";

export type ResearchPaper = {
  title: string;
  slug: string;
  authors: string[];
  date: string;
  status: PaperStatus;
  venue: string;
  venueId: string;
  venueUrl: string;
  doi: string | null;
  abstract: string;
  tags: string[];
  related: string[];
  pdf: string;
};

const CONTENT_DIR = path.join(process.cwd(), "content/research");

export function getAllResearchPapers(): ResearchPaper[] {
  if (!fs.existsSync(CONTENT_DIR)) return [];

  const dirs = fs
    .readdirSync(CONTENT_DIR)
    .filter(
      (name) =>
        fs.statSync(path.join(CONTENT_DIR, name)).isDirectory() &&
        fs.existsSync(path.join(CONTENT_DIR, name, "index.mdx"))
    );

  const papers: ResearchPaper[] = dirs.map((slug) => {
    const raw = fs.readFileSync(
      path.join(CONTENT_DIR, slug, "index.mdx"),
      "utf-8"
    );
    const { data } = matter(raw);
    return {
      title: data.title ?? slug,
      slug: data.slug ?? slug,
      authors: (data.authors ?? []) as string[],
      date: String(data.date ?? ""),
      status: (data.status ?? "draft") as PaperStatus,
      venue: data.venue ?? "",
      venueId: data.venueId ?? "",
      venueUrl: data.venueUrl ?? "",
      doi: data.doi ?? null,
      abstract: data.abstract ?? "",
      tags: (data.tags ?? []) as string[],
      related: (data.related ?? []) as string[],
      pdf: data.pdf ?? "",
    };
  });

  return papers.sort((a, b) => b.date.localeCompare(a.date));
}
