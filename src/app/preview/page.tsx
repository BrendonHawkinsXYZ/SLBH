import type { Metadata } from "next";
import { LandingExperience } from "@/components/landing/LandingExperience";
import { getLandingFeature, getLandingProjects, studioBiography } from "@/lib/landingPreview";

export const metadata: Metadata = {
  title: "Studio Lab BH — Landing study",
  description: studioBiography,
  robots: { index: false, follow: false },
};

export default async function LandingPreviewPage({ searchParams }: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  return <LandingExperience
    projects={getLandingProjects()}
    feature={getLandingFeature()}
    biography={studioBiography}
    initialQuery={typeof params.q === "string" ? params.q : ""}
  />;
}
