import type { ReactNode } from "react";
import styles from "./ChromaLegal.module.css";

type LegalSection = {
  title: string;
  content: ReactNode;
};

type ChromaLegalProps = {
  title: string;
  documentName: string;
  effectiveDate: string;
  signals: string;
  intro: ReactNode;
  sections: LegalSection[];
};

export function ChromaLegal({
  title,
  documentName,
  effectiveDate,
  intro,
  sections,
}: ChromaLegalProps) {
  return (
    <article className={`container-page ${styles.page}`} aria-label={`Chroma ${documentName}`}>
      <div className={styles.measure}>
        <header className={styles.header}>
          <h1 className={styles.title}>{title}</h1>
          <p className={styles.effective}>Effective date: {effectiveDate}</p>
        </header>
        <div className={styles.intro}>{intro}</div>
        {sections.map((section) => (
          <section key={section.title} className={styles.section}>
            <h2 className={styles.heading}>{section.title}</h2>
            {section.content}
          </section>
        ))}
      </div>
    </article>
  );
}

export { styles as chromaLegalStyles };
