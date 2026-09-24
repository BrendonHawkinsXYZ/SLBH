import type { Metadata } from "next";
import { WorkIndex } from "@/components/index/WorkIndex";
import { getWorks } from "@/lib/works";

export const metadata: Metadata = { title: "Work — Studio Lab BH", description: "Papers, products, studies, instruments, installations, visual work, and participatory programs from Studio Lab BH." };
export default function ProjectsPage() {
  return <div className="container-page work-page">
    <h1>Work</h1>
    <WorkIndex works={getWorks()} filters />
  </div>;
}
