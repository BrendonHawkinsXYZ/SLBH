import { ProjectEssay } from "@/components/projects/essay/ProjectEssay";
import { projectFiles } from "@/lib/projectFiles";

const project = projectFiles["convergent-grammar"];

export const metadata = {
  title: `${project.title} — Studio Lab BH`,
  description: project.summary,
};

export default function ProjectPage() {
  return <ProjectEssay slug="convergent-grammar" />;
}
