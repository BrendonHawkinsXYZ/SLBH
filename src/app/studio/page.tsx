import Link from "next/link";
import styles from "./studio.module.css";

export const metadata = {
  title: "Studio — SLBH",
  description:
    "Studio Lab BH is a systems research lab building computational models, instruments, and environments to understand and shape invisible human systems.",
};

const FOCUS_AREAS = [
  {
    label: "CHROMA — LAUNCHING SEPTEMBER 2026",
    body: "Chroma is the lab’s first personal affect instrument: a private place to give feeling a form, preserve it over time, and see the patterns that individual moments can hide. It translates the lab’s research into an everyday product.",
  },
];

const TENETS = [
  {
    n: "01",
    title: "LEAD WITH DESIGN THINKING",
    body: "Identifying emerging trends, noticing intuitive patterns, and exploring abstract concepts to define the foundation of research and projects.",
  },
  {
    n: "02",
    title: "DATA FOUNDATION",
    body: "Using data to validate and guide research, projects, and experiments, building on insights from design thinking.",
  },
  {
    n: "03",
    title: "COLOR AS LANGUAGE",
    body: "Exploring color’s fundamental role in perception and its significance across human, ecological, and biological systems.",
  },
  {
    n: "04",
    title: "CULTURE HAS VALUE",
    body: "Emphasizing culture’s foundational role in shaping human theories, social constructs, and engagements.",
  },
  {
    n: "05",
    title: "MEDIA AS COMMUNICATION",
    body: "Leveraging media to engage with culture, share theories, and promote projects, integrating it deeply into the research process.",
  },
  {
    n: "06",
    title: "ENGINEERING DNA",
    body: "Emphasizing a problem-solving mindset, where every project and research effort is guided by engineering principles to address and solve problems.",
  },
  {
    n: "07",
    title: "FLUID BOUNDARIES",
    body: "Adapting the practice to address emerging problems, ensuring flexibility and growth over time.",
  },
];

function readableHeading(value: string) {
  return value.charAt(0) + value.slice(1).toLowerCase().replace(/\bdna\b/g, "DNA");
}

export default function StudioPage() {
  return (
    <article className={`container-page ${styles.page}`}>
      <div className={styles.document}>
        <header className={styles.header}>
          <h1>Studio Lab BH</h1>
          <p>
            Studio Lab BH is a systems research lab modeling invisible human
            systems, with affect as its first field of study. The studio is
            also the research practice of Brendon Hawkins, whose work moves
            across art, computation, product, and social theory.
          </p>
          <p className={styles.meta}>New York, NY. Established 2024.</p>
        </header>

        <section id="slbh" className={styles.section} aria-labelledby="practice-heading">
          <h2 id="practice-heading">Modeling invisible human systems.</h2>
          <p>
            Studio Lab BH is a systems research lab. We build computational
            models, instruments, and environments to understand and shape
            invisible human systems — especially affect.
          </p>
          <p>
            Our work sits at the intersection of research, design, and
            engineering. We publish papers, ship instruments, and release
            diagrams as first-class research artifacts. Everything we make
            is built to be read, cited, and used.
          </p>
          <p>
            The lab&rsquo;s core axiom is simple. Affect has value. It is a
            structured, measurable, collective phenomenon, and treating it as
            such unlocks a class of problems that current models can&rsquo;t touch.
          </p>
        </section>

        <section className={styles.section} aria-labelledby="focus-heading">
          <h2 id="focus-heading">Current focus</h2>
          {FOCUS_AREAS.map((focus) => (
            <div key={focus.label}>
              <h3 className={styles.label}>{readableHeading(focus.label)}</h3>
              <p>{focus.body}</p>
              <Link className={styles.textLink} href="/work/chroma">Open Chroma →</Link>
            </div>
          ))}
        </section>

        <section className={styles.section} aria-labelledby="method-heading">
          <h2 id="method-heading">Method</h2>
          <ol className={styles.tenets}>
            {TENETS.map((tenet) => (
              <li key={tenet.n}>
                <span className={styles.number} aria-hidden="true">{tenet.n}</span>
                <div>
                  <h3 className={styles.label}>{readableHeading(tenet.title)}</h3>
                  <p>{tenet.body}</p>
                </div>
              </li>
            ))}
          </ol>
          <Link className={styles.textLink} href="/diagrams">Diagrams →</Link>
        </section>

        <section id="brendon" className={styles.section} aria-labelledby="founder-heading">
          <h2 id="founder-heading">Founder</h2>
          <Link className={styles.textLink} href="/brendon">Brendon Hawkins →</Link>
        </section>

        <section className={styles.section} aria-labelledby="contact-heading">
          <h2 id="contact-heading">Contact</h2>
          <ul className={styles.contact}>
            <li><a href="mailto:brendon@studiolabbh.xyz">brendon@studiolabbh.xyz</a></li>
            <li>
              <a href="https://instagram.com/studiolabbh" target="_blank" rel="noopener noreferrer">
                Instagram / @studiolabbh ↗
              </a>
            </li>
          </ul>
        </section>
      </div>
    </article>
  );
}
