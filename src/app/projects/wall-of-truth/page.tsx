import { ProjectEssay } from "@/components/projects/essay/ProjectEssay";
import { wallOfTruth } from "@/lib/earlyProjects";

export const metadata = {
  title: `${wallOfTruth.title} — Studio Lab BH`,
  description: wallOfTruth.summary,
};

export default function ProjectPage() {
  return <ProjectEssay slug="wall-of-truth" />;
}
