import { ChromaStudio } from "@/app/chroma/ChromaStudio";

// Unlisted utility page: not in the nav or sitemap, and kept out of search.
export const metadata = {
  title: "Chroma sequence tool — Studio Lab BH",
  description: "Sequence field shapes into a 15-second morphing video on the CHROMA template.",
  robots: { index: false, follow: false },
};

export default function ChromaPage() {
  return <ChromaStudio />;
}
