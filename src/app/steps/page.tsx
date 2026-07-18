import { StepsStudio } from "./StepsStudio";

// Unlisted utility page: not in the nav or sitemap, and kept out of search.
export const metadata = {
  title: "Steps — SLBH",
  description:
    "Colour step generator — blend between colour stops with specified steps, RGB / LAB / HSL, and export a PNG.",
  robots: { index: false, follow: false },
};

export default function StepsPage() {
  return <StepsStudio />;
}
