import { fetchAllChromaData } from "@/lib/chroma";
import HomeClient from "@/components/HomeClient";

export const dynamic = "force-dynamic";

export default async function Home() {
  const initialData = await fetchAllChromaData();
  return <HomeClient initialData={initialData} />;
}
