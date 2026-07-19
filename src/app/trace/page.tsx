import { TraceStudio } from "./TraceStudio";

// Unlisted utility page: not in the nav or sitemap, and kept out of search.
export const metadata = {
  title: "Trace — SLBH",
  description:
    "Image trace instrument — turn a sketch or scan into smooth vector curves in the browser, and export an SVG or a transparent PNG.",
  robots: { index: false, follow: false },
};

export default function TracePage() {
  return <TraceStudio />;
}
