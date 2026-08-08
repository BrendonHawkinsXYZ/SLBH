import Link from "next/link";
import { getAllProjects, findImage } from "@/lib/projects";
import { FallbackImg } from "@/components/projects/FallbackImg";

export const metadata = {
  title: "Affective Sculptural Sketches — SLBH",
  description:
    "An ongoing study of light and space as sculptural material for affect.",
};

// One plate per sketch. Drop first-date / affective-infrastructure /
// temporary-emotional-architectures into public/projects/affective-sculptural-sketches/
// and they appear — no code change.
const SKETCHES = [
  { base: "first-date", title: "High Fidelity Sketch: First Date" },
  {
    base: "affective-infrastructure",
    title: "High Fidelity Sketch for Affective Infrastructure",
  },
  {
    base: "temporary-emotional-architectures",
    title: "Temporary Emotional Architectures",
  },
];

export default function AffectiveSculpturalSketchesPage() {
  const allProjects = getAllProjects();
  const relatedSlugs = ["acg", "affective-geometry"];
  const related = relatedSlugs
    .map((s) => allProjects.find((p) => p.slug === s))
    .filter(Boolean) as (typeof allProjects)[0][];

  const asset = (base: string) =>
    findImage("affective-sculptural-sketches", base);

  const sketches = SKETCHES.map((sketch) => ({
    ...sketch,
    src: asset(sketch.base),
  }));

  return (
    <>
      {/* ── Section 1: Header ── */}
      <section className="ss-hero">
        <div className="container-page ss-hero-inner">
          <p className="t-mono ss-kicker">PROJECT 04 / 2026 — ONGOING / STUDY / NYC</p>
          <h1 className="t-display ss-title">Affective Sculptural Sketches</h1>
          <p className="ss-summary">
            An ongoing study of light and space as sculptural material for
            affect — how a constructed environment produces a feeling, and
            whether it can carry one person&rsquo;s feeling to another.
          </p>
        </div>
      </section>

      {/* ── Section 2: Readout strip ── */}
      <div className="hairline-t hairline-b ss-readout">
        <span className="t-mono" style={{ opacity: 0.55 }}>
          SLBH / v2.0 / PROJECTS / AFFECTIVE SCULPTURAL SKETCHES
        </span>
        <span
          className="t-label ss-readout-mid"
          style={{ opacity: 0.55, letterSpacing: "0.18em" }}
        >
          AFFECT · SYSTEMS · DATA · TIME
        </span>
        <span className="t-mono" style={{ opacity: 0.55, textAlign: "right" }}>
          STATUS: ACTIVE · 03 SKETCHES
        </span>
      </div>

      {/* ── Section 3: The sketches — imagery first ── */}
      <section className="container-page ss-sketches">
        <div className="ss-plate-grid">
          {sketches.map((sketch, i) => (
            <figure key={sketch.base} className="ss-plate">
              <div
                className={`ss-plate-frame${sketch.src ? "" : " ss-plate-frame--empty"}`}
              >
                {sketch.src ? (
                  <FallbackImg
                    src={sketch.src}
                    alt={sketch.title}
                    className="ss-plate-img"
                  />
                ) : (
                  <span className="t-mono ss-plate-tk">
                    TK: {sketch.title.toUpperCase()}
                  </span>
                )}
              </div>
              <figcaption className="ss-plate-caption">
                <span className="t-mono ss-plate-idx">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="ss-plate-title">{sketch.title}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* ── Section 4: Editorial ── */}
      <section className="container-page ss-editorial">
        {/* Block A — PREMISE */}
        <div className="ss-block">
          <p className="t-mono ss-block-kicker">01 / PREMISE</p>
          <h2 className="t-h2 ss-block-headline">
            Light and space are not neutral containers.
          </h2>
          <p className="t-body ss-block-body">
            Proportion, the temperature and angle of what illuminates a room,
            the distance between a body and a surface, the rate at which light
            changes — these produce feeling before anything is named or
            represented. Affect arrives through the room itself, not through
            what the room depicts.
          </p>
          <p className="t-body ss-block-body">
            The sketches treat that as material to be worked rather than
            atmosphere added at the end. Each one takes a single affective state
            and asks what it would have to be built out of.
          </p>
        </div>

        {/* Block B — TRANSMISSION */}
        <div className="ss-block">
          <p className="t-mono ss-block-kicker">02 / TRANSMISSION</p>
          <h2 className="t-h2 ss-block-headline">
            Authored on one end, undergone on the other.
          </h2>
          <p className="t-body ss-block-body">
            Each sketch runs in two directions at once. In one, a state is
            authored — composed deliberately into light and volume, the way a
            sentence is composed. In the other it is received: a person walks in
            and undergoes something that began in somebody else.
          </p>
          <p className="t-body ss-block-body">
            The interesting part is the gap between them. A sketch is high
            fidelity when what was encoded is what gets felt, so the work is
            largely a matter of finding where the transmission degrades — which
            qualities survive the trip from maker to occupant, and which turn
            out to be private to the person who built them.
          </p>
        </div>
      </section>

      {/* ── Section 5: Related projects ── */}
      {related.length > 0 && (
        <section className="container-page ss-related">
          <p className="t-mono ss-section-label">RELATED PROJECTS</p>
          <div className="ss-rel-grid">
            {related.map((p) => (
              <Link
                key={p.slug}
                href={`/projects/${p.slug}`}
                className="ss-rel-card link-quiet"
              >
                <div className="ss-rel-cover">
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
                <div className="ss-rel-meta">
                  <span className="ss-rel-title">{p.title}</span>
                  <span className="t-mono" style={{ opacity: 0.55, fontSize: 10 }}>
                    {p.year}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ── Section 6: Footer copy ── */}
      <section className="container-page ss-footer">
        <p className="t-body ss-footer-body">
          They are called sketches because the medium resists finish. A room can
          be specified but not held still — light moves, occupants move, and the
          same construction reads differently at a different hour. Each sketch
          is a fixed proposal about something that will not sit still, which is
          the condition the study is actually about.
        </p>
      </section>

      <style>{`
        /* ── Hero ── */
        .ss-hero { position: relative; }
        .ss-hero-inner {
          padding-top: 56px;
          padding-bottom: 64px;
        }
        .ss-kicker { opacity: 0.55; margin: 0 0 20px; }
        .ss-title { margin: 0 0 28px; }
        .ss-summary {
          font-family: var(--font-inter), sans-serif;
          font-weight: 300;
          font-size: 24px;
          line-height: 1.4;
          max-width: 680px;
          opacity: 0.82;
          margin: 0;
        }
        /* ── Readout strip ── */
        .ss-readout {
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
          .ss-readout { padding: 20px var(--pad-x); }
        }
        .ss-readout-mid { display: none; }
        @media (min-width: 768px) {
          .ss-readout-mid { display: block; }
        }

        /* ── Editorial ── */
        .ss-editorial {
          padding-top: 96px;
          padding-bottom: 96px;
          display: grid;
          grid-template-columns: 1fr;
          gap: 64px;
        }
        @media (min-width: 900px) {
          .ss-editorial { grid-template-columns: 1fr 1fr; gap: 80px; }
        }
        .ss-block-kicker {
          opacity: 0.45;
          margin: 0 0 16px;
          font-size: 10px;
          letter-spacing: 0.12em;
        }
        .ss-block-headline { margin: 0 0 28px; max-width: 20ch; }
        .ss-block-body {
          margin: 0 0 18px;
          max-width: 520px;
          line-height: 1.7;
          opacity: 0.82;
        }
        .ss-block-body:last-child { margin-bottom: 0; }

        /* ── Section labels ── */
        .ss-section-label {
          opacity: 0.45;
          margin: 0 0 32px;
          font-size: 10px;
          letter-spacing: 0.12em;
        }

        /* ── Sketches — three across, stacked on mobile ── */
        .ss-sketches { padding-top: 0; padding-bottom: 96px; }
        .ss-plate-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 32px;
        }
        @media (min-width: 900px) {
          .ss-plate-grid { grid-template-columns: repeat(3, 1fr); gap: 28px; }
        }
        .ss-plate { margin: 0; }
        .ss-plate-frame {
          position: relative;
          aspect-ratio: 4 / 5;
          width: 100%;
          border: 0.5px solid var(--hairline-strong);
          overflow: hidden;
          background: var(--graphite);
        }
        .ss-plate-img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        .ss-plate-frame--empty {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 16px;
          text-align: center;
        }
        .ss-plate-tk {
          color: rgba(243, 242, 242, 0.4);
          font-size: 9px;
          letter-spacing: 0.12em;
        }
        .ss-plate-caption {
          display: flex;
          gap: 12px;
          margin: 16px 0 0;
          align-items: baseline;
        }
        .ss-plate-idx {
          font-size: 9px;
          opacity: 0.45;
          letter-spacing: 0.1em;
          flex-shrink: 0;
        }
        .ss-plate-title {
          font-family: var(--font-inter), sans-serif;
          font-weight: 500;
          font-size: 13px;
          line-height: 1.4;
          letter-spacing: 0.02em;
        }

        /* ── Related ── */
        .ss-related { padding-top: 0; padding-bottom: 80px; }
        .ss-rel-grid {
          display: flex;
          gap: 24px;
          overflow-x: auto;
          padding-bottom: 8px;
        }
        .ss-rel-card {
          flex-shrink: 0;
          width: 240px;
          text-decoration: none;
          color: var(--ground);
          transition: opacity 600ms var(--ease-out);
        }
        .ss-rel-grid:has(.ss-rel-card:hover) .ss-rel-card:not(:hover) {
          opacity: 0.35;
        }
        .ss-rel-cover {
          width: 240px;
          height: 300px;
          background: var(--graphite);
          overflow: hidden;
          margin-bottom: 16px;
        }
        .ss-rel-meta { padding: 0 4px; }
        .ss-rel-title {
          font-family: var(--font-inter), sans-serif;
          font-weight: 500;
          font-size: 13px;
          letter-spacing: 0.02em;
          display: block;
          margin-bottom: 6px;
        }

        /* ── Footer copy ── */
        .ss-footer {
          padding-top: 0;
          padding-bottom: 120px;
          max-width: var(--max-w);
        }
        .ss-footer-body {
          max-width: 640px;
          line-height: 1.7;
          opacity: 0.72;
          margin: 0;
        }
      `}</style>
    </>
  );
}
