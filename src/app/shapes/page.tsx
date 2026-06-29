import { ShapesStudio } from "./ShapesStudio";

// Unlisted utility page: not in the nav or sitemap, and kept out of search.
export const metadata = {
  title: "Shapes — SLBH",
  description: "Generator for SLBH field shapes — reroll colour, choose a ground, export a PNG.",
  robots: { index: false, follow: false },
};

export default function ShapesPage() {
  return <ShapesStudio />;
}
