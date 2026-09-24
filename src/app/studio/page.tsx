import { CHROMA_URL } from "@/lib/site";
import Link from "next/link";
import styles from "./studio.module.css";

export const metadata = {
  title: "Studio — SLBH",
  description:
    "Studio Lab BH is an independent systems studio and research practice founded by Brendon Hawkins. Affect is its first formal field of inquiry.",
};

const COMMITMENTS = [
  { title: "Color as Language", body: "Explore how color carries meaning through perception, culture, and the systems we build." },
  { title: "Culture Has Value", body: "Attend to the histories, contexts, and shared meanings that shape how a system is made and encountered." },
  { title: "Affect Has Value", body: "Treat feeling as consequential to human experience, without reducing it to a score or assuming it is fully measurable." },
  { title: "Fluid Boundaries", body: "Let questions move across disciplines and forms, and let encounters change the terms of the inquiry." },
  { title: "Engineering and inquiry", body: "Build with a problem-solving mindset. Some work resolves a practical need; other work investigates, represents, questions, or creates conditions for observation." },
];

export default function StudioPage() {
  return (
    <article className={`container-page ${styles.page}`}>
      <div className={styles.document}>
        <header className={styles.header}>
          <h1>Studio Lab BH</h1>
          <p className={styles.tagline}>Modeling invisible human systems.</p>
          <p>
            Studio Lab BH is an independent systems studio and research practice
            founded by Brendon Hawkins. It studies the invisible systems through
            which human experience becomes legible—to ourselves, to one another,
            and to computation—and builds models, products, artworks,
            environments, and programs to investigate them. Affect is its first
            formal field of inquiry.
          </p>
          <p className={styles.meta}>New York, NY. Established 2024.</p>
        </header>

        <section id="slbh" className={styles.section} aria-labelledby="inquiry-heading">
          <h2 id="inquiry-heading">Current inquiry</h2>
          <p>
            The studio&rsquo;s current research centers affect: how internal states
            are described, represented, interpreted, externalized, and encountered
            by people and computational systems. This is one field within a broader
            practice of systems research.
          </p>
          <Link className={styles.textLink} href="/research/emotion-as-system">Emotion as System →</Link>
        </section>

        <section className={styles.section} aria-labelledby="method-heading">
          <h2 id="method-heading">Operating model</h2>
          <div className={styles.operatingModel} role="img" aria-label="Theory, research, and application continually inform and revise one another.">
            <span>Theory</span><span className={styles.reciprocal} aria-hidden="true">↔</span>
            <span>Research</span><span className={styles.reciprocal} aria-hidden="true">↔</span>
            <span>Application</span>
          </div>
          <p>
            The practice moves recursively between theory, research, and application.
            A theory may produce an experiment; research may become an application;
            an application may expose a new research question; an encounter may revise
            the theory. Movement is reciprocal rather than sequential.
          </p>
        </section>

        <section className={styles.section} aria-labelledby="commitments-heading">
          <h2 id="commitments-heading">Practice commitments</h2>
          <ul className={styles.commitments}>
            {COMMITMENTS.map((commitment) => (
              <li key={commitment.title}>
                <h3 className={styles.label}>{commitment.title}</h3>
                <p>{commitment.body}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className={styles.section} aria-labelledby="forms-heading">
          <h2 id="forms-heading">Forms of work</h2>
          <p>
            The studio works across software, visual systems, research papers,
            installations, environments, workshops, and commissioned applications.
            Different questions require different forms. Applied product and design
            work can also begin with a practical brief, without becoming a formal
            research project.
          </p>
          <Link className={styles.textLink} href="/projects">Explore the work →</Link>
        </section>

        <section className={styles.section} aria-labelledby="current-heading">
          <h2 id="current-heading">Current work</h2>
          <div className={styles.currentWork}>
            <h3 className={styles.label}>Chroma — available for iPhone</h3>
            <p>A private place to give feeling a form. The released product brings questions of description, representation, and personal authority into an everyday journal.</p>
            <Link className={styles.textLink} href={CHROMA_URL}>Visit Chroma ↗</Link>
          </div>
          <div className={styles.currentWork}>
            <h3 className={styles.label}>Tell Me How You Feel: Chroma</h3>
            <p>A completed workshop at Plated Studios brought drawing, flowers, food, and conversation into a shared encounter with emotion and perception.</p>
            <Link className={styles.textLink} href="/projects/tell-me-how-you-feel-chroma">Workshop record →</Link>
          </div>
        </section>

        <section id="brendon" className={styles.section} aria-labelledby="founder-heading">
          <h2 id="founder-heading">Founder</h2>
          <Link className={styles.textLink} href="/brendon">Brendon Hawkins →</Link>
        </section>

        <section className={styles.section} aria-labelledby="contact-heading">
          <h2 id="contact-heading">Contact</h2>
          <ul className={styles.contact}>
            <li><a href="mailto:brendon@studiolabbh.xyz">brendon@studiolabbh.xyz</a></li>
            <li><a href="https://instagram.com/studiolabbh" target="_blank" rel="noopener noreferrer">Instagram / @studiolabbh ↗</a></li>
          </ul>
        </section>
      </div>
    </article>
  );
}
