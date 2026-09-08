import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { diagrams } from "@/lib/diagrams";
import styles from "./diagrams.module.css";

export const metadata: Metadata = {
  title: "Diagrams — Studio Lab BH",
  description:
    "Original Studio Lab BH diagrams tracing relationships between emotion, meaning, perception, action, and color within Affective Computational Geometry.",
};

export default function DiagramsPage() {
  return (
    <div className={`container-page ${styles.page}`}>
      <header className={styles.header}>
        <h1>Diagrams</h1>
        <p>
          Diagrams from Affective Computational Geometry, tracing relationships
          between emotion, meaning, perception, action, and color.
        </p>
      </header>

      <div className={styles.gallery}>
        {diagrams.map((diagram, index) => (
          <figure id={diagram.id} key={diagram.id} className={styles.figure}>
            <a
              href={diagram.image}
              className={styles.imageLink}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Open ${diagram.title} at full resolution`}
            >
              <Image
                src={diagram.image}
                alt={diagram.alt}
                width={diagram.width}
                height={diagram.height}
                sizes="(max-width: 680px) calc(100vw - 44px), calc((100vw - 88px) / 2)"
                loading={index === 0 ? "eager" : "lazy"}
                className={styles.image}
              />
            </a>
            <figcaption className={styles.caption}>
              <h2>{diagram.title}</h2>
              <a
                href={diagram.image}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Open ${diagram.title} at full resolution`}
              >
                Open image <span aria-hidden="true">↗</span>
              </a>
            </figcaption>
          </figure>
        ))}
      </div>

      <footer className={styles.footer}>
        <Link href="/">← Return to index</Link>
        <Link href="/research/emotion-as-system">Emotion as System →</Link>
      </footer>
    </div>
  );
}
