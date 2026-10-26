import Link from "next/link";
import { WorkPreviewLink, WorkPreviewProvider } from "@/components/index/WorkPreviewLink";
import { getWorks, type WorkFormat } from "@/lib/works";
import styles from "@/components/home/HomeBibliography.module.css";

const sections: { format: WorkFormat; title: string; id: string }[] = [
  { format: "Paper", title: "Research & publications", id: "research" },
  { format: "Product", title: "Products", id: "products" },
  { format: "Instrument", title: "Instruments", id: "instruments" },
  { format: "Study", title: "Studies", id: "studies" },
  { format: "Installation", title: "Installations", id: "installations" },
  { format: "Program / Workshop", title: "Programs & workshops", id: "programs" },
  { format: "Visual Work", title: "Visual work", id: "visual-work" },
];

export function HomeBibliography() {
  const works = getWorks();
  return (
    <WorkPreviewProvider>
    <div className={`container-page ${styles.document}`}>
      <section className={styles.introduction} aria-label="About the practice">
        <div className={styles.introRow}>
          <h1>Studio Lab BH</h1>
          <p>An independent systems studio and research practice studying how human experience becomes legible through computation, culture, and shared environments.</p>
          <Link href="/studio">About the studio <span aria-hidden="true">↗</span></Link>
        </div>
        <div className={styles.introRow}>
          <h2>Brendon Hawkins</h2>
          <p>Runs the lab. A systems theorist, researcher, artist, and technologist working across software, visual art, and participatory environments.</p>
          <Link href="/brendon">Biography & CV <span aria-hidden="true">↗</span></Link>
        </div>
      </section>

      <section id="work" className={styles.work} aria-labelledby="work-title">
        <div className={styles.workHeading}>
          <h2 id="work-title">Work</h2>
          <nav aria-label="Work categories">
            {sections.filter(section => works.some(work => work.formats[0] === section.format)).map(section => (
              <a key={section.id} href={`#${section.id}`}>{section.title}</a>
            ))}
          </nav>
        </div>
        {sections.map(section => {
          const entries = works.filter(work => work.formats[0] === section.format)
            .sort((a, b) => b.year.localeCompare(a.year));
          if (!entries.length) return null;
          return (
            <section key={section.id} id={section.id} className={styles.category} aria-labelledby={`${section.id}-title`}>
              <h3 id={`${section.id}-title`}>{section.title}</h3>
              <ol className={styles.entries}>
                {entries.map(work => (
                  <li key={work.id}>
                    <span className={styles.year}>{work.year || "—"}</span>
                    <div className={styles.entry}>
                      <WorkPreviewLink work={work} className={styles.title}>{work.title} <span aria-hidden="true">↗</span></WorkPreviewLink>
                      <p>{work.id === "emotion-as-system" ? "A foundational architecture for affect, meaning, perception, and action." : work.summary}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </section>
          );
        })}
      </section>
      <div className={styles.contact}>
        <span>Contact</span>
        <a href="mailto:brendon@studiolabbh.xyz">brendon@studiolabbh.xyz <span aria-hidden="true">↗</span></a>
      </div>
    </div>
    </WorkPreviewProvider>
  );
}
