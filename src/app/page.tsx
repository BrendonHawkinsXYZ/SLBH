import { ChromaLanding } from "@/components/home/ChromaLanding";
import { findAsset } from "@/lib/assets";

export default function HomePage() {
  const screens = Array.from({ length: 5 }, (_, index) =>
    findAsset("chroma", `screen-${String(index + 1).padStart(2, "0")}`),
  );

  return <ChromaLanding screens={screens} />;
}
