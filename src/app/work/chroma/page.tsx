import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chroma — Studio Lab BH",
  description: "A private emotional journal. Chroma turns a moment into color, form, and a private reflection, entirely on your iPhone.",
};
export default function ChromaPage() {
  return <article className="container-page chroma-document">
    <h1>Chroma</h1>
    <p className="chroma-document-meta">Product · 2026</p>
    <p className="chroma-document-intro">See your feelings take shape.</p>
    <p className="chroma-document-copy">Speak or type what happened. Chroma turns the moment into color, form, and a private reflection—entirely on your iPhone.</p>
    <div className="chroma-document-links">
      <a href="https://apps.apple.com/us/app/mood-tracker-journal-chroma/id6784464340" target="_blank" rel="noopener noreferrer">View on the App Store ↗</a>
      <a href="https://chroma.studiolabbh.xyz/" target="_blank" rel="noopener noreferrer">Visit Chroma ↗</a>
    </div>
    <figure>
      <Image src="/chroma/collection.png" alt="Four Chroma app views showing voice journaling, a daily reading, a weekly reflection, and on-device privacy" width={6686} height={5376} priority sizes="(max-width: 800px) 100vw, 1000px" />
      <figcaption>Voice journaling, daily readings, weekly reflection, and on-device privacy.</figcaption>
    </figure>
    <section className="chroma-document-related">
      <h2>Related work</h2>
      <Link href="/projects/affective-geometry">Affective Geometry →</Link>
      <Link href="/diagrams">Diagrams →</Link>
      <Link href="/research/emotion-as-system">Emotion as System →</Link>
    </section>
    <nav className="chroma-document-links" aria-label="Chroma legal"><Link href="/chroma/privacy">Privacy</Link><Link href="/chroma/terms">Terms</Link></nav>
  </article>;
}
