import Image from "next/image";
import Link from "next/link";
import { newYorkEmotions as project, newYorkResponses } from "@/lib/newYorkEmotions";
import { EssayImage } from "./EssayImage";
import styles from "./ProjectEssay.module.css";
import ny from "./NewYorkEmotionsStory.module.css";

export function NewYorkEmotionsStory() {
  return <>
    <header className={styles.essayHeader}>
      <h1>New York<br />Emotions</h1>
      <p>The day’s reading.<br />The people in the room.</p>
    </header>
    <EssayImage project={project} file="participation.webp" className={styles.bleed} priority sizes="100vw" caption="An iPad, a prompt, and two fields. NYC PIT Pop-ups, 2025." />

    <section className={styles.storyOpening}>
      <h2>What changes<br />when you ask?</h2>
      <p>For about a month leading up to New York City’s 2025 mayoral election, public search activity became a daily reading of emotion. Days before the election, the project brought that reading into a room and asked people how they felt.</p>
    </section>

    <section className={styles.archiveSpread}>
      <EssayImage project={project} file="daily-fields.webp" caption="The archival plate titled “New York Emotions 14 Days.” A selection from the daily work." />
      <div>
        <h2>A reading,<br />once a day.</h2>
        <p>Like <Link href="/projects/american-emotions">American Emotions</Link>, the work began with public attention. A daily collection of search trends passed through an authored interpretation of emotion and color.</p>
        <p>Each field held the system’s reading of those signals. New York Emotions asked how that reading would sit beside the feelings of people encountering it.</p>
      </div>
    </section>

    <section className={ny.encounter}>
      <div>
        <h2>“How are you<br />feeling right now?”</h2>
        <p>At NYC PIT Pop-ups, visitors answered this prompt on an iPad. Their responses became colored blips on a shared screen, joining those of people who had already taken part.</p>
        <p>For six hours, the display grew. The day’s inferred field remained alongside it.</p>
      </div>
      <EssayImage project={project} file="pit-popup.webp" caption="The installation at the Public Interest Technology pop-up." sizes="(max-width: 760px) 100vw, 44vw" />
    </section>

    <section className={styles.storyClosing}>
      <div>
        <h2>One day.<br />Many moments.</h2>
        <p>The daily field and the live responses move at different speeds. One is a reading of public attention; the other accumulates from people describing a moment in their lives.</p>
      </div>
      <div className={ny.comparison}>
        <EssayImage project={project} file="daily-field.webp" caption="The day’s inferred reading, shown at the pop-up." sizes="(max-width: 760px) 100vw, 48vw" />
        <figure className={styles.picture}>
          <Image src="/projects/new-york-emotions/six-hours.gif" alt="Time lapse of colored response blips accumulating during the six-hour New York Emotions study" width={800} height={1000} unoptimized />
          <figcaption>Six hours of responses, condensed into a time lapse.</figcaption>
        </figure>
      </div>
    </section>


    <section className={ny.voices} aria-labelledby="ny-voices-title">
      <div className={ny.voicesIntro}>
        <h2 id="ny-voices-title">More than<br />one feeling.</h2>
        <p>Four of the 27 archived submissions. Each person’s words could hold several feelings at once. The system gave each response an emotion label and a color.</p>
      </div>
      <div className={ny.quotes}>
        {newYorkResponses.map((response) => <figure key={response.row}>
          <blockquote><p>“{response.text}”</p></blockquote>
          <figcaption><span className={ny.blip} style={{ backgroundColor: response.color }} aria-hidden="true" /><span>Recorded interpretation: {response.emotion}</span></figcaption>
        </figure>)}
      </div>
    </section>

    <div className={`${styles.photoPair} ${styles.bleedPair}`}>
      <EssayImage project={project} file="screen-early.webp" caption="Early in the session. Two responses beside the day’s field." sizes="(max-width: 760px) 100vw, 50vw" />
      <EssayImage project={project} file="screen-later.webp" caption="Later in the session. The same daily field beside a growing collection of responses." sizes="(max-width: 760px) 100vw, 50vw" />
    </div>

    <section className={styles.storyClosing}>
      <div>
        <h2>The comparison<br />became the work.</h2>
        <p>New York Emotions was the first point in this inquiry where an inferred emotional state met people speaking for themselves. That question led directly to <Link href="/projects/acg">Tell Me How You Feel: ACG</Link>, carrying the comparison into a shared environment of light.</p>
      </div>
      <EssayImage project={project} file="six-hours-contact-sheet.webp" className={ny.contactSheet} caption="The six-hour study as a sequence. Each new blip joins the responses already present." sizes="(max-width: 760px) 100vw, 80vw" />
    </section>
  </>;
}
