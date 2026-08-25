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
  signals,
  intro,
  sections,
}: ChromaLegalProps) {
  return (
    <>
      <section className={styles.hero}>
        <div className={`container-page ${styles.heroInner}`}>
          <h1 className={`t-display ${styles.title}`}>{title}</h1>
          <p className={styles.effective}>Effective date: {effectiveDate}</p>
        </div>
      </section>

      <div className={`hairline-t hairline-b ${styles.readout}`}>
        <span className="t-mono" style={{ opacity: 0.55 }}>
          SLBH / v2.0 / CHROMA / {documentName.toUpperCase()}
        </span>
        <span className={`t-label ${styles.readoutMiddle}`}>{signals}</span>
        <span className="t-mono" style={{ opacity: 0.55, textAlign: "right" }}>
          EFFECTIVE {effectiveDate.toUpperCase()}
        </span>
      </div>

      <section className={`container-page ${styles.body}`}>
        <div className={styles.measure}>
          <div className={styles.intro}>{intro}</div>
          {sections.map((section) => (
            <section key={section.title}>
              <h2 className={`t-h3 ${styles.heading}`}>{section.title}</h2>
              {section.content}
            </section>
          ))}
        </div>
      </section>
    </>
  );
}

export { styles as chromaLegalStyles };
