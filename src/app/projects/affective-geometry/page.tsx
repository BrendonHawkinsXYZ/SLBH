import Link from "next/link";
import { getAllProjects, findImage } from "@/lib/projects";
import { TrunkLine } from "@/components/TrunkLine";
import { FallbackImg } from "@/components/projects/FallbackImg";
import { FlowDiagram } from "@/components/projects/FlowDiagram";

// Scaffold: structure and labels are final, body copy is TK. Paragraphs marked
// .ag-tk are placeholders waiting on copy; drop images into
// public/projects/affective-geometry/ and the frames fill in on their own.

export const metadata = {
  title: "Affective Geometry — SLBH",
  description:
    "An artwork that theorizes emotion as shape and color — the studio's affective research taken as art rather than as an applied system.",
};

export default function AffectiveGeometryPage() {
  const allProjects = getAllProjects();
  const relatedSlugs = ["acg", "american-emotions"];
  const related = relatedSlugs
    .map((s) => allProjects.find((p) => p.slug === s))
    .filter(Boolean) as (typeof allProjects)[0][];

  const asset = (base: string) => findImage("affective-geometry", base);
  const heroSrc = asset("hero");
  const premiseSrc = asset("premise");
  const plates: { base: string; caption: string; wide?: boolean }[] = [
    { base: "plate-01", caption: "TK / PLATE 01", wide: true },
    { base: "plate-02", caption: "TK / PLATE 02" },
    { base: "plate-03", caption: "TK / PLATE 03" },
    { base: "plate-04", caption: "TK / PLATE 04" },
    { base: "plate-05", caption: "TK / PLATE 05" },
    { base: "plate-06", caption: "TK / PLATE 06", wide: true },
  ];

  return (
    <>
      {/* ── Section 1: Header ── */}
      <section className="ag-hero">
        <div className="container-page ag-hero-inner">
          <p className="t-mono ag-kicker">PROJECT 06 / 2026 / ACTIVE / NYC</p>
          <h1 className="t-display ag-title">Affective Geometry</h1>
          <p className="ag-summary ag-tk">
            TK — the one-sentence version. An artwork that treats emotion as
            shape and color, and what that proposition is for.
          </p>
        </div>
        <div className="ag-trunkline">
          <TrunkLine length={110} nodePosition="top" />
        </div>
      </section>

      {/* ── Section 2: Readout strip ── */}
      <div className="hairline-t hairline-b ag-readout">
        <span className="t-mono" style={{ opacity: 0.55 }}>
          SLBH / v2.0 / PROJECTS / AFFECTIVE GEOMETRY
        </span>
        <span
          className="t-label ag-readout-mid"
          style={{ opacity: 0.55, letterSpacing: "0.18em" }}
        >
          AFFECT · SHAPE · COLOR · COMPOSITION
        </span>
        <span className="t-mono" style={{ opacity: 0.55, textAlign: "right" }}>
          STATUS: ACTIVE · 2026 · ARTWORK
        </span>
      </div>

      {/* ── Section 3: Hero visual ── */}
      <section className="ag-visual" aria-label="Affective Geometry hero visual">
        <div className="ag-visual-bg" aria-hidden />
        {heroSrc && <FallbackImg src={heroSrc} alt="" className="ag-visual-img" />}
        {!heroSrc && (
          <div className="ag-visual-fallback" aria-hidden>
            <span className="t-mono" style={{ opacity: 0.3 }}>
              TK: HERO VISUAL
            </span>
          </div>
        )}
      </section>

      {/* ── Section 4: Editorial ── */}
      <section className="container-page ag-editorial">
        {/* Block A — PREMISE */}
        <div className="ag-block ag-block--text-left">
          <div className="ag-block-text">
            <p className="t-mono ag-block-kicker">01 / PREMISE</p>
            <h2 className="t-h2 ag-block-headline ag-tk-head">
              TK — headline: emotion has a shape.
            </h2>
            <p className="t-body ag-block-body ag-tk">
              TK — the premise. What it means to claim that a feeling has a
              form, and why shape and color are the terms this work uses.
            </p>
            <p className="t-body ag-block-body ag-tk">
              TK — the second paragraph. Where the proposition comes from in the
              studio&rsquo;s own research, and what it refuses to reduce.
            </p>
          </div>
          <div className="ag-block-visual">
            <div className="ag-img-wrap">
              <div className="ag-img-frame">
                <div className="ag-img-bg" />
                {premiseSrc && (
                  <FallbackImg
                    src={premiseSrc}
                    alt="Affective Geometry, study"
                    className="ag-img-fill"
                  />
                )}
              </div>
              <p className="t-mono ag-img-caption">TK — CAPTION</p>
            </div>
          </div>
        </div>

        {/* Block B — GEOMETRY */}
        <div className="ag-block ag-block--diagram-left">
          <div className="ag-block-visual ag-flow-wrap">
            <FlowDiagram
              ariaLabel="Geometry: emotion → shape family → color assignment → composition"
              stages={[
                { primary: "EMOTION", secondary: "STATE" },
                { primary: "SHAPE", secondary: "FAMILY" },
                { primary: "COLOR", secondary: "ASSIGNMENT" },
                { primary: "COMPOSITION", secondary: "WORK" },
              ]}
            />
          </div>
          <div className="ag-block-text">
            <p className="t-mono ag-block-kicker">02 / GEOMETRY</p>
            <h2 className="t-h2 ag-block-headline ag-tk-head">
              TK — headline: the rules of the shape language.
            </h2>
            <p className="t-body ag-block-body ag-tk">
              TK — how a state becomes a shape: the families, what edge,
              curvature, scale, and repetition are each carrying.
            </p>
            <p className="t-body ag-block-body ag-tk">
              TK — how color enters, and how a single work is composed from the
              two together.
            </p>
          </div>
        </div>

        {/* Block C — SERIES */}
        <div className="ag-block ag-block--text-left">
          <div className="ag-block-text">
            <p className="t-mono ag-block-kicker">03 / SERIES</p>
            <h2 className="t-h2 ag-block-headline ag-tk-head">
              TK — headline: the works themselves.
            </h2>
            <p className="t-body ag-block-body ag-tk">
              TK — what the series consists of, at what scale, in what medium,
              and how the plates relate to one another.
            </p>
            <p className="t-body ag-block-body ag-tk">
              TK — how a viewer is meant to move through them.
            </p>
          </div>
          <div className="ag-block-visual ag-flow-wrap">
            <FlowDiagram
              ariaLabel="Series: study → plate → series → installation"
              stages={[
                { primary: "STUDY", secondary: "TK" },
                { primary: "PLATE", secondary: "TK" },
                { primary: "SERIES", secondary: "TK" },
                { primary: "INSTALLATION", secondary: "TK" },
              ]}
            />
          </div>
        </div>

        {/* Block D — DISTINCTION */}
        <div className="ag-block ag-block--full">
          <p className="t-mono ag-block-kicker">04 / DISTINCTION</p>
          <h2 className="t-h2 ag-block-headline ag-tk-head">
            TK — headline: near ACG, but not ACG.
          </h2>
          <p className="t-body ag-block-body ag-block-body--wide ag-tk">
            TK — the relationship to ACG by SLBH. Same lineage of thinking, and
            the same interest in affect made visible.
          </p>
          <p className="t-body ag-block-body ag-block-body--wide ag-tk">
            TK — and the separation: ACG is an applied system rendering live
            data in public space; this is art, making an argument in shape and
            color rather than running an instrument.
          </p>
        </div>
      </section>

      {/* ── Section 4b: Plates ── */}
      <section className="container-page ag-plates">
        <p className="t-mono ag-plates-label">PLATES</p>
        <div className="ag-plate-grid">
          {plates.map((plate) => {
            const src = asset(plate.base);
            return (
              <figure
                key={plate.base}
                className={`ag-plate-cell${plate.wide ? " ag-plate-cell--wide" : ""}`}
              >
                <div className="ag-plate-frame">
                  <div className="ag-plate-bg" />
                  {src && (
                    <FallbackImg src={src} alt={plate.caption} className="ag-img-fill" />
                  )}
                </div>
                <figcaption className="t-mono ag-plate-caption">
                  {plate.caption}
                </figcaption>
              </figure>
            );
          })}
        </div>
      </section>

      {/* ── Section 5: Work details ── */}
      <section className="container-page ag-work">
        <p className="t-mono ag-work-label">WORK</p>
        <div className="ag-work-rows">
          {[
            { label: "MEDIUM", value: "TK" },
            { label: "FORMAT", value: "TK" },
            { label: "SERIES", value: "TK" },
            { label: "EDITION", value: "TK" },
            { label: "EXHIBITION", value: "TK" },
            { label: "STATUS", value: "ACTIVE · ONGOING" },
          ].map((row, i) => (
            <div
              key={row.label}
              className="ag-work-row"
              style={{ borderTop: i === 0 ? "0.5px solid var(--hairline)" : undefined }}
            >
              <span className="ag-work-key t-label">{row.label}</span>
              <span className="t-mono ag-work-val">{row.value}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Section 6: Links ── */}
      <section className="container-page ag-links">
        {[
          { label: "ACG BY SLBH", href: "/projects/acg", note: "/projects/acg" },
          { label: "AMERICAN EMOTIONS", href: "/projects/american-emotions", note: "/projects/american-emotions" },
          { label: "READ THE THEORY", href: "/research/emotion-as-system", note: "/research/emotion-as-system" },
        ].map(({ label, href, note }, i) => (
          <div
            key={label}
            className="ag-link-row"
            style={{ borderTop: i === 0 ? "0.5px solid var(--hairline)" : undefined }}
          >
            <span className="ag-link-label">{label}</span>
            <Link href={href} className="t-mono link-quiet ag-link-url">
              {note} →
            </Link>
          </div>
        ))}
      </section>

      {/* ── Section 7: Related projects ── */}
      {related.length > 0 && (
        <section className="container-page ag-related">
          <p className="t-mono ag-related-label">RELATED PROJECTS</p>
          <div className="ag-rel-grid">
            {related.map((p) => (
              <Link
                key={p.slug}
                href={`/projects/${p.slug}`}
                className="ag-rel-card link-quiet"
              >
                <div className="ag-rel-cover">
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
                <div className="ag-rel-meta">
                  <span className="ag-rel-title">{p.title}</span>
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
      <section className="container-page ag-footer">
        <p className="t-body ag-footer-body ag-tk">
          TK — closing note. What the next plates in the series are after, and
          where the work is headed.
        </p>
      </section>

      <style>{`
        /* ── Placeholder register ── */
        .ag-tk { opacity: 0.45; }
        .ag-tk-head { opacity: 0.5; }

        /* ── Hero ── */
        .ag-hero { position: relative; }
        .ag-hero-inner { padding-top: 56px; padding-bottom: 144px; }
        .ag-kicker { opacity: 0.55; margin: 0 0 20px; }
        .ag-title { margin: 0 0 28px; }
        .ag-summary {
          font-family: var(--font-inter), sans-serif;
          font-weight: 300;
          font-size: 24px;
          line-height: 1.4;
          max-width: 680px;
          margin: 0;
        }
        .ag-trunkline {
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
        }

        /* ── Readout strip ── */
        .ag-readout {
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
          .ag-readout { padding: 20px var(--pad-x); }
        }
        .ag-readout-mid { display: none; }
        @media (min-width: 768px) {
          .ag-readout-mid { display: block; }
        }

        /* ── Hero visual ── */
        .ag-visual {
          min-height: 100vh;
          position: relative;
          overflow: hidden;
          background: var(--graphite);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .ag-visual-bg { position: absolute; inset: 0; background: var(--graphite); }
        .ag-visual-img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        .ag-visual-fallback { position: relative; z-index: 1; }

        /* ── Editorial ── */
        .ag-editorial {
          padding-top: 96px;
          padding-bottom: 96px;
          display: flex;
          flex-direction: column;
          gap: 96px;
        }
        @media (min-width: 900px) {
          .ag-editorial { gap: 120px; }
        }
        .ag-block {
          display: grid;
          grid-template-columns: 1fr;
          gap: 48px;
        }
        @media (min-width: 900px) {
          .ag-block { grid-template-columns: 1fr 1fr; gap: 80px; align-items: start; }
          .ag-block--diagram-left .ag-block-visual { order: -1; }
        }
        .ag-block--full { display: block; max-width: 640px; }

        .ag-block-kicker {
          opacity: 0.45;
          margin: 0 0 16px;
          font-size: 10px;
          letter-spacing: 0.12em;
        }
        .ag-block-headline { margin: 0 0 28px; }
        .ag-block-body { margin: 0 0 18px; max-width: 520px; line-height: 1.7; }
        .ag-block-body--wide { max-width: 640px; }
        .ag-block-body:last-child { margin-bottom: 0; }

        /* Image frame */
        .ag-img-wrap { width: 100%; }
        .ag-img-frame {
          position: relative;
          aspect-ratio: 4/3;
          width: 100%;
          border: 0.5px solid var(--hairline-strong);
          overflow: hidden;
        }
        .ag-img-bg { position: absolute; inset: 0; background: var(--graphite); }
        .ag-img-fill {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        .ag-img-caption {
          margin: 12px 0 0;
          font-size: 9px;
          opacity: 0.45;
          letter-spacing: 0.1em;
        }

        .ag-flow-wrap { display: flex; align-items: center; padding: 32px 0; }

        /* ── Plates ── */
        .ag-plates { padding-top: 0; padding-bottom: 96px; }
        .ag-plates-label {
          opacity: 0.45;
          margin: 0 0 24px;
          font-size: 10px;
          letter-spacing: 0.12em;
        }
        .ag-plate-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 32px;
        }
        @media (min-width: 768px) {
          .ag-plate-grid { grid-template-columns: repeat(2, 1fr); }
          .ag-plate-cell--wide { grid-column: span 2; }
        }
        .ag-plate-cell { margin: 0; }
        .ag-plate-frame {
          position: relative;
          aspect-ratio: 4/5;
          width: 100%;
          border: 0.5px solid var(--hairline-strong);
          overflow: hidden;
        }
        .ag-plate-cell--wide .ag-plate-frame { aspect-ratio: 16/9; }
        .ag-plate-bg { position: absolute; inset: 0; background: var(--graphite); }
        .ag-plate-caption {
          margin: 12px 0 0;
          font-size: 9px;
          opacity: 0.45;
          letter-spacing: 0.1em;
        }

        /* ── Work rows ── */
        .ag-work { padding-top: 0; padding-bottom: 96px; }
        .ag-work-label {
          opacity: 0.45;
          margin: 0 0 24px;
          font-size: 10px;
          letter-spacing: 0.12em;
        }
        .ag-work-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
          padding: 20px 0;
          border-bottom: 0.5px solid var(--hairline);
        }
        .ag-work-key { font-size: 10px; letter-spacing: 0.14em; opacity: 0.72; }
        .ag-work-val { font-size: 11px; opacity: 0.82; text-align: right; }

        /* ── Links ── */
        .ag-links { padding-top: 0; padding-bottom: 80px; }
        .ag-link-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
          padding: 24px 0;
          border-bottom: 0.5px solid var(--hairline);
        }
        .ag-link-label {
          font-family: var(--font-inter), sans-serif;
          font-weight: 500;
          font-size: 13px;
          letter-spacing: 0.04em;
        }
        .ag-link-url { font-size: 11px; color: var(--ground); text-decoration: none; }

        /* ── Related ── */
        .ag-related { padding-top: 0; padding-bottom: 80px; }
        .ag-related-label {
          opacity: 0.45;
          margin: 0 0 32px;
          font-size: 10px;
          letter-spacing: 0.12em;
        }
        .ag-rel-grid {
          display: flex;
          gap: 24px;
          overflow-x: auto;
          padding-bottom: 8px;
        }
        .ag-rel-card {
          flex-shrink: 0;
          width: 240px;
          text-decoration: none;
          color: var(--ground);
          transition: opacity 600ms var(--ease-out);
        }
        .ag-rel-grid:has(.ag-rel-card:hover) .ag-rel-card:not(:hover) { opacity: 0.35; }
        .ag-rel-cover {
          width: 240px;
          height: 300px;
          background: var(--graphite);
          overflow: hidden;
          margin-bottom: 16px;
        }
        .ag-rel-meta { padding: 0 4px; }
        .ag-rel-title {
          font-family: var(--font-inter), sans-serif;
          font-weight: 500;
          font-size: 13px;
          letter-spacing: 0.02em;
          display: block;
          margin-bottom: 6px;
        }

        /* ── Footer copy ── */
        .ag-footer {
          padding-top: 0;
          padding-bottom: 120px;
          max-width: var(--max-w);
        }
        .ag-footer-body { max-width: 640px; line-height: 1.7; margin: 0; }
      `}</style>
    </>
  );
}
