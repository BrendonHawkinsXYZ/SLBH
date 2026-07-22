import { BloomStudio } from "./BloomStudio";

// Unlisted utility page: not in the nav or sitemap, and kept out of search.
export const metadata = {
  title: "Bloom — SLBH",
  description: "A field shape that grows — set a seed and a bloom, then play the seed sprout and morph into the end shape.",
  robots: { index: false, follow: false },
};

export default function BloomPage() {
  return <BloomStudio />;
}
