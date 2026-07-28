import { FigureStudio } from "./FigureStudio";

// Unlisted utility page: not in the nav or sitemap, and kept out of search.
export const metadata = {
  title: "Figure — SLBH",
  description:
    "Character instrument for SLBH pixel figures — dress the figure, choose a ground, export a PNG or the settings as JSON.",
  robots: { index: false, follow: false },
};

export default function FigurePage() {
  return <FigureStudio />;
}
