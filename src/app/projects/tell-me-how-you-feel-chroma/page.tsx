import { ProjectEssay } from "@/components/projects/essay/ProjectEssay";
import { chromaWorkshop } from "@/lib/chromaWorkshop";

export const metadata = {
  title: `${chromaWorkshop.title} — Studio Lab BH`,
  description: chromaWorkshop.summary,
};

export default function WorkshopPage() {
  return <ProjectEssay slug="tell-me-how-you-feel-chroma" />;
}
