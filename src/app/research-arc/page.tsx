import type { Metadata } from "next";
import { getWorks } from "@/lib/works";
import { ResearchArc } from "./ResearchArc";

export const metadata: Metadata = {
  title: "Research Arc — Studio Lab BH",
  description: "Traverse the connections between Studio Lab BH’s research, instruments, installations, and Chroma.",
};

export default function ResearchArcPage() {
  return <ResearchArc works={getWorks()} />;
}
