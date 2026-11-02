import { homeArtwork } from "./homeArtwork";

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

/** The homepage gallery and evening previews share the curated image selection. */
export function getGalleryArtwork(): Artwork[] {
  return homeArtwork;
}
