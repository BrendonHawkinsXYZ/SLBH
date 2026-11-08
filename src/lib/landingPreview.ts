import type { DocumentImage, ProjectFileData } from "@/components/projects/ProjectFile.types";
import { projectFiles } from "./projectFiles";
import { chromaWorkshop } from "./chromaWorkshop";
import { homeArtwork } from "./homeArtwork";

export type LandingView = "home" | "collection" | "studio";
export type LandingGroup = "all" | "series" | "supporting";

export type LandingProject = {
  slug: string;
  title: string;
  shortTitle: string;
  href: string;
  year: string;
  form: string;
  place: string;
  group: "series" | "supporting";
  summary: string;
  image: DocumentImage;
};

export const studioBiography = "Studio Lab BH is an independent systems studio and research practice founded by Brendon Hawkins. It studies the invisible systems through which human experience becomes legible—to ourselves, to one another, and to computation—and builds models, products, artworks, environments, and programs to investigate them. Affect is its first formal field of inquiry.";

export function getLandingProjects(): LandingProject[] {
  const selections: {
    slug: string; shortTitle: string; record: ProjectFileData; year: string;
    form: string; place: string; group: LandingProject["group"]; image: string;
  }[] = [
    { slug: "tell-me-how-you-feel-pit-lab", shortTitle: "PIT Lab", record: projectFiles["tell-me-how-you-feel-pit-lab"], year: "2026", form: "Participatory drawing / public research", place: "Oculus, New York", group: "series", image: "cover.webp" },
    { slug: "tell-me-how-you-feel-chroma", shortTitle: "Chroma", record: chromaWorkshop, year: "2026", form: "Workshop / shared environment", place: "Plated Studios, Brooklyn", group: "series", image: "at-the-table.webp" },
    { slug: "acg", shortTitle: "ACG", record: projectFiles.acg, year: "2026–ongoing", form: "Light installation", place: "The Space, New York", group: "series", image: "installation-storefront.webp" },
    { slug: "affective-geometry", shortTitle: "Affective Geometry", record: projectFiles["affective-geometry"], year: "2026–ongoing", form: "Geometric studies", place: "New York", group: "supporting", image: "plate-rhombus.png" },
    { slug: "new-york-emotions", shortTitle: "New York Emotions", record: projectFiles["new-york-emotions"], year: "2025", form: "Public study / computational color", place: "New York", group: "supporting", image: "daily-fields.webp" },
  ];

  return selections.map(({ record, image, ...selection }) => ({
    ...selection,
    title: record.title,
    href: `/projects/${selection.slug}`,
    summary: record.summary,
    image: record.images.find(item => item.src.endsWith(image)) ?? record.images[0],
  }));
}

export function getLandingFeature() {
  const paths = ["acg-storefront.webp", "pit-lab-inspired-portrait.webp", "chroma-shared-table.webp"];
  return paths.flatMap(path => {
    const image = homeArtwork.find(item => item.src.endsWith(path));
    return image ? [image] : [];
  });
}
