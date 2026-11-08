import Link from "next/link";
import { affectiveLighting, wallOfTruth, wallOfTruthFilm } from "@/lib/earlyProjects";
import { EssayImage } from "./EssayImage";
import styles from "./ProjectEssay.module.css";

export function AffectiveLightingStory() {
  return <>
    <header className={styles.essayHeader}>
      <h1>Affective<br />Lighting</h1>
      <p>{affectiveLighting.statement}</p>
    </header>
    <EssayImage project={affectiveLighting} file="cover.webp" className={styles.bleed} priority sizes="100vw" caption="Affective Lighting, begun in 2024." />
    <section className={styles.storyOpening}>
      <h2>A state becomes<br />something to live with.</h2>
      <p>A ready-made smart light. A clay structure built around it. In 2024, American Emotions data became the source for a first investigation into translating rendered emotional states into environmental objects.</p>
    </section>
    <section className={styles.roomSpread}>
      <div>
        <h2>Clay holds the light.<br />The room carries<br />the color.</h2>
        <p>In ambient light, the constructed object becomes visible: a slim manufactured light held in a hand-built clay form. In darkness, its field extends across the wall. The object and its surroundings are encountered together.</p>
      </div>
      <EssayImage project={affectiveLighting} file="object.webp" caption="The ready-made light and clay structure, seen in ambient light." sizes="(max-width: 760px) 100vw, 60vw" />
    </section>
    <section className={styles.storyClosing}>
      <div>
        <h2>From an object<br />to a shared room.</h2>
        <p><Link href="/projects/american-emotions">American Emotions</Link> supplied the computational source. This experiment gave it a physical setting. Alongside <Link href="/projects/wall-of-truth">Wall of Truth</Link>’s inquiry into public vulnerability, it opened questions that continued through <Link href="/projects/new-york-emotions">New York Emotions</Link> and <Link href="/projects/acg">Tell Me How You Feel: ACG</Link>.</p>
      </div>
    </section>
  </>;
}

export function WallOfTruthStory() {
  return <>
    <header className={styles.essayHeader}>
      <h1>Wall of<br />Truth</h1>
      <p>{wallOfTruth.statement}</p>
    </header>
    <figure className={`${styles.picture} ${styles.bleed}`}>
      <video
        className={styles.essayFilm}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        poster={wallOfTruthFilm.poster}
        width={wallOfTruthFilm.width}
        height={wallOfTruthFilm.height}
        aria-label="Archival screen recording scrolling through dated anonymous messages on the Wall of Truth."
        aria-describedby="wall-film-caption"
      >
        <source src={wallOfTruthFilm.src} type="video/mp4" />
      </video>
      <figcaption id="wall-film-caption">Proof-of-concept recording. A scroll through the wall’s 2025 entries.</figcaption>
    </figure>
    <section className={styles.storyOpening}>
      <h2>A place to say<br />something.</h2>
      <p>Begun in 2024, Wall of Truth offers a public confessional through an anonymous digital wall. An invitation found in a physical location becomes a place to leave words that someone else can encounter.</p>
    </section>
    <section className={styles.portraitOpening}>
      <EssayImage project={wallOfTruth} file="cover.webp" caption="“Tell Your Story.” The QR-code invitation in a physical setting." sizes="(max-width: 760px) 100vw, 56vw" />
      <div>
        <h2>Tell your story.</h2>
        <p>A sticker provides the entry point. Following its QR code takes a visitor to the wall, where a message joins contributions from other people, encountered in other places.</p>
        <p>The invitation, its placement, and the possibility of anonymity shape the encounter. What someone chooses to share remains their decision.</p>
      </div>
    </section>
    <section className={styles.storyClosing}>
      <div>
        <h2>The invitation<br />became a question.</h2>
        <p>What makes someone willing to be vulnerable in public? The wall’s disclosures, jokes, affection, and anger gave that question a shared setting. It continued through <Link href="/projects/new-york-emotions">New York Emotions</Link> and <Link href="/projects/acg">Tell Me How You Feel</Link>, as the practice developed other ways to invite expression and encounter it together.</p>
      </div>
    </section>
  </>;
}
