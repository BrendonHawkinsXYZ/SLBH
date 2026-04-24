import { HomeSurface } from "@/components/home/HomeSurface";
import { Instruments } from "@/components/home/Instruments";
import { Editorial } from "@/components/home/Editorial";
import { FeaturedDiagrams } from "@/components/home/FeaturedDiagrams";
import { Publications } from "@/components/home/Publications";

export default function HomePage() {
  return (
    <>
      <HomeSurface />
      <Instruments />
      <Editorial />
      <FeaturedDiagrams />
      <Publications />
    </>
  );
}
