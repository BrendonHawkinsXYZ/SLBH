import { pitLab } from "@/lib/pitLab";
import { EssayImage } from "./EssayImage";
import styles from "./ProjectEssay.module.css";

export function PitLabStory() {
  return <>
    <header className={styles.essayHeader}>
      <h1>Tell Me How<br />You Feel: PIT Lab</h1>
      <p>{pitLab.statement}</p>
    </header>
    <EssayImage project={pitLab} file="cover.webp" className={styles.bleed} priority caption="CUNY PIT Lab pop-up, Oculus, New York City. October 7 & 28, 2026." sizes="100vw" />
    <section className={styles.storyOpening}>
      <h2>What does emotion<br />look like to you?</h2>
      <p>Two encounters for the launch of Social Wednesdays. At the CUNY PIT Lab pop-up, participants chose from 25 emotion prompts, made a drawing, and brought their own meanings to the word.</p>
    </section>
    <section className={styles.invitationSpread}>
      <EssayImage project={pitLab} file="drawing.webp" caption="Ashamed, in progress. October 7." sizes="(max-width: 760px) 100vw, 64vw" />
      <div>
        <h2>A word is only<br />a starting point.</h2>
        <p>Paper, markers, and an open invitation. Each person decided how an emotion could be represented. The same prompt could hold a memory, an aspiration, a symbol, or a field of color.</p>
      </div>
    </section>
    <section className={styles.storyClosing}>
      <div>
        <h2>Drawn by a person.<br />Held by its maker.</h2>
        <p>Hurt and Inspired, from October 28. A portrait keeps the drawing beside the person who made it. Its visible forms offer a starting point for conversation; the maker supplies their meaning.</p>
      </div>
    </section>
    <div className={`${styles.photoPair} ${styles.bleedPair}`}>
      <EssayImage project={pitLab} file="hurt.webp" caption="Hurt. Yellow lightning across a gray field." sizes="(max-width: 760px) 100vw, 50vw" />
      <EssayImage project={pitLab} file="inspired.webp" caption="Inspired. A light bulb, figures, and a window of color." sizes="(max-width: 760px) 100vw, 50vw" />
    </div>
    <section className={styles.roomSpread}>
      <div>
        <h2>The explanation<br />changes the reading.</h2>
        <p>One Hopeful drawing described travel to America. Another spoke through sunlight, prayer, and flowers. Those meanings emerged through conversation. By the second session, portraits and some interviews joined the drawings in the record.</p>
      </div>
      <EssayImage project={pitLab} file="conversation.webp" caption="Drawing and conversation at the pop-up. October 7." sizes="(max-width: 760px) 100vw, 64vw" />
    </section>
    <section className={styles.invitationSpread}>
      <EssayImage project={pitLab} file="tea-and-cookies.webp" caption="Studio Lab BH tea and cookies. Holy Black Passion and Black & Red Sablé." sizes="(max-width: 760px) 100vw, 64vw" />
      <div>
        <h2>A place<br />to pause.</h2>
        <p>The setting developed between visits. Tea was present at the first encounter; by October 28, Studio Lab BH tea and cookies became a more deliberate part of the welcome, offering time to settle into the activity.</p>
      </div>
    </section>
    <section className={styles.storyClosing}>
      <div>
        <h2>The invitation is<br />part of the research.</h2>
        <p>How the activity was introduced, who felt comfortable drawing, and whether there was time to talk shaped what could be collected. Returning to the table made those conditions visible alongside the drawings themselves.</p>
      </div>
      <EssayImage project={pitLab} file="at-the-table.webp" className={styles.bleed} caption="A shared table, individual visual descriptions. October 7." sizes="100vw" />
    </section>
  </>;
}
