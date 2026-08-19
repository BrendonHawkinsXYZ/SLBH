import { GlyphStudio } from "./GlyphStudio";

// Unlisted utility page: not in the nav or sitemap, and kept out of search.
export const metadata = {
  title: "Glyph — SLBH",
  description:
    "Pixel emoji instrument — choose a grid from 12 to 256 squares, lay a pasted SVG or PNG under it as a guide, trace it by hand or have it traced for you, and export the glyph as a clean SVG.",
  robots: { index: false, follow: false },
};

export default function GlyphPage() {
  return <GlyphStudio />;
}
