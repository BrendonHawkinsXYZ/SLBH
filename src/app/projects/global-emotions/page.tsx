import Link from "next/link";
import { getAllProjects, findImage } from "@/lib/projects";
import { TrunkLine } from "@/components/TrunkLine";
import { FallbackImg } from "@/components/projects/FallbackImg";
import { FlowDiagram } from "@/components/projects/FlowDiagram";

// Scaffold: structure and labels are final, body copy is TK. Paragraphs marked
// .ge-tk are placeholders waiting on copy; drop images into
// public/projects/global-emotions/ and the frames fill in on their own.

export const metadata = {
  title: "Global Emotions — SLBH",
  description:
    "A live instrument that reads collective affect beyond one country, rendering the world's emotional field as color.",
};

const LIVE_URL = "https://globalemotions.studiolabbh.xyz";

export default function GlobalEmotionsPage() {
  const allProjects = getAllProjects();
  const relatedSlugs = ["american-emotions", "acg"];
  const related = relatedSlugs
    .map((s) => allProjects.find((p) => p.slug === s))
    .filter(Boolean) as (typeof allProjects)[0][];

  const asset = (base: string) => findImage("global-emotions", base);
  const heroSrc = asset("hero");
  const originSrc = asset("origin");
  const docs: { base: string; caption: string; wide?: boolean }[] = [
    { base: "field-world", caption: "TK / WORLD FIELD", wide: true },
    { base: "region-01", caption: "TK / REGION READOUT" },
    { base: "region-02", caption: "TK / REGION READOUT" },
    { base: "interface-01", caption: "TK / INTERFACE" },
    { base: "interface-02", caption: "TK / INTERFACE" },
  ];

  return (
    <>
      {/* ── Section 1: Header ── */}
      <section className="ge-hero">
        <div className="container-page ge-hero-inner">
          <p className="t-mono ge-kicker">PROJECT 05 / 2026 / ACTIVE / GLOBAL</p>
          <h1 className="t-display ge-title">Global Emotions</h1>
          <p className="ge-summary ge-tk">
            TK — the one-sentence version of Global Emotions. What it reads,
            where it reads it, and what it renders.
          </p>
        </div>
        <div className="ge-trunkline">
          <TrunkLine length={110} nodePosition="top" />
        </div>
      </section>

      {/* ── Section 2: Readout strip ── */}
      <div className="hairline-t hairline-b ge-readout">
        <span className="t-mono" style={{ opacity: 0.55 }}>
          SLBH / v2.0 / PROJECTS / GLOBAL EMOTIONS
        </span>
        <span
          className="t-label ge-readout-mid"
          style={{ opacity: 0.55, letterSpacing: "0.18em" }}
        >
          AFFECT · SYSTEMS · DATA · TIME · GEOGRAPHY
        </span>
        <span className="t-mono" style={{ opacity: 0.55, textAlign: "right" }}>
          STATUS: ACTIVE · 2026 · LIVE INSTRUMENT
        </span>
      </div>

      {/* ── Section 3: Hero visual ── */}
      <section className="ge-visual" aria-label="Global Emotions hero visual">
        <div className="ge-visual-bg" aria-hidden />
        {heroSrc && <FallbackImg src={heroSrc} alt="" className="ge-visual-img" />}
        {!heroSrc && (
          <div className="ge-visual-fallback" aria-hidden>
            <span className="t-mono" style={{ opacity: 0.3 }}>
              TK: HERO VISUAL
            </span>
          </div>
        )}
      </section>

      {/* ── Section 4: Editorial ── */}
      <section className="container-page ge-editorial">
        {/* Block A — ORIGIN */}
        <div className="ge-block ge-block--text-left">
          <div className="ge-block-text">
            <p className="t-mono ge-block-kicker">01 / ORIGIN</p>
            <h2 className="t-h2 ge-block-headline ge-tk-head">
              TK — headline: where Global Emotions came from.
            </h2>
            <p className="t-body ge-block-body ge-tk">
              TK — the origin paragraph. American Emotions read one country;
              this is the question that pushed the instrument past that border.
            </p>
            <p className="t-body ge-block-body ge-tk">
              TK — what changes when the field is global rather than national:
              language, time zones, data availability, comparability.
            </p>
          </div>
          <div className="ge-block-visual">
            <div className="ge-img-wrap">
              <div className="ge-img-frame">
                <div className="ge-img-bg" />
                {originSrc && (
                  <FallbackImg
                    src={originSrc}
                    alt="Global Emotions, early field render"
                    className="ge-img-fill"
                  />
                )}
              </div>
              <p className="t-mono ge-img-caption">TK — CAPTION</p>
            </div>
          </div>
        </div>

        {/* Block B — METHOD */}
        <div className="ge-block ge-block--diagram-left">
          <div className="ge-block-visual ge-flow-wrap">
            <FlowDiagram
              ariaLabel="Method: public signal → regional aggregation → emotion scoring → color field"
              stages={[
                { primary: "PUBLIC", secondary: "SIGNAL" },
                { primary: "REGIONAL", secondary: "AGGREGATION" },
                { primary: "EMOTION", secondary: "SCORING" },
                { primary: "COLOR", secondary: "FIELD" },
              ]}
            />
          </div>
          <div className="ge-block-text">
            <p className="t-mono ge-block-kicker">02 / METHOD</p>
            <h2 className="t-h2 ge-block-headline ge-tk-head">
              TK — headline: how the world field is read.
            </h2>
            <p className="t-body ge-block-body ge-tk">
              TK — the pipeline in prose: what the signal is, how it is grouped
              by region, how it is scored, how a score becomes a color.
            </p>
            <p className="t-body ge-block-body ge-tk">
              TK — what the instrument deliberately does not claim. The limits
              of the reading, stated plainly.
            </p>
          </div>
        </div>

        {/* Block C — COVERAGE */}
        <div className="ge-block ge-block--text-left">
          <div className="ge-block-text">
            <p className="t-mono ge-block-kicker">03 / COVERAGE</p>
            <h2 className="t-h2 ge-block-headline ge-tk-head">
              TK — headline: what the instrument can see.
            </h2>
            <p className="t-body ge-block-body ge-tk">
              TK — coverage as it stands: which regions resolve well, which are
              thin, and what widens the aperture next.
            </p>
          </div>
          <div className="ge-block-visual ge-flow-wrap">
            <FlowDiagram
              ariaLabel="Coverage: source pool → language handling → regional resolution → field state"
              stages={[
                { primary: "SOURCE", secondary: "POOL" },
                { primary: "LANGUAGE", secondary: "HANDLING" },
                { primary: "REGIONAL", secondary: "RESOLUTION" },
                { primary: "FIELD", secondary: "STATE" },
              ]}
            />
          </div>
        </div>

        {/* Block D — READING */}
        <div className="ge-block ge-block--full">
          <p className="t-mono ge-block-kicker">04 / READING</p>
          <h2 className="t-h2 ge-block-headline ge-tk-head">
            TK — headline: how to read a global field.
          </h2>
          <p className="t-body ge-block-body ge-block-body--wide ge-tk">
            TK — what a viewer is actually looking at, and what makes a moment
            worth noticing: divergence between regions, drift over a day,
            alignment across the whole field.
          </p>
          <p className="t-body ge-block-body ge-block-body--wide ge-tk">
            TK — the closing thought of the section. Why a world-scale affective
            reading matters, in the studio&rsquo;s terms.
          </p>
        </div>
      </section>

      {/* ── Section 4b: Documentation strip ── */}
      <section className="container-page ge-doc-strip">
        <div className="ge-doc-grid">
          {docs.map((doc) => {
            const src = asset(doc.base);
            return (
              <figure
                key={doc.base}
                className={`ge-doc-cell${doc.wide ? " ge-doc-cell--wide" : ""}`}
              >
                <div className="ge-doc-frame">
                  <div className="ge-doc-bg" />
                  {src && (
                    <FallbackImg src={src} alt={doc.caption} className="ge-img-fill" />
                  )}
                </div>
                <figcaption className="t-mono ge-doc-caption">
                  {doc.caption}
                </figcaption>
              </figure>
            );
          })}
        </div>
      </section>

      {/* ── Section 5: Instrument ── */}
      <section className="container-page ge-instrument">
        <p className="t-mono ge-instrument-label">INSTRUMENT</p>
        <div className="ge-instrument-rows">
          {[
            { label: "PLATFORM", value: "WEB · LIVE" },
            { label: "COVERAGE", value: "TK" },
            { label: "UPDATE CADENCE", value: "TK" },
            { label: "DATA SOURCES", value: "TK" },
            { label: "OUTPUT", value: "COLOR FIELD" },
            { label: "STATUS", value: "ACTIVE · ONGOING" },
          ].map((row, i) => (
            <div
              key={row.label}
              className="ge-instrument-row"
              style={{ borderTop: i === 0 ? "0.5px solid var(--hairline)" : undefined }}
            >
              <span className="ge-instrument-key t-label">{row.label}</span>
              <span className="t-mono ge-instrument-val">{row.value}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Section 6: Links ── */}
      <section className="container-page ge-links">
        {[
          { label: "LIVE INSTRUMENT", href: LIVE_URL, note: "globalemotions.studiolabbh.xyz", external: true },
          { label: "AMERICAN EMOTIONS", href: "/projects/american-emotions", note: "/projects/american-emotions" },
          { label: "READ THE THEORY", href: "/research/emotion-as-system", note: "/research/emotion-as-system" },
        ].map(({ label, href, note, external }, i) => (
          <div
            key={label}
            className="ge-link-row"
            style={{ borderTop: i === 0 ? "0.5px solid var(--hairline)" : undefined }}
          >
            <span className="ge-link-label">{label}</span>
            {external ? (
              <a
                href={href}
                className="t-mono link-quiet ge-link-url"
                target="_blank"
                rel="noopener noreferrer"
              >
                {note} ↗
              </a>
            ) : (
              <Link href={href} className="t-mono link-quiet ge-link-url">
                {note} →
              </Link>
            )}
          </div>
        ))}
      </section>

      {/* ── Section 7: Related projects ── */}
      {related.length > 0 && (
        <section className="container-page ge-related">
          <p className="t-mono ge-related-label">RELATED PROJECTS</p>
          <div className="ge-rel-grid">
            {related.map((p) => (
              <Link
                key={p.slug}
                href={`/projects/${p.slug}`}
                className="ge-rel-card link-quiet"
              >
                <div className="ge-rel-cover">
                  {p.coverPath && (
                    <FallbackImg
                      src={p.coverPath}
                      alt={p.title}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        display: "block",
                      }}
                    />
                  )}
                </div>
                <div className="ge-rel-meta">
                  <span className="ge-rel-title">{p.title}</span>
                  <span className="t-mono" style={{ opacity: 0.55, fontSize: 10 }}>
                    {p.year}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ── Section 8: Footer copy ── */}
      <section className="container-page ge-footer">
        <p className="t-body ge-footer-body ge-tk">
          TK — closing note. Global Emotions is ongoing; say what the next
          version of the instrument is meant to answer.
        </p>
      </section>

      <style>{`
        /* ── Placeholder register ── */
        .ge-tk { opacity: 0.45; }
        .ge-tk-head { opacity: 0.5; }

        /* ── Hero ── */
        .ge-hero { position: relative; }
        .ge-hero-inner {
          padding-top: 56px;
          padding-bottom: 144px;
        }
        .ge-kicker { opacity: 0.55; margin: 0 0 20px; }
        .ge-title { margin: 0 0 28px; }
        .ge-summary {
          font-family: var(--font-inter), sans-serif;
          font-weight: 300;
          font-size: 24px;
          line-height: 1.4;
          max-width: 680px;
          margin: 0;
        }
        .ge-trunkline {
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
        }

        /* ── Readout strip ── */
        .ge-readout {
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
          .ge-readout { padding: 20px var(--pad-x); }
        }
        .ge-readout-mid { display: none; }
        @media (min-width: 768px) {
          .ge-readout-mid { display: block; }
        }

        /* ── Hero visual ── */
        .ge-visual {
          min-height: 100vh;
          position: relative;
          overflow: hidden;
          background: var(--graphite);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .ge-visual-bg { position: absolute; inset: 0; background: var(--graphite); }
        .ge-visual-img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        .ge-visual-fallback { position: relative; z-index: 1; }

        /* ── Editorial ── */
        .ge-editorial {
          padding-top: 96px;
          padding-bottom: 96px;
          display: flex;
          flex-direction: column;
          gap: 96px;
        }
        @media (min-width: 900px) {
          .ge-editorial { gap: 120px; }
        }
        .ge-block {
          display: grid;
          grid-template-columns: 1fr;
          gap: 48px;
        }
        @media (min-width: 900px) {
          .ge-block { grid-template-columns: 1fr 1fr; gap: 80px; align-items: start; }
          .ge-block--diagram-left .ge-block-visual { order: -1; }
        }
        .ge-block--full { display: block; max-width: 640px; }

        .ge-block-kicker {
          opacity: 0.45;
          margin: 0 0 16px;
          font-size: 10px;
          letter-spacing: 0.12em;
        }
        .ge-block-headline { margin: 0 0 28px; }
        .ge-block-body {
          margin: 0 0 18px;
          max-width: 520px;
          line-height: 1.7;
        }
        .ge-block-body--wide { max-width: 640px; }
        .ge-block-body:last-child { margin-bottom: 0; }

        /* Image frame */
        .ge-img-wrap { width: 100%; }
        .ge-img-frame {
          position: relative;
          aspect-ratio: 4/3;
          width: 100%;
          border: 0.5px solid var(--hairline-strong);
          overflow: hidden;
        }
        .ge-img-bg { position: absolute; inset: 0; background: var(--graphite); }
        .ge-img-fill {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        .ge-img-caption {
          margin: 12px 0 0;
          font-size: 9px;
          opacity: 0.45;
          letter-spacing: 0.1em;
        }

        .ge-flow-wrap { display: flex; align-items: center; padding: 32px 0; }

        /* ── Documentation strip ── */
        .ge-doc-strip { padding-top: 0; padding-bottom: 96px; }
        .ge-doc-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 32px;
        }
        @media (min-width: 768px) {
          .ge-doc-grid { grid-template-columns: repeat(2, 1fr); }
          .ge-doc-cell--wide { grid-column: span 2; }
        }
        .ge-doc-cell { margin: 0; }
        .ge-doc-frame {
          position: relative;
          aspect-ratio: 4/3;
          width: 100%;
          border: 0.5px solid var(--hairline-strong);
          overflow: hidden;
        }
        .ge-doc-cell--wide .ge-doc-frame { aspect-ratio: 16/9; }
        .ge-doc-bg { position: absolute; inset: 0; background: var(--graphite); }
        .ge-doc-caption {
          margin: 12px 0 0;
          font-size: 9px;
          opacity: 0.45;
          letter-spacing: 0.1em;
        }

        /* ── Instrument rows ── */
        .ge-instrument { padding-top: 0; padding-bottom: 96px; }
        .ge-instrument-label {
          opacity: 0.45;
          margin: 0 0 24px;
          font-size: 10px;
          letter-spacing: 0.12em;
        }
        .ge-instrument-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
          padding: 20px 0;
          border-bottom: 0.5px solid var(--hairline);
        }
        .ge-instrument-key { font-size: 10px; letter-spacing: 0.14em; opacity: 0.72; }
        .ge-instrument-val { font-size: 11px; opacity: 0.82; text-align: right; }

        /* ── Links ── */
        .ge-links { padding-top: 0; padding-bottom: 80px; }
        .ge-link-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
          padding: 24px 0;
          border-bottom: 0.5px solid var(--hairline);
        }
        .ge-link-label {
          font-family: var(--font-inter), sans-serif;
          font-weight: 500;
          font-size: 13px;
          letter-spacing: 0.04em;
        }
        .ge-link-url {
          font-size: 11px;
          color: var(--ground);
          text-decoration: none;
        }

        /* ── Related ── */
        .ge-related { padding-top: 0; padding-bottom: 80px; }
        .ge-related-label {
          opacity: 0.45;
          margin: 0 0 32px;
          font-size: 10px;
          letter-spacing: 0.12em;
        }
        .ge-rel-grid {
          display: flex;
          gap: 24px;
          overflow-x: auto;
          padding-bottom: 8px;
        }
        .ge-rel-card {
          flex-shrink: 0;
          width: 240px;
          text-decoration: none;
          color: var(--ground);
          transition: opacity 600ms var(--ease-out);
        }
        .ge-rel-grid:has(.ge-rel-card:hover) .ge-rel-card:not(:hover) { opacity: 0.35; }
        .ge-rel-cover {
          width: 240px;
          height: 300px;
          background: var(--graphite);
          overflow: hidden;
          margin-bottom: 16px;
        }
        .ge-rel-meta { padding: 0 4px; }
        .ge-rel-title {
          font-family: var(--font-inter), sans-serif;
          font-weight: 500;
          font-size: 13px;
          letter-spacing: 0.02em;
          display: block;
          margin-bottom: 6px;
        }

        /* ── Footer copy ── */
        .ge-footer {
          padding-top: 0;
          padding-bottom: 120px;
          max-width: var(--max-w);
        }
        .ge-footer-body { max-width: 640px; line-height: 1.7; margin: 0; }
      `}</style>
    </>
  );
}
