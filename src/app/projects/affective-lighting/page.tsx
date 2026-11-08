import { ProjectEssay } from "@/components/projects/essay/ProjectEssay";
import { affectiveLighting } from "@/lib/earlyProjects";

export const metadata = {
  title: `${affectiveLighting.title} — Studio Lab BH`,
  description: affectiveLighting.summary,
};

export default function ProjectPage() {
  return <ProjectEssay slug="affective-lighting" />;
}
