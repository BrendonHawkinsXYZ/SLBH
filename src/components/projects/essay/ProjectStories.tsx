import { projectFiles } from "@/lib/projectFiles";
import { chromaWorkshop } from "@/lib/chromaWorkshop";
import { CHROMA_URL } from "@/lib/site";
import { EssayImage as ProjectImage } from "./EssayImage";
import styles from "./ProjectEssay.module.css";

export function ACGStory() {
  return <>
    <header className={styles.essayHeader}>
      <h1>Tell Me How<br />You Feel: ACG</h1>
      <p>Emotional data,<br />in shared space.</p>
    </header>
    <ProjectImage project={projectFiles.acg} file="installation-storefront.png" className={styles.bleed} priority caption="The Space, Upper West Side. April 28–30, 2026." />
    <section className={styles.storyOpening}>
      <h2>Two windows.<br />Two ways of feeling.</h2>
      <p>One field begins with an interpretation of public signals. The other begins with what people in the room choose to express. At a New York storefront, the two are placed beside one another, translated into light.</p>
    </section>
    <div className={`${styles.photoPair} ${styles.bleedPair}`}>
      <ProjectImage project={projectFiles.acg} file="installation-array-01.png" caption="The public field. American Emotions, rendered as light." />
      <ProjectImage project={projectFiles.acg} file="installation-array-02.png" caption="The local field. Shaped by the people present." />
    </div>
    <section className={styles.invitationSpread}>
      <ProjectImage project={projectFiles.acg} file="activation-prompt.png" />
      <div><h2>The person looking<br />can become part<br />of the work.</h2><p>A prompt at the storefront invites a response. A visitor’s declared feeling enters the color mapping and contributes to the local field.</p></div>
    </section>
    <section className={styles.roomSpread}>
      <div><h2>Inside,<br />a conversation.</h2><p>Presence, conversation, and participation make the room both the site of the work and one of its inputs.</p></div>
      <ProjectImage project={projectFiles.acg} file="activation-room.png" />
    </section>
    <section className={styles.storyClosing}>
      <div><h2>The difference<br />is part of the reading.</h2><p>In this nighttime view, the public field is blue and the participant field is red. The windows offer a relationship to look at, rather than a single account of how everyone feels.</p></div>
      <ProjectImage project={projectFiles.acg} file="activation-alignment.png" className={styles.bleed} />
    </section>
  </>;
}


export function GeometryStory() {
  const project = projectFiles["affective-geometry"];
  return <>
    <header className={styles.essayHeader}><h1>Affective<br />Geometry</h1><p>A feeling<br />has a form.</p></header>
    <div className={styles.geometryHero}>
      <ProjectImage project={project} file="plate-circle.png" priority sizes="(max-width: 760px) 100vw, 60vw" />
      <ProjectImage project={project} file="plate-triangle.png" priority sizes="(max-width: 760px) 72vw, 36vw" />
    </div>
    <section className={styles.storyOpening}>
      <h2>Shape sets a boundary.<br />Color fills it.</h2>
      <p>Each sketch gives an emotional state a bounded figure and a field of color. A circle, a triangle, a square: familiar forms become places to explore how feeling might be represented.</p>
    </section>
    <div className={`${styles.photoPair} ${styles.geometryPlates}`}>
      <ProjectImage project={project} file="plate-rhombus.png" caption="Rhombus. A green field, held within four edges." sizes="(max-width: 760px) 100vw, 48vw" />
      <ProjectImage project={project} file="plate-square.png" caption="Square. Color and texture within a different boundary." sizes="(max-width: 760px) 100vw, 48vw" />
    </div>
    <section className={`${styles.roomSpread} ${styles.contactSpread}`}>
      <div><h2>One form becomes<br />a family.</h2><p>The contact sheet brings the variations together: 25 shapes and 25 palettes, working within a 169-colour field gamut. Seen together, the studies reveal how much can change inside a simple outline.</p></div>
      <ProjectImage project={project} file="contact-sheet.jpeg" caption="The original contact sheet, shown in full." />
    </section>
    <section className={styles.geometryCoda}>
      <ProjectImage project={project} file="plate-heptagon.png" sizes="(max-width: 760px) 100vw, 48vw" />
      <div><h2>A sketch,<br />put into practice.</h2><p>These shapes became the shapes in Chroma. A visual study moved into an everyday setting: a private journal, where a person can give a moment form and return to it later.</p><a href={CHROMA_URL}>Visit Chroma ↗</a></div>
    </section>
  </>;
}


export function WorkshopStory() {
  const project = chromaWorkshop;
  return <>
    <header className={styles.essayHeader}><h1>Tell Me How<br />You Feel: Chroma</h1><p>Feeling, around<br />a shared table.</p></header>
    <ProjectImage project={project} file="at-the-table.webp" className={styles.bleed} priority caption="Plated Studios, Brooklyn. September 2026." sizes="100vw" />
    <section className={styles.storyOpening}>
      <h2>Make a place<br />for a feeling.</h2>
      <p>A table, a meal, flowers, and a set of drawing prompts. At Plated Studios, Chroma’s question moved into a shared setting: what form would you give to the way you feel?</p>
    </section>
    <section className={styles.workshopArrival}>
      <ProjectImage project={project} file="tea.webp" sizes="(max-width: 760px) 100vw, 56vw" />
      <div><h2>First, arrive.</h2><p>Tea offered a grounding ritual. Ceramic cups, flowers, and drawing materials set the pace for a gathering built around attention and exchange.</p></div>
    </section>
    <section className={styles.storyClosing}>
      <div><h2>A word becomes<br />a drawing.</h2><p>Pleased. Inspired. Defiant. Emotion words became invitations to draw, opening a conversation about how differently a feeling can be pictured.</p></div>
      <ProjectImage project={project} file="drawing.webp" className={styles.bleed} sizes="100vw" />
    </section>
    <section className={styles.workshopDrawings} aria-label="Drawings from the table">
      <ProjectImage project={project} file="defiant.webp" caption="Defiant. One participant’s visual description." sizes="(max-width: 760px) 100vw, 40vw" />
      <div><h2>Each person<br />gives it a form.</h2><p>The drawing sheets held individual interpretations. Around them, the menu carried its own sensory language: Refreshing, Grounding, Brightening.</p><ProjectImage project={project} file="mystified.webp" caption="Mystified. A blue and violet spiral beside the menu." sizes="(max-width: 760px) 100vw, 56vw" /></div>
    </section>
    <section className={styles.roomSpread}>
      <div><h2>The table<br />comes apart.</h2><p>At the close, flowers were gathered into arrangements. Materials that had held a shared setting became something each person could take away.</p></div>
      <ProjectImage project={project} file="flowers.webp" />
    </section>
    <section className={styles.workshopClosing}>
      <h2>Something to leave with.</h2>
      <ProjectImage project={project} file="together.webp" className={styles.bleed} sizes="100vw" />
    </section>
  </>;
}
