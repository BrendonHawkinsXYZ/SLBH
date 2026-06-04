import Link from "next/link";
import { getAllProjects, findImage } from "@/lib/projects";
import { TrunkLine } from "@/components/TrunkLine";
import { PipelineDiagram } from "@/components/projects/american-emotions/PipelineDiagram";
import { IterationTimeline } from "@/components/projects/american-emotions/IterationTimeline";
import { FallbackImg } from "@/components/projects/american-emotions/FallbackImg";

export const metadata = {
  title: "American Emotions — SLBH",
  description:
    "A living instrument that renders collective affect as color, using public attention as the signal.",
};

export default function AmericanEmotionsPage() {
  const allProjects = getAllProjects();
  const relatedSlugs = ["acg", "tihif-nyc"];
  const related = relatedSlugs
    .map((s) => allProjects.find((p) => p.slug === s))
    .filter(Boolean) as (typeof allProjects)[0][];

  const heroSrc = findImage("american-emotions", "hero");
  const render2024Src = findImage("american-emotions", "render-2024");

  return (
    <>
      {/* ── Section 1: Hero ── */}
      <section className="ae-hero">
        <div className="container-page ae-hero-inner">
          <p className="t-mono ae-kicker">
            PROJECT 01 / 2024 — ACTIVE / NYC
          </p>
          <h1 className="t-display ae-title">American Emotions</h1>
          <p className="ae-summary">
            A living instrument that renders collective affect as color, using
            public attention as the signal.
          </p>
        </div>
        <div className="ae-trunkline">
          <TrunkLine length={110} nodePosition="top" />
        </div>
      </section>

      {/* ── Section 2: Readout strip ── */}
      <div className="hairline-t hairline-b ae-readout">
        <span className="t-mono" style={{ opacity: 0.55 }}>
          SLBH / v2.0 / PROJECTS / AMERICAN EMOTIONS
        </span>
        <span
          className="t-label ae-readout-mid"
          style={{ opacity: 0.55, letterSpacing: "0.18em" }}
        >
          AFFECT · SYSTEMS · DATA · TIME
        </span>
        <span className="t-mono" style={{ opacity: 0.55, textAlign: "right" }}>
          STATUS: ACTIVE · EST. 2024 · ITERATIONS: 03
        </span>
      </div>

      {/* ── Section 3: Hero visual ── */}
      <section className="ae-visual" aria-label="American Emotions hero visual">
        <div className="ae-visual-bg" aria-hidden />
        {heroSrc ? (
          <FallbackImg
            src={heroSrc}
            alt="American Emotions — rendered collective affect as color"
            className="ae-visual-img"
          />
        ) : (
          <div className="ae-visual-fallback" aria-hidden>
            <span className="t-mono" style={{ opacity: 0.3 }}>
              TK: HERO VISUAL
            </span>
          </div>
        )}
      </section>

      {/* ── Section 4: Editorial ── */}
      <section className="container-page ae-editorial">
        {/* Block A — ORIGIN */}
        <div className="ae-block ae-block--text-left">
          <div className="ae-block-text">
            <p className="t-mono ae-block-kicker">01 / ORIGIN</p>
            <h2 className="t-h2 ae-block-headline">
              It started as a question about color.
            </h2>
            <p className="t-body ae-block-body">
              American Emotions began in 2024 as a question: could I render a
              nation&rsquo;s emotional state? And if I could, what would the
              right medium be? The answer arrived as color.
            </p>
            <p className="t-body ae-block-body">
              The project ran for seven months leading up to the 2024
              presidential election. It was conceived as art, but the process
              of making it—tracking millions of small signals of public
              attention, inferring affect from what people were thinking about,
              watching that affect move and change in near-real-time—established
              the philosophy that now grounds every other project in the lab.
            </p>
            <p className="t-body ae-block-body">
              American Emotions is where the lab&rsquo;s axiom came from.
              Affect has value. It is measurable, collective, and shaped.
            </p>
          </div>
          <div className="ae-block-visual">
            <div className="ae-archival-wrap">
              <div className="ae-archival-frame">
                <div className="ae-archival-bg" />
                <FallbackImg
                  src={render2024Src}
                  alt="2024 election run render, archival"
                  className="ae-archival-img"
                />
              </div>
              <p className="t-mono ae-archival-caption">
                2024 ELECTION RUN — ARCHIVAL
              </p>
            </div>
          </div>
        </div>

        {/* Block B — METHOD */}
        <div className="ae-block ae-block--diagram-left">
          <div className="ae-block-visual ae-pipeline-wrap">
            <PipelineDiagram />
          </div>
          <div className="ae-block-text">
            <p className="t-mono ae-block-kicker">02 / METHOD</p>
            <h2 className="t-h2 ae-block-headline">
              Public attention as an affect proxy.
            </h2>
            <p className="t-body ae-block-body">
              The pipeline treats Google search trends as a proxy for what
              people are collectively thinking about. Each trending query is
              scored against a 171-emotion taxonomy by a language model, which
              assigns emotional weight and a color drawn freely from the
              continuous spectrum.
            </p>
            <p className="t-body ae-block-body">
              Scores accumulate over time into a luminous field. The renderer
              uses float32 additive accumulation with Gaussian bloom, so
              individual queries leave soft traces that layer into a density
              map of collective attention. The result is not a chart. It is a
              field you read the way you read a sky.
            </p>
          </div>
        </div>

        {/* Block C — ITERATIONS */}
        <div className="ae-block ae-block--text-left">
          <div className="ae-block-text">
            <p className="t-mono ae-block-kicker">03 / ITERATIONS</p>
            <h2 className="t-h2 ae-block-headline">
              Three runs, one continuous instrument.
            </h2>
            <p className="t-body ae-block-body">
              The project has run in three phases. The first, AMERICAN EMOTIONS
              (2024), ran for seven months leading up to the presidential
              election. The second, NEW YORK EMOTIONS (2025), ran for six weeks
              leading up to the NYC mayoral election. The third restarted in
              April 2026 and is ongoing, designed to run continuously through
              midterms and into the next presidential cycle.
            </p>
            <p className="t-body ae-block-body">
              Each run sharpened the pipeline. The taxonomy expanded. The
              renderer got quieter. The field got easier to read.
            </p>
          </div>
          <div className="ae-block-visual">
            <IterationTimeline />
          </div>
        </div>

        {/* Block D — INFLUENCE */}
        <div className="ae-block ae-block--full">
          <p className="t-mono ae-block-kicker">04 / INFLUENCE</p>
          <h2 className="t-h2 ae-block-headline">
            The art project became the lab.
          </h2>
          <p className="t-body ae-block-body ae-block-body--wide">
            American Emotions is the work every other project in Studio Lab BH
            descends from. The philosophy it established—affect as a
            structured, measurable, collective phenomenon—became the
            foundational axiom. The pipeline became Chroma. The renderer became
            a research instrument. The questions it raised became papers.
          </p>
          <p className="t-body ae-block-body ae-block-body--wide">
            The project is still art. It is also the lab&rsquo;s oldest
            continuously running piece of infrastructure.
          </p>
        </div>
      </section>

      {/* ── Section 5: Links ── */}
      <section className="container-page ae-links">
        {[
          { label: "LIVE INSTRUMENT", href: "https://www.instagram.com/americanemotions", note: "instagram / @americanemotions" },
          { label: "RELATED PAPER", href: "/research/emotion-as-system", note: "/research/emotion-as-system" },
          { label: "SEE ALSO", href: "/projects/acg", note: "/projects/acg" },
        ].map(({ label, href, note }, i) => (
          <div key={label} className="ae-link-row" style={{ borderTop: i === 0 ? "0.5px solid var(--hairline)" : undefined }}>
            <span
              style={{
                fontFamily: "var(--font-orbitron), sans-serif",
                fontWeight: 500,
                fontSize: 13,
                letterSpacing: "0.04em",
              }}
            >
              {label}
            </span>
            {href ? (
              <Link href={href} className="t-mono link-quiet ae-link-url" target="_blank" rel="noopener noreferrer">
                {note} →
              </Link>
            ) : (
              <span className="t-mono ae-link-url" style={{ opacity: 0.35 }}>
                {note}
              </span>
            )}
          </div>
        ))}
      </section>

      {/* ── Section 6: Related projects ── */}
      {related.length > 0 && (
        <section className="container-page ae-related">
          <p className="t-mono ae-related-label">RELATED PROJECTS</p>
          <div className="ae-rel-grid">
            {related.map((p) => (
              <Link
                key={p.slug}
                href={`/projects/${p.slug}`}
                className="ae-rel-card link-quiet"
              >
                <div className="ae-rel-cover">
                  {p.coverPath && (
                    <FallbackImg
                      src={p.coverPath}
                      alt={p.title}
                      style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                    />
                  )}
                </div>
                <div className="ae-rel-meta">
                  <span
                    style={{
                      fontFamily: "var(--font-orbitron), sans-serif",
                      fontWeight: 500,
                      fontSize: 13,
                      letterSpacing: "0.02em",
                      display: "block",
                      marginBottom: 6,
                    }}
                  >
                    {p.title}
                  </span>
                  <span className="t-mono" style={{ opacity: 0.55, fontSize: 10 }}>
                    {p.year}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <style>{`
        /* ── Hero ── */
        .ae-hero {
          position: relative;
        }
        .ae-hero-inner {
          padding-top: 56px;
          padding-bottom: 144px;
        }
        .ae-kicker {
          opacity: 0.55;
          margin: 0 0 20px;
        }
        .ae-title {
          margin: 0 0 28px;
        }
        .ae-summary {
          font-family: var(--font-inter), sans-serif;
          font-weight: 300;
          font-size: 24px;
          line-height: 1.4;
          max-width: 640px;
          opacity: 0.82;
          margin: 0;
        }
        .ae-trunkline {
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
        }

        /* ── Readout strip ── */
        .ae-readout {
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
          .ae-readout { padding: 20px var(--pad-x); }
        }
        .ae-readout-mid { display: none; }
        @media (min-width: 768px) {
          .ae-readout-mid { display: block; }
        }

        /* ── Hero visual ── */
        .ae-visual {
          min-height: 100vh;
          position: relative;
          overflow: hidden;
          background: var(--graphite);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .ae-visual-bg {
          position: absolute;
          inset: 0;
          background: var(--graphite);
        }
        .ae-visual-img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        .ae-visual-fallback {
          position: relative;
          z-index: 1;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* ── Editorial ── */
        .ae-editorial {
          padding-top: 96px;
          padding-bottom: 96px;
          display: flex;
          flex-direction: column;
          gap: 96px;
        }
        @media (min-width: 900px) {
          .ae-editorial { gap: 120px; }
        }

        .ae-block {
          display: grid;
          grid-template-columns: 1fr;
          gap: 48px;
        }
        @media (min-width: 900px) {
          .ae-block { grid-template-columns: 1fr 1fr; gap: 80px; align-items: start; }
          .ae-block--diagram-left .ae-block-visual { order: -1; }
        }
        .ae-block--full {
          display: block;
          max-width: 640px;
        }

        .ae-block-kicker {
          opacity: 0.45;
          margin: 0 0 16px;
          font-size: 10px;
          letter-spacing: 0.12em;
        }
        .ae-block-headline {
          margin: 0 0 28px;
        }
        .ae-block-body {
          margin: 0 0 18px;
          max-width: 520px;
          line-height: 1.7;
          opacity: 0.82;
        }
        .ae-block-body--wide {
          max-width: 640px;
        }
        .ae-block-body:last-child { margin-bottom: 0; }

        /* Archival image */
        .ae-archival-frame {
          position: relative;
          aspect-ratio: 1/1;
          width: 100%;
          border: 0.5px solid var(--hairline-strong);
          overflow: hidden;
        }
        .ae-archival-bg {
          position: absolute;
          inset: 0;
          background: var(--graphite);
        }
        .ae-archival-img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        .ae-archival-caption {
          margin: 12px 0 0;
          font-size: 9px;
          opacity: 0.45;
          letter-spacing: 0.1em;
        }

        /* Pipeline diagram */
        .ae-pipeline-wrap {
          display: flex;
          align-items: center;
          padding: 32px 0;
        }

        /* ── Links ── */
        .ae-links {
          padding-top: 0;
          padding-bottom: 80px;
        }
        .ae-link-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
          padding: 24px 0;
          border-bottom: 0.5px solid var(--hairline);
        }
        .ae-link-url {
          font-size: 11px;
          color: var(--ground);
          text-decoration: none;
        }

        /* ── Related ── */
        .ae-related {
          padding-top: 0;
          padding-bottom: 80px;
        }
        .ae-related-label {
          opacity: 0.45;
          margin: 0 0 32px;
          font-size: 10px;
          letter-spacing: 0.12em;
        }
        .ae-rel-grid {
          display: flex;
          gap: 24px;
          overflow-x: auto;
          padding-bottom: 8px;
        }
        .ae-rel-card {
          flex-shrink: 0;
          width: 240px;
          text-decoration: none;
          color: var(--ground);
          transition: opacity 600ms var(--ease-out);
        }
        .ae-rel-grid:has(.ae-rel-card:hover) .ae-rel-card:not(:hover) {
          opacity: 0.35;
        }
        .ae-rel-cover {
          width: 240px;
          height: 300px;
          background: var(--graphite);
          overflow: hidden;
          margin-bottom: 16px;
        }
        .ae-rel-meta { padding: 0 4px; }

      `}</style>
    </>
  );
}
