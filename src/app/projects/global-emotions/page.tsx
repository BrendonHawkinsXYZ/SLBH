import Link from "next/link";
import { getAllProjects, findImage } from "@/lib/projects";
import { FallbackImg } from "@/components/projects/FallbackImg";
import { StackDiagram } from "@/components/projects/StackDiagram";

// Copy follows the live instrument's About and Method sections. Image frames
// fill in on their own as files land in public/projects/global-emotions/.

export const metadata = {
  title: "Global Emotions — SLBH",
  description:
    "A public emotional observatory: a daily instrument that reads the world as a weather system of attention.",
};

const LIVE_URL = "https://globalemotions.studiolabbh.xyz";

export default function GlobalEmotionsPage() {
  const allProjects = getAllProjects();
  const relatedSlugs = ["american-emotions", "acg"];
  const related = relatedSlugs
    .map((s) => allProjects.find((p) => p.slug === s))
    .filter(Boolean) as (typeof allProjects)[0][];

  const asset = (base: string) => findImage("global-emotions", base);
  const worldSrc = asset("field-world");
  const docs: { base: string; caption: string }[] = [
    { base: "location", caption: "LOCATION / COUNTRY VIEW" },
    { base: "archive", caption: "ARCHIVE / ACCUMULATED DAYS" },
  ];

  return (
    <article className="project-document">
      {/* ── Section 1: Header ── */}
      <section className="ge-hero">
        <div className="container-page ge-hero-inner">
          <h1 className="t-display ge-title">Global Emotions</h1>
          <p className="project-metadata">2026–ongoing · Seasonal instrument · Global</p>
          <p className="ge-summary">
            Global Emotions is a public emotional observatory — a daily
            instrument that reads the world as a weather system of attention.
          </p>
        </div>
      </section>

      {/* ── Section 3: World field — the lead image ── */}
      <section className="container-page ge-worldfield">
        <figure className="ge-worldfield-fig">
          <div className="ge-worldfield-frame">
            {worldSrc ? (
              <FallbackImg
                src={worldSrc}
                alt="Global Emotions, today's world field"
                className="ge-worldfield-img"
              />
            ) : (
              <span className="t-mono ge-worldfield-tk">TK: WORLD FIELD</span>
            )}
          </div>
          <figcaption className="t-mono ge-doc-caption">
            TODAY / WORLD FIELD
          </figcaption>
        </figure>
      </section>

      {/* ── Section 4: Editorial ── */}
      <section className="container-page ge-editorial">
        {/* Block A — THE PROJECT */}
        <div className="ge-block ge-block--full">
          <h2 className="t-h2 ge-block-headline">One field a day.</h2>
          <p className="t-body ge-block-body ge-block-body--wide">
            Each day, search behavior across countries is classified into
            emotional categories and mapped to a single color field. Over time
            the fields accumulate into an archive — a record of how the world
            felt, one day at a time.
          </p>
        </div>

        {/* Block B — METHOD */}
        <div className="ge-block ge-block--diagram-left">
          <div className="ge-block-visual ge-stack-wrap">
            <StackDiagram
              label="SYSTEM OVERVIEW"
              ariaLabel="System overview: daily global Google Trends, emotional classification, emotion to color mapping, attention weighting, daily color field"
              stages={[
                "GOOGLE TRENDS — DAILY (GLOBAL)",
                "EMOTIONAL CLASSIFICATION",
                "EMOTION → COLOR MAPPING",
                "ATTENTION WEIGHTING",
                "DAILY COLOR FIELD",
              ]}
              footnote="OUTPUT: 1 FIELD / DAY · SCOPE: GLOBAL"
            />
          </div>
          <div className="ge-block-text">
            <h2 className="t-h2 ge-block-headline">
              A daily computational artwork.
            </h2>
            <p className="t-body ge-block-body">
              Global Emotions translates search behavior around the world into
              emotional and chromatic fields. Each day produces one color field
              per place: an atmospheric reading of the public mood.
            </p>
            <p className="t-body ge-block-body">
              The instrument reads daily search trends together with the
              headline context around them, weighted by traffic and publication
              time. Everything is aggregated by country and stripped of
              individual identity.
            </p>
          </div>
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
                className="ge-doc-cell"
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
        <h2 className="project-section-heading">Instrument</h2>
        <div className="ge-instrument-rows">
          {[
            { label: "SOURCE", value: "GOOGLE TRENDS — DAILY" },
            { label: "TAXONOMY", value: "169 EMOTIONS" },
            { label: "SPACE", value: "VALENCE–AROUSAL–DOMINANCE" },
            { label: "WEIGHTING", value: "ATTENTION INTENSITY" },
            { label: "OUTPUT", value: "1 FIELD / DAY" },
            { label: "SCOPE", value: "GLOBAL · BY COUNTRY" },
            { label: "VERSION", value: "AFFECT-FIELD-V2" },
            { label: "STATUS", value: "SEASONAL · ONGOING" },
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
          { label: "LIVE INSTRUMENT", href: LIVE_URL, note: "Open instrument", external: true },
          { label: "AMERICAN EMOTIONS", href: "/projects/american-emotions", note: "American Emotions" },
          { label: "READ THE THEORY", href: "/research/emotion-as-system", note: "Emotion as System" },
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
          <h2 className="project-section-heading">Related projects</h2>
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
                  <span className="t-mono" style={{ opacity: 0.55, fontSize: 14 }}>
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
        <p className="t-body ge-footer-body">
          The site is the canonical source. Each day is an artifact you can cite.
        </p>
      </section>

      <style>{`
        /* ── Hero ── */
        .ge-hero { position: relative; }
        .ge-hero-inner {
          padding-top: 56px;
          padding-bottom: 64px;
        }
        .ge-title { margin: 0 0 28px; }
        .ge-summary {
          font-family: var(--font-inter), sans-serif;
          font-weight: 300;
          font-size: 18px;
          line-height: 1.4;
          max-width: 680px;
          opacity: 0.82;
          margin: 0;
        }
        /* ── Hero visual ── */

        /* ── World field — the lead image ── */
        .ge-worldfield { padding-top: 56px; padding-bottom: 56px; }
        .ge-worldfield-fig { margin: 0; }
        /* The frame takes the image's own proportions rather than cropping it
           to a fixed ratio, so a 1919×987 export (or any other wide one) lands
           whole. The ratio below only shapes the empty state. */
        .ge-worldfield-frame {
          position: relative;
          aspect-ratio: 1919 / 987;
          width: 100%;
          border: 0.5px solid var(--hairline-strong);
          overflow: hidden;
          background: var(--graphite);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .ge-worldfield-frame:has(img) { aspect-ratio: auto; }
        .ge-worldfield-img {
          display: block;
          width: 100%;
          height: auto;
        }
        .ge-worldfield-tk {
          color: rgba(243, 242, 242, 0.4);
          font-size: 14px;
          letter-spacing: 0em;
        }

        /* ── Editorial ── */
        .ge-editorial {
          padding-top: 56px;
          padding-bottom: 56px;
          display: flex;
          flex-direction: column;
          gap: 56px;
        }
        @media (min-width: 900px) {
          .ge-editorial { gap: 56px; }
        }
        .ge-block {
          display: grid;
          grid-template-columns: 1fr;
          gap: 48px;
        }
        @media (min-width: 900px) {
          .ge-block { grid-template-columns: 1fr 1fr; gap: 48px; align-items: start; }
          .ge-block--diagram-left .ge-block-visual { order: -1; }
        }
        .ge-block--full { display: block; max-width: 640px; }

        .ge-block-headline { margin: 0 0 28px; }
        .ge-block-body {
          margin: 0 0 18px;
          max-width: 520px;
          line-height: 1.7;
          opacity: 0.82;
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
          font-size: 14px;
          opacity: 0.72;
          letter-spacing: 0em;
        }

        .ge-stack-wrap { display: flex; align-items: flex-start; padding-top: 8px; }

        /* ── Documentation strip ── */
        .ge-doc-strip { padding-top: 0; padding-bottom: 56px; }
        .ge-doc-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 32px;
        }
        @media (min-width: 768px) {
          .ge-doc-grid { grid-template-columns: repeat(2, 1fr); }
        }
        .ge-doc-cell { margin: 0; }
        .ge-doc-frame {
          position: relative;
          aspect-ratio: 4/3;
          width: 100%;
          border: 0.5px solid var(--hairline-strong);
          overflow: hidden;
        }
        .ge-doc-bg { position: absolute; inset: 0; background: var(--graphite); }
        .ge-doc-caption {
          margin: 12px 0 0;
          font-size: 14px;
          opacity: 0.72;
          letter-spacing: 0em;
        }

        /* ── Instrument rows ── */
        .ge-instrument { padding-top: 0; padding-bottom: 56px; }
        .ge-instrument-label {
          opacity: 0.72;
          margin: 0 0 24px;
          font-size: 14px;
          letter-spacing: 0em;
        }
        .ge-instrument-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
          padding: 20px 0;
          border-bottom: 0.5px solid var(--hairline);
        }
        .ge-instrument-key { font-size: 14px; letter-spacing: 0em; opacity: 0.72; }
        .ge-instrument-val { font-size: 14px; opacity: 0.82; text-align: right; }

        /* ── Links ── */
        .ge-links { padding-top: 0; padding-bottom: 48px; }
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
          font-size: 16px;
          letter-spacing: 0em;
        }
        .ge-link-url {
          font-size: 14px;
          color: var(--ground);
          text-decoration: none;
        }

        /* ── Related ── */
        .ge-related { padding-top: 0; padding-bottom: 48px; }
        .ge-related-label {
          opacity: 0.72;
          margin: 0 0 32px;
          font-size: 14px;
          letter-spacing: 0em;
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
          font-size: 16px;
          letter-spacing: 0em;
          display: block;
          margin-bottom: 6px;
        }

        /* ── Footer copy ── */
        .ge-footer {
          padding-top: 0;
          padding-bottom: 56px;
          max-width: var(--max-w);
        }
        .ge-footer-body {
          max-width: 640px;
          line-height: 1.7;
          opacity: 0.72;
          margin: 0;
        }
      `}</style>
    </article>
  );
}
