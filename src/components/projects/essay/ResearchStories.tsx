import Link from "next/link";
import type { ProjectFileData } from "../ProjectFile.types";
import { EssayImage } from "./EssayImage";
import styles from "./ProjectEssay.module.css";

function Actions({ project }: { project: ProjectFileData }) {
  if (!project.actions?.length) return null;
  return <div className={styles.actions}>{project.actions.map((action) => action.href.startsWith("https://")
    ? <a key={action.href} href={action.href}>{action.title} ↗</a>
    : <Link key={action.href} href={action.href}>{action.title} →</Link>)}</div>;
}

export function ResearchStory({ slug, project }: { slug: string; project: ProjectFileData }) {
  const titles: Record<string, string> = {
    "affective-sculptural-sketches": "Affective Sculptural\nSketches",
    "american-emotions": "American\nEmotions",
    "global-emotions": "Global\nEmotions",
    "convergent-grammar": "Convergent\nGrammar",
    "tihif-nyc": "This Is How\nI’m Feeling: NYC",
  };
  const header = <header className={styles.essayHeader}><h1>{titles[slug] ?? project.title}</h1><p>{project.statement}</p></header>;

  if (slug === "affective-sculptural-sketches") return <>
    {header}
    <div className={`${styles.photoPair} ${styles.bleedPair}`}>
      <EssayImage project={project} file="first-date.png" priority caption="First Date. A light, a cord, a wall." sizes="(max-width: 760px) 100vw, 50vw" />
      <EssayImage project={project} file="affective-infrastructure.png" priority caption="Affective Infrastructure. Light, reflection, and the space between." sizes="(max-width: 760px) 100vw, 50vw" />
    </div>
    <section className={styles.storyOpening}><h2>Light is<br />a material.</h2><p>Color, proportion, and distance can change the way a space feels. Each sketch begins with an affective state and asks what it might be built out of.</p></section>
    <section className={styles.portraitOpening}>
      <EssayImage project={project} file="temporary-emotional-architectures.png" caption="Temporary Emotional Architectures. A room held in warm light." />
      <div><h2>A feeling,<br />given a room.</h2><p>A construction begins with the maker’s intention. Someone else enters it with their own experience. The study asks what survives that passage—and what remains private to the maker.</p></div>
    </section>
  </>;

  if (slug === "american-emotions") return <>
    {header}
    <EssayImage project={project} file="hero.png" className={styles.bleed} priority caption="Public attention, interpreted through color." sizes="100vw" />
    <section className={styles.storyOpening}><h2>Attention leaves<br />a trace.</h2><p>The project began during the 2024 election period. Public search activity supplied a signal; an authored model assigned emotional weights and colors. Each interpretation became part of a field.</p></section>
    <section className={styles.archiveSpread}>
      <EssayImage project={project} file="render-2024.png" caption="The archival plate: American Emotions, 185 days." />
      <div><h2>A record,<br />over time.</h2><p>The individual traces accumulate. Read together, they make a visual record of the model’s interpretations of public attention.</p><p>The field carries those interpretations. It does not establish how a population felt.</p><Actions project={project} /></div>
    </section>
  </>;

  if (slug === "global-emotions") return <>
    {header}
    <EssayImage project={project} file="field-world.png" className={styles.bleed} priority caption="The world view. An aggregate field from the instrument’s archive." sizes="100vw" />
    <section className={styles.storyOpening}><h2>From a place<br />to a field.</h2><p>Public search and news signals enter an authored affective model. Color gives its interpretation a visible form, with a location and date attached to each record.</p></section>
    <section className={styles.roomSpread}>
      <div><h2>Change<br />the scope.</h2><p>The instrument offers country, territory, and regional views alongside a world aggregate. Each field belongs to a particular scope; no view stands for every person within it.</p></div>
      <EssayImage project={project} file="location.png" caption="The location selector connects a place to its available records." />
    </section>
    <section className={styles.storyClosing}>
      <div><h2>Each day leaves<br />a record.</h2><p>Fields gather into a dated archive. A reading can be revisited in its original context: where it came from, when it was generated, and which model produced it.</p></div>
      <EssayImage project={project} file="archive.png" className={styles.bleed} caption="The daily archive preserves changes in the instrument’s visual field." sizes="100vw" />
    </section>
    <Actions project={project} />
  </>;

  if (slug === "convergent-grammar") return <>
    {header}
    <div className={`${styles.photoPair} ${styles.bleedPair}`}>
      <EssayImage project={project} file="portrait-01.png" priority caption="A source portrait with geometric relationships traced over it." sizes="(max-width: 760px) 100vw, 50vw" />
      <EssayImage project={project} file="example.png" priority caption="Geometric traces from the portrait study." sizes="(max-width: 760px) 100vw, 50vw" />
    </div>
    <section className={styles.storyOpening}><h2>A portrait.<br />A spatial proposition.</h2><p>Figures, focal points, and negative space can be described through relationships. The study extracts those relationships and compares them across images, asking what remains when style and subject change.</p></section>
    <div className={`${styles.photoPair} ${styles.offsetPair}`}>
      <EssayImage project={project} file="portrait-02.png" caption="A second portrait, read through the same geometric reference." sizes="(max-width: 760px) 100vw, 48vw" />
      <EssayImage project={project} file="portrait-03.png" caption="Different subjects, a shared method of comparison." sizes="(max-width: 760px) 100vw, 48vw" />
    </div>
    <section className={styles.storyClosing}>
      <div><h2>What survives<br />a change of image?</h2><p>Portraiture is the reference for a wider inquiry into landscapes, interiors, garments, photographs, and generated images. The current study finds that grammar follows the spatial problem a genre addresses.</p></div>
      <EssayImage project={project} file="hero.png" className={styles.bleed} caption="Portraits in the working corpus." sizes="100vw" />
    </section>
  </>;

  return <>
    {header}
    <section className={styles.portraitOpening}>
      <EssayImage project={project} file="cover.png" priority caption="Three studio windows, seen from the street in New York." />
      <div><h2>One person.<br />Three windows.</h2><p>A daily journal entry became an emotion, then a color. Three networked lights carried the signal into the studio windows, placing a private feeling in public view.</p></div>
    </section>
    <section className={styles.storyClosing}>
      <div><h2>The days change.<br />So does the light.</h2><p>Across the 2025 installation, the windows became a repeated encounter on the street. The premise later expanded into Tell Me How You Feel: ACG, where public signals and participant input share a space.</p></div>
      <EssayImage project={project} file="hero.png" className={styles.bleed} caption="Day 1, day 3, and day 7. Three views of the installation." sizes="100vw" />
    </section>
  </>;
}
