import { ProjectFile } from "@/components/projects/ProjectFile";
import { projectFiles } from "@/lib/projectFiles";

const project = projectFiles["affective-sculptural-sketches"];

export const metadata = {
  title: `${project.title} — Studio Lab BH`,
  description: project.summary,
};

export default function ProjectPage() {
  return <ProjectFile project={project} />;
}
