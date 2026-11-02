import { ProjectEssay } from "@/components/projects/essay/ProjectEssay";
import { pitLab } from "@/lib/pitLab";

export const metadata = {
  title: `${pitLab.title} — Studio Lab BH`,
  description: pitLab.summary,
};

export default function PitLabPage() {
  return <ProjectEssay slug="tell-me-how-you-feel-pit-lab" />;
}
