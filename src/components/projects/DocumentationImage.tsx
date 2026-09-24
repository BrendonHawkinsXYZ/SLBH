"use client";

import Image from "next/image";
import { useRef } from "react";
import type { DocumentImage } from "./ProjectFile.types";
import styles from "./ProjectFile.module.css";

export function DocumentationImage({ image }: { image: DocumentImage }) {
  const dialog = useRef<HTMLDialogElement>(null);
  return <figure className={styles.figure}>
    <button type="button" className={styles.imageButton} onClick={() => dialog.current?.showModal()} aria-label={`Enlarge ${image.title}`} aria-haspopup="dialog">
      <Image src={image.src} alt={image.alt} width={image.width} height={image.height} sizes="(max-width: 600px) 85vw, (max-width: 800px) 50vw, 40vw" />
      <span className={styles.enlarge} aria-hidden="true">↗</span>
    </button>
    <figcaption><span>{image.id}</span><span>{image.caption}</span></figcaption>
    <dialog ref={dialog} className={styles.imageDialog} aria-label={image.title} onClick={(event) => { if (event.target === event.currentTarget) dialog.current?.close(); }}>
      <div className={styles.dialogBody}>
        <div className={styles.dialogHeader}><span>{image.id} / {image.title}</span><button type="button" onClick={() => dialog.current?.close()} autoFocus>Close ×</button></div>
        <Image src={image.src} alt={image.alt} width={image.width} height={image.height} sizes="95vw" />
        <p>{image.caption}</p>
      </div>
    </dialog>
  </figure>;
}
