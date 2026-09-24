import type { Metadata } from "next";
import { ProjectFile } from "@/components/projects/ProjectFile";
import { projectFiles } from "@/lib/projectFiles";
import { StudyEnd } from "@/components/projects/acg-studies/Shared";

export const metadata: Metadata = { title: "Test 1 — ACG / Project file — Studio Lab BH" };

export default function ProjectFilePage() {
  return <>
    <ProjectFile project={projectFiles.acg} preview />
    <StudyEnd number={1} name="Project file">The project at a glance. A short abstract, an explicit system, and a scrollable documentation record. Detail is available without becoming the first thing you read.</StudyEnd>
  </>;
}
