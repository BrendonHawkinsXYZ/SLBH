import type { Metadata } from "next";
import { acg, records } from "@/lib/acg";
import { RecordImage } from "@/components/projects/acg-studies/RecordImage";
import { ActivationRecord, RelatedRecords, StudyEnd } from "@/components/projects/acg-studies/Shared";
import styles from "@/components/projects/acg-studies/studies.module.css";

export const metadata: Metadata = { title: "Test 2 — ACG / Field report — Studio Lab BH" };

export default function FieldReportPage() {
  return <>
    <article className={styles.report}>
      <div className={styles.reportRegister}><span>SLBH / Research record 01</span><span>New York, 2026</span></div>
      <header className={styles.reportHeader}>
        <p className={styles.label}>ACG by SLBH / Field report</p>
        <h1>Two fields.<br />One room.</h1>
        <p>{acg.premise}</p>
        <div className={styles.reportByline}><span>{acg.name}</span><span>{acg.year}</span></div>
      </header>

      <section id="question" className={styles.reportSection}>
        <div className={styles.marginNote}><h2>01 / Question</h2><p>From affective computation to public experience.</p></div>
        <div className={styles.reportCopy}><p className={styles.reportLead}>Emotional data is usually read on a screen. ACG asks what happens when it becomes an environment.</p><p>The series brings the lab’s affective research into physical space. In its first storefront activation, light becomes the medium: a visible expression of two emotional fields occupying the same room.</p><p>One field describes a collective atmosphere. The other is shaped by the people present. The relationship between them is the work.</p></div>
      </section>

      <section id="method" className={styles.reportSection}>
        <div className={styles.marginNote}><h2>02 / Method</h2><p>Two sources.<br />One interpretive system.</p></div>
        <div className={styles.reportCopy}>
          <h3>Give each field a place.</h3>
          <p>American Emotions supplies the collective field through its reading of public data. Visitors supply the local field by responding to an affective prompt. The same emotional and color logic translates both inputs into light.</p>
          <div className={styles.reportPair}><RecordImage record={records[2]} compact /><RecordImage record={records[3]} compact /></div>
          <div className={styles.reportMethod}><span>Affective input</span><span aria-hidden="true">→</span><span>Interpretation</span><span aria-hidden="true">→</span><span>Physical output</span></div>
          <p>The windows make the two scales readable together. The national field can shift independently of the room; the room can change as people contribute.</p>
        </div>
      </section>

      <section id="encounter" className={styles.reportSection}>
        <div className={styles.marginNote}><h2>03 / Encounter</h2><p>The person observing can become an input.</p></div>
        <div className={styles.reportCopy}>
          <h3>The room participates in its own reading.</h3>
          <p>Visitors answer a simple prompt about how they feel. Each response contributes to the local field, allowing the installation to accumulate the emotional presence of those who enter it.</p>
          <RecordImage record={records[7]} />
          <p>Participation gives the work a feedback loop. People encounter a field that they can also affect; the shared setting is both an output of the system and a source of input.</p>
        </div>
      </section>

      <section id="reading" className={styles.reportSection}>
        <div className={styles.marginNote}><h2>04 / Reading</h2><p>Difference and alignment are both part of the system.</p></div>
        <div className={styles.reportCopy}>
          <h3>What happens between the fields?</h3>
          <p>The fields do not need to agree. Their difference makes the relationship between a collective atmosphere and a local experience visible. When they take the same color, the system expresses alignment.</p>
          <RecordImage record={records[8]} />
          <p className={styles.reportObservation}>The central proposition is that affect can be encountered as a relationship—with color, scale, and duration—in a space we share.</p>
        </div>
      </section>

      <section className={styles.reportSection}>
        <div className={styles.marginNote}><h2>05 / Continuation</h2><p>A series, with light as its first medium.</p></div>
        <div className={styles.reportCopy}><p>ACG is an ongoing applied research series. Future activations may work through other sensory or spatial outputs, carrying the same translation system into new contexts.</p><h3 className={styles.reportSmallHeading}>Activation record</h3><ActivationRecord /><h3 className={styles.reportSmallHeading}>Related research</h3><RelatedRecords /></div>
      </section>
      <div className={styles.reportColophon}><span>Studio Lab BH</span><span>ACG / An ongoing inquiry</span></div>
    </article>
    <StudyEnd number={2} name="Field report">A project read as a short research paper. The question leads; the method and images build the argument. Captions and margin notes make the long read easy to scan.</StudyEnd>
  </>;
}
