"use client";

import Image from "next/image";
import { useRef } from "react";
import type { ACGRecord } from "@/lib/acg";
import styles from "./studies.module.css";

export function RecordImage({ record, caption = true, priority = false, compact = false }: {
  record: ACGRecord;
  caption?: boolean;
  priority?: boolean;
  compact?: boolean;
}) {
  const dialog = useRef<HTMLDialogElement>(null);

  return (
    <figure className={`${styles.figure} ${compact ? styles.compactFigure : ""}`}>
      <button type="button" className={styles.imageButton} onClick={() => dialog.current?.showModal()} aria-label={`Enlarge record ${record.id}: ${record.title}`} aria-haspopup="dialog">
        <Image src={`/projects/acg/${record.file}.png`} alt={record.alt} width={record.width} height={record.height} sizes={compact ? "(max-width: 600px) 90vw, 33vw" : "(max-width: 800px) 90vw, 65vw"} priority={priority} />
        <span className={styles.enlarge} aria-hidden="true">↗</span>
      </button>
      {caption && <figcaption><span>{record.id}</span><span>{record.caption}</span></figcaption>}
      <dialog ref={dialog} className={styles.imageDialog} aria-label={`Record ${record.id}: ${record.title}`} onClick={(event) => { if (event.target === event.currentTarget) dialog.current?.close(); }}>
        <div className={styles.dialogBody}>
          <div className={styles.dialogHeader}><span>{record.id} / {record.title}</span><button type="button" onClick={() => dialog.current?.close()} autoFocus>Close ×</button></div>
          <Image src={`/projects/acg/${record.file}.png`} alt={record.alt} width={record.width} height={record.height} sizes="95vw" />
          <p>{record.caption}</p>
        </div>
      </dialog>
    </figure>
  );
}
