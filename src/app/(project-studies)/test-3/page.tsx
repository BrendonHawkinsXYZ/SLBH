import type { Metadata } from "next";
import { acg } from "@/lib/acg";
import { EvidenceIndex } from "@/components/projects/acg-studies/EvidenceIndex";
import { ActivationRecord, RelatedRecords, StudyEnd } from "@/components/projects/acg-studies/Shared";
import styles from "@/components/projects/acg-studies/studies.module.css";

export const metadata: Metadata = { title: "Test 3 — ACG / Evidence index — Studio Lab BH" };

export default function EvidenceIndexPage() {
  return <>
    <article className={styles.evidence}>
      <header className={styles.evidenceHeader}>
        <div><p className={styles.label}>01 / Applied research / {acg.year}</p><h1>{acg.title}</h1></div>
        <p>Two emotional fields occupy one room. One comes from public data; the other from the people present. ACG translates both into light.</p>
      </header>
      <EvidenceIndex />
      <div className={styles.evidenceContext}>
        <section><h2>What is being investigated?</h2><p>{acg.premise}</p><p>The storefront is the first activation of an ongoing research series. Light makes the relationship visible; future versions may use other sensory and spatial outputs.</p></section>
        <section><h2>Activation record</h2><ActivationRecord /></section>
      </div>
      <section className={styles.evidenceReferences}><h2>Related research</h2><RelatedRecords /></section>
    </article>
    <StudyEnd number={3} name="Evidence index">Enter through the material. Each image is a record with a description and a reason to be here. The story emerges through selection, comparison, and context.</StudyEnd>
  </>;
}
