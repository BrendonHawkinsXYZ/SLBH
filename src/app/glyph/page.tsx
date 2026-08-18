import { GlyphStudio } from "./GlyphStudio";

// Unlisted utility page: not in the nav or sitemap, and kept out of search.
export const metadata = {
  title: "Glyph — SLBH",
  description:
    "Pixel emoji instrument — draw a 1-bit glyph on a 12, 16, 24, or 32 square grid and export it as a clean SVG.",
  robots: { index: false, follow: false },
};

export default function GlyphPage() {
  return <GlyphStudio />;
}
