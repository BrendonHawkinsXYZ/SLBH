import Link from "next/link";
import { getAllProjects, findImage } from "@/lib/projects";
import { TrunkLine } from "@/components/TrunkLine";
import { FallbackImg } from "@/components/projects/FallbackImg";
import { FlowDiagram } from "@/components/projects/FlowDiagram";

// Image frames fill in on their own as files land in
// public/projects/affective-geometry/.

export const metadata = {
  title: "Affective Geometry — SLBH",
  description:
    "An art project that theorizes emotion as shape and color — a proof of concept for rendering affective computational geometry as 2D plates.",
};

const PLATES: { base: string; caption: string }[] = [
  { base: "plate-circle", caption: "CIRCLE · 01" },
  { base: "plate-triangle", caption: "TRIANGLE · 02" },
  { base: "plate-square", caption: "SQUARE · 03" },
  { base: "plate-rhombus", caption: "RHOMBUS · 04" },
  { base: "plate-heptagon", caption: "HEPTAGON · 05" },
  { base: "plate-06", caption: "CIRCLE · 06" },
];

export default function AffectiveGeometryPage() {
  const allProjects = getAllProjects();
  const relatedSlugs = ["acg", "american-emotions"];
  const related = relatedSlugs
    .map((s) => allProjects.find((p) => p.slug === s))
    .filter(Boolean) as (typeof allProjects)[0][];

  const asset = (base: string) => findImage("affective-geometry", base);
  const heroSrc = asset("hero");
  const premiseSrc = asset("premise");
  const detailSrc = asset("detail");
  const contactSrc = asset("contact-sheet");

  return (
    <>
      {/* ── Section 1: Header ── */}
      <section className="ag-hero">
        <div className="container-page ag-hero-inner">
          <p className="t-mono ag-kicker">PROJECT 06 / 2026 / ACTIVE / NYC</p>
          <h1 className="t-display ag-title">Affective Geometry</h1>
          <p className="ag-summary">
            An art project that theorizes emotion as shape and color — a proof of
            concept for rendering affective computational geometry as 2D plates.
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
          AFFECT · SHAPE · COLOR · FIELD
        </span>
        <span className="t-mono" style={{ opacity: 0.55, textAlign: "right" }}>
          25 SHAPES / 25 PALETTES · 4:5
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
            <h2 className="t-h2 ag-block-headline">Emotion is a shape, a field.</h2>
            <p className="t-body ag-block-body">
              Affective Geometry begins from a claim the lab keeps returning to:
              a feeling has a form. Each sketch takes an emotional state and
              renders it as a bounded geometric figure filled with a field of
              color.
            </p>
            <p className="t-body ag-block-body">
              The work makes that claim visible rather than arguing it. Where the
              lab&rsquo;s research writes affect as a model, these plates draw it.
            </p>
          </div>
          <div className="ag-block-visual">
            <div className="ag-img-wrap">
              <div className="ag-img-frame">
                <div className="ag-img-bg" />
                {premiseSrc && (
                  <FallbackImg
                    src={premiseSrc}
                    alt="Affective Geometry, sketch"
                    className="ag-img-fill"
                  />
                )}
              </div>
              <p className="t-mono ag-img-caption">SKETCH / STUDY</p>
            </div>
          </div>
        </div>

        {/* Block B — RENDERING */}
        <div className="ag-block ag-block--diagram-left">
          <div className="ag-block-visual ag-flow-wrap">
            <FlowDiagram
              ariaLabel="Rendering: emotion state → shape family → color field → 2D plate"
              stages={[
                { primary: "EMOTION", secondary: "STATE" },
                { primary: "SHAPE", secondary: "FAMILY" },
                { primary: "COLOR", secondary: "FIELD" },
                { primary: "2D", secondary: "PLATE" },
              ]}
            />
          </div>
          <div className="ag-block-text">
            <p className="t-mono ag-block-kicker">02 / RENDERING</p>
            <h2 className="t-h2 ag-block-headline">
              A proof of concept for the geometry.
            </h2>
            <p className="t-body ag-block-body">
              Every plate is generated the same way. A state selects a shape
              family — circle, triangle, square, rhombus, heptagon — and the
              figure is filled with a palette drawn from the 169-colour field
              gamut, then woven with a dense mark field so the color reads as
              atmosphere rather than fill.
            </p>
            <p className="t-body ag-block-body">
              The result is a proof of concept: affective computational geometry
              rendered flat, at plate scale, where it can be looked at directly.
            </p>
          </div>
        </div>

        {/* Block C — THE SERIES */}
        <div className="ag-block ag-block--text-left">
          <div className="ag-block-text">
            <p className="t-mono ag-block-kicker">03 / THE SERIES</p>
            <h2 className="t-h2 ag-block-headline">
              Twenty-five shapes, twenty-five palettes.
            </h2>
            <p className="t-body ag-block-body">
              The series is read as a contact sheet. Each plate carries its shape
              name, its index, and the palette strip it was built from, so the
              full run can be compared at a glance.
            </p>
            <p className="t-body ag-block-body">
              Repetition is the argument. The same five families recur across
              palettes until the shape stops reading as a shape and starts
              reading as a state.
            </p>
          </div>
          <div className="ag-block-visual">
            <div className="ag-img-wrap">
              <div className="ag-img-frame ag-img-frame--plate">
                <div className="ag-img-bg" />
                {detailSrc && (
                  <FallbackImg
                    src={detailSrc}
                    alt="Affective Geometry, plate detail"
                    className="ag-img-fill"
                  />
                )}
              </div>
              <p className="t-mono ag-img-caption">PLATE / MARK DETAIL</p>
            </div>
          </div>
        </div>

        {/* Block D — RELATION TO ACG */}
        <div className="ag-block ag-block--full">
          <p className="t-mono ag-block-kicker">04 / RELATION TO ACG</p>
          <h2 className="t-h2 ag-block-headline">Near ACG, made as art.</h2>
          <p className="t-body ag-block-body ag-block-body--wide">
            Affective Geometry shares its lineage with ACG by SLBH. Both take the
            same computational model of affect as their starting point.
          </p>
          <p className="t-body ag-block-body ag-block-body--wide">
            ACG runs that model as a live public system in physical space.
            Affective Geometry works the other direction, holding the geometry
            still long enough to render it as an image and see what the form
            actually looks like.
          </p>
        </div>
      </section>

      {/* ── Section 4b: Contact sheet + plates ── */}
      <section className="container-page ag-plates">
        <p className="t-mono ag-plates-label">FIELD · CONTACT SHEET</p>
        <figure className="ag-contact">
          <div className="ag-contact-frame">
            <div className="ag-plate-bg" />
            {contactSrc && (
              <FallbackImg
                src={contactSrc}
                alt="Affective Geometry contact sheet, 25 shapes across 25 palettes"
                className="ag-img-fill"
              />
            )}
          </div>
          <figcaption className="t-mono ag-plate-caption">
            25 SHAPES / 25 PALETTES · 4:5 · 169-COLOUR FIELD GAMUT
          </figcaption>
        </figure>

        <div className="ag-plate-grid">
          {PLATES.map((plate) => {
            const src = asset(plate.base);
            return (
              <figure key={plate.base} className="ag-plate-cell">
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
            { label: "MEDIUM", value: "GENERATIVE 2D RENDER" },
            { label: "FORMAT", value: "4:5 PLATE" },
            { label: "SHAPE FAMILIES", value: "CIRCLE / TRIANGLE / SQUARE / RHOMBUS / HEPTAGON" },
            { label: "SERIES", value: "25 SHAPES · 25 PALETTES" },
            { label: "GAMUT", value: "169-COLOUR FIELD" },
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
        <p className="t-body ag-footer-body">
          The series continues as new palettes enter the gamut and new families
          are cut.
        </p>
        <p className="t-mono ag-mono-line">
          169-COLOUR FIELD GAMUT · EMOTION IS A SHAPE, A FIELD
        </p>
      </section>

      <style>{`
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
          opacity: 0.82;
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
        .ag-block-body {
          margin: 0 0 18px;
          max-width: 520px;
          line-height: 1.7;
          opacity: 0.82;
        }
        .ag-block-body--wide { max-width: 640px; }
        .ag-block-body:last-child { margin-bottom: 0; }

        /* Image frames */
        .ag-img-wrap { width: 100%; }
        .ag-img-frame {
          position: relative;
          aspect-ratio: 4/3;
          width: 100%;
          border: 0.5px solid var(--hairline-strong);
          overflow: hidden;
        }
        .ag-img-frame--plate { aspect-ratio: 4/5; max-width: 420px; }
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

        /* ── Contact sheet + plates ── */
        .ag-plates { padding-top: 0; padding-bottom: 96px; }
        .ag-plates-label {
          opacity: 0.45;
          margin: 0 0 24px;
          font-size: 10px;
          letter-spacing: 0.12em;
        }
        .ag-contact { margin: 0 0 48px; }
        .ag-contact-frame {
          position: relative;
          aspect-ratio: 4/5;
          width: 100%;
          max-width: 860px;
          border: 0.5px solid var(--hairline-strong);
          overflow: hidden;
        }
        .ag-plate-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 24px;
        }
        @media (min-width: 768px) {
          .ag-plate-grid { grid-template-columns: repeat(3, 1fr); gap: 32px; }
        }
        .ag-plate-cell { margin: 0; }
        .ag-plate-frame {
          position: relative;
          aspect-ratio: 4/5;
          width: 100%;
          border: 0.5px solid var(--hairline-strong);
          overflow: hidden;
        }
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
        .ag-footer-body {
          max-width: 640px;
          line-height: 1.7;
          opacity: 0.72;
          margin: 0;
        }
        .ag-mono-line {
          margin: 28px 0 0;
          font-size: 9px;
          letter-spacing: 0.14em;
          opacity: 0.45;
        }
      `}</style>
    </>
  );
}
