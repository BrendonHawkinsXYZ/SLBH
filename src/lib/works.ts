import { getAllProjects } from "./projects";
import { getAllResearchPapers } from "./research";

export type WorkFormat = "Product" | "Research" | "Study" | "Instrument" | "Installation" | "Graphical";
export type Work = {
  id: string;
  title: string;
  href: string;
  formats: WorkFormat[];
  year: string;
  summary: string;
  image?: string;
  status: string;
  series?: string;
  related: string[];
  informedBy?: string[];
  featured?: boolean;
};

/** One index source; project stories and publication metadata stay in their existing records. */
export function getWorks(): Work[] {
  const papers: Work[] = getAllResearchPapers().map(paper => ({
    id: paper.slug,
    title: paper.slug === "emotion-as-system" ? "Emotion as System" : paper.title,
    href: `/research/${paper.slug}`,
    formats: ["Research"],
    year: paper.date.slice(0, 4),
    summary: paper.abstract,
    status: paper.status,
    related: paper.related,
    featured: paper.slug === "emotion-as-system",
  }));
  const chroma: Work = {
    id: "chroma", title: "Chroma", href: "/work/chroma", formats: ["Product"], year: "2026",
    summary: "A private emotional journal. Give a moment color and form, then return to it over time.",
    image: "/chroma/collection.png", status: "active", series: "Affective Geometry",
    related: ["affective-geometry", "emotion-as-system"], featured: true,
    // Authored lineage, ordered by relevance to this product. Keep the full
    // archive separate; a different feature can carry a different selection.
    informedBy: [
      "emotion-as-system",
      "affective-geometry",
      "american-emotions",
      "acg",
      "tihif-nyc",
      "diagrams",
    ],
  };
  const projects: Work[] = getAllProjects().map(project => ({
    id: project.slug, title: project.title, href: project.href ?? `/projects/${project.slug}`,
    formats: project.slug === "acg" ? ["Installation"] : [project.type === "Archive" ? "Study" : project.type],
    year: project.year, summary: project.summary, image: project.coverPath || undefined,
    status: project.status, related: project.related, featured: project.slug === "acg",
  }));
  const diagramCollection: Work = {
    id: "diagrams", title: "Diagrams", href: "/diagrams", formats: ["Graphical"],
    year: "", summary: "Working definitions and visual studies from Affective Computational Geometry.",
    image: "/diagrams/emotion-definition.png", status: "", related: ["emotion-as-system"],
  };
  const rank = ["emotion-as-system", "chroma", "acg", "affective-geometry", "american-emotions", "affective-sculptural-sketches", "global-emotions", "convergent-grammar", "tihif-nyc"];
  return [...papers, chroma, ...projects, diagramCollection].sort((a, b) => {
    const aRank = rank.indexOf(a.id), bRank = rank.indexOf(b.id);
    return (aRank < 0 ? rank.length : aRank) - (bRank < 0 ? rank.length : bRank);
  });
}

export function getSelectedWorks(featuredWorkId: string): Work[] {
  const works = getWorks();
  const featured = works.find(work => work.id === featuredWorkId);
  return (featured?.informedBy ?? []).flatMap(id => {
    const work = works.find(candidate => candidate.id === id);
    return work && work.id !== featuredWorkId ? [work] : [];
  });
}
