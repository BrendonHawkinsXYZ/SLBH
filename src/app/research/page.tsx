import { redirect } from "next/navigation";
import { getAllResearchPapers } from "@/lib/research";

export default function ResearchPage() {
  // §8.1 If the publications list has exactly one entry, redirect to it.
  // Once a second paper lands, this file becomes the real index.
  const papers = getAllResearchPapers();
  if (papers.length === 1) redirect(`/research/${papers[0].slug}`);

  // §8.2 Future index structure (≥2 papers) — not built in v2.0.
  return null;
}
