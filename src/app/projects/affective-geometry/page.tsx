import Link from "next/link";
import { findImage } from "@/lib/projects";
import { FallbackImg } from "@/components/projects/FallbackImg";

// A sketch page: premise, the contact sheet, the plates. Image frames fill in
// on their own as files land in public/projects/affective-geometry/.

export const metadata = {
  title: "Affective Geometry — SLBH",
  description:
    "An art project that theorizes emotion as shape and color — the sketches whose shapes became Chroma.",
};

const PLATES: { base: string; caption: string }[] = [
  { base: "plate-circle", caption: "CIRCLE · 01" },
  { base: "plate-triangle", caption: "TRIANGLE · 02" },
  { base: "plate-square", caption: "SQUARE · 03" },
  { base: "plate-rhombus", caption: "RHOMBUS · 04" },
  { base: "plate-heptagon", caption: "HEPTAGON · 05" },
];

export default function AffectiveGeometryPage() {
  const asset = (base: string) => findImage("affective-geometry", base);
  const heroSrc = asset("hero");
  const premiseSrc = asset("premise");
  const contactSrc = asset("contact-sheet");

  return (
    <>
      {/* ── Section 1: Header ── */}
      <section className="ag-hero">
        <div className="container-page ag-hero-inner">
          <p className="t-mono ag-kicker">PROJECT 03 / 2026 / ACTIVE / NYC</p>
          <h1 className="t-display ag-title">Affective Geometry</h1>
          <p className="ag-summary">
            An art project that theorizes emotion as shape and color — a proof of
            concept for rendering affective computational geometry as 2D plates.
          </p>
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
          25 SHAPES / 25 PALETTES · 4:4
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

      {/* ── Section 4: Premise ── */}
      <section className="container-page ag-editorial">
        <div className="ag-block">
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
              These are sketches. The shapes drawn here became the shapes in
              Chroma.
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
      </section>

      {/* ── Section 5: Contact sheet + plates ── */}
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
            25 SHAPES / 25 PALETTES · 4:4 · 169-COLOUR FIELD GAMUT
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

      {/* ── Section 6: Links ── */}
      <section className="container-page ag-links">
        {[
          { label: "READ THE PAPER", href: "/research/emotion-as-system", note: "/research/emotion-as-system" },
          { label: "CHROMA", href: "/#chroma", note: "LAUNCHING SEPTEMBER 2026" },
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

      {/* ── Section 7: Footer line ── */}
      <section className="container-page ag-footer">
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

        /* ── Premise ── */
        .ag-editorial { padding-top: 96px; padding-bottom: 96px; }
        .ag-block {
          display: grid;
          grid-template-columns: 1fr;
          gap: 48px;
        }
        @media (min-width: 900px) {
          .ag-block { grid-template-columns: 1fr 1fr; gap: 80px; align-items: start; }
        }
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
          aspect-ratio: 1/1;
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

        /* ── Links ── */
        .ag-links { padding-top: 0; padding-bottom: 64px; }
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

        /* ── Footer line ── */
        .ag-footer {
          padding-top: 0;
          padding-bottom: 120px;
          max-width: var(--max-w);
        }
        .ag-mono-line {
          margin: 0;
          font-size: 9px;
          letter-spacing: 0.14em;
          opacity: 0.45;
        }
      `}</style>
    </>
  );
}
