import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllResearchPapers, type ResearchPaper } from "@/lib/research";
import styles from "../research.module.css";

export function generateStaticParams() {
  return getAllResearchPapers().map((paper) => ({ slug: paper.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const paper = getAllResearchPapers().find((entry) => entry.slug === slug);
  if (!paper) return {};
  return {
    title: `${paper.title} — SLBH`,
    description: paper.abstract.slice(0, 200),
  };
}

function formatAuthors(authors: string[]): string {
  if (authors.length < 2) return authors.join("");
  if (authors.length === 2) return authors.join(" & ");
  return `${authors.slice(0, -1).join(", ")} & ${authors[authors.length - 1]}`;
}

export default async function PaperPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const papers = getAllResearchPapers();
  const paper = papers.find((entry) => entry.slug === slug);
  if (!paper) notFound();

  const related = paper.related
    .map((relatedSlug) => papers.find((entry) => entry.slug === relatedSlug))
    .filter((entry): entry is ResearchPaper => Boolean(entry));
  const authors = formatAuthors(paper.authors);
  const citation = [
    authors && `${authors}.`,
    paper.date && `(${paper.date.slice(0, 4)}).`,
    `${paper.title}.`,
    paper.venue && `${paper.venue}.`,
    paper.status === "preprint" && "Preprint.",
  ].filter(Boolean).join(" ");

  return (
    <article className={`container-page ${styles.page}`}>
      <div className={styles.document}>
        <header className={styles.header}>
          <h1>{paper.title}</h1>
          {authors && <p className={styles.authors}>{authors}</p>}
          <dl className={styles.metadata}>
            {paper.date && <div><dt>Date</dt><dd><time dateTime={paper.date}>{paper.date.replaceAll("-", ".")}</time></dd></div>}
            <div><dt>Status</dt><dd className={styles.status}>{paper.status}</dd></div>
            {paper.venue && <div><dt>Repository</dt><dd>{paper.venue}{paper.venueId ? ` · ${paper.venueId}` : ""}</dd></div>}
          </dl>
          <div className={styles.actions}>
            {paper.pdf && <a href={paper.pdf} download>Download paper (PDF) ↓</a>}
            {paper.venueUrl && (
              <a href={paper.venueUrl} target="_blank" rel="noopener noreferrer">
                Read on {paper.venue || "publication site"} ↗
              </a>
            )}
            {!paper.pdf && !paper.venueUrl && <p className={styles.muted}>Full paper forthcoming.</p>}
            {paper.doi && (
              <a href={`https://doi.org/${paper.doi}`} target="_blank" rel="noopener noreferrer">
                DOI: {paper.doi} ↗
              </a>
            )}
          </div>
        </header>

        <section className={styles.section} aria-labelledby="abstract-heading">
          <h2 id="abstract-heading">Abstract</h2>
          {paper.abstract.split(/\n\n+/).map((paragraph, index) => (
            <p key={index}>{paragraph.trim()}</p>
          ))}
        </section>

        <section className={styles.section} aria-labelledby="citation-heading">
          <h2 id="citation-heading">Citation</h2>
          <p className={styles.citation}>
            {citation}{" "}
            {paper.doi ? (
              <a href={`https://doi.org/${paper.doi}`} target="_blank" rel="noopener noreferrer">https://doi.org/{paper.doi}</a>
            ) : paper.venueUrl ? (
              <a href={paper.venueUrl} target="_blank" rel="noopener noreferrer">{paper.venueUrl}</a>
            ) : null}
          </p>
        </section>

        {paper.tags.length > 0 && (
          <section className={styles.section} aria-labelledby="subjects-heading">
            <h2 id="subjects-heading">Subjects</h2>
            <p className={styles.muted}>{paper.tags.join(", ")}</p>
          </section>
        )}

        {(related.length > 0 || paper.slug === "emotion-as-system") && (
          <section className={styles.section} aria-labelledby="related-heading">
            <h2 id="related-heading">Related work</h2>
            <ul className={styles.related}>
              {related.map((entry) => (
                <li key={entry.slug}>
                  <Link href={`/research/${entry.slug}`}>{entry.title} →</Link>
                  <span>{entry.date.slice(0, 4)} · {entry.status}</span>
                </li>
              ))}
              {paper.slug === "emotion-as-system" && (
                <>
                  <li>
                    <Link href="/diagrams">Diagrams →</Link>
                    <span>Systems and relationships across the practice.</span>
                  </li>
                  <li>
                    <Link href="/projects/affective-geometry">Affective Geometry →</Link>
                    <span>Emotion as shape and color.</span>
                  </li>
                </>
              )}
            </ul>
          </section>
        )}
      </div>
    </article>
  );
}
