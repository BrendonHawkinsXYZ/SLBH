import Link from "next/link";
import { redirect } from "next/navigation";
import { getAllResearchPapers } from "@/lib/research";
import styles from "./research.module.css";

export const metadata = {
  title: "Research — SLBH",
  description: "Papers from Studio Lab BH.",
};

export default function ResearchPage() {
  const papers = getAllResearchPapers();
  if (papers.length === 1) redirect(`/research/${papers[0].slug}`);

  return (
    <section className={`container-page ${styles.page}`}>
      <div className={styles.document}>
        <header className={styles.header}><h1>Research</h1></header>
        {papers.length === 0 ? (
          <p className={styles.muted}>No papers yet.</p>
        ) : (
          <ul className={styles.paperList}>
            {papers.map((paper) => (
              <li key={paper.slug}>
                <Link href={`/research/${paper.slug}`}>
                  <span>{paper.title} →</span>
                  <span className={styles.paperMeta}>
                    {paper.date.slice(0, 4)} · {paper.status}{paper.venue ? ` · ${paper.venue}` : ""}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
