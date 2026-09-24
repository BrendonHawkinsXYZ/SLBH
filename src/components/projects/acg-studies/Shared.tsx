import Link from "next/link";
import { acg, related } from "@/lib/acg";
import styles from "./studies.module.css";

export function ActivationRecord() {
  return <dl className={styles.factList}>
    <div><dt>Site</dt><dd>{acg.activation.venue}</dd></div>
    <div><dt>Dates</dt><dd>{acg.activation.dates}</dd></div>
    <div><dt>Format</dt><dd>{acg.activation.format}</dd></div>
    <div><dt>Series</dt><dd>Ongoing · Next activation {acg.activation.next.toLowerCase()}</dd></div>
  </dl>;
}

export function RelatedRecords() {
  return <div className={styles.relatedRecords}>{related.map((item) => <Link key={item.href} href={item.href}>
    <span>{item.title}</span><span>{item.role}</span><span aria-hidden="true">↗</span>
  </Link>)}</div>;
}

export function StudyEnd({ number, name, children }: { number: number; name: string; children: React.ReactNode }) {
  return <aside className={styles.studyEnd} aria-label="About this page study">
    <span>Test {number} / {name}</span><p>{children}</p>
    <Link href={`/test-${number === 3 ? 1 : number + 1}`}>Test {number === 3 ? 1 : number + 1} →</Link>
  </aside>;
}
