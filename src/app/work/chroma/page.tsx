import { permanentRedirect } from "next/navigation";
import { CHROMA_URL } from "@/lib/site";

export default function ChromaPage() {
  permanentRedirect(CHROMA_URL);
}
