import { diagrams } from "./diagrams";
import { posters } from "./posters";
import { projectFiles } from "./projectFiles";
import { chromaWorkshop } from "./chromaWorkshop";
import { newYorkTimeLapse } from "./newYorkEmotions";
import type { Work } from "./works";
import { artworkColors } from "./artworkColors";

export type Artwork = {
  src: string;
  stillSrc?: string;
  alt: string;
  width: number;
  height: number;
  title: string;
  project: string;
  href: string;
  year: string;
  color?: string;
};

/** Reuse the project, poster, and diagram image records; never copy their assets. */
export function getGalleryArtwork(works: Work[]): Artwork[] {
  const projects = Object.entries({ ...projectFiles, "tell-me-how-you-feel-chroma": chromaWorkshop }).flatMap(([id, project]) => {
    const work = works.find(candidate => candidate.id === id);
    return project.images.map(image => ({
      ...image,
      project: project.title,
      href: work?.href ?? `/projects/${id}`,
      year: work?.year ?? "",
    }));
  });
  const collections = [
    ...posters.map(image => ({ ...image, project: "Posters", href: "/posters" })),
    ...diagrams.map(image => ({ ...image, project: "Diagrams", href: "/diagrams" })),
  ].map(image => ({ ...image, src: image.image, year: "" }));
  const all: Artwork[] = [
    { ...newYorkTimeLapse, project: "New York Emotions", href: "/projects/new-york-emotions", year: "2025" },
    ...projects,
    ...collections,
  ];

  // The opening sequence crosses the practice before continuing through the archive.
  const opening = [
    newYorkTimeLapse.src,
    "/projects/american-emotions/render-2024.png",
    "/projects/affective-geometry/plate-circle.png",
    "/projects/acg/installation-storefront.webp",
    "/projects/tell-me-how-you-feel-chroma/at-the-table.webp",
    "/posters/techno-savior.png",
    "/chroma/collection.png",
    "/projects/new-york-emotions/daily-fields.webp",
    "/diagrams/emotion-definition.png",
  ];
  const first = opening.flatMap(src => all.find(image => image.src === src) ?? []);
  return [...first, ...all.filter(image => !opening.includes(image.src))]
    .map(image => ({ ...image, color: artworkColors[image.src] ?? "#969693" }));
}
