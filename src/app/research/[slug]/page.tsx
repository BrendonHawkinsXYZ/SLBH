import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllResearchPapers, type ResearchPaper } from "@/lib/research";

export function generateStaticParams() {
  return getAllResearchPapers().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const paper = getAllResearchPapers().find((p) => p.slug === slug);
  if (!paper) return {};
  return {
    title: `${paper.title} — SLBH`,
    description: paper.abstract.slice(0, 200),
  };
}

function formatDate(iso: string): string {
  if (!iso) return "";
  const [y, m] = iso.split("-");
  return m ? `${y}.${m}` : y;
}

function formatAuthors(authors: string[]): string {
  if (authors.length === 0) return "";
  if (authors.length === 1) return authors[0];
  if (authors.length === 2) return authors.join(" & ");
  return `${authors.slice(0, -1).join(", ")} & ${authors[authors.length - 1]}`;
}

function statusLabel(status: ResearchPaper["status"]): string {
  return status.toUpperCase();
}

export default async function PaperPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const allPapers = getAllResearchPapers();
  const paper = allPapers.find((p) => p.slug === slug);
  if (!paper) notFound();

  const related = paper.related
    .map((s) => allPapers.find((p) => p.slug === s))
    .filter(Boolean) as ResearchPaper[];

  const dateLabel = formatDate(paper.date);
  const authorsLabel = formatAuthors(paper.authors);
  const titleUpper = paper.title.toUpperCase();

  return (
    <>
      {/* ── Hero ── */}
      <section className="rp-hero">
        <div className="container-page rp-hero-inner">
          <p className="t-mono rp-kicker">
            RESEARCH · {dateLabel} · {statusLabel(paper.status)}
            {paper.venue ? ` · ${paper.venue.toUpperCase()}` : ""}
          </p>
          <h1 className="t-display rp-title">{paper.title}</h1>
          {authorsLabel && <p className="rp-authors">{authorsLabel}</p>}
        </div>
      </section>

      {/* ── Readout strip ── */}
      <div className="hairline-t hairline-b rp-readout">
        <span className="t-mono" style={{ opacity: 0.55 }}>
          SLBH / v2.0 / RESEARCH / {titleUpper.split(":")[0]}
        </span>
        <span
          className="t-label rp-readout-mid"
          style={{ opacity: 0.55, letterSpacing: "0.18em" }}
        >
          {paper.tags.length > 0
            ? paper.tags.map((t) => t.toUpperCase()).join(" · ")
            : "AFFECT · SYSTEMS · DATA · TIME"}
        </span>
        <span className="t-mono" style={{ opacity: 0.55, textAlign: "right" }}>
          {paper.venue ? `${paper.venue.toUpperCase()} · ` : ""}
          {dateLabel} · {statusLabel(paper.status)}
        </span>
      </div>

      {/* ── Abstract ── */}
      <section className="container-page rp-abstract">
        <p className="t-mono rp-section-label">ABSTRACT</p>
        <div className="rp-abstract-body">
          {paper.abstract.split(/\n\n+/).map((para, i) => (
            <p key={i} className="t-body rp-abstract-para">
              {para.trim()}
            </p>
          ))}
        </div>
      </section>

      {/* ── Primary actions: PDF + DOI ── */}
      <section className="container-page rp-actions">
        {paper.pdf ? (
          <a
            href={paper.pdf}
            target="_blank"
            rel="noopener noreferrer"
            className="rp-action rp-action--primary"
          >
            <span className="rp-action-label">VIEW PDF</span>
            <span className="rp-action-arrow">↗︎</span>
          </a>
        ) : (
          <span className="rp-action rp-action--disabled">
            <span className="rp-action-label">PDF FORTHCOMING</span>
          </span>
        )}

        {paper.doi && (
          <a
            href={`https://doi.org/${paper.doi}`}
            target="_blank"
            rel="noopener noreferrer"
            className="rp-action rp-action--secondary"
          >
            <span className="rp-action-label">DOI · {paper.doi}</span>
            <span className="rp-action-arrow">↗︎</span>
          </a>
        )}

        {paper.venueUrl && (
          <a
            href={paper.venueUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rp-action rp-action--secondary"
          >
            <span className="rp-action-label">
              {paper.venue.toUpperCase()} LISTING
            </span>
            <span className="rp-action-arrow">↗︎</span>
          </a>
        )}
      </section>

      {/* ── Tags ── */}
      {paper.tags.length > 0 && (
        <section className="container-page rp-tags">
          <p className="t-mono rp-section-label">TAGS</p>
          <ul className="rp-tag-list">
            {paper.tags.map((tag) => (
              <li key={tag} className="t-label rp-tag">
                {tag.toUpperCase()}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* ── Related papers ── */}
      {related.length > 0 && (
        <section className="container-page rp-related">
          <p className="t-mono rp-section-label">RELATED</p>
          <ul className="rp-related-list">
            {related.map((r) => (
              <li key={r.slug}>
                <Link href={`/research/${r.slug}`} className="rp-related-link">
                  <span className="t-mono rp-related-date">
                    {formatDate(r.date)}
                  </span>
                  <span className="rp-related-title">{r.title}</span>
                  <span className="t-label rp-related-status">
                    {statusLabel(r.status)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <style>{`
        /* ── Hero ── */
        .rp-hero {
          min-height: 50vh;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
        }
        .rp-hero-inner {
          padding-top: 80px;
          padding-bottom: 56px;
        }
        .rp-kicker {
          opacity: 0.55;
          margin: 0 0 24px;
        }
        .rp-title {
          margin: 0 0 28px;
          max-width: 18ch;
        }
        @media (min-width: 900px) {
          .rp-title { max-width: 22ch; }
        }
        .rp-authors {
          font-family: var(--font-inter), sans-serif;
          font-weight: 300;
          font-size: 18px;
          line-height: 1.4;
          opacity: 0.82;
          margin: 0;
        }
        @media (min-width: 768px) {
          .rp-authors { font-size: 20px; }
        }

        /* ── Readout strip ── */
        .rp-readout {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          padding: 20px var(--pad-x-mobile);
          max-width: var(--max-w);
          margin-inline: auto;
          width: 100%;
          box-sizing: border-box;
        }
        @media (min-width: 768px) {
          .rp-readout { padding: 20px var(--pad-x); }
        }
        .rp-readout-mid { display: none; }
        @media (min-width: 1024px) {
          .rp-readout-mid { display: block; }
        }

        /* ── Abstract ── */
        .rp-abstract {
          padding-top: 80px;
          padding-bottom: 56px;
        }
        .rp-section-label {
          opacity: 0.45;
          margin: 0 0 24px;
          font-size: 10px;
          letter-spacing: 0.18em;
        }
        .rp-abstract-body {
          max-width: 640px;
        }
        .rp-abstract-para {
          margin: 0 0 18px;
          line-height: 1.7;
          opacity: 0.88;
        }
        .rp-abstract-para:last-child { margin-bottom: 0; }

        /* ── Actions ── */
        .rp-actions {
          padding-top: 0;
          padding-bottom: 80px;
          display: flex;
          flex-direction: column;
          gap: 0;
        }
        .rp-action {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
          padding: 28px 0;
          text-decoration: none;
          color: var(--ground);
          border-top: 0.5px solid var(--hairline);
          transition: opacity var(--d-fast) var(--ease-out);
        }
        .rp-action:last-child {
          border-bottom: 0.5px solid var(--hairline);
        }
        .rp-action:hover {
          opacity: 0.55;
        }
        .rp-action--disabled {
          opacity: 0.35;
          cursor: default;
        }
        .rp-action--disabled:hover { opacity: 0.35; }
        .rp-action-label {
          font-family: var(--font-inter), sans-serif;
          font-weight: 500;
          font-size: clamp(16px, 2.4vw, 22px);
          letter-spacing: 0.04em;
        }
        .rp-action--primary .rp-action-label {
          font-size: clamp(20px, 3vw, 28px);
        }
        .rp-action-arrow {
          font-family: var(--font-inter), sans-serif;
          font-size: clamp(20px, 3vw, 28px);
        }

        /* ── Tags ── */
        .rp-tags {
          padding-top: 0;
          padding-bottom: 56px;
        }
        .rp-tag-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        .rp-tag {
          border: 1px solid var(--hairline-strong);
          padding: 6px 12px;
          letter-spacing: 0.14em;
          font-size: 10px;
        }

        /* ── Related ── */
        .rp-related {
          padding-top: 0;
          padding-bottom: 80px;
        }
        .rp-related-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        .rp-related-link {
          display: grid;
          grid-template-columns: 80px 1fr 100px;
          gap: 24px;
          align-items: center;
          padding: 20px 0;
          border-top: 0.5px solid var(--hairline);
          text-decoration: none;
          color: var(--ground);
          transition: opacity var(--d-fast) var(--ease-out);
        }
        .rp-related-link:hover { opacity: 0.55; }
        .rp-related-list li:last-child .rp-related-link {
          border-bottom: 0.5px solid var(--hairline);
        }
        .rp-related-date { opacity: 0.72; font-size: 11px; }
        .rp-related-title {
          font-family: var(--font-inter), sans-serif;
          font-weight: 500;
          font-size: clamp(14px, 2vw, 18px);
          line-height: 1.25;
        }
        .rp-related-status {
          justify-self: end;
          border: 1px solid var(--hairline-strong);
          padding: 6px 12px;
          letter-spacing: 0.14em;
          font-size: 10px;
        }
        @media (max-width: 720px) {
          .rp-related-link {
            grid-template-columns: 1fr auto;
            gap: 8px;
          }
          .rp-related-title { grid-column: 1 / -1; order: 1; }
          .rp-related-date { order: 2; }
          .rp-related-status { order: 3; justify-self: end; }
        }
      `}</style>
    </>
  );
}
