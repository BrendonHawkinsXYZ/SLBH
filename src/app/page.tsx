import { CHROMA_URL } from "@/lib/site";
import Image from "next/image";
import Link from "next/link";
import { WorkIndex } from "@/components/index/WorkIndex";
import { getSelectedWorks } from "@/lib/works";

export default function HomePage() {
  return (
    <div className="container-page home-index">
      <section className="home-feature" aria-labelledby="chroma-feature-title">
        <div className="home-feature-copy">
          <h1 id="chroma-feature-title"><Link href={CHROMA_URL}>Chroma</Link></h1>
          <p>A private place to give feeling a form.</p>
          <p>Speak or type what happened. Chroma turns the moment into color, form, and a private reflection—entirely on your iPhone.</p>
          <a href="https://apps.apple.com/us/app/mood-tracker-journal-chroma/id6784464340" className="home-feature-link" target="_blank" rel="noopener noreferrer">Chroma for iPhone ↗</a>
        </div>
        <Link href={CHROMA_URL} className="home-feature-image" aria-label="Explore Chroma, the studio’s emotional journal">
          <Image src="/chroma/collection.png" alt="Chroma: voice journaling, daily readings, weekly reflection, and on-device privacy" width={6686} height={5376} sizes="(max-width: 767px) 100vw, 600px" priority />
        </Link>
      </section>
      <section className="home-selected" aria-labelledby="selected-work-title">
        <div className="home-intro">
          <p>Studio Lab BH is an independent systems studio and research practice studying how human experience becomes legible through computation, culture, and shared environments. The work moves between theory, research, and application through software, artworks, studies, and participatory programs.</p>
          <Link href="/studio">About the studio →</Link>
        </div>
        <h2 id="selected-work-title">Select Work</h2>
        <p className="home-lineage"><Link href="/projects/american-emotions">American Emotions</Link> initiated a line of inquiry that later informed <Link href="/research/emotion-as-system">Emotion as System</Link>, <Link href={CHROMA_URL}>Chroma</Link>, and <Link href="/projects/acg">Tell Me How You Feel: ACG</Link>. Products and shared encounters return new questions to that inquiry.</p>
        <WorkIndex works={getSelectedWorks("chroma")} />
      </section>
      <nav className="index-directories" aria-label="Studio index">
        <Link href="/projects"><span>All work</span><span>Index →</span></Link>
        <Link href="/studio"><span>Studio</span><span>Information →</span></Link>
        <Link href="/brendon"><span>Brendon Hawkins</span><span>About →</span></Link>
        <a href="mailto:brendon@studiolabbh.xyz"><span>Contact</span><span>Email ↗</span></a>
      </nav>
    </div>
  );
}
