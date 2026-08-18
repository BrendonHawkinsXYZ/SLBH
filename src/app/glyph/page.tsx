import { GlyphStudio } from "./GlyphStudio";

// Unlisted utility page: not in the nav or sitemap, and kept out of search.
export const metadata = {
  title: "Glyph — SLBH",
  description:
    "Pixel emoji instrument — choose a 12, 16, 24, or 32 square grid, lay a pasted SVG or PNG under it as a guide, fill the cells by hand, and export the glyph as a clean SVG.",
  robots: { index: false, follow: false },
};

export default function GlyphPage() {
  return <GlyphStudio />;
}
