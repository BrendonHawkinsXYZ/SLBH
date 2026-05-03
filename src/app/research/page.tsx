import Link from "next/link";
import { redirect } from "next/navigation";
import { getAllResearchPapers, type ResearchPaper } from "@/lib/research";

function formatDate(iso: string): string {
  if (!iso) return "";
  const [y, m] = iso.split("-");
  return m ? `${y}.${m}` : y;
}

function statusLabel(status: ResearchPaper["status"]): string {
  return status.toUpperCase();
}

export default function ResearchPage() {
  const papers = getAllResearchPapers();

  // §8.1 Single-paper case: redirect straight to the abstract page.
  if (papers.length === 1) redirect(`/research/${papers[0].slug}`);

  // §8.2 Empty state: nothing yet to show.
  if (papers.length === 0) {
    return (
      <div className="hairline-t hairline-b rp-empty">
        <span className="t-mono" style={{ opacity: 0.55 }}>
          SLBH / v2.0 / RESEARCH
        </span>
        <span className="t-mono" style={{ opacity: 0.55 }}>
          NO PAPERS YET
        </span>
        <style>{`
          .rp-empty {
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
            .rp-empty { padding: 20px var(--pad-x); }
          }
        `}</style>
      </div>
    );
  }

  // §8.3 Multi-paper index.
  const total = papers.length;
  const preprints = papers.filter((p) => p.status === "preprint").length;
  const published = papers.filter((p) => p.status === "published").length;
  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <>
      <div className="hairline-t hairline-b rpi-readout">
        <span className="t-mono" style={{ opacity: 0.55 }}>
          SLBH / v2.0 / RESEARCH
        </span>
        <span
          className="t-label rpi-readout-mid"
          style={{ opacity: 0.55, letterSpacing: "0.18em" }}
        >
          AFFECT · SYSTEMS · DATA · TIME
        </span>
        <span className="t-mono" style={{ opacity: 0.55, textAlign: "right" }}>
          {pad(total)} TOTAL · {pad(preprints)} PREPRINT · {pad(published)} PUBLISHED
        </span>
      </div>

      <section className="container-page rpi-section">
        <ul className="rpi-list">
          {papers.map((p) => (
            <li key={p.slug}>
              <Link href={`/research/${p.slug}`} className="rpi-link">
                <span className="rpi-date t-mono">{formatDate(p.date)}</span>
                <span className="rpi-title">{p.title}</span>
                <span className="rpi-status t-label">
                  {statusLabel(p.status)}
                </span>
                <span className="rpi-venue t-mono">{p.venue}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <style>{`
        .rpi-readout {
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
          .rpi-readout { padding: 20px var(--pad-x); }
        }
        .rpi-readout-mid { display: none; }
        @media (min-width: 768px) {
          .rpi-readout-mid { display: block; }
        }

        .rpi-section {
          padding-top: 56px;
          padding-bottom: 80px;
        }
        @media (min-width: 768px) {
          .rpi-section { padding-top: 80px; padding-bottom: 96px; }
        }
        .rpi-list { list-style: none; padding: 0; margin: 0; }
        .rpi-link {
          display: grid;
          grid-template-columns: 80px 1fr 120px 80px;
          gap: 24px;
          align-items: center;
          padding: 24px 0;
          border-top: 0.5px solid var(--hairline);
          text-decoration: none;
          color: var(--ground);
        }
        .rpi-link > *:not(.rpi-title) {
          transition: opacity var(--d-fast) var(--ease-out);
        }
        .rpi-link:hover > *:not(.rpi-title) {
          opacity: 0.55;
        }
        .rpi-list li:last-child .rpi-link {
          border-bottom: 0.5px solid var(--hairline);
        }
        .rpi-date { opacity: 0.72; font-size: 11px; }
        .rpi-title {
          font-family: var(--font-orbitron), sans-serif;
          font-weight: 500;
          font-size: clamp(14px, 2vw, 20px);
          line-height: 1.25;
        }
        .rpi-status {
          justify-self: start;
          border: 1px solid var(--hairline-strong);
          padding: 6px 12px;
          letter-spacing: 0.14em;
          font-size: 10px;
        }
        .rpi-venue { opacity: 0.72; font-size: 11px; text-align: right; }
        @media (max-width: 720px) {
          .rpi-link {
            grid-template-columns: 1fr auto;
            gap: 8px;
          }
          .rpi-link .rpi-title { grid-column: 1 / -1; order: 1; font-size: 15px; }
          .rpi-link .rpi-date  { order: 2; }
          .rpi-link .rpi-status{ order: 3; justify-self: end; }
          .rpi-link .rpi-venue { order: 4; grid-column: 1 / -1; text-align: left; }
        }
      `}</style>
    </>
  );
}
