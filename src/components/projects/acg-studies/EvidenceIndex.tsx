"use client";

import { useState } from "react";
import { records, type RecordCategory } from "@/lib/acg";
import { RecordImage } from "./RecordImage";
import styles from "./studies.module.css";

const categories: (RecordCategory | "All records")[] = ["All records", "Installation", "Participation", "Concept"];

export function EvidenceIndex() {
  const [category, setCategory] = useState<(typeof categories)[number]>("All records");
  const [selectedId, setSelectedId] = useState("02");
  const visible = category === "All records" ? records : records.filter((record) => record.category === category);
  const selected = visible.find((record) => record.id === selectedId) ?? visible[0];
  const selectedIndex = visible.indexOf(selected);

  function selectCategory(next: (typeof categories)[number]) {
    setCategory(next);
    const nextRecords = next === "All records" ? records : records.filter((record) => record.category === next);
    if (!nextRecords.some((record) => record.id === selectedId)) setSelectedId(nextRecords[0].id);
  }

  return <div className={styles.evidenceBrowser}>
    <aside className={styles.evidenceRail} aria-label="Documentation index">
      <h2>Documentation</h2>
      <div className={styles.filters} role="group" aria-label="Filter records">{categories.map((item) => <button key={item} type="button" aria-pressed={category === item} onClick={() => selectCategory(item)}>
        <span>{item}</span><span>{item === "All records" ? records.length.toString().padStart(2, "0") : records.filter((record) => record.category === item).length.toString().padStart(2, "0")}</span>
      </button>)}</div>
      <div className={styles.recordList} role="group" aria-label={`${category}: choose a record`}>{visible.map((record) => <button key={record.id} type="button" aria-pressed={selected.id === record.id} aria-controls="selected-record" onClick={() => setSelectedId(record.id)}>
        <span>{record.id}</span><span>{record.title}</span><span aria-hidden="true">↗</span>
      </button>)}</div>
      <p className={styles.archiveNote}>ACG / Activation 01<br />New York, April 2026</p>
    </aside>

    <section id="selected-record" className={styles.evidenceViewer} aria-label="Selected record">
      <div className={styles.viewerToolbar}>
        <p aria-live="polite" aria-atomic="true"><span>{selected.id}</span> / {selected.category} <span className={styles.viewerCount}>· {selectedIndex + 1} of {visible.length}</span></p>
        <div><button type="button" onClick={() => setSelectedId(visible[selectedIndex - 1].id)} disabled={selectedIndex === 0} aria-label="Previous record">←</button><button type="button" onClick={() => setSelectedId(visible[selectedIndex + 1].id)} disabled={selectedIndex === visible.length - 1} aria-label="Next record">→</button></div>
      </div>
      <RecordImage key={selected.id} record={selected} caption={false} priority />
      <div className={styles.evidenceCaption}><div><h2>{selected.title}</h2><p>{selected.caption}</p></div><p>{selected.note}</p></div>
    </section>
  </div>;
}
