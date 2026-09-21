import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { posters } from "@/lib/posters";
import styles from "@/components/ImageGallery.module.css";

export const metadata: Metadata = {
  title: "Posters — Studio Lab BH",
  description:
    "Posters by Brendon Hawkins exploring language, attention, technology, and culture.",
};

export default function PostersPage() {
  return (
    <div className={`container-page ${styles.page}`}>
      <header className={styles.header}>
        <h1>Posters</h1>
        <p>
          Graphic studies in language, attention, technology, and culture by
          Brendon Hawkins.
        </p>
      </header>

      <div className={styles.gallery}>
        {posters.map((poster, index) => (
          <figure id={poster.id} key={poster.id} className={styles.figure}>
            <a
              href={poster.image}
              className={styles.imageLink}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Open ${poster.title} at full resolution`}
            >
              <Image
                src={poster.image}
                alt={poster.alt}
                width={poster.width}
                height={poster.height}
                sizes="(max-width: 680px) calc(100vw - 44px), calc((100vw - 88px) / 2)"
                loading={index === 0 ? "eager" : "lazy"}
                className={styles.image}
              />
            </a>
            <figcaption className={styles.caption}>
              <h2>{poster.title}</h2>
              <a
                href={poster.image}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Open ${poster.title} at full resolution`}
              >
                Open image <span aria-hidden="true">↗</span>
              </a>
            </figcaption>
          </figure>
        ))}
      </div>

      <footer className={styles.footer}>
        <Link href="/">← Return to index</Link>
        <Link href="/diagrams">Diagrams →</Link>
      </footer>
    </div>
  );
}
